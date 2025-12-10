/**
 * 本地存储工具
 */

const STORAGE_PREFIX = 'ai_chat_';

export const storage = {
  /**
   * 设置存储项
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, serializedValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * 获取存储项
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * 删除存储项
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * 清空所有存储
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

