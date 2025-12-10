# AI Chat Application - 基于 Ant Design X

一个现代化的AI聊天应用，前端使用 React + Ant Design X，后端使用 Python Flask + 阿里百炼API。

## 🚀 快速启动

### 前置要求

- **Node.js**: 16+ 版本
- **Conda**: Anaconda 或 Miniconda
- **阿里云API密钥**: 需要在阿里云百炼平台获取

### 启动步骤

#### 1. 安装前端依赖

```bash
pnpm install
```

#### 2. 启动后端服务（使用Conda）

**方法1：双击运行（推荐）**

直接双击项目根目录的 `启动后端-conda.bat` 文件

**方法2：使用npm脚本**

```bash
pnpm backend
```

**方法3：手动启动**

```bash
cd backend

# 创建conda环境（首次运行）
conda create -n ai-chat python=3.11 -y

# 激活环境
conda activate ai-chat

# 安装依赖
pip install -r requirements.txt

# 启动服务
python app.py
```

#### 3. 启动前端服务

新开一个终端窗口：

```bash
pnpm dev
```

#### 4. 访问应用

在浏览器打开：http://localhost:5173

## 📁 项目结构

```
antdx-demo/
├── backend/                    # Python后端
│   ├── app.py                 # Flask主程序
│   ├── services/              # 服务层
│   │   └── bailian_service.py # 阿里百炼API封装
│   ├── requirements.txt       # Python依赖
│   ├── .env                   # 环境变量配置
│   ├── start-conda.bat        # Conda启动脚本(Windows)
│   └── start-conda.ps1        # Conda启动脚本(PowerShell)
├── src/                       # 前端源码
│   ├── components/            # 组件
│   ├── services/              # 服务层
│   ├── hooks/                 # 自定义Hooks
│   ├── types/                 # TypeScript类型
│   └── utils/                 # 工具函数
├── start-conda.js             # Node.js启动脚本
├── 启动后端-conda.bat          # 一键启动脚本
└── package.json               # 前端依赖配置
```

## 🔧 配置说明

### 后端配置

后端配置文件位于 `backend/.env`，包含以下配置：

```env
# 阿里百炼API配置
DASHSCOPE_API_KEY=your-api-key-here
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1

# 服务器配置
PORT=5000
DEBUG=True
```

### 获取阿里云API密钥

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 登录并进入控制台
3. 在"API-KEY管理"中创建或查看API密钥
4. 将密钥配置到 `backend/.env` 文件

## 🎯 功能特性

- ✅ 现代化的聊天界面
- ✅ 支持流式响应
- ✅ 多模型支持（通义千问系列）
- ✅ 会话管理
- ✅ Markdown渲染
- ✅ 代码高亮
- ✅ 响应式设计

## 🔌 API接口

### 后端API

- `GET /health` - 健康检查
- `POST /api/chat/completions` - 聊天补全（非流式）
- `POST /api/chat/stream` - 聊天补全（流式）
- `GET /api/models` - 获取可用模型列表

### 支持的模型

- `qwen-turbo` - 通义千问-Turbo（快速响应）
- `qwen-plus` - 通义千问-Plus（平衡性能）
- `qwen-max` - 通义千问-Max（最强性能）
- `qwen-max-longcontext` - 通义千问-Max长文本版

## 📚 技术栈

### 前端

- React 19
- TypeScript
- Ant Design X
- Vite
- Ant Design

### 后端

- Python 3.11
- Flask
- Flask-CORS
- Requests
- 阿里云百炼API

## 🛠️ 开发建议

1. **使用两个终端窗口**：一个运行后端，一个运行前端
2. **先启动后端再启动前端**：确保API服务可用
3. **查看日志**：遇到问题时查看控制台输出
4. **使用conda环境**：推荐使用conda管理Python依赖

## ❓ 常见问题

### 后端启动失败

- 确保conda已正确安装
- 检查 `.env` 文件是否存在且配置正确
- 确保API密钥有效且有额度

### 前端无法连接后端

- 确保后端服务已启动（访问 http://localhost:5000/health 测试）
- 检查端口5000是否被占用
- 检查防火墙设置

### API调用失败

- 检查API密钥是否正确
- 确认阿里云账户有足够额度
- 查看后端日志了解详细错误信息

## 📖 详细文档

- [后端API文档](backend/README.md) - 后端接口详细说明
- [启动指南](START_GUIDE.md) - 完整的启动和配置指南

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**快速开始**: 双击 `启动后端-conda.bat` → 运行 `pnpm dev` → 访问 http://localhost:5173

祝使用愉快！🎉
