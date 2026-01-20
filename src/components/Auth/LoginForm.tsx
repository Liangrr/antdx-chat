/**
 * 登录表单组件
 */

import React from 'react';
import { Button, Form, Input } from 'antd';

export interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginFormProps {
  loading?: boolean;
  onSubmit: (values: LoginFormValues) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loading, onSubmit }) => {
  const [form] = Form.useForm<LoginFormValues>();

  const handleFinish = (values: LoginFormValues) => {
    onSubmit(values);
  };

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input size="large" placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password size="large" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;

