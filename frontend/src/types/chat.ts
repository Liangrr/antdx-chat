/**
 * 聊天相关类型定义
 */

import type { ActionsFeedbackProps } from '@ant-design/x';
import type { XModelMessage } from '@ant-design/x-sdk';

// 消息角色类型
export type MessageRole = 'user' | 'assistant' | 'system';

// 消息状态
export type MessageStatus = 'sending' | 'success' | 'error';

// 单条消息接口
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  error?: string;
}

// AI模型配置
export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string; // 如: OpenAI, Claude, 本地模型等
  maxTokens?: number;
  temperature?: number;
}

// 聊天会话
export interface ChatSession {
  id: string;
  title: string;
  modelId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// API请求参数
export interface ChatRequest {
  model: string;
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// API响应
export interface ChatResponse {
  id: string;
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 聊天配置
export interface ChatConfig {
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

// Ant Design X 扩展的消息类型
export interface ChatMessage extends XModelMessage {
  extraInfo?: {
    feedback: ActionsFeedbackProps['value'];
  };
}
