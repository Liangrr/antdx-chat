/**
 * 侧边栏组件 - 对话历史列表
 */

import React from 'react';
import { Button, Typography, Menu, Dropdown, Avatar } from 'antd';
import { PlusOutlined, MessageOutlined, MoreOutlined, DeleteOutlined, EditOutlined, UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ChatSession } from '@/types';
import './style.css';

const { Text } = Typography;

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
}) => {
  const getSessionMenu = (session: ChatSession) => ({
    items: [
      {
        key: 'rename',
        label: '重命名',
        icon: <EditOutlined />,
        onClick: () => onRenameSession?.(session.id),
      },
      {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => onDeleteSession?.(session.id),
      },
    ],
  });

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const today: ChatSession[] = [];
    const yesterday: ChatSession[] = [];
    const earlier: ChatSession[] = [];

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    sessions.forEach((session) => {
      const diff = now - session.updatedAt;
      if (diff < oneDayMs) {
        today.push(session);
      } else if (diff < oneDayMs * 2) {
        yesterday.push(session);
      } else {
        earlier.push(session);
      }
    });

    return { today, yesterday, earlier };
  };

  const { today, yesterday, earlier } = groupSessionsByDate(sessions);

  const renderSessionGroup = (title: string, sessions: ChatSession[]) => {
    if (sessions.length === 0) return null;

    return (
      <div className="sidebar-group">
        <Text type="secondary" className="sidebar-group-title">
          {title}
        </Text>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`sidebar-item ${currentSessionId === session.id ? 'active' : ''}`}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageOutlined className="sidebar-item-icon" />
            <Text ellipsis className="sidebar-item-title">
              {session.title}
            </Text>
            <Dropdown menu={getSessionMenu(session)} trigger={['click']}>
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                className="sidebar-item-more"
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#1890ff"/>
            <path d="M2 17L12 22L22 17" stroke="#1890ff" strokeWidth="2"/>
          </svg>
          <Text strong style={{ fontSize: 16 }}>Ant Design X</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onNewChat}
          block
          className="sidebar-new-chat"
        >
          新对话
        </Button>
      </div>

      <div className="sidebar-content">
        {renderSessionGroup('今天', today)}
        {renderSessionGroup('昨天', yesterday)}
        {renderSessionGroup('更早', earlier)}

        {sessions.length === 0 && (
          <div className="sidebar-empty">
            <Text type="secondary">暂无对话历史</Text>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <Button
          type="text"
          icon={<QuestionCircleOutlined />}
          size="small"
          block
          className="sidebar-footer-btn"
        >
          <Avatar size={24} icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <Text>WebApp 模式</Text>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
