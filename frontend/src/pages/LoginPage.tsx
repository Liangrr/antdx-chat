/**
 * 登录页面
 */

import React, { useState } from 'react';
import { Card, Typography, message, Flex } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm, type LoginFormValues } from '@/components/Auth/LoginForm';
import { useAuth } from '@/hooks';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setSubmitting(true);
      await login(values);
      message.success('登录成功');
      const redirectPath =
        (location.state?.from as unknown as { pathname?: string })?.pathname ?? '/';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : '登录失败，请稍后重试';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex
      style={{ minHeight: '100vh' }}
      align="center"
      justify="center"
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          登录到 AI Chat
        </Title>
        <LoginForm loading={submitting} onSubmit={handleSubmit} />
        <Text type="secondary">
          还没有账号？ <Link to="/register">去注册</Link>
        </Text>
      </Card>
    </Flex>
  );
};

export default LoginPage;

