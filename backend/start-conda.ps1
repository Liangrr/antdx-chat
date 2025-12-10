# ====================================
# AI Chat Backend - Conda启动脚本 (PowerShell)
# ====================================

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Starting AI Chat Backend with Conda" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 设置conda路径
$CONDA_PATH = "C:\Users\Admin\miniconda3"
$CONDA_EXE = "$CONDA_PATH\Scripts\conda.exe"

# 检查conda是否存在
if (-not (Test-Path $CONDA_EXE)) {
    Write-Host "[ERROR] Conda not found at: $CONDA_EXE" -ForegroundColor Red
    Write-Host "Please update the CONDA_PATH in this script" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Found conda at: $CONDA_PATH" -ForegroundColor Green
Write-Host ""

# 检查环境是否存在
$envExists = & $CONDA_EXE env list | Select-String "ai-chat"

if (-not $envExists) {
    Write-Host "[INFO] Creating conda environment 'ai-chat'..." -ForegroundColor Cyan
    & $CONDA_EXE create -n ai-chat python=3.11 -y
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to create conda environment" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "[SUCCESS] Environment created" -ForegroundColor Green
    Write-Host ""
}

# 激活环境并安装依赖
Write-Host "[INFO] Activating environment and installing dependencies..." -ForegroundColor Cyan

# 使用conda run来在指定环境中执行命令
& $CONDA_EXE run -n ai-chat pip install -q -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Some dependencies may have issues" -ForegroundColor Yellow
} else {
    Write-Host "[SUCCESS] Dependencies ready" -ForegroundColor Green
}

Write-Host ""

# 检查.env文件
if (-not (Test-Path ".env")) {
    Write-Host "[WARNING] .env file not found!" -ForegroundColor Yellow
    Write-Host "Please create .env file with your API key" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# 启动服务
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "[INFO] Starting Flask server..." -ForegroundColor Green
Write-Host "[INFO] Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "[INFO] Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 在conda环境中运行Flask
& $CONDA_EXE run -n ai-chat python app.py

