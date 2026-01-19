/**
 * 聊天工具函数
 */

// NOTE: 移除未使用的 React 导入（仅使用 JSX，不需要显式导入 React）
import { message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { Actions, ThoughtChain } from '@ant-design/x';
import type { BubbleListProps, ThoughtChainItemProps } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { DeepSeekChatProvider, XRequest } from '@ant-design/x-sdk';
import type { DefaultMessageInfo, useXChat, SSEFields, XModelParams, XModelResponse } from '@ant-design/x-sdk';

import { HISTORY_MESSAGES, THOUGHT_CHAIN_CONFIG } from '@/constants/chat';
import locale from '@/locales/zh-CN';
import type { ChatMessage } from '@/types/chat';
import { ThinkRenderer } from '@/components/Chat/ChatRenderers';

// Provider 缓存
const providerCaches = new Map<string, DeepSeekChatProvider>();

// 创建 Provider
export const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new DeepSeekChatProvider({
        request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
          'https://api.x.ant.design/api/big_model_glm-4.5-flash',
          {
            manual: true,
            params: {
              stream: true,
              thinking: {
                type: 'disabled',
              },
              model: 'glm-4.5-flash',
            },
          },
        ),
      }),
    );
  }
  // NOTE: 缓存命中后必定存在
  return providerCaches.get(conversationKey)!;
};

// 获取历史消息
export const historyMessageFactory = (conversationKey: string): DefaultMessageInfo<ChatMessage>[] => {
  return HISTORY_MESSAGES[conversationKey] || [];
};

const renderFooter = (
  args: {
    id?: string | number;
    content: string;
    status?: string;
    extraInfo?: ChatMessage['extraInfo'];
  },
  context: {
    onReload?: ReturnType<typeof useXChat>['onReload'];
    setMessage?: ReturnType<typeof useXChat<ChatMessage>>['setMessage'];
  },
) => {
  const { id, content, extraInfo, status } = args;
  const Items = [
    {
      key: 'retry',
      label: locale.retry,
      icon: <SyncOutlined />,
      onItemClick: () => {
        if (id) {
          context?.onReload?.(id, {
            userAction: 'retry',
          });
        }
      },
    },
    {
      key: 'copy',
      actionRender: <Actions.Copy text={content} />,
    },
    {
      key: 'feedback',
      actionRender: (
        <Actions.Feedback
          styles={{
            liked: {
              color: '#f759ab',
            },
          }}
          value={extraInfo?.feedback || 'default'}
          key="feedback"
          onChange={(val) => {
            if (id) {
              context?.setMessage?.(id, () => ({
                extraInfo: {
                  feedback: val,
                },
              }));
              message.success(`${id}: ${val}`);
            } else {
              message.error('has no id!');
            }
          }}
        />
      ),
    },
  ];
  return status !== 'updating' && status !== 'loading' ? (
    <div style={{ display: 'flex' }}>{id && <Actions items={Items} />}</div>
  ) : null;
};

// 获取角色配置
export const getRole = (
  className: string,
  context: {
    onReload?: ReturnType<typeof useXChat>['onReload'];
    setMessage?: ReturnType<typeof useXChat<ChatMessage>>['setMessage'];
  }
): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    header: (_, { status }) => {
      const config = THOUGHT_CHAIN_CONFIG[status as keyof typeof THOUGHT_CHAIN_CONFIG];
      return config ? (
        <ThoughtChain.Item
          style={{ marginBottom: 8 }}
          status={config.status as ThoughtChainItemProps['status']}
          variant="solid"
          icon={config.icon}
          title={config.title}
        />
      ) : null;
    },
    footer: (content, { status, key, extraInfo }) =>
      renderFooter(
        {
          content,
          status,
          // NOTE: antd/x 的 key 类型较宽，这里只在展示/回调时使用
          id: key as string,
          extraInfo: extraInfo as ChatMessage['extraInfo'],
        },
        context,
      ),
    contentRender: (content: string, { status }) => {
      // NOTE: content 确认为 string，避免 any；并修正 replace 的正则写法
      const newContent = content.replace(/\n\n/g, '<br/><br/>');
      return (
        <XMarkdown
          paragraphTag="div"
          components={{
            think: ThinkRenderer,
          }}
          className={className}
          streaming={{
            hasNextChunk: status === 'updating',
            enableAnimation: true,
          }}
        >
          {newContent}
        </XMarkdown>
      );
    },
  },
  user: { placement: 'end' },
});

