/**
 * 聊天输入框组件
 */

import React from 'react';
import { Flex } from 'antd';
import { Sender, Prompts } from '@ant-design/x';
import { createStyles } from 'antd-style';
import { SENDER_PROMPTS } from '@/constants/chat';
import locale from '@/locales/zh-CN';

const useStyle = createStyles(({ token, css }) => ({
  sender: css`
    width: 100%;
    max-width: 840px;
    box-sizing: border-box;
    
    /* NOTE: iOS Safari 防止自动缩放 - 确保输入框字体大小至少为 16px */
    /* 如果字体小于 16px，iOS Safari 会在聚焦时自动放大页面 */
    input,
    textarea {
      font-size: 16px !important;
    }
    
    @media (max-width: 768px) {
      max-width: 100%;
      width: 100%;
      
      /* NOTE: 移动端确保字体大小至少为 16px */
      input,
      textarea {
        font-size: 16px !important;
      }
    }
  `,
  senderPrompt: css`
    width: 100%;
    max-width: 840px;
    margin: 0 auto;
    color: ${token.colorText};
    box-sizing: border-box;
    
    @media (max-width: 768px) {
      max-width: 100%;
      width: 100%;
    }
  `,
  senderWrapper: css`
    width: 100%;
    max-width: 100%;
    margin-inline: 24px;
    box-sizing: border-box;
    
    @media (max-width: 768px) {
      margin-inline: 0;
      width: 100%;
      max-width: 100%;
      padding-inline: 0;
    }
  `,
}));

interface ChatSenderProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (value: string) => void;
  isRequesting: boolean;
  abort: () => void;
}

export const ChatSender: React.FC<ChatSenderProps> = ({
  inputValue,
  setInputValue,
  onSubmit,
  isRequesting,
  abort,
}) => {
  const { styles } = useStyle();

  return (
    <Flex
      vertical
      gap={12}
      align="center"
      className={styles.senderWrapper}
    >
      {/* 提示词 */}
      <Prompts
        items={SENDER_PROMPTS}
        onItemClick={(info) => onSubmit(info.data.description as string)}
        styles={{ item: { padding: '6px 12px' } }}
        className={styles.senderPrompt}
      />

      {/* 输入框 */}
      <Sender
        value={inputValue}
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue('');
        }}
        onChange={setInputValue}
        onCancel={abort}
        loading={isRequesting}
        className={styles.sender}
        placeholder={locale.askOrInputUseSkills}
      />
    </Flex>
  );
};

