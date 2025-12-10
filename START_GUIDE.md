# 项目启动指南

本项目包含前端（React + Vite）和后端（Python + Flask）两部分，需要分别启动。

## 前置要求

- **Node.js**: 16+ 版本
- **Python**: 3.8+ 版本
- **pnpm**: 包管理器（或使用 npm/yarn）
- **阿里云API密钥**: 需要在阿里云百炼平台获取

## 快速启动（3步）

### 1️⃣ 安装前端依赖

```bash
pnpm install
```

### 2️⃣ 配置并启动Python后端

```bash
# 进入后端目录
cd backend

# 安装Python依赖
pip install -r requirements.txt

# 复制环境变量配置文件
copy .env.example .env   # Windows
# 或
cp .env.example .env     # Linux/Mac

# 编辑 .env 文件，填入你的阿里云API密钥
# DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# 启动后端服务
python app.py
```

后端将在 `http://localhost:5000` 启动。

### 3️⃣ 启动前端开发服务器

**新开一个终端窗口**，在项目根目录执行：

```bash
pnpm dev
```

前端将在 `http://localhost:5173` 启动。

## 详细步骤

### 步骤1: 获取阿里云API密钥

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 登录你的阿里云账号
3. 进入"API-KEY管理"页面
4. 创建或查看你的API密钥
5. 复制API密钥备用

### 步骤2: 配置后端环境变量

在 `backend` 目录下创建 `.env` 文件：

```env
# 阿里百炼API配置
DASHSCOPE_API_KEY=sk-your-api-key-here
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1

# 服务器配置
PORT=5000
DEBUG=True
```

### 步骤3: 安装Python依赖（推荐使用虚拟环境）

```bash
cd backend

# 创建虚拟环境（可选但推荐）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 步骤4: 启动后端服务

```bash
# 在 backend 目录下
python app.py
```

看到以下输出表示启动成功：

```
INFO:__main__:Starting Flask server on port 5000
 * Running on http://0.0.0.0:5000
```

### 步骤5: 配置前端环境变量（可选）

如果后端不是运行在 `http://localhost:5000`，需要在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 步骤6: 启动前端服务

**新开一个终端窗口**，在项目根目录执行：

```bash
pnpm dev
```

看到以下输出表示启动成功：

```
VITE v6.0.11  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 步骤7: 访问应用

在浏览器中打开 `http://localhost:5173`，即可使用AI聊天应用！

## 使用npm脚本启动（简化版）

### 启动后端

```bash
pnpm backend
```

### 安装后端依赖

```bash
pnpm backend:install
```

## 验证后端是否正常运行

访问健康检查接口：

```bash
curl http://localhost:5000/health
```

应该返回：

```json
{
  "status": "ok",
  "message": "Backend service is running"
}
```

## 常见问题

### ❌ 问题1: 后端启动失败 - ModuleNotFoundError

**原因**: Python依赖未安装

**解决**:
```bash
cd backend
pip install -r requirements.txt
```

### ❌ 问题2: API调用失败 - 401 Unauthorized

**原因**: API密钥无效或未配置

**解决**:
1. 检查 `backend/.env` 文件中的 `DASHSCOPE_API_KEY` 是否正确
2. 确保API密钥有效且账户有额度
3. 重启后端服务

### ❌ 问题3: 前端无法连接后端 - Network Error

**原因**: 后端未启动或端口配置错误

**解决**:
1. 确保后端服务已启动（访问 http://localhost:5000/health 测试）
2. 检查前端 `.env` 中的 `VITE_API_BASE_URL` 配置
3. 检查防火墙设置

### ❌ 问题4: CORS跨域错误

**原因**: 跨域配置问题

**解决**: 后端已配置CORS，如果仍有问题，检查 `backend/app.py` 中的CORS配置

### ❌ 问题5: Python虚拟环境激活失败

**Windows PowerShell执行策略问题**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 项目结构

```
antdx-demo/
├── backend/                 # Python后端
│   ├── app.py              # Flask应用主文件
│   ├── services/           # 服务层
│   │   └── bailian_service.py  # 阿里百炼API封装
│   ├── requirements.txt    # Python依赖
│   ├── .env               # 环境变量（需自行创建）
│   └── README.md          # 后端文档
├── src/                    # 前端源码
│   ├── services/
│   │   └── chatService.ts # 聊天服务（调用后端API）
│   └── ...
├── package.json           # 前端依赖配置
└── START_GUIDE.md        # 本文档
```

## 开发建议

1. **使用两个终端窗口**: 一个运行后端，一个运行前端
2. **先启动后端再启动前端**: 确保API服务可用
3. **查看日志**: 遇到问题时查看两边的控制台输出
4. **使用虚拟环境**: Python项目推荐使用虚拟环境隔离依赖

## 支持的AI模型

- `qwen-turbo`: 通义千问-Turbo（快速响应，适合日常对话）
- `qwen-plus`: 通义千问-Plus（平衡性能和速度）
- `qwen-max`: 通义千问-Max（最强性能，适合复杂任务）
- `qwen-max-longcontext`: 通义千问-Max长文本版（支持超长文本）

## 生产部署

### 后端部署

使用Gunicorn作为WSGI服务器：

```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 前端部署

```bash
pnpm build
```

构建产物在 `dist/` 目录，可部署到任何静态文件服务器。

## 需要帮助？

- 查看 `backend/README.md` 了解后端详细文档
- 查看项目根目录的其他文档文件
- 提交Issue或联系开发团队

---

祝您使用愉快！🎉

