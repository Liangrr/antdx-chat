/**
 * 自动化部署脚本
 * 功能：构建项目并上传到云服务器
 * 使用方法：node deploy.cjs
 */

const { execSync } = require('child_process');
const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const archiver = require('archiver');

// ==================== 配置区域 ====================
// 从外部配置文件加载（敏感信息不提交到 Git）
const config = require('./deploy.config.cjs');
// ================================================

class Deployer {
  constructor(config) {
    this.config = config;
    this.sftp = new Client();
  }

  /**
   * 日志输出
   */
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleString('zh-CN');
    const prefix = `[${timestamp}]`;

    switch (type) {
      case 'success':
        console.log(chalk.green(`${prefix} ✓ ${message}`));
        break;
      case 'error':
        console.log(chalk.red(`${prefix} ✗ ${message}`));
        break;
      case 'warning':
        console.log(chalk.yellow(`${prefix} ⚠ ${message}`));
        break;
      case 'info':
      default:
        console.log(chalk.blue(`${prefix} ℹ ${message}`));
        break;
    }
  }

  /**
   * 执行构建
   */
  async build() {
    if (this.config.build.skipBuild) {
      this.log('跳过构建步骤', 'warning');
      return;
    }

    this.log('开始构建项目...', 'info');
    console.log(''); // 空行

    try {
      // 切换到项目根目录执行构建命令
      const projectRoot = path.resolve(__dirname, '..');
      execSync(this.config.build.command, {
        stdio: 'inherit',
        cwd: projectRoot
      });
      console.log(''); // 空行
      this.log('项目构建完成', 'success');
    } catch (error) {
      this.log('构建失败', 'error');
      throw error;
    }
  }

  /**
   * 检查本地 dist 目录
   */
  checkLocalDist() {
    if (!fs.existsSync(this.config.paths.localDist)) {
      throw new Error(`本地 dist 目录不存在: ${this.config.paths.localDist}`);
    }

    const stats = fs.statSync(this.config.paths.localDist);
    if (!stats.isDirectory()) {
      throw new Error(`${this.config.paths.localDist} 不是一个目录`);
    }

    this.log(`检查本地 dist 目录: ${this.config.paths.localDist}`, 'success');
  }

  /**
   * 压缩 dist 目录
   */
  async compressDist() {
    const zipPath = path.join(__dirname, 'dist.zip');

    // 如果已存在旧的压缩包，先删除
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    this.log('开始压缩 dist 目录...', 'info');

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // 最高压缩级别
      });

      output.on('close', () => {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        this.log(`压缩完成，大小: ${sizeMB} MB`, 'success');
        resolve(zipPath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      // 添加 dist 目录到压缩包
      archive.directory(this.config.paths.localDist, 'dist');

      archive.finalize();
    });
  }

  /**
   * 连接服务器
   */
  async connect() {
    this.log(`连接服务器 ${this.config.server.host}:${this.config.server.port}...`, 'info');

    try {
      await this.sftp.connect(this.config.server);
      this.log('服务器连接成功', 'success');
    } catch (error) {
      this.log(`服务器连接失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 上传压缩包
   */
  async uploadZip(localZipPath) {
    const remoteZipPath = `${this.config.paths.remoteDir}/dist.zip`;

    this.log(`上传压缩包到 ${remoteZipPath}...`, 'info');

    try {
      // 确保远程目录存在
      const remoteDir = this.config.paths.remoteDir;
      const exists = await this.sftp.exists(remoteDir);
      if (!exists) {
        await this.sftp.mkdir(remoteDir, true);
      }

      await this.sftp.put(localZipPath, remoteZipPath);
      this.log('压缩包上传完成', 'success');
      return remoteZipPath;
    } catch (error) {
      this.log(`上传失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 执行远程命令
   */
  async executeRemoteCommand(command) {
    return new Promise((resolve, reject) => {
      const { Client: SSHClient } = require('ssh2');
      const conn = new SSHClient();

      // 设置超时
      const timeout = setTimeout(() => {
        conn.end();
        reject(new Error('命令执行超时'));
      }, 60000); // 60秒超时（解压可能需要较长时间）

      conn.on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            clearTimeout(timeout);
            conn.end();
            return reject(err);
          }

          let stdout = '';
          let stderr = '';

          stream.on('close', (code) => {
            clearTimeout(timeout);
            conn.end();
            if (code === 0) {
              resolve({ stdout, stderr });
            } else {
              reject(new Error(`命令执行失败，退出码: ${code}\n${stderr}`));
            }
          });

          stream.on('data', (data) => {
            stdout += data.toString();
          });

          stream.stderr.on('data', (data) => {
            stderr += data.toString();
          });
        });
      }).on('error', (err) => {
        clearTimeout(timeout);
        conn.end();
        reject(err);
      }).connect(this.config.server);
    });
  }

  /**
   * 在服务器上部署
   */
  async deployOnServer(remoteZipPath) {
    const remoteDir = this.config.paths.remoteDir;
    const distPath = `${remoteDir}/dist`;

    // 生成备份名称（格式：dist20251025_140250）
    const timestamp = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/[\/:\s]/g, '').slice(0, 14); // 20251025140250

    const backupName = `dist${timestamp}`;
    const backupPath = `${this.config.paths.backupDir}/${backupName}`;

    try {
      // 1. 备份原 dist 目录
      const distExists = await this.sftp.exists(distPath);
      if (distExists) {
        this.log(`备份原 dist 目录到 ${backupPath}...`, 'info');

        // 确保备份目录存在
        await this.executeRemoteCommand(`mkdir -p ${this.config.paths.backupDir}`);

        // 备份
        await this.executeRemoteCommand(`cp -r ${distPath} ${backupPath}`);
        this.log('备份完成', 'success');

        // 删除旧的 dist 目录
        this.log('删除旧的 dist 目录...', 'info');
        await this.executeRemoteCommand(`rm -rf ${distPath}`);
      } else {
        this.log('原 dist 目录不存在，跳过备份', 'info');
      }

      // 2. 创建 dist 目录并解压
      this.log('创建 dist 目录...', 'info');
      await this.executeRemoteCommand(`mkdir -p ${distPath}`);

      this.log('解压缩包到 dist 目录...', 'info');
      await this.executeRemoteCommand(`unzip -q ${remoteZipPath} -d ${remoteDir}`);
      this.log('解压完成', 'success');

      // 3. 删除压缩包
      this.log('删除压缩包...', 'info');
      await this.executeRemoteCommand(`rm -f ${remoteZipPath}`);
      this.log('压缩包已删除', 'success');

      // 4. 设置权限
      this.log('设置文件权限...', 'info');
      await this.executeRemoteCommand(`chmod -R 755 ${distPath}`);
      this.log('权限设置完成', 'success');

      // 5. 清理旧备份（保留最近几个）
      await this.cleanOldBackups();

    } catch (error) {
      this.log(`服务器部署失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 清理旧备份（超过 10 个时自动删除最旧的）
   */
  async cleanOldBackups() {
    const { backupDir } = this.config.paths;
    const { keepCount } = this.config.backup;

    if (!this.config.backup.enabled) {
      return;
    }

    try {
      const list = await this.sftp.list(backupDir);
      const backups = list
        .filter(item => item.type === 'd' && item.name.startsWith('dist'))
        .sort((a, b) => b.modifyTime - a.modifyTime);  // 按时间降序排序（最新的在前）

      this.log(`当前备份数量: ${backups.length}`, 'info');

      if (backups.length > keepCount) {
        const toDelete = backups.slice(keepCount);  // 保留前 keepCount 个，删除后面的
        this.log(`超过 ${keepCount} 个备份，开始清理最旧的 ${toDelete.length} 个...`, 'warning');
        console.log(''); // 空行

        for (let i = 0; i < toDelete.length; i++) {
          const backup = toDelete[i];
          const backupPath = `${backupDir}/${backup.name}`;
          this.log(`  [${i + 1}/${toDelete.length}] 删除: ${backup.name}`, 'warning');
          await this.executeRemoteCommand(`rm -rf ${backupPath}`);
        }

        console.log(''); // 空行
        this.log(`已删除 ${toDelete.length} 个旧备份`, 'success');
      } else {
        this.log(`备份数量未超过 ${keepCount} 个，无需清理`, 'info');
      }
    } catch (error) {
      this.log(`清理旧备份失败: ${error.message}`, 'warning');
    }
  }

  /**
   * 断开连接
   */
  async disconnect() {
    try {
      await this.sftp.end();
      this.log('已断开服务器连接', 'info');
    } catch (error) {
      // 忽略断开连接时的错误
      this.log('断开连接', 'info');
    }
  }

  /**
   * 清理本地压缩包
   */
  cleanupLocal() {
    const zipPath = path.join(__dirname, 'dist.zip');
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
      this.log('本地压缩包已清理', 'info');
    }
  }

  /**
   * 执行完整的部署流程
   */
  async deploy() {
    const startTime = Date.now();

    console.log(chalk.cyan('\n========================================'));
    console.log(chalk.cyan('    Vue 项目自动化部署工具'));
    console.log(chalk.cyan('========================================\n'));

    let localZipPath = null;

    try {
      // 1. 构建项目
      await this.build();

      // 2. 检查本地 dist
      this.checkLocalDist();

      // 3. 压缩 dist 目录
      localZipPath = await this.compressDist();

      // 4. 连接服务器
      await this.connect();

      // 5. 上传压缩包
      const remoteZipPath = await this.uploadZip(localZipPath);

      // 6. 在服务器上部署（备份、解压、删除压缩包）
      await this.deployOnServer(remoteZipPath);

      // 7. 断开连接
      await this.disconnect();

      // 8. 清理本地压缩包
      this.cleanupLocal();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log(chalk.green('\n========================================'));
      console.log(chalk.green('    部署成功！'));
      console.log(chalk.green(`    耗时: ${duration}秒`));
      console.log(chalk.green('========================================\n'));

      // 确保进程退出
      process.exit(0);

    } catch (error) {
      console.log(chalk.red('\n========================================'));
      console.log(chalk.red('    部署失败！'));
      console.log(chalk.red(`    错误: ${error.message}`));
      console.log(chalk.red('========================================\n'));

      // 清理本地压缩包
      if (localZipPath && fs.existsSync(localZipPath)) {
        fs.unlinkSync(localZipPath);
      }

      // 确保断开连接
      try {
        await this.disconnect();
      } catch (e) {
        // 忽略断开连接的错误
      }

      process.exit(1);
    }
  }
}

// 主函数
(async () => {
  const deployer = new Deployer(config);
  await deployer.deploy();
})();

