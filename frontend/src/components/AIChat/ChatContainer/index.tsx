/**
 * 聊天容器组件
 */

import React, { useEffect, useRef } from 'react';
import { Button, Space, Typography } from 'antd';
import { StopOutlined, ReloadOutlined, CopyOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import type { Message } from '@/types';
import { ChatMessage } from '../ChatMessage';
import { EmptyState } from '../EmptyState';
import './style.css';

const { Text } = Typography;

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
  onResend?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onStop?: () => void;
  showPagination?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading = false,
  onResend,
  onDelete,
  onStop,
  showPagination = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container" ref={containerRef}>
      <div className="chat-container-content">
        {messages.length === 0 ? (
          <EmptyState message="暂无数据" />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onResend={onResend}
                onDelete={onDelete}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}

        {/* 分页和操作按钮 */}
        {messages.length > 0 && showPagination && (
          <div className="chat-container-actions">
            <div className="chat-pagination">
              <Button type="text" size="small" icon={<span>&lt;</span>} disabled />
              <Space size="small">
                <Text style={{ fontSize: 12 }}>1</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>/</Text>
                <Text style={{ fontSize: 12 }}>1</Text>
              </Space>
              <Button type="text" size="small" icon={<span>&gt;</span>} disabled />
            </div>
            <Space size="small">
              <Button type="text" size="small" icon={<ReloadOutlined />} />
              <Button type="text" size="small" icon={<CopyOutlined />} />
              <Button type="text" size="small" icon={<span>🔊</span>} />
              <Button type="text" size="small" icon={<LikeOutlined />} />
              <Button type="text" size="small" icon={<DislikeOutlined />} />
            </Space>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className="chat-container-loading">
            <Button
              type="text"
              size="small"
              icon={<StopOutlined />}
              onClick={onStop}
            >
              已经终止
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;


