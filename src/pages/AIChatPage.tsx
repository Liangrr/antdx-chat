/**
 * AI聊天页面 - 使用 Ant Design X
 */

import React, { useState } from 'react';
import { message, Flex } from 'antd';
import { XProvider, Prompts, Welcome, Bubble, Attachments } from '@ant-design/x';
import { useXChat, useXConversations } from '@ant-design/x-sdk';
import type { GetProp } from 'antd';
import { createStyles } from 'antd-style';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

import { ChatSidebar } from '@/components/Chat/ChatSidebar';
import { ChatSender } from '@/components/Chat/ChatSender';
import { ChatContext } from '@/contexts/ChatContext';
import { providerFactory, historyMessageFactory, getRole } from '@/utils/chat';
import { DEFAULT_CONVERSATIONS_ITEMS, HOT_TOPICS, DESIGN_GUIDE } from '@/constants/chat';
import { useMarkdownTheme } from '@/utils/markdown';
import locale from '@/locales/zh-CN';
import type { ChatMessage } from '@/types/chat';
import { USER_AVATAR } from '@/constants/chat';

// ==================== Style ====================
const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    chat: css`
      height: 100%;
      width: calc(100% - 280px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      justify-content: space-between;
      .ant-bubble-content-updating {
        background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      }
    `,
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
    `,
    chatList: css`
      display: flex;
      height: calc(100% - 120px);
      flex-direction: column;
      align-items: center;
      width: 100%;
    `,
    placeholder: css`
      padding-top: 32px;
      width: 100%;
      padding-inline: ${token.paddingLG}px;
      box-sizing: border-box;
    `,
  };
});

const AIChatPage: React.FC = () => {
  const { styles } = useStyle();
  const [className] = useMarkdownTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);
  const [inputValue, setInputValue] = useState('');

  // 会话管理
  const {
    conversations,
    activeConversationKey,
    setActiveConversationKey,
    addConversation,
    setConversations,
  } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
    defaultActiveConversationKey: DEFAULT_CONVERSATIONS_ITEMS[0].key,
  });

  // 聊天功能
  const { onRequest, messages, isRequesting, abort, onReload, setMessage } = useXChat<ChatMessage>({
    provider: providerFactory(activeConversationKey),
    conversationKey: activeConversationKey,
    defaultMessages: historyMessageFactory(activeConversationKey),
    requestPlaceholder: () => ({
      content: locale.noData,
      role: 'assistant',
    }),
    requestFallback: (_, { messageInfo }) => ({
      ...messageInfo?.message,
      content: messageInfo?.message?.content || locale.requestFailedPleaseTryAgain,
    }),
  });

  // 提交消息
  const onSubmit = (val: string) => {
    if (!val) return;
    onRequest({
      messages: [{ role: 'user', content: val }],
    });
    setActiveConversationKey(activeConversationKey);
  };

  // 渲染聊天列表
  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        <Bubble.List
          items={messages?.map((i) => ({
            ...i.message,
            key: i.id,
            status: i.status,
            loading: i.status === 'loading',
            extraInfo: i.extraInfo,
          }))}
          styles={{
            bubble: {
              maxWidth: 840,
            },
          }}
          role={getRole(className, { onReload, setMessage })}
        />
      ) : (
        <Flex
          vertical
          style={{ maxWidth: 840 }}
          gap={16}
          align="center"
          className={styles.placeholder}
        >
          <Welcome
            style={{ width: '100%' }}
            variant="borderless"
            icon={USER_AVATAR}
            title={locale.welcome}
            description={locale.welcomeDescription}
          />
          <Flex gap={16} justify="center" style={{ width: '100%' }}>
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: '100%' },
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { padding: 0, background: 'transparent' },
              }}
              onItemClick={(info) => onSubmit(info.data.description as string)}
              className={styles.chatPrompt}
            />
            <Prompts
              items={[DESIGN_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { background: '#ffffffa6' },
              }}
              onItemClick={(info) => onSubmit(info.data.description as string)}
              className={styles.chatPrompt}
            />
          </Flex>
        </Flex>
      )}
    </div>
  );

  return (
    <XProvider>
      <ChatContext.Provider value={{ onReload, setMessage }}>
        {contextHolder}
        <div className={styles.layout}>
          {/* 左侧边栏 */}
          <ChatSidebar
            conversations={conversations}
            activeConversationKey={activeConversationKey}
            setActiveConversationKey={setActiveConversationKey}
            addConversation={addConversation}
            setConversations={setConversations}
            messages={messages}
            messageApi={messageApi}
          />

          {/* 主聊天区域 */}
          <div className={styles.chat}>
            {chatList}
            
            {/* 输入框 */}
            <ChatSender
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSubmit={onSubmit}
              isRequesting={isRequesting}
              abort={abort}
              attachmentsOpen={attachmentsOpen}
              setAttachmentsOpen={setAttachmentsOpen}
              attachedFiles={attachedFiles}
              setAttachedFiles={setAttachedFiles}
            />
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default AIChatPage;

