/**
 * AI聊天服务
 */

import type { ChatRequest, ChatResponse } from '@/types';

class ChatService {
  /**
   * 发送聊天消息
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // 这里是模拟API调用，实际项目中需要替换为真实的API端点
      // return await httpClient.post<ChatResponse>('/chat/completions', request);

      // 模拟API响应
      return await this.mockSendMessage(request);
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
      // 实际项目中使用真实的流式API
      // const response = await fetch('/api/chat/stream', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request),
      // });
      //
      // const reader = response.body?.getReader();
      // const decoder = new TextDecoder();
      //
      // while (true) {
      //   const { done, value } = await reader!.read();
      //   if (done) break;
      //   yield decoder.decode(value);
      // }

      // 模拟流式响应
      yield* this.mockStreamResponse(request);
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

