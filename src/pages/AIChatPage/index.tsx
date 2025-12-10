/**
 * AI聊天页面
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Layout, message as antdMessage, Modal, Button } from 'antd';
import {
  ChatContainer,
  ChatInput,
  Sidebar,
  WelcomePage,
  GuidePanel,
} from '@/components/AIChat';
import { useChat, useSession } from '@/hooks';
import { AI_MODELS, DEFAULT_MODEL_ID } from '@/constants';
import type { AIModel } from '@/types';
import './style.css';

const { Content, Header } = Layout;

export const AIChatPage: React.FC = () => {
  // 选择的模型
  const [selectedModel, setSelectedModel] = useState<AIModel>(() => {
    return AI_MODELS.find((m) => m.id === DEFAULT_MODEL_ID) || AI_MODELS[0];
  });

  // 会话管理
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    updateSession,
    deleteSession,
    getCurrentSession,
  } = useSession();

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
    deleteMessage,
  } = useChat({
    model: selectedModel,
    config: chatConfig,
    onError: handleError,
  });

  // 同步消息到当前会话
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const currentSession = getCurrentSession();
      if (currentSession) {
        // 生成会话标题（使用第一条用户消息）
        const firstUserMessage = messages.find((m) => m.role === 'user');
        const title = firstUserMessage
          ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '')
          : '新对话';

        updateSession(currentSessionId, {
          messages,
          title: currentSession.messages.length === 0 ? title : currentSession.title,
        });
      }
    }
  }, [messages, currentSessionId, getCurrentSession, updateSession]);

  // 创建新对话
  const handleNewChat = useCallback(() => {
    if (isLoading) {
      antdMessage.warning('正在生成回复，请稍后再操作');
      return;
    }

    clearMessages();
    const newSession = createSession(selectedModel.id);
    setCurrentSessionId(newSession.id);
  }, [isLoading, clearMessages, createSession, selectedModel.id, setCurrentSessionId]);

  // 选择会话
  const handleSelectSession = useCallback(
    (sessionId: string) => {
      if (isLoading) {
        antdMessage.warning('正在生成回复，请稍后再操作');
        return;
      }

      setCurrentSessionId(sessionId);
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        // TODO: 加载会话消息
        clearMessages();
      }
    },
    [isLoading, sessions, setCurrentSessionId, clearMessages]
  );

  // 删除会话
  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除这个对话吗？此操作不可恢复。',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteSession(sessionId);
          antdMessage.success('对话已删除');
        },
      });
    },
    [deleteSession]
  );

  // 重命名会话
  const handleRenameSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;

      Modal.confirm({
        title: '重命名对话',
        content: (
          <input
            id="rename-input"
            defaultValue={session.title}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginTop: '8px',
            }}
          />
        ),
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const input = document.getElementById('rename-input') as HTMLInputElement;
          const newTitle = input?.value.trim();
          if (newTitle) {
            updateSession(sessionId, { title: newTitle });
            antdMessage.success('重命名成功');
          }
        },
      });
    },
    [sessions, updateSession]
  );

  // 处理热门话题点击
  const handleTopicClick = useCallback(
    (topic: string) => {
      if (!currentSessionId) {
        handleNewChat();
      }
      sendMessage(topic);
    },
    [currentSessionId, handleNewChat, sendMessage]
  );

  // 显示欢迎页还是聊天内容
  const showWelcome = messages.length === 0;

  return (
    <Layout className="ai-chat-page">
      {/* 左侧边栏 */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />

      {/* 中间内容区 */}
      <Layout className="ai-chat-main">
        {/* 顶部按钮 */}
        <Header className="ai-chat-header">
          <Button type="text" className="ai-chat-help-btn">
            我是谁啊
          </Button>
        </Header>

        <Content className="ai-chat-content">
          {showWelcome ? (
            <WelcomePage onTopicClick={handleTopicClick} />
          ) : (
            <ChatContainer
              messages={messages}
              isLoading={isLoading}
              onResend={resendMessage}
              onDelete={deleteMessage}
              onStop={stopGeneration}
              showPagination={messages.length > 0}
            />
          )}
        </Content>

        {/* 输入区 */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </Layout>

      {/* 右侧指南面板 */}
      <GuidePanel />
    </Layout>
  );
};

export default AIChatPage;

