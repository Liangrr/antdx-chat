/**
 * AI聊天页面 - 使用 Ant Design X
 */

import React, { useState, useMemo } from 'react';
import { message, Flex, Drawer, Button } from 'antd';
import { MenuOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { XProvider, Prompts, Welcome, Bubble } from '@ant-design/x';
import { useXChat, useXConversations } from '@ant-design/x-sdk';
import { createStyles } from 'antd-style';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

import { ChatSidebar } from '@/components/Chat/ChatSidebar';
import { ChatSender } from '@/components/Chat/ChatSender';
import { ChatNavigation } from '@/components/Chat/ChatNavigation';
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
      position: relative;
    `,
    mobileMenuBtn: css`
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 1000;
      display: none;
      
      @media (max-width: 768px) {
        display: block;
      }
    `,
    mobileNavBtn: css`
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 1000;
      display: none;
      
      @media (max-width: 768px) {
        display: block;
      }
    `,
    sidebar: css`
      @media (max-width: 768px) {
        display: none;
      }
    `,
    chat: css`
      height: 100%;
      width: calc(100% - 280px - 240px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      justify-content: space-between;
      
      @media (max-width: 1200px) {
        width: calc(100% - 280px);
      }
      
      @media (max-width: 768px) {
        width: 100%;
        padding-block: ${token.paddingSM}px;
        padding-top: 56px;
      }
      
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

      @media (max-width: 768px) {
        height: calc(100% - 100px);
      }
    `,
    placeholder: css`
      padding-top: 32px;
      width: 100%;
      padding-inline: ${token.paddingLG}px;
      box-sizing: border-box;
      
      @media (max-width: 768px) {
        padding-top: 16px;
        padding-inline: ${token.paddingSM}px;
      }
    `,
    bubbleContainer: css`
      width: 100%;
      max-width: 840px;
      height: 100%;
      overflow-y: auto;
      
      @media (max-width: 768px) {
        max-width: 100%;
        padding-inline: ${token.paddingSM}px;
      }
      
      /* NOTE: 消息高亮样式 - 用于导航跳转时的视觉反馈 */
      [data-message-id].message-highlight {
        background-color: rgba(24, 144, 255, 0.15) !important;
        border-radius: 8px;
        padding: 4px 8px;
        margin: -4px -8px;
        transition: background-color 0.3s ease;
        animation: highlight-pulse 0.5s ease;
      }
      
      @keyframes highlight-pulse {
        0% {
          background-color: rgba(24, 144, 255, 0.3);
        }
        100% {
          background-color: rgba(24, 144, 255, 0.15);
        }
      }
    `,
  };
});

const AIChatPage: React.FC = () => {
  const { styles } = useStyle();
  const [className] = useMarkdownTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const [inputValue, setInputValue] = useState('');
  // NOTE: 移动端侧边栏抽屉控制
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // NOTE: 移动端导航栏抽屉控制
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  // NOTE: 当前激活的消息ID（用于导航高亮）
  const [activeMessageId, setActiveMessageId] = useState<string>('');

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

  // NOTE: 使用 useMemo 确保 provider 在 activeConversationKey 变化时正确更新，避免消息混乱
  const provider = useMemo(() => {
    return providerFactory(activeConversationKey);
  }, [activeConversationKey]);

  // NOTE: 使用 useMemo 确保历史消息在 activeConversationKey 变化时正确更新
  const defaultMessages = useMemo(() => {
    return historyMessageFactory(activeConversationKey);
  }, [activeConversationKey]);

  // 聊天功能
  const { onRequest, messages, isRequesting, abort, onReload, setMessage } = useXChat<ChatMessage>({
    provider,
    conversationKey: activeConversationKey,
    defaultMessages,
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
    if (!val.trim() || isRequesting) return;
    // NOTE: onRequest 会自动合并当前会话的历史消息，只需传入新消息即可
    onRequest({
      messages: [{ role: 'user', content: val.trim() }],
    });
  };

  // 导航到指定消息
  const handleNavigate = (messageId: string) => {
    setActiveMessageId(messageId);
    // NOTE: 移动端导航后自动关闭抽屉
    setNavDrawerOpen(false);
    // NOTE: 查找对应的消息元素并滚动到该位置
    const element = document.querySelector(`[data-message-id="${messageId}"]`);
    if (element) {
      // 滚动到元素位置，居中显示
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 添加高亮效果，2秒后移除
      element.classList.add('message-highlight');
      setTimeout(() => {
        element.classList.remove('message-highlight');
      }, 2000);
    }
  };

  // 渲染聊天列表
  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        <div className={styles.bubbleContainer}>
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
                maxWidth: '100%',
              },
            }}
            role={getRole(className, { onReload, setMessage })}
          />
        </div>
      ) : (
        <Flex
          vertical
          style={{ maxWidth: 840, width: '100%' }}
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
          <Flex 
            gap={16} 
            justify="center" 
            style={{ width: '100%' }}
            wrap="wrap"
          >
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: '100%' },
                item: {
                  flex: 1,
                  minWidth: 'calc(50% - 8px)',
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
                  minWidth: 'calc(50% - 8px)',
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
          {/* 移动端菜单按钮 */}
          <Button
            type="primary"
            icon={<MenuOutlined />}
            className={styles.mobileMenuBtn}
            onClick={() => setSidebarOpen(true)}
          />

          {/* 移动端导航按钮 */}
          {messages && messages.length > 0 && (
            <Button
              type="primary"
              icon={<UnorderedListOutlined />}
              className={styles.mobileNavBtn}
              onClick={() => setNavDrawerOpen(true)}
            />
          )}

          {/* 左侧边栏 - 桌面端 */}
          <div className={styles.sidebar}>
            <ChatSidebar
              conversations={conversations}
              activeConversationKey={activeConversationKey}
              setActiveConversationKey={(key) => {
                setActiveConversationKey(key);
                setSidebarOpen(false);
              }}
              addConversation={addConversation}
              setConversations={setConversations}
              messages={messages}
              messageApi={messageApi}
            />
          </div>

          {/* 移动端侧边栏抽屉 */}
          <Drawer
            title="会话列表"
            placement="left"
            onClose={() => setSidebarOpen(false)}
            open={sidebarOpen}
            width={280}
            bodyStyle={{ padding: 0 }}
          >
            <ChatSidebar
              conversations={conversations}
              activeConversationKey={activeConversationKey}
              setActiveConversationKey={(key) => {
                setActiveConversationKey(key);
                setSidebarOpen(false);
              }}
              addConversation={addConversation}
              setConversations={setConversations}
              messages={messages}
              messageApi={messageApi}
            />
          </Drawer>

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
            />
          </div>

          {/* 右侧导航栏 - 桌面端 */}
          {messages && messages.length > 0 && (
            <ChatNavigation
              messages={messages.map((m) => ({
                id: m.id,
                message: m.message,
                status: m.status,
              }))}
              onNavigate={handleNavigate}
              activeMessageId={activeMessageId}
            />
          )}

          {/* 移动端导航栏抽屉 */}
          {messages && messages.length > 0 && (
            <Drawer
              title="提问导航"
              placement="right"
              onClose={() => setNavDrawerOpen(false)}
              open={navDrawerOpen}
              width={280}
              bodyStyle={{ padding: 0, height: '100%', overflow: 'hidden' }}
              styles={{
                body: {
                  padding: 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              <ChatNavigation
                messages={messages.map((m) => ({
                  id: m.id,
                  message: m.message,
                  status: m.status,
                }))}
                onNavigate={handleNavigate}
                activeMessageId={activeMessageId}
                className="in-drawer"
              />
            </Drawer>
          )}
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default AIChatPage;

