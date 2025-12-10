/**
 * 聊天侧边栏组件
 */

import React from 'react';
import { Avatar, Button } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { MessageInstance } from 'antd/es/message/interface';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import locale from '../_utils/local';

const useStyle = createStyles(({ token, css }) => ({
  side: css`
    background: ${token.colorBgLayout}80;
    width: 280px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    box-sizing: border-box;
  `,
  logo: css`
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 0 24px;
    box-sizing: border-box;
    gap: 8px;
    margin: 24px 0;

    span {
      font-weight: bold;
      color: ${token.colorText};
      font-size: 16px;
    }
  `,
  conversations: css`
    overflow-y: auto;
    margin-top: 12px;
    padding: 0;
    flex: 1;
    .ant-conversations-list {
      padding-inline-start: 0;
    }
  `,
  sideFooter: css`
    border-top: 1px solid ${token.colorBorderSecondary};
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
}));

interface ChatSidebarProps {
  conversations: any[];
  activeConversationKey: string;
  setActiveConversationKey: (key: string) => void;
  addConversation: (item: any) => void;
  setConversations: (items: any[]) => void;
  messages: any[];
  messageApi: MessageInstance;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationKey,
  setActiveConversationKey,
  addConversation,
  setConversations,
  messages,
  messageApi,
}) => {
  const { styles } = useStyle();

  return (
    <div className={styles.side}>
      {/* Logo */}
      <div className={styles.logo}>
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable={false}
          alt="logo"
          width={24}
          height={24}
        />
        <span>Ant Design X</span>
      </div>

      {/* 会话管理 */}
      <Conversations
        creation={{
          onClick: () => {
            if (messages.length === 0) {
              messageApi.error(locale.itIsNowANewConversation);
              return;
            }
            const now = dayjs().valueOf().toString();
            addConversation({
              key: now,
              label: `${locale.newConversation} ${conversations.length + 1}`,
              group: locale.today,
            });
            setActiveConversationKey(now);
          },
        }}
        items={conversations.map(({ key, label, ...other }) => ({
          key,
          label: key === activeConversationKey ? `[${locale.curConversation}]${label}` : label,
          ...other,
        }))}
        className={styles.conversations}
        activeKey={activeConversationKey}
        onActiveChange={setActiveConversationKey}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => ({
          items: [
            {
              label: locale.rename,
              key: 'rename',
              icon: <EditOutlined />,
            },
            {
              label: locale.delete,
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                const newList = conversations.filter((item) => item.key !== conversation.key);
                const newKey = newList?.[0]?.key;
                setConversations(newList);
                if (conversation.key === activeConversationKey) {
                  setActiveConversationKey(newKey);
                }
              },
            },
          ],
        })}
      />

      {/* 底部 */}
      <div className={styles.sideFooter}>
        <Avatar size={24} />
        <Button type="text" icon={<QuestionCircleOutlined />} />
      </div>
    </div>
  );
};

