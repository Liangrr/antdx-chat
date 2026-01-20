/**
 * 会话管理Hook
 */

import { useState, useCallback } from 'react';
import type { ChatSession } from '@/types';
import { generateId, storage } from '@/utils';

const STORAGE_KEY = 'chat_sessions';

export const useSession = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    return storage.get<ChatSession[]>(STORAGE_KEY) || [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();

  // 保存会话到本地存储
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    setSessions(newSessions);
    storage.set(STORAGE_KEY, newSessions);
  }, []);

  // 创建新会话
  const createSession = useCallback(
    (modelId: string, title = '新对话') => {
      const newSession: ChatSession = {
        id: generateId(),
        title,
        modelId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const newSessions = [newSession, ...sessions];
      saveSessions(newSessions);
      setCurrentSessionId(newSession.id);
      return newSession;
    },
    [sessions, saveSessions]
  );

  // 更新会话
  const updateSession = useCallback(
    (sessionId: string, updates: Partial<ChatSession>) => {
      const newSessions = sessions.map((session) =>
        session.id === sessionId
          ? { ...session, ...updates, updatedAt: Date.now() }
          : session
      );
      saveSessions(newSessions);
    },
    [sessions, saveSessions]
  );

  // 删除会话
  const deleteSession = useCallback(
    (sessionId: string) => {
      const newSessions = sessions.filter((s) => s.id !== sessionId);
      saveSessions(newSessions);

      if (currentSessionId === sessionId) {
        setCurrentSessionId(newSessions[0]?.id);
      }
    },
    [sessions, currentSessionId, saveSessions]
  );

  // 获取当前会话
  const getCurrentSession = useCallback(() => {
    return sessions.find((s) => s.id === currentSessionId);
  }, [sessions, currentSessionId]);

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    updateSession,
    deleteSession,
    getCurrentSession,
  };
};

