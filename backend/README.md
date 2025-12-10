# AI Chat Backend - 阿里百炼API封装

这是一个基于Flask的Python后端服务，用于封装阿里百炼（DashScope）API，为前端AI聊天应用提供接口支持。

## 功能特性

- ✅ 封装阿里百炼API调用
- ✅ 支持流式和非流式响应
- ✅ 支持多种通义千问模型
- ✅ CORS跨域支持
- ✅ 完善的错误处理和日志记录
- ✅ 环境变量配置管理

## 技术栈

- **Flask**: Web框架
- **Flask-CORS**: 跨域资源共享
- **Requests**: HTTP请求库
- **Python-dotenv**: 环境变量管理

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

或使用虚拟环境（推荐）：

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的阿里云API密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1
PORT=5000
DEBUG=True
```

### 3. 获取阿里云API密钥

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 登录并进入控制台
3. 在"API-KEY管理"中创建或查看你的API密钥
4. 将密钥复制到 `.env` 文件中

### 4. 启动服务

```bash
python app.py
```

服务将在 `http://localhost:5000` 启动。

## API接口文档

### 1. 健康检查

**接口**: `GET /health`

**响应**:
```json
{
  "status": "ok",
  "message": "Backend service is running"
}
```

### 2. 聊天补全（非流式）

**接口**: `POST /api/chat/completions`

**请求体**:
```json
{
  "model": "qwen-turbo",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**响应**:
```json
{
  "id": "request_id",
  "content": "你好！有什么我可以帮助你的吗？",
  "model": "qwen-turbo",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

### 3. 聊天补全（流式）

**接口**: `POST /api/chat/stream`

**请求体**: 同上

**响应**: Server-Sent Events (SSE) 流

```
data: {"content": "你", "finish_reason": null}

data: {"content": "好", "finish_reason": null}

data: [DONE]
```

### 4. 获取模型列表

**接口**: `GET /api/models`

**响应**:
```json
{
  "models": [
    {
      "id": "qwen-turbo",
      "name": "通义千问-Turbo",
      "description": "快速响应，适合日常对话",
      "provider": "Alibaba",
      "maxTokens": 6000
    }
  ]
}
```

## 支持的模型

- `qwen-turbo`: 通义千问-Turbo（快速响应）
- `qwen-plus`: 通义千问-Plus（平衡性能）
- `qwen-max`: 通义千问-Max（最强性能）
- `qwen-max-longcontext`: 通义千问-Max长文本版

## 项目结构

```
backend/
├── app.py                      # Flask应用主文件
├── services/                   # 服务层
│   ├── __init__.py
│   └── bailian_service.py     # 阿里百炼API封装
├── requirements.txt            # Python依赖
├── .env.example               # 环境变量示例
├── .env                       # 环境变量（需自行创建）
├── .gitignore                # Git忽略文件
└── README.md                  # 本文档
```

## 开发说明

### 日志配置

应用使用Python标准logging模块，日志级别为INFO。可以在 `app.py` 中修改日志配置。

### 错误处理

所有API接口都包含完善的错误处理：
- 400: 请求参数错误
- 404: 接口不存在
- 500: 服务器内部错误

### CORS配置

默认允许所有域名跨域访问。生产环境建议在 `.env` 中配置 `ALLOWED_ORIGINS`。

## 生产部署

### 使用Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 使用Docker（可选）

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

构建并运行：

```bash
docker build -t ai-chat-backend .
docker run -p 5000:5000 --env-file .env ai-chat-backend
```

## 常见问题

### 1. API密钥无效

确保你的 `DASHSCOPE_API_KEY` 是有效的，并且账户有足够的额度。

### 2. 连接超时

检查网络连接，确保可以访问阿里云API服务。

### 3. CORS错误

确保前端应用的域名在CORS配置中被允许。

## 许可证

MIT License

## 联系方式

如有问题，请提交Issue或联系开发团队。

