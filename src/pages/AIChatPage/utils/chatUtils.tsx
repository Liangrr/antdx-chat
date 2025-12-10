/**
 * 聊天工具函数
 */

import React from 'react';
import { message, Pagination } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { Actions, ThoughtChain, Think } from '@ant-design/x';
import type { BubbleListProps, ThoughtChainItemProps } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { DeepSeekChatProvider, XRequest } from '@ant-design/x-sdk';
import type { DefaultMessageInfo, useXChat, SSEFields, XModelParams, XModelResponse } from '@ant-design/x-sdk';

import { HISTORY_MESSAGES, THOUGHT_CHAIN_CONFIG } from '../constants/index';
import locale from '../_utils/local';
import type { ChatMessage } from '../types';

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
  return providerCaches.get(conversationKey);
};

// 获取历史消息
export const historyMessageFactory = (conversationKey: string): DefaultMessageInfo<ChatMessage>[] => {
  return HISTORY_MESSAGES[conversationKey] || [];
};

// Think 组件
const ThinkComponent = React.memo((props: any) => {
  const [title, setTitle] = React.useState(`${locale.deepThinking}...`);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle(locale.completeThinking);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

// Footer 组件
const Footer: React.FC<{
  id?: string | number;
  content: string;
  status?: string;
  extraInfo?: ChatMessage['extraInfo'];
  context: {
    onReload?: ReturnType<typeof useXChat>['onReload'];
    setMessage?: ReturnType<typeof useXChat<ChatMessage>>['setMessage'];
  };
}> = ({ id, content, extraInfo, status, context }) => {
  const Items = [
    {
      key: 'pagination',
      actionRender: <Pagination simple total={1} pageSize={1} />,
    },
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
      key: 'audio',
      actionRender: (
        <Actions.Audio
          onClick={() => {
            message.info(locale.isMock);
          }}
        />
      ),
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
    footer: (content, { status, key, extraInfo }) => (
      <Footer
        content={content}
        status={status}
        extraInfo={extraInfo as ChatMessage['extraInfo']}
        id={key as string}
        context={context}
      />
    ),
    contentRender: (content: any, { status }) => {
      const newContent = content.replace('/\n\n/g', '<br/><br/>');
      return (
        <XMarkdown
          paragraphTag="div"
          components={{
            think: ThinkComponent,
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

