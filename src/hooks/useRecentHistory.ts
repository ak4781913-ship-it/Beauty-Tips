import { useState, useEffect, useCallback } from 'react';
import {
  RecentArticleItem,
  getRecentHistory,
  recordArticleVisit,
  removeRecentHistoryItem,
  clearRecentHistory,
  RECENT_HISTORY_EVENT,
  RECENT_HISTORY_STORAGE_KEY,
} from '../utils/recentHistory';
import { BeautyTip } from '../types';

export function useRecentHistory() {
  const [history, setHistory] = useState<RecentArticleItem[]>(() => getRecentHistory());

  useEffect(() => {
    // Sync initial state
    setHistory(getRecentHistory());

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ history?: RecentArticleItem[] }>;
      if (customEvent.detail && Array.isArray(customEvent.detail.history)) {
        setHistory(customEvent.detail.history);
      } else {
        setHistory(getRecentHistory());
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === RECENT_HISTORY_STORAGE_KEY) {
        setHistory(getRecentHistory());
      }
    };

    window.addEventListener(RECENT_HISTORY_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(RECENT_HISTORY_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const recordVisit = useCallback((tip: BeautyTip, customSlug?: string) => {
    const updated = recordArticleVisit(tip, customSlug);
    setHistory(updated);
  }, []);

  const removeItem = useCallback((tipId: string) => {
    const updated = removeRecentHistoryItem(tipId);
    setHistory(updated);
  }, []);

  const clearAll = useCallback(() => {
    clearRecentHistory();
    setHistory([]);
  }, []);

  return {
    history,
    count: history.length,
    recordVisit,
    removeItem,
    clearAll,
  };
}
