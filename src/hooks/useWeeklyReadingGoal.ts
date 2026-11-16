import { useState, useEffect, useCallback } from 'react';
import {
  calculateWeeklyProgress,
  setWeeklyTarget,
  recordWeeklyTipRead,
  removeWeeklyTipRead,
  resetWeeklyProgress,
  WeeklyProgressResult,
  READING_GOAL_EVENT,
  WEEKLY_TARGET_STORAGE_KEY,
  WEEKLY_READ_LOGS_STORAGE_KEY,
} from '../utils/readingGoal';
import { RECENT_HISTORY_EVENT } from '../utils/recentHistory';

export function useWeeklyReadingGoal() {
  const [progress, setProgress] = useState<WeeklyProgressResult>(() => calculateWeeklyProgress());

  const refresh = useCallback(() => {
    setProgress(calculateWeeklyProgress());
  }, []);

  useEffect(() => {
    // Initial sync
    refresh();

    const handleGoalEvent = () => refresh();
    const handleHistoryEvent = () => refresh();
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === WEEKLY_TARGET_STORAGE_KEY ||
        e.key === WEEKLY_READ_LOGS_STORAGE_KEY ||
        e.key === null
      ) {
        refresh();
      }
    };

    window.addEventListener(READING_GOAL_EVENT, handleGoalEvent);
    window.addEventListener(RECENT_HISTORY_EVENT, handleHistoryEvent);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(READING_GOAL_EVENT, handleGoalEvent);
      window.removeEventListener(RECENT_HISTORY_EVENT, handleHistoryEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  const updateTarget = useCallback(
    (newTarget: number) => {
      setWeeklyTarget(newTarget);
      refresh();
    },
    [refresh]
  );

  const markTipRead = useCallback(
    (tip: { id: string; title: string; categoryLabel?: string; category?: string; slug?: string }) => {
      const result = recordWeeklyTipRead(tip);
      refresh();
      return result;
    },
    [refresh]
  );

  const removeTip = useCallback(
    (tipId: string) => {
      removeWeeklyTipRead(tipId);
      refresh();
    },
    [refresh]
  );

  const resetCurrentWeek = useCallback(() => {
    resetWeeklyProgress();
    refresh();
  }, [refresh]);

  return {
    ...progress,
    updateTarget,
    markTipRead,
    removeTip,
    resetCurrentWeek,
    refresh,
  };
}
