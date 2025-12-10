/**
 * 聊天头部组件
 */

import React from 'react';
import { Typography, Space, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import './style.css';

const { Title, Text } = Typography;

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  messageCount?: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'AI 智能对话',
  subtitle = '基于先进的大语言模型，为您提供智能对话服务',
  messageCount = 0,
}) => {
  return (
    <div className="chat-header">
      <Space align="center" size="middle">
        <Badge count={messageCount} showZero={false} offset={[-5, 5]}>
          <MessageOutlined style={{ fontSize: 32, color: '#1890ff' }} />
        </Badge>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {subtitle}
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default ChatHeader;

