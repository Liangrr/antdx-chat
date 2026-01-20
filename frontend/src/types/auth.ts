/**
 * 认证相关类型定义
 */

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  /**
   * 访问令牌有效期（秒）
   */
  expiresIn?: number;
}

