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
              } catch (e) {
                console.warn('Failed to parse SSE data:', data);
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
   * 模拟发送消息（开发用）
   */
  private async mockSendMessage(request: ChatRequest): Promise<ChatResponse> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const userMessage = request.messages[request.messages.length - 1]?.content || '';

    // 简单的模拟响应逻辑
    let responseContent = '';

    if (userMessage.includes('你好') || userMessage.includes('您好')) {
      responseContent = '你好！我是AI助手，很高兴为您服务。有什么我可以帮助您的吗？';
    } else if (userMessage.includes('天气')) {
      responseContent = '抱歉，我目前无法获取实时天气信息。建议您查看天气预报应用或网站获取准确的天气数据。';
    } else if (userMessage.includes('帮助') || userMessage.includes('功能')) {
      responseContent = '我可以帮助您：\n1. 回答各类问题\n2. 提供建议和指导\n3. 进行对话交流\n4. 协助解决问题\n\n请随时告诉我您需要什么帮助！';
    } else {
      responseContent = `我理解您说的是："${userMessage}"。作为AI助手，我会尽力为您提供帮助。请问您需要了解更多相关信息吗？`;
    }

    return {
      id: `msg_${Date.now()}`,
      content: responseContent,
      model: request.model,
      usage: {
        prompt_tokens: userMessage.length,
        completion_tokens: responseContent.length,
        total_tokens: userMessage.length + responseContent.length,
      },
    };
  }

  /**
   * 模拟流式响应（开发用）
   */
  private async *mockStreamResponse(
    request: ChatRequest
  ): AsyncGenerator<string, void, unknown> {
    const response = await this.mockSendMessage(request);
    const words = response.content.split('');

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 50));
      yield word;
    }
  }

  /**
   * 获取可用模型列表
   */
  async getModels() {
    try {
      // return await httpClient.get('/models');
      // 模拟返回
      return [];
    } catch (error) {
      console.error('Get models error:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default ChatService;

