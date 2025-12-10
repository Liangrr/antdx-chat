/**
 * 常量配置
 */

import {
  HeartOutlined,
  SmileOutlined,
  CommentOutlined,
  PaperClipOutlined,
  ScheduleOutlined,
  ProductOutlined,
  FileSearchOutlined,
  AppstoreAddOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { Prompts } from '@ant-design/x';
import type { GetProp } from 'antd';
import type { DefaultMessageInfo } from '@ant-design/x-sdk';
import locale from '../_utils/local';
import type { ChatMessage } from '../types';

// 历史消息
export const HISTORY_MESSAGES: {
  [key: string]: DefaultMessageInfo<ChatMessage>[];
} = {
  'default-1': [
    {
      message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
      status: 'success',
    },
    {
      message: {
        role: 'assistant',
        content: locale.aiMessage_2,
      },
      status: 'success',
    },
  ],
  'default-2': [
    { message: { role: 'user', content: locale.newAgiHybridInterface }, status: 'success' },
    {
      message: {
        role: 'assistant',
        content: locale.aiMessage_1,
      },
      status: 'success',
    },
  ],
};

// 默认对话列表
export const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: locale.whatIsAntDesignX,
    group: locale.today,
  },
  {
    key: 'default-1',
    label: locale.howToQuicklyInstallAndImportComponents,
    group: locale.today,
  },
  {
    key: 'default-2',
    label: locale.newAgiHybridInterface,
    group: locale.yesterday,
  },
];

// 热门话题
export const HOT_TOPICS: GetProp<typeof Prompts, 'items'>[0] = {
  key: '1',
  label: locale.hotTopics,
  children: [
    {
      key: '1-1',
      description: locale.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: locale.newAgiHybridInterface,
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: locale.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: locale.comeAndDiscoverNewDesignParadigm,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: locale.howToQuicklyInstallAndImportComponents,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>,
    },
  ],
};

// 设计指南
export const DESIGN_GUIDE: GetProp<typeof Prompts, 'items'>[0] = {
  key: '2',
  label: locale.designGuide,
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: locale.intention,
      description: locale.aiUnderstandsUserNeedsAndProvidesSolutions,
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: locale.role,
      description: locale.aiPublicPersonAndImage,
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: locale.chat,
      description: locale.howAICanExpressItselfWayUsersUnderstand,
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: locale.interface,
      description: locale.aiBalances,
    },
  ],
};

// 输入框提示词
export const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: locale.upgrades,
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: locale.components,
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: locale.richGuide,
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: locale.installationIntroduction,
    icon: <AppstoreAddOutlined />,
  },
];

// 思考链配置
export const THOUGHT_CHAIN_CONFIG = {
  loading: {
    title: locale.modelIsRunning,
    status: 'loading',
    icon: <GlobalOutlined />,
  },
  updating: {
    title: locale.modelIsRunning,
    status: 'loading',
    icon: <GlobalOutlined />,
  },
  success: {
    title: locale.modelExecutionCompleted,
    status: 'success',
    icon: <GlobalOutlined />,
  },
  error: {
    title: locale.executionFailed,
    status: 'error',
    icon: <GlobalOutlined />,
  },
  abort: {
    title: locale.aborted,
    status: 'abort',
    icon: <GlobalOutlined />,
  },
} as const;

