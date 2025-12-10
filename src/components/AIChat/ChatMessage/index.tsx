/**
 * 聊天消息组件
 */

import React from 'react';
import { Avatar, Typography, Space, Button, Spin } from 'antd';
import {
  UserOutlined,
  RobotOutlined,
  CopyOutlined,
  RedoOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { Message } from '@/types';
import { formatTimestamp } from '@/utils';
import './style.css';

const { Text, Paragraph } = Typography;

interface ChatMessageProps {
  message: Message;
  onResend?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onResend,
  onDelete,
}) => {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}`}>
      <div className="chat-message-avatar">
        <Avatar
          size={40}
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{
            backgroundColor: isUser ? '#1890ff' : '#52c41a',
          }}
        />
      </div>

      <div className="chat-message-content">
        <div className="chat-message-header">
          <Text strong>{isUser ? '你' : 'AI助手'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatTimestamp(message.timestamp)}
          </Text>
        </div>

        <div className={`chat-message-body ${isError ? 'chat-message-error' : ''}`}>
          {isSending && !message.content ? (
            <Space>
              <Spin size="small" />
              <Text type="secondary">正在思考...</Text>
            </Space>
          ) : (
            <>
              <Paragraph
                style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
                copyable={false}
              >
                {message.content}
              </Paragraph>
              {isError && message.error && (
                <div className="chat-message-error-info">
                  <ExclamationCircleOutlined />
                  <Text type="danger">{message.error}</Text>
                </div>
              )}
            </>
          )}
        </div>

        {message.content && (
          <div className="chat-message-actions">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopy}
            >
              复制
            </Button>

            {isError && onResend && (
              <Button
                type="text"
                size="small"
                icon={<RedoOutlined />}
                onClick={() => onResend(message.id)}
              >
                重试
              </Button>
            )}

            {onDelete && (
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(message.id)}
              >
                删除
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

