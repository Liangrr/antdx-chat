/**
 * 部署配置文件
 * 此文件包含敏感信息，已加入 .gitignore，不会被提交到 Git
 */

const path = require('path');

module.exports = {
  // 服务器配置
  server: {
    host: '115.190.204.173',
    port: 22,
    username: 'root',
    password: 'Lrr1026@',
  },

  // 路径配置
  paths: {
    localDist: path.resolve(__dirname, '../dist'), // 指向项目根目录的 dist
    remoteDir: '/usr/project/pure',
    backupDir: '/usr/project/pure/backups', // 备份目录单独存放
  },

  // 构建配置
  build: {
    command: 'pnpm build',
    skipBuild: false,
  },

  // 备份配置
  backup: {
    enabled: true,
    keepCount: 10,  // 保留最近 10 个备份
  },
};

