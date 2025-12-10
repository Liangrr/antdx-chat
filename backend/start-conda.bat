@echo off
REM ====================================
REM AI Chat Backend - Conda启动脚本
REM ====================================

echo ====================================
echo Starting AI Chat Backend with Conda
echo ====================================
echo.

REM 设置conda路径（根据您的安装路径）
set CONDA_PATH=C:\Users\Admin\miniconda3

REM 初始化conda
call "%CONDA_PATH%\Scripts\activate.bat" "%CONDA_PATH%"

echo [INFO] Conda initialized
echo.

REM 检查是否存在ai-chat环境
conda env list | findstr "ai-chat" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Creating conda environment 'ai-chat'...
    conda create -n ai-chat python=3.11 -y
    if errorlevel 1 (
        echo [ERROR] Failed to create conda environment
        pause
        exit /b 1
    )
    echo [SUCCESS] Environment created
    echo.
)

REM 激活环境
echo [INFO] Activating conda environment 'ai-chat'...
call conda activate ai-chat
if errorlevel 1 (
    echo [ERROR] Failed to activate environment
    pause
    exit /b 1
)

echo [SUCCESS] Environment activated
echo.

REM 安装依赖
echo [INFO] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed
echo.

REM 检查.env文件
if not exist .env (
    echo [WARNING] .env file not found!
    echo Please create .env file with your API key
    pause
    exit /b 1
)

REM 启动服务
echo ====================================
echo [INFO] Starting Flask server...
echo [INFO] Backend: http://localhost:5000
echo [INFO] Press Ctrl+C to stop
echo ====================================
echo.

python app.py

