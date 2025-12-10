"""
Flask API服务 - 封装阿里百炼API
"""
import os
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
import logging
from services.bailian_service import BailianService

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 创建Flask应用
app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 初始化阿里百炼服务
bailian_service = BailianService(
    api_key=os.getenv('DASHSCOPE_API_KEY'),
    base_url=os.getenv('DASHSCOPE_BASE_URL', 'https://dashscope.aliyuncs.com/api/v1')
)


@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend service is running'
    })


@app.route('/api/chat/completions', methods=['POST'])
def chat_completions():
    """
    聊天补全接口（非流式）
    """
    try:
        data = request.get_json()
        
        # 验证必需参数
        if not data or 'messages' not in data:
            return jsonify({
                'error': 'Missing required parameter: messages'
            }), 400
        
        model = data.get('model', 'qwen-turbo')
        messages = data.get('messages', [])
        temperature = data.get('temperature', 0.7)
        max_tokens = data.get('max_tokens', 2000)
        
        logger.info(f"Received chat request - model: {model}, messages count: {len(messages)}")
        
        # 调用阿里百炼API
        response = bailian_service.chat_completion(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Chat completion error: {str(e)}", exc_info=True)
        return jsonify({
            'error': str(e),
            'message': 'Failed to process chat request'
        }), 500


@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    """
    聊天补全接口（流式）
    """
    try:
        data = request.get_json()
        
        # 验证必需参数
        if not data or 'messages' not in data:
            return jsonify({
                'error': 'Missing required parameter: messages'
            }), 400
        
        model = data.get('model', 'qwen-turbo')
        messages = data.get('messages', [])
        temperature = data.get('temperature', 0.7)
        max_tokens = data.get('max_tokens', 2000)
        
        logger.info(f"Received stream request - model: {model}, messages count: {len(messages)}")
        
        def generate():
            """生成器函数，用于流式输出"""
            try:
                for chunk in bailian_service.chat_completion_stream(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens
                ):
                    yield f"data: {chunk}\n\n"
                
                # 发送结束标记
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                logger.error(f"Stream error: {str(e)}", exc_info=True)
                error_data = {
                    'error': str(e),
                    'message': 'Stream processing failed'
                }
                yield f"data: {error_data}\n\n"
        
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no'
            }
        )
        
    except Exception as e:
        logger.error(f"Stream setup error: {str(e)}", exc_info=True)
        return jsonify({
            'error': str(e),
            'message': 'Failed to setup stream'
        }), 500


@app.route('/api/models', methods=['GET'])
def get_models():
    """
    获取可用的模型列表
    """
    try:
        models = bailian_service.get_available_models()
        return jsonify({
            'models': models
        })
    except Exception as e:
        logger.error(f"Get models error: {str(e)}", exc_info=True)
        return jsonify({
            'error': str(e),
            'message': 'Failed to get models'
        }), 500


@app.errorhandler(404)
def not_found(error):
    """404错误处理"""
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested URL was not found on the server'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """500错误处理"""
    logger.error(f"Internal error: {str(error)}", exc_info=True)
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An internal error occurred'
    }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Flask server on port {port}")
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )

