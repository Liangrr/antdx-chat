/**
 * AI聊天服务
 */

import type { ChatRequest, ChatResponse } from '@/types';

// Python后端API地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ChatService {
  /**
   * 发送聊天消息
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * 流式发送消息（SSE）
   */
  async *sendMessageStream(
    request: ChatRequest
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start stream');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('data:')) {
            const data = trimmedLine.slice(5).trim();
            
            if (data === '[DONE]') {
              return;
            }

            if (data) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  yield parsed.content;
                }
              } catch (err) {
                // NOTE: 保留错误对象，避免 unused vars，同时便于排查后端推送异常
                console.warn('Failed to parse SSE data:', err, data);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream message error:', error);
      throw error;
    }
  }

  /**
   * 获取可用模型列表
   */
  async getModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Get models error:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default ChatService;

