/**
 * 聊天导航栏组件 - 显示用户提问列表，支持快速跳转
 */

import React, { useMemo } from 'react';
import { List, Typography } from 'antd';
import { createStyles } from 'antd-style';
import type { ChatMessage } from '@/types/chat';

const { Text } = Typography;

const useStyle = createStyles(({ token, css }) => ({
  navigation: css`
    width: 240px;
    height: 100%;
    background: ${token.colorBgLayout};
    border-left: 1px solid ${token.colorBorderSecondary};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    @media (max-width: 1200px) {
      display: none;
    }
    
    /* NOTE: 在 Drawer 中使用时，移除边框并占满高度 */
    &.in-drawer {
      width: 100%;
      height: 100%;
      min-height: 100%;
      border-left: none;
      display: flex !important;
    }
  `,
  header: css`
    padding: 16px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    
    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: ${token.colorText};
    }
  `,
  list: css`
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
    
    .ant-list-item {
      padding: 8px 16px;
      cursor: pointer;
      transition: all 0.2s;
      border-left: 2px solid transparent;
      
      &:hover {
        background: ${token.colorBgTextHover};
        border-left-color: ${token.colorPrimary};
      }
      
      &.active {
        background: ${token.colorPrimaryBg};
        border-left-color: ${token.colorPrimary};
      }
    }
  `,
  itemContent: css`
    .ant-typography {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
  empty: css`
    padding: 24px 16px;
    text-align: center;
    color: ${token.colorTextSecondary};
    font-size: 12px;
  `,
}));

interface ChatNavigationProps {
  messages: Array<{
    id: string | number;
    message: ChatMessage;
    status?: string;
  }>;
  onNavigate?: (messageId: string) => void;
  activeMessageId?: string;
  className?: string;
}

export const ChatNavigation: React.FC<ChatNavigationProps> = ({
  messages,
  onNavigate,
  activeMessageId,
  className,
}) => {
  const { styles } = useStyle();

  // 提取所有用户消息
  const userMessages = useMemo(() => {
    return messages
      .filter((item) => item.message.role === 'user')
      .map((item, index) => {
        // NOTE: content 可能是 string 或对象，统一处理为 string
        const content = typeof item.message.content === 'string' 
          ? item.message.content 
          : String(item.message.content || '');
        return {
          id: String(item.id),
          content,
          index: index + 1,
        };
      });
  }, [messages]);

  // 生成消息标题（取前30个字符）
  const getMessageTitle = (content: string, index: number) => {
    if (!content.trim()) {
      return `提问 ${index}`;
    }
    const text = content.replace(/\n/g, ' ').trim();
    return text.length > 30 ? `${text.slice(0, 30)}...` : text;
  };

  const handleItemClick = (messageId: string) => {
    if (onNavigate) {
      onNavigate(messageId);
    } else {
      // 默认行为：滚动到对应消息
      // NOTE: 查找用户消息对应的元素（可能是用户消息本身或紧邻的 AI 回复）
      const element = document.querySelector(`[data-message-id="${messageId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // 高亮效果
        element.classList.add('message-highlight');
        setTimeout(() => {
          element.classList.remove('message-highlight');
        }, 2000);
      }
    }
  };

  if (userMessages.length === 0) {
    return (
      <div className={`${styles.navigation} ${className || ''}`}>
        <div className={styles.header}>
          <h4>提问导航</h4>
        </div>
        <div className={styles.empty}>暂无提问</div>
      </div>
    );
  }

  return (
    <div className={`${styles.navigation} ${className || ''}`}>
      <div className={styles.header}>
        <h4>提问导航 ({userMessages.length})</h4>
      </div>
      <List
        className={styles.list}
        dataSource={userMessages}
        renderItem={(item) => (
          <List.Item
            className={activeMessageId === item.id ? 'active' : ''}
            onClick={() => handleItemClick(item.id)}
          >
            <div className={styles.itemContent}>
              <Text type="secondary" style={{ fontSize: 11, marginBottom: 4, display: 'block' }}>
                #{item.index}
              </Text>
              <Text>{getMessageTitle(item.content, item.index)}</Text>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
