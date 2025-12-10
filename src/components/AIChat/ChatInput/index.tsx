/**
 * 聊天输入组件
 */

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Input, Button, Space, Tooltip } from 'antd';
import {
  SendOutlined,
  StopOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import './style.css';

const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  onClear?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  onClear,
  isLoading = false,
  placeholder = '输入消息... (Shift + Enter 换行，Enter 发送)',
  maxLength = 2000,
}) => {
  const [value, setValue] = useState('');
  const textAreaRef = useRef<any>(null);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;

    onSend(value);
    setValue('');

    // 重置输入框高度
    if (textAreaRef.current) {
      textAreaRef.current.resizableTextArea?.textArea?.style.setProperty(
        'height',
        'auto'
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 发送，Shift + Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (window.confirm('确定要清空所有对话吗？')) {
      onClear?.();
      setValue('');
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <TextArea
          ref={textAreaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoSize={{ minRows: 1, maxRows: 6 }}
          maxLength={maxLength}
          disabled={isLoading}
          className="chat-input-textarea"
        />

        <div className="chat-input-footer">
          <div className="chat-input-counter">
            <span className={value.length > maxLength * 0.9 ? 'warning' : ''}>
              {value.length} / {maxLength}
            </span>
          </div>

          <Space>
            {onClear && (
              <Tooltip title="清空对话">
                <Button
                  type="text"
                  icon={<ClearOutlined />}
                  onClick={handleClear}
                  disabled={isLoading}
                />
              </Tooltip>
            )}

            {isLoading ? (
              <Button
                type="primary"
                danger
                icon={<StopOutlined />}
                onClick={onStop}
              >
                停止
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!value.trim()}
              >
                发送
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

