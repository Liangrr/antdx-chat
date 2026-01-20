/**
 * HTTP请求工具封装（集成 Token 管理：自动携带、过期检测、自动刷新）
 */

interface RequestConfig extends RequestInit {
  timeout?: number;
}

interface AuthTokenPayload {
  accessToken: string;
  refreshToken?: string;
  /**
   * 过期时间戳（毫秒）
   */
  expiresAt?: number;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  /**
   * 访问令牌有效期（秒）
   */
  expiresIn?: number;
}

const AUTH_STORAGE_KEY = 'auth_token';

/**
 * 读取本地存储中的 Token
 */
const getStoredAuthToken = (): AuthTokenPayload | null => {
  const token = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!token) {
    return null;
  }
  try {
    return JSON.parse(token) as AuthTokenPayload;
  } catch {
    return null;
  }
};

/**
 * 写入/清理本地 Token
 */
export const setAuthToken = (payload: AuthTokenPayload | null): void => {
  if (!payload) {
    clearAuthToken();
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

// 获取本地存储中的 Token
export const getAuthToken = (): AuthTokenPayload | null => getStoredAuthToken();

/**
 * 清理本地存储中的 Token
 */
export const clearAuthToken = (): void => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const isTokenExpired = (payload: AuthTokenPayload | null): boolean => {
  if (!payload || !payload.expiresAt) return false;
  return payload.expiresAt <= Date.now();
};

/**
 * 使用 refreshToken 刷新访问令牌
 */
const refreshAccessToken = async (
  baseURL: string,
  current: AuthTokenPayload
): Promise<AuthTokenPayload | null> => {
  if (!current.refreshToken) {
    clearAuthToken();
    return null;
  }

  try {
    const response = await fetch(`${baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });

    if (!response.ok) {
      clearAuthToken();
      return null;
    }

    const data: RefreshTokenResponse = (await response.json()) as RefreshTokenResponse;

    const next: AuthTokenPayload = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? current.refreshToken,
      expiresAt: data.expiresIn ? Date.now() + data.expiresIn * 1000 : current.expiresAt,
    };

    setAuthToken(next);
    return next;
  } catch {
    clearAuthToken();
    return null;
  }
};

class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL = '', timeout = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  private async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const { timeout = this.defaultTimeout, ...restConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // 1. 读取本地 Token，如果已过期则尝试刷新
      let auth = getStoredAuthToken();
      if (isTokenExpired(auth)) {
        auth = await refreshAccessToken(this.baseURL, auth as AuthTokenPayload);
      }

      const authHeaders =
        auth && auth.accessToken
          ? {
              Authorization: `Bearer ${auth.accessToken}`,
            }
          : {};

      const mergedHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(authHeaders as Record<string, string>),
        ...(restConfig.headers as HeadersInit),
      };

      const response = await fetch(this.baseURL + url, {
        ...restConfig,
        signal: controller.signal,
        headers: mergedHeaders,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          // 未授权时清理本地 Token，交由上层控制跳转登录
          clearAuthToken();
        }
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时');
        }
        throw error;
      }
      throw new Error('未知错误');
    }
  }

  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}

// 创建默认实例
export const httpClient = new HttpClient('/api');

export default HttpClient;

