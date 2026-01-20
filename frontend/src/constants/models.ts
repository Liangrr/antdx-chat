/**
 * AI模型常量配置
 */

import type { AIModel } from '@/types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: '最强大的GPT模型，适合复杂任务',
    provider: 'OpenAI',
    maxTokens: 8192,
    temperature: 0.7,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '快速响应，性价比高',
    provider: 'OpenAI',
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic最强模型',
    provider: 'Anthropic',
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: '平衡性能与成本',
    provider: 'Anthropic',
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: 'local-llama',
    name: 'Llama 2 (本地)',
    description: '本地部署的开源模型',
    provider: 'Local',
    maxTokens: 2048,
    temperature: 0.7,
  },
];

export const DEFAULT_MODEL_ID = 'gpt-3.5-turbo';

export const DEFAULT_CHAT_CONFIG = {
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: '你是一个有帮助的AI助手。',
};

