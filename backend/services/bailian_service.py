"""
阿里百炼API服务封装
"""
import json
import requests
import logging
from typing import List, Dict, Any, Generator

logger = logging.getLogger(__name__)


class BailianService:
    """阿里百炼API服务类"""
    
    def __init__(self, api_key: str, base_url: str = 'https://dashscope.aliyuncs.com/api/v1'):
        """
        初始化阿里百炼服务
        
        Args:
            api_key: 阿里云API密钥
            base_url: API基础URL
        """
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        if not self.api_key:
            logger.warning("API key is not set. Please set DASHSCOPE_API_KEY in .env file")
    
    def chat_completion(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> Dict[str, Any]:
        """
        调用阿里百炼聊天补全API（非流式）
        
        Args:
            model: 模型名称
            messages: 消息列表
            temperature: 温度参数
            max_tokens: 最大token数
            **kwargs: 其他参数
            
        Returns:
            API响应数据
        """
        try:
            url = f"{self.base_url}/services/aigc/text-generation/generation"
            
            payload = {
                "model": model,
                "input": {
                    "messages": messages
                },
                "parameters": {
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "result_format": "message",
                    **kwargs
                }
            }
            
            logger.info(f"Calling Bailian API - model: {model}")
            
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=60
            )
            
            response.raise_for_status()
            result = response.json()
            
            # 解析响应
            if result.get('output') and result['output'].get('choices'):
                choice = result['output']['choices'][0]
                message = choice.get('message', {})
                
                return {
                    'id': result.get('request_id', ''),
                    'content': message.get('content', ''),
                    'model': model,
                    'usage': result.get('usage', {
                        'prompt_tokens': 0,
                        'completion_tokens': 0,
                        'total_tokens': 0
                    })
                }
            else:
                raise Exception(f"Invalid response format: {result}")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            raise Exception(f"Failed to call Bailian API: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise
    
    def chat_completion_stream(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> Generator[str, None, None]:
        """
        调用阿里百炼聊天补全API（流式）
        
        Args:
            model: 模型名称
            messages: 消息列表
            temperature: 温度参数
            max_tokens: 最大token数
            **kwargs: 其他参数
            
        Yields:
            流式响应数据（JSON字符串）
        """
        try:
            url = f"{self.base_url}/services/aigc/text-generation/generation"
            
            payload = {
                "model": model,
                "input": {
                    "messages": messages
                },
                "parameters": {
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "result_format": "message",
                    "incremental_output": True,
                    **kwargs
                }
            }
            
            logger.info(f"Calling Bailian API (stream) - model: {model}")
            
            response = requests.post(
                url,
                headers={**self.headers, 'X-DashScope-SSE': 'enable'},
                json=payload,
                stream=True,
                timeout=60
            )
            
            response.raise_for_status()
            
            # 处理SSE流
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    
                    # 跳过注释行
                    if line_str.startswith(':'):
                        continue
                    
                    # 解析data行
                    if line_str.startswith('data:'):
                        data_str = line_str[5:].strip()
                        
                        # 跳过空数据
                        if not data_str:
                            continue
                        
                        try:
                            data = json.loads(data_str)
                            
                            # 提取消息内容
                            if data.get('output') and data['output'].get('choices'):
                                choice = data['output']['choices'][0]
                                message = choice.get('message', {})
                                content = message.get('content', '')
                                
                                if content:
                                    # 返回格式化的数据
                                    chunk_data = {
                                        'content': content,
                                        'finish_reason': choice.get('finish_reason')
                                    }
                                    yield json.dumps(chunk_data)
                                    
                        except json.JSONDecodeError:
                            logger.warning(f"Failed to parse JSON: {data_str}")
                            continue
                            
        except requests.exceptions.RequestException as e:
            logger.error(f"Stream request error: {str(e)}")
            raise Exception(f"Failed to call Bailian API stream: {str(e)}")
        except Exception as e:
            logger.error(f"Stream unexpected error: {str(e)}")
            raise
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """
        获取可用的模型列表
        
        Returns:
            模型列表
        """
        # 阿里百炼支持的模型列表
        return [
            {
                'id': 'qwen-turbo',
                'name': '通义千问-Turbo',
                'description': '快速响应，适合日常对话',
                'provider': 'Alibaba',
                'maxTokens': 6000
            },
            {
                'id': 'qwen-plus',
                'name': '通义千问-Plus',
                'description': '平衡性能和速度',
                'provider': 'Alibaba',
                'maxTokens': 30000
            },
            {
                'id': 'qwen-max',
                'name': '通义千问-Max',
                'description': '最强性能，适合复杂任务',
                'provider': 'Alibaba',
                'maxTokens': 30000
            },
            {
                'id': 'qwen-max-longcontext',
                'name': '通义千问-Max长文本',
                'description': '支持超长文本处理',
                'provider': 'Alibaba',
                'maxTokens': 100000
            }
        ]

