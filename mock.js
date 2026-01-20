// 模拟数据
// 用户信息
const userData = localStorage.setItem('auth_user', JSON.stringify({id: 50, username: 'lrr'}))
// 令牌信息
const tokenData = localStorage.setItem('auth_token', JSON.stringify({accessToken: '1234567890', refreshToken: '1234567890', expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30}))