/**
 * HTTP请求工具封装
 */

interface RequestConfig extends RequestInit {
  timeout?: number;
}

class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL = '', timeout = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  private async request<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, ...restConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(this.baseURL + url, {
        ...restConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...restConfig.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
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

