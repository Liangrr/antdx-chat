/**
 * Markdown 主题工具
 */

import { useState, useEffect } from 'react';

export const useMarkdownTheme = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return [`markdown-${theme}`];
};

