/**
 * 应用主入口
 */

import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AIChatPage } from '@/pages';
import './App.css';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <AIChatPage />
    </ConfigProvider>
  );
}

export default App;
