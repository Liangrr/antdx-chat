/**
 * 聊天侧边栏组件
 */

import React, { useMemo, useState } from 'react';
import { Avatar, Button, Input, Modal, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { MessageInstance } from 'antd/es/message/interface';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import locale from '@/locales/zh-CN';
import { USER_AVATAR, LOGO_IMAGE } from '@/constants/chat';

const useStyle = createStyles(({ token, css }) => ({
  side: css`
    background: ${token.colorBgLayout}80;
    width: 280px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    box-sizing: border-box;
    
    @media (max-width: 768px) {
      width: 100%;
      height: 100vh;
    }
  `,
  logo: css`
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 0 24px;
    box-sizing: border-box;
    gap: 8px;
    margin: 24px 0;

    @media (max-width: 768px) {
      padding: 0 16px;
      margin: 16px 0;
    }

    span {
      font-weight: bold;
      color: ${token.colorText};
      font-size: 16px;
      
      @media (max-width: 768px) {
        font-size: 14px;
      }
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
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
}));

// NOTE: useXConversations 返回结构在不同版本 SDK 可能变化；这里用最小字段集保证类型安全和稳定性
// label 设为可选，兼容 SDK 的 ConversationData 类型（可能没有 label）
export interface ConversationItem {
  key: string;
  label?: string;
  group?: string;
  [k: string]: unknown;
}

interface ChatSidebarProps {
  conversations: ConversationItem[];
  activeConversationKey: string;
  setActiveConversationKey: (key: string) => void;
  addConversation: (item: ConversationItem) => void;
  setConversations: (items: ConversationItem[]) => void;
  // NOTE: 这里只用到了 length，避免引入复杂的 SDK 类型依赖
  messages: readonly unknown[];
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

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameKey, setRenameKey] = useState<string>('');
  const [renameValue, setRenameValue] = useState<string>('');

  const renameTargetLabel = useMemo(() => {
    return conversations.find((item) => item.key === renameKey)?.label ?? '';
  }, [conversations, renameKey]);

  const openRenameModal = (key: string) => {
    // NOTE: label 可能不存在，使用空字符串作为默认值
    const currentLabel = conversations.find((item) => item.key === key)?.label ?? '';
    setRenameKey(key);
    setRenameValue(currentLabel);
    setRenameOpen(true);
  };

  const handleRenameOk = () => {
    const nextLabel = renameValue.trim();
    if (!nextLabel) {
      messageApi.error('请输入名称');
      return;
    }

    setConversations(
      conversations.map((item) => (item.key === renameKey ? { ...item, label: nextLabel } : item)),
    );
    setRenameOpen(false);
  };

  return (
    <div className={styles.side}>
      {/* Logo */}
      <div className={styles.logo}>
        <img
          src={LOGO_IMAGE}
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
          // NOTE: label 可能不存在，需要提供默认值
          label: key === activeConversationKey ? `[${locale.curConversation}]${label ?? ''}` : (label ?? ''),
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
              onClick: () => {
                openRenameModal(conversation.key as string);
              },
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
                  // NOTE: 删除最后一个会话时，保持原 key，避免传入 undefined
                  if (newKey) setActiveConversationKey(newKey);
                }
              },
            },
          ],
        })}
      />

      {/* 重命名弹窗 */}
      <Modal
        title={locale.rename}
        open={renameOpen}
        okText="提交"
        cancelText="取消"
        onOk={handleRenameOk}
        onCancel={() => setRenameOpen(false)}
        afterClose={() => {
          setRenameKey('');
          setRenameValue('');
        }}
      >
        <Input
          autoFocus
          value={renameValue}
          placeholder="请输入名称"
          onChange={(e) => setRenameValue(e.target.value)}
          onPressEnter={handleRenameOk}
          maxLength={50}
          allowClear
        />
        {/* 用于避免用户看不到当前正在改哪个 */}
        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          原名称：{renameTargetLabel || '-'}
        </Typography.Text>
      </Modal>

      {/* 底部 */}
      <div className={styles.sideFooter}>
        <div>
          <Avatar src={USER_AVATAR} size={40} />
          <Typography.Text>{locale.userName}</Typography.Text>
        </div>
        <Button type="text" icon={<QuestionCircleOutlined />} />
      </div>
    </div>
  );
};

