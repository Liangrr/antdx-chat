/**
 * 模型选择器组件
 */

import React from 'react';
import { Select, Space, Typography, Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import type { AIModel } from '@/types';
import './style.css';

const { Text } = Typography;
const { Option } = Select;

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel;
  onChange: (model: AIModel) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onChange,
  disabled = false,
}) => {
  const handleChange = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (model) {
      onChange(model);
    }
  };

  return (
    <div className="model-selector">
      <Space align="center">
        <RobotOutlined style={{ fontSize: 18 }} />
        <Text strong>选择模型:</Text>
        <Select
          value={selectedModel.id}
          onChange={handleChange}
          disabled={disabled}
          style={{ minWidth: 200 }}
          className="model-selector-dropdown"
        >
          {models.map((model) => (
            <Option key={model.id} value={model.id}>
              <div className="model-option">
                <div className="model-option-header">
                  <Text strong>{model.name}</Text>
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    {model.provider}
                  </Tag>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {model.description}
                </Text>
              </div>
            </Option>
          ))}
        </Select>
      </Space>

      <div className="model-info">
        <Space size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>
            当前: {selectedModel.name}
          </Text>
          {selectedModel.maxTokens && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              • 最大Token: {selectedModel.maxTokens}
            </Text>
          )}
        </Space>
      </div>
    </div>
  );
};

export default ModelSelector;

