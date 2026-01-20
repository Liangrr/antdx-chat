/**
 * 路由守卫组件：未登录时跳转到登录页
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  console.log('isAuthenticated', isAuthenticated);
  const location = useLocation();

  if (loading) {
    // 简单的全局加载占位
    return <div style={{ textAlign: 'center', marginTop: 80 }}>正在加载...</div>;
  }

  // 如果未认证，则跳转到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

