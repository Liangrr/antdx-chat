/**
 * 注册页面
 */

import React, { useState } from 'react';
import { Card, Typography, message, Flex } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm, type RegisterFormValues } from '@/components/Auth/RegisterForm';
import { useAuth } from '@/hooks';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setSubmitting(true);
      await register({
        username: values.username,
        password: values.password,
        email: values.email,
      });
      message.success('注册并登录成功');
      navigate('/', { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : '注册失败，请稍后重试';
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
          注册新账号
        </Title>
        <RegisterForm loading={submitting} onSubmit={handleSubmit} />
        <Text type="secondary">
          已有账号？ <Link to="/login">去登录</Link>
        </Text>
      </Card>
    </Flex>
  );
};

export default RegisterPage;

