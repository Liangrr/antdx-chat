/**
 * 认证相关 Service
 */

import { httpClient, setAuthToken } from '@/utils';
import type { AuthResponse, AuthUser } from '@/types';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

const authService = {
  /**
   * 用户登录
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await httpClient.post<AuthResponse>('/auth/login', payload);

    setAuthToken({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresAt: res.expiresIn ? Date.now() + res.expiresIn * 1000 : undefined,
    });

    return res;
  },

  /**
   * 用户注册
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await httpClient.post<AuthResponse>('/auth/register', payload);

    setAuthToken({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresAt: res.expiresIn ? Date.now() + res.expiresIn * 1000 : undefined,
    });

    return res;
  },

  /**
   * 获取当前用户信息
   */
  async getProfile(): Promise<AuthUser> {
    return httpClient.get<AuthUser>('/auth/me');
  },
};

export default authService;

