/**
 * 使用Conda启动后端服务的Node.js脚本
 */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const backendDir = path.join(__dirname, 'backend');
const CONDA_PATH = 'C:\\Users\\Admin\\miniconda3';
const ENV_NAME = 'ai-chat';

console.log('\n====================================');
console.log('🚀 AI Chat Backend (Conda)');
console.log('====================================\n');

// 检查后端健康状态
function checkBackendHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/health', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.status === 'ok');
        } catch {
          resolve(false);
        }
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// 等待服务启动
async function waitForBackend(maxAttempts = 30) {
  console.log('⏳ Waiting for backend to start...\n');
  
  for (let i = 0; i < maxAttempts; i++) {
    const isHealthy = await checkBackendHealth();
    if (isHealthy) {
      console.log('✅ Backend is running!\n');
      return true;
    }
    process.stdout.write(`   Attempt ${i + 1}/${maxAttempts}...\r`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n❌ Backend failed to start within timeout');
  return false;
}

// 执行conda命令
function runCondaCommand(args, options = {}) {
  return new Promise((resolve, reject) => {
    const condaExe = path.join(CONDA_PATH, 'Scripts', 'conda.exe');
    
    const proc = spawn(condaExe, args, {
      ...options,
      shell: true,
      stdio: options.silent ? 'pipe' : 'inherit'
    });
    
    let output = '';
    
    if (options.silent) {
      proc.stdout?.on('data', (data) => { output += data.toString(); });
      proc.stderr?.on('data', (data) => { output += data.toString(); });
    }
    
    proc.on('close', (code) => {
      if (code === 0 || options.ignoreError) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    proc.on('error', reject);
  });
}

// 检查环境是否存在
async function checkEnvironment() {
  try {
    const output = await runCondaCommand(['env', 'list'], { silent: true });
    return output.includes(ENV_NAME);
  } catch {
    return false;
  }
}

// 创建conda环境
async function createEnvironment() {
  console.log(`📦 Creating conda environment '${ENV_NAME}'...`);
  try {
    await runCondaCommand(['create', '-n', ENV_NAME, 'python=3.11', '-y']);
    console.log('✅ Environment created\n');
    return true;
  } catch (err) {
    console.error('❌ Failed to create environment:', err.message);
    return false;
  }
}

// 安装依赖
async function installDependencies() {
  console.log('📦 Installing Python dependencies...');
  try {
    await runCondaCommand([
      'run', '-n', ENV_NAME,
      'pip', 'install', '-q', '-r', 'requirements.txt'
    ], { cwd: backendDir });
    console.log('✅ Dependencies installed\n');
    return true;
  } catch (err) {
    console.log('⚠️  Some dependencies may have issues, continuing...\n');
    return true; // 继续执行
  }
}

// 启动Flask服务
async function startFlask() {
  console.log('🚀 Starting Flask server...\n');
  
  const condaExe = path.join(CONDA_PATH, 'Scripts', 'conda.exe');
  
  const flask = spawn(condaExe, [
    'run', '-n', ENV_NAME,
    'python', 'app.py'
  ], {
    cwd: backendDir,
    shell: true,
    stdio: 'inherit'
  });
  
  flask.on('error', (err) => {
    console.error('❌ Failed to start Flask:', err.message);
    process.exit(1);
  });
  
  flask.on('close', (code) => {
    console.log(`\n⚠️  Backend exited with code ${code}`);
    process.exit(code);
  });
  
  return flask;
}

// 主函数
async function main() {
  try {
    // 检查conda
    const condaExe = path.join(CONDA_PATH, 'Scripts', 'conda.exe');
    if (!fs.existsSync(condaExe)) {
      console.error('❌ Conda not found at:', CONDA_PATH);
      console.error('💡 Please update CONDA_PATH in start-conda.js');
      process.exit(1);
    }
    
    console.log('✅ Found conda at:', CONDA_PATH, '\n');
    
    // 检查.env文件
    const envFile = path.join(backendDir, '.env');
    if (!fs.existsSync(envFile)) {
      console.error('❌ .env file not found!');
      console.error('💡 Please create backend/.env with your API key\n');
      process.exit(1);
    }
    
    // 检查是否已运行
    const alreadyRunning = await checkBackendHealth();
    if (alreadyRunning) {
      console.log('✅ Backend already running on http://localhost:5000\n');
      console.log('====================================');
      console.log('🎉 Services Status:');
      console.log('   Backend:  http://localhost:5000');
      console.log('   Frontend: http://localhost:5173');
      console.log('====================================\n');
      return;
    }
    
    // 检查/创建环境
    const envExists = await checkEnvironment();
    if (!envExists) {
      const created = await createEnvironment();
      if (!created) {
        process.exit(1);
      }
    } else {
      console.log(`✅ Conda environment '${ENV_NAME}' exists\n`);
    }
    
    // 安装依赖
    await installDependencies();
    
    // 启动Flask
    const flaskProcess = await startFlask();
    
    // 等待启动
    const started = await waitForBackend();
    
    if (started) {
      console.log('====================================');
      console.log('🎉 Backend is ready!');
      console.log('====================================');
      console.log('   Backend:  http://localhost:5000');
      console.log('   Frontend: http://localhost:5173');
      console.log('====================================\n');
      console.log('💡 Press Ctrl+C to stop the backend\n');
    }
    
    // 处理退出
    const cleanup = () => {
      console.log('\n\n🛑 Stopping backend...');
      flaskProcess.kill('SIGTERM');
      setTimeout(() => process.exit(0), 1000);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();

