/**
 * Chat 渲染辅助组件
 *
 * NOTE: 单独拆文件以满足 react-refresh/only-export-components（该文件只导出 React 组件）
 */
import React from 'react';
import { Think } from '@ant-design/x';

import locale from '@/locales/zh-CN';

export interface ThinkRendererProps {
  streamStatus?: string;
  children?: React.ReactNode;
}

export const ThinkRenderer = React.memo<ThinkRendererProps>((props) => {
  const [title, setTitle] = React.useState(`${locale.deepThinking}...`);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle(locale.completeThinking);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

ThinkRenderer.displayName = 'ThinkRenderer';

