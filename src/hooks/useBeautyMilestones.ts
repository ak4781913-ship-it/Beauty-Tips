import { useState, useEffect, useCallback } from 'react';
import {
  evaluateMilestones,
  BeautyMilestone,
  MILESTONES_EVENT,
  MILESTONES_STORAGE_KEY,
} from '../utils/milestones';
import { getDailyStreak, DailyStreakData, STREAK_EVENT } from '../utils/streak';
import { READING_GOAL_EVENT } from '../utils/readingGoal';
import { RECENT_HISTORY_EVENT } from '../utils/recentHistory';

export function useBeautyMilestones(favoritesList?: string[]) {
  const [milestonesState, setMilestonesState] = useState(() =>
    evaluateMilestones(favoritesList)
  );
  const [streak, setStreak] = useState<DailyStreakData>(() => getDailyStreak());

  const refresh = useCallback(() => {
    setMilestonesState(evaluateMilestones(favoritesList));
    setStreak(getDailyStreak());
  }, [favoritesList]);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();

    window.addEventListener(MILESTONES_EVENT, handleUpdate);
    window.addEventListener(STREAK_EVENT, handleUpdate);
    window.addEventListener(READING_GOAL_EVENT, handleUpdate);
    window.addEventListener(RECENT_HISTORY_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(MILESTONES_EVENT, handleUpdate);
      window.removeEventListener(STREAK_EVENT, handleUpdate);
      window.removeEventListener(READING_GOAL_EVENT, handleUpdate);
      window.removeEventListener(RECENT_HISTORY_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  return {
    milestones: milestonesState.milestones,
    unlockedCount: milestonesState.unlockedCount,
    totalCount: milestonesState.totalCount,
    streak,
    refresh,
  };
}
