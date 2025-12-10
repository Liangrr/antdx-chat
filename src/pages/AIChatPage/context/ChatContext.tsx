/**
 * 聊天上下文
 */

import React from 'react';
import type { useXChat } from '@ant-design/x-sdk';
import type { ChatMessage } from '../types';

export const ChatContext = React.createContext<{
  onReload?: ReturnType<typeof useXChat>['onReload'];
  setMessage?: ReturnType<typeof useXChat<ChatMessage>>['setMessage'];
}>({});

