/**
 * 聊天输入组件
 */

import React, { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Input, Button, Space, Tooltip } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  RocketOutlined,
  FileTextOutlined,
  SafetyOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import './style.css';

const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = '提问或输入 / 使用指令',
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

  return (
    <div className="chat-input-container">
      <div className="chat-input-toolbar">
        <Space size="small">
          <Tooltip title="升级">
            <Button type="text" icon={<RocketOutlined />} size="small">
              升级
            </Button>
          </Tooltip>
          <Tooltip title="组件">
            <Button type="text" icon={<FileTextOutlined />} size="small">
              组件
            </Button>
          </Tooltip>
          <Tooltip title="RICH 指南">
            <Button type="text" icon={<SafetyOutlined />} size="small">
              RICH 指南
            </Button>
          </Tooltip>
          <Tooltip title="安全介绍">
            <Button type="text" icon={<SafetyOutlined />} size="small">
              安全介绍
            </Button>
          </Tooltip>
        </Space>
      </div>

      <div className="chat-input-wrapper">
        <div className="chat-input-main">
          <Button
            type="text"
            icon={<PaperClipOutlined />}
            className="chat-input-attach"
          />
          <TextArea
            ref={textAreaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoSize={{ minRows: 1, maxRows: 4 }}
            maxLength={maxLength}
            disabled={isLoading}
            className="chat-input-textarea"
            bordered={false}
          />
          <div className="chat-input-actions">
            <Tooltip title="语音输入">
              <Button
                type="text"
                icon={<AudioOutlined />}
                size="small"
                className="chat-input-voice"
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!value.trim() || isLoading}
              className="chat-input-send"
              shape="circle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

