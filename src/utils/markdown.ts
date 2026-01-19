/**
 * Markdown 主题工具
 */

import { useState, useEffect } from 'react';

export const useMarkdownTheme = () => {
  // NOTE: 初始主题用 lazy initializer 计算，避免在 effect 里同步 setState（react-hooks/set-state-in-effect）
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return [`markdown-${theme}`];
};

