/**
 * 聊天功能Hook
 */

import { useState, useCallback, useRef } from 'react';
import type { Message, AIModel, ChatConfig } from '@/types';
import { chatService } from '@/services';
import { generateId } from '@/utils';
import { message as antdMessage } from 'antd';

interface UseChatOptions {
  model: AIModel;
  config?: Partial<ChatConfig>;
  onError?: (error: Error) => void;
}

export const useChat = (options: UseChatOptions) => {
  const { model, config, onError } = options;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 发送消息
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        status: 'success',
      };

      // 添加用户消息
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // 创建助手消息占位
      const assistantMessageId = generateId();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // 准备请求数据
        const requestMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // 使用流式响应
        let fullContent = '';
        const stream = chatService.sendMessageStream({
          model: model.id,
          messages: requestMessages,
          temperature: config?.temperature ?? model.temperature,
          max_tokens: config?.maxTokens ?? model.maxTokens,
          stream: true,
        });

        for await (const chunk of stream) {
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent, status: 'sending' }
                : msg
            )
          );
        }

        // 更新为成功状态
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, status: 'success' as const }
              : msg
          )
        );
      } catch (error) {
        console.error('Send message error:', error);

        // 更新为错误状态
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : '发送失败',
                }
              : msg
          )
        );

        antdMessage.error('消息发送失败，请重试');
        onError?.(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, model, config, isLoading, onError]
  );

  /**
   * 重新发送消息
   */
  const resendMessage = useCallback(
    (messageId: string) => {
      const message = messages.find((msg) => msg.id === messageId);
      if (!message) return;

      // 删除错误消息及其后面的所有消息
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      setMessages((prev) => prev.slice(0, messageIndex));

      // 重新发送
      if (message.role === 'user') {
        sendMessage(message.content);
      }
    },
    [messages, sendMessage]
  );

  /**
   * 清空对话
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    abortControllerRef.current?.abort();
  }, []);

  /**
   * 停止生成
   */
  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);

    // 更新最后一条消息状态
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.status === 'sending') {
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, status: 'success' as const },
        ];
      }
      return prev;
    });
  }, []);

  /**
   * 删除消息
   */
  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    resendMessage,
    clearMessages,
    stopGeneration,
    deleteMessage,
  };
};

