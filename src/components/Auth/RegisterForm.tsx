/**
 * 注册表单组件
 */

import React from 'react';
import { Button, Form, Input } from 'antd';

export interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

interface RegisterFormProps {
  loading?: boolean;
  onSubmit: (values: RegisterFormValues) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ loading, onSubmit }) => {
  const [form] = Form.useForm<RegisterFormValues>();

  const handleFinish = (values: RegisterFormValues) => {
    onSubmit(values);
  };

  return (
    <Form<RegisterFormValues>
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
        label="邮箱"
        name="email"
        rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
      >
        <Input size="large" placeholder="请输入邮箱（可选）" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password size="large" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password size="large" placeholder="请再次输入密码" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;

