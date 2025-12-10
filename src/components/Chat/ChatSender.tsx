/**
 * 聊天输入框组件
 */

import React from 'react';
import { Button, Flex } from 'antd';
import { PaperClipOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Sender, Prompts, Attachments } from '@ant-design/x';
import type { GetProp } from 'antd';
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
  attachmentsOpen: boolean;
  setAttachmentsOpen: (open: boolean) => void;
  attachedFiles: GetProp<typeof Attachments, 'items'>;
  setAttachedFiles: (files: GetProp<typeof Attachments, 'items'>) => void;
}

export const ChatSender: React.FC<ChatSenderProps> = ({
  inputValue,
  setInputValue,
  onSubmit,
  isRequesting,
  abort,
  attachmentsOpen,
  setAttachmentsOpen,
  attachedFiles,
  setAttachedFiles,
}) => {
  const { styles } = useStyle();

  const senderHeader = (
    <Sender.Header
      title={locale.uploadFile}
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      styles={{ content: { padding: 0 } }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={(info) => setAttachedFiles(info.fileList)}
        placeholder={(type) =>
          type === 'drop'
            ? { title: locale.dropFileHere }
            : {
                icon: <CloudUploadOutlined />,
                title: locale.uploadFiles,
                description: locale.clickOrDragFilesToUpload,
              }
        }
      />
    </Sender.Header>
  );

  return (
    <Flex
      vertical
      gap={12}
      align="center"
      style={{ marginInline: 24 }}
    >
      {/* 提示词 */}
      {!attachmentsOpen && (
        <Prompts
          items={SENDER_PROMPTS}
          onItemClick={(info) => onSubmit(info.data.description as string)}
          styles={{ item: { padding: '6px 12px' } }}
          className={styles.senderPrompt}
        />
      )}

      {/* 输入框 */}
      <Sender
        value={inputValue}
        header={senderHeader}
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue('');
        }}
        onChange={setInputValue}
        onCancel={abort}
        prefix={
          <Button
            type="text"
            icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
            onClick={() => setAttachmentsOpen(!attachmentsOpen)}
          />
        }
        loading={isRequesting}
        className={styles.sender}
        allowSpeech
        placeholder={locale.askOrInputUseSkills}
      />
    </Flex>
  );
};

