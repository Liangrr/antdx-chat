/**
 * 认证 Hook，封装 AuthContext 访问
 */

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

