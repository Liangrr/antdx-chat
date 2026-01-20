/**
 * 右侧指南面板组件
 */

import React from 'react';
import { Card, Typography, Space } from 'antd';
import {
  CompassOutlined,
  BgColorsOutlined,
  MessageOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import './style.css';

const { Title, Text } = Typography;

interface GuideItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GUIDE_ITEMS: GuideItem[] = [
  {
    id: '1',
    icon: <CompassOutlined />,
    title: '意图',
    description: 'AI理解用户需求并提供解决方案',
  },
  {
    id: '2',
    icon: <BgColorsOutlined />,
    title: '角色',
    description: 'AI的公众形象',
  },
  {
    id: '3',
    icon: <MessageOutlined />,
    title: '对话',
    description: 'AI如何以用户理解的方式表达自己',
  },
  {
    id: '4',
    icon: <AppstoreOutlined />,
    title: '界面',
    description: 'AI宿主"聊天"和"执行"行为',
  },
];

export const GuidePanel: React.FC = () => {
  return (
    <div className="guide-panel">
      <Card className="guide-card">
        <Title level={5} style={{ marginBottom: 16 }}>
          设计指南
        </Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {GUIDE_ITEMS.map((item) => (
            <div key={item.id} className="guide-item">
              <div className="guide-item-icon">{item.icon}</div>
              <div className="guide-item-content">
                <Text strong>{item.title}</Text>
                <Text type="secondary" className="guide-item-desc">
                  {item.description}
                </Text>
              </div>
            </div>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default GuidePanel;

