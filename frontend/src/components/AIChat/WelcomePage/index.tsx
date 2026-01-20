/**
 * 欢迎页组件 - 显示热门话题
 */

import React from 'react';
import { Card, Typography, Avatar } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import './style.css';

const { Title, Text } = Typography;

interface HotTopic {
  id: string;
  title: string;
  order: number;
}

interface WelcomePageProps {
  onTopicClick: (topic: string) => void;
}

const HOT_TOPICS: HotTopic[] = [
  { id: '1', title: 'Ant Design X 中有哪些组件？', order: 1 },
  { id: '2', title: '新的 AGI 混合界面', order: 2 },
  { id: '3', title: 'Ant Design X 中有哪些组件？', order: 3 },
  { id: '4', title: '快速发现 AI 时代的新设计范式...', order: 4 },
  { id: '5', title: '如何快速安装和导入组件？', order: 5 },
];

export const WelcomePage: React.FC<WelcomePageProps> = ({ onTopicClick }) => {
  return (
    <div className="welcome-page">
      <div className="welcome-header">
        <Avatar
          size={64}
          icon={<RobotOutlined />}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        <Title level={2} style={{ marginTop: 16, marginBottom: 8 }}>
          你好，我是 Ant Design X
        </Title>
        <Text type="secondary">
          基于蚂蚁设计，AGI产品新解决方案，打造更好的智能视觉~
        </Text>
      </div>

      <div className="welcome-topics">
        <Title level={4} style={{ marginBottom: 16 }}>
          热门话题
        </Title>
        <div className="welcome-topics-list">
          {HOT_TOPICS.map((topic) => (
            <Card
              key={topic.id}
              hoverable
              className="welcome-topic-card"
              onClick={() => onTopicClick(topic.title)}
            >
              <div className="welcome-topic-order">{topic.order}</div>
              <Text>{topic.title}</Text>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

