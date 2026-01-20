/**
 * 空状态组件 - 显示在对话过程中暂无数据时
 */

import React from 'react';
import { Typography, Space } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import './style.css';

const { Text } = Typography;

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = '暂无数据',
}) => {
  return (
    <div className="empty-state">
      <Space direction="vertical" align="center" size="small">
        <div className="empty-state-icon">
          <StopOutlined />
        </div>
        <Text type="secondary">{message}</Text>
      </Space>
    </div>
  );
};

export default EmptyState;

