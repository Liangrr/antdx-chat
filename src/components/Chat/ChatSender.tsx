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
  `,
  senderPrompt: css`
    width: 100%;
    max-width: 840px;
    margin: 0 auto;
    color: ${token.colorText};
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
      style={{ marginInline: 24 }}
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

