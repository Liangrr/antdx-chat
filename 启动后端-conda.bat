@echo off
chcp 65001 >nul
cls

echo ====================================
echo   AI Chat Backend 启动器 (Conda)
echo ====================================
echo.

cd /d "%~dp0backend"

echo [1/4] 初始化 Conda...
call C:\Users\Admin\miniconda3\Scripts\activate.bat C:\Users\Admin\miniconda3
if errorlevel 1 (
    echo ❌ Conda 初始化失败
    pause
    exit /b 1
)

echo [2/4] 检查环境...
conda env list | findstr "ai-chat" >nul 2>&1
if errorlevel 1 (
    echo 创建 ai-chat 环境...
    conda create -n ai-chat python=3.11 -y
)

echo [3/4] 激活环境并安装依赖...
call conda activate ai-chat
pip install -q -r requirements.txt

echo [4/4] 启动服务...
echo.
echo ====================================
echo   后端服务启动中...
echo   地址: http://localhost:5000
echo   按 Ctrl+C 停止服务
echo ====================================
echo.

python app.py

pause

