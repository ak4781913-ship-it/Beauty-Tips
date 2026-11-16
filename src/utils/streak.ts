import { getRecentHistory } from './recentHistory';

export const STREAK_STORAGE_KEY = 'beauty_reading_streak';
export const STREAK_EVENT = 'beauty_streak_updated';

export interface DailyStreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  activeDays: string[];   // list of 'YYYY-MM-DD' strings
  totalDaysActive: number;
  hasReadToday: boolean;
}

/**
 * Formats a Date object as 'YYYY-MM-DD' in local time.
 */
export function toLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns 'YYYY-MM-DD' string for yesterday.
 */
export function getYesterdayDateString(date: Date = new Date()): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return toLocalDateString(yesterday);
}

/**
 * Retrieves the current streak data from localStorage, with automatic validation
 * against yesterday/today and fallback to recent history.
 */
export function getDailyStreak(): DailyStreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: '',
      activeDays: [],
      totalDaysActive: 0,
      hasReadToday: false,
    };
  }

  const todayStr = toLocalDateString();
  const yesterdayStr = getYesterdayDateString();

  let data: DailyStreakData = {
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: '',
    activeDays: [],
    totalDaysActive: 0,
    hasReadToday: false,
  };

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.currentStreak === 'number') {
        data = {
          currentStreak: parsed.currentStreak || 0,
          bestStreak: parsed.bestStreak || 0,
          lastActiveDate: parsed.lastActiveDate || '',
          activeDays: Array.isArray(parsed.activeDays) ? parsed.activeDays : [],
          totalDaysActive: parsed.totalDaysActive || (parsed.activeDays ? parsed.activeDays.length : 0),
          hasReadToday: parsed.lastActiveDate === todayStr,
        };
      }
    }
  } catch (e) {
    console.error('Error reading streak from storage:', e);
  }

  // If active days is empty, try seeding from recentHistory
  if (data.activeDays.length === 0) {
    try {
      const history = getRecentHistory();
      if (history.length > 0) {
        const uniqueDates = Array.from(
          new Set(history.map((h) => toLocalDateString(new Date(h.visitedAt))))
        ).sort();

        if (uniqueDates.length > 0) {
          const lastDate = uniqueDates[uniqueDates.length - 1];
          let currentStreak = 0;
          if (lastDate === todayStr) {
            currentStreak = 1;
          } else if (lastDate === yesterdayStr) {
            currentStreak = 1;
          }

          data = {
            currentStreak,
            bestStreak: Math.max(1, currentStreak),
            lastActiveDate: lastDate,
            activeDays: uniqueDates,
            totalDaysActive: uniqueDates.length,
            hasReadToday: lastDate === todayStr,
          };
          // Save seeded streak
          localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
        }
      }
    } catch {
      // ignore
    }
  }

  // Check if streak is still active or expired
  const hasReadToday = data.lastActiveDate === todayStr;
  const readYesterday = data.lastActiveDate === yesterdayStr;

  let currentStreak = data.currentStreak;
  if (!hasReadToday && !readYesterday && data.lastActiveDate !== '') {
    // Missed yesterday and today -> streak broke
    currentStreak = 0;
  }

  return {
    ...data,
    currentStreak,
    hasReadToday,
  };
}

/**
 * Records reading activity for today, updating daily streak and active days.
 * Returns the updated streak data and a flag indicating if streak was incremented today.
 */
export function recordDailyActivity(): { streak: DailyStreakData; isNewStreakDay: boolean } {
  if (typeof window === 'undefined') {
    return { streak: getDailyStreak(), isNewStreakDay: false };
  }

  const todayStr = toLocalDateString();
  const yesterdayStr = getYesterdayDateString();
  const current = getDailyStreak();

  if (current.lastActiveDate === todayStr) {
    // Already active today; return current
    return { streak: current, isNewStreakDay: false };
  }

  let newStreak = 1;
  if (current.lastActiveDate === yesterdayStr) {
    newStreak = (current.currentStreak || 0) + 1;
  } else {
    // Gap day or fresh start
    newStreak = 1;
  }

  const newBestStreak = Math.max(current.bestStreak || 0, newStreak);
  const activeDaysSet = new Set(current.activeDays || []);
  activeDaysSet.add(todayStr);
  const updatedActiveDays = Array.from(activeDaysSet).sort();

  const updatedData: DailyStreakData = {
    currentStreak: newStreak,
    bestStreak: newBestStreak,
    lastActiveDate: todayStr,
    activeDays: updatedActiveDays,
    totalDaysActive: updatedActiveDays.length,
    hasReadToday: true,
  };

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updatedData));
    dispatchStreakEvent();
  } catch (e) {
    console.error('Failed to save updated streak:', e);
  }

  return { streak: updatedData, isNewStreakDay: true };
}

/**
 * Dispatches custom window event for streak reactivity across components.
 */
export function dispatchStreakEvent(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STREAK_EVENT));
  }
}
