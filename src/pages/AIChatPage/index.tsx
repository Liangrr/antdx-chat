/**
 * AI聊天页面
 */

import React, { useState, useCallback } from 'react';
import { Layout, message as antdMessage } from 'antd';
import {
  ChatHeader,
  ChatContainer,
  ChatInput,
  ModelSelector,
} from '@/components/AIChat';
import { useChat } from '@/hooks';
import { AI_MODELS, DEFAULT_MODEL_ID } from '@/constants';
import type { AIModel } from '@/types';
import './style.css';

const { Content } = Layout;

export const AIChatPage: React.FC = () => {
  // 选择的模型
  const [selectedModel, setSelectedModel] = useState<AIModel>(() => {
    return AI_MODELS.find((m) => m.id === DEFAULT_MODEL_ID) || AI_MODELS[0];
  });

  // 聊天配置
  const chatConfig = {
    temperature: selectedModel.temperature || 0.7,
    maxTokens: selectedModel.maxTokens || 2048,
  };

  // 错误处理
  const handleError = useCallback((error: Error) => {
    console.error('Chat error:', error);
    antdMessage.error(`发生错误: ${error.message}`);
  }, []);

  // 使用聊天Hook
  const {
    messages,
    isLoading,
    sendMessage,
    resendMessage,
    clearMessages,
    stopGeneration,
    deleteMessage,
  } = useChat({
    model: selectedModel,
    config: chatConfig,
    onError: handleError,
  });

  // 切换模型
  const handleModelChange = useCallback(
    (model: AIModel) => {
      if (isLoading) {
        antdMessage.warning('正在生成回复，请稍后再切换模型');
        return;
      }

      if (messages.length > 0) {
        const confirmed = window.confirm(
          '切换模型将清空当前对话，是否继续？'
        );
        if (!confirmed) return;
        clearMessages();
      }

      setSelectedModel(model);
      antdMessage.success(`已切换到 ${model.name}`);
    },
    [isLoading, messages.length, clearMessages]
  );

  return (
    <Layout className="ai-chat-page">
      {/* 头部 */}
      <ChatHeader messageCount={messages.length} />

      {/* 模型选择器 */}
      <ModelSelector
        models={AI_MODELS}
        selectedModel={selectedModel}
        onChange={handleModelChange}
        disabled={isLoading}
      />

      {/* 聊天内容区 */}
      <Content className="ai-chat-content">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onResend={resendMessage}
          onDelete={deleteMessage}
        />
      </Content>

      {/* 输入区 */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopGeneration}
        onClear={clearMessages}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default AIChatPage;

