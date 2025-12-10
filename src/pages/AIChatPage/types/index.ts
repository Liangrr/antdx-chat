/**
 * 类型定义
 */

import type { ActionsFeedbackProps } from '@ant-design/x';
import type { XModelMessage } from '@ant-design/x-sdk';

export interface ChatMessage extends XModelMessage {
  extraInfo?: {
    feedback: ActionsFeedbackProps['value'];
  };
}

