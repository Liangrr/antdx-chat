/**
 * 认证上下文，管理登录状态和当前用户
 */

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/utils';
import type { AuthResponse, AuthUser } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (params: { username: string; password: string }) => Promise<void>;
  register: (params: { username: string; password: string; email?: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  isAuthenticated: false, // 是否已认证
  // 这里提供空实现以满足默认值要求，实际会被 Provider 覆盖
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async login() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async register() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout() {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const USER_STORAGE_KEY = 'auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化时从本地读取用户信息和 Token
  useEffect(() => {
    const token = getAuthToken(); // 获取本地存储的 Token
    if (!token) {
      setLoading(false); // 如果 Token 不存在，则设置加载状态为 false
      return;
    }

    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY); // 获取本地存储的用户信息
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser); // 将用户信息转换为 AuthUser 类型并设置到状态中
        setLoading(false); // 如果用户信息存在，则设置加载状态为 false
        return;
      } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    // 如果没有本地用户信息，则从服务端拉取
    authService
      .getProfile()
      .then((profile) => {
        setUser(profile);
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      })
      .catch(() => {
        clearAuthToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAuthSuccess = useCallback((res: AuthResponse) => {
    const payload = {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresAt: res.expiresIn ? Date.now() + res.expiresIn * 1000 : undefined,
    };
    setAuthToken(payload);
    setUser(res.user);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
  }, []);

  const login = useCallback(
    async (params: { username: string; password: string }) => {
      const res = await authService.login(params);
      handleAuthSuccess(res);
    },
    [handleAuthSuccess]
  );

  const register = useCallback(
    async (params: { username: string; password: string; email?: string }) => {
      const res = await authService.register({
        username: params.username,
        password: params.password,
        confirmPassword: params.password,
        email: params.email,
      });
      handleAuthSuccess(res);
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

