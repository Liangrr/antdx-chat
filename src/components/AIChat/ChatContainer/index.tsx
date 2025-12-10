/**
 * 聊天容器组件
 */

import React, { useEffect, useRef } from 'react';
import { Empty, Spin } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import type { Message } from '@/types';
import { ChatMessage } from '../ChatMessage';
import './style.css';

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
  onResend?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading = false,
  onResend,
  onDelete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="chat-container chat-container-empty">
        <Empty
          image={<MessageOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description={
            <div>
              <p style={{ fontSize: 16, marginBottom: 8 }}>暂无对话</p>
              <p style={{ fontSize: 14, color: '#8c8c8c' }}>
                开始与AI助手对话吧！
              </p>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="chat-container" ref={containerRef}>
      <div className="chat-container-content">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onResend={onResend}
            onDelete={onDelete}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {isLoading && (
        <div className="chat-container-loading">
          <Spin size="small" />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;

