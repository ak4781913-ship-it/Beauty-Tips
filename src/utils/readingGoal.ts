import { BeautyTip } from '../types';
import { getTipSlug } from './slug';
import { getRecentHistory } from './recentHistory';

export const WEEKLY_TARGET_STORAGE_KEY = 'beauty_weekly_reading_target';
export const WEEKLY_READ_LOGS_STORAGE_KEY = 'beauty_weekly_reading_logs';
export const READING_GOAL_EVENT = 'beauty_reading_goal_updated';

export const DEFAULT_WEEKLY_TARGET = 5;

export interface ReadTipLog {
  tipId: string;
  slug: string;
  title: string;
  categoryLabel?: string;
  category?: string;
  readAt: number; // timestamp in milliseconds
}

export interface WeeklyProgressResult {
  target: number;
  count: number;
  percentage: number;
  remaining: number;
  isGoalMet: boolean;
  weekKey: string;
  weekLabel: string;
  readTips: ReadTipLog[];
}

/**
 * Returns the Monday 00:00:00 of the week for a given date.
 */
export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  // In JS, Sunday is 0. If Sunday, shift back 6 days; otherwise shift back (day - 1)
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns the Sunday 23:59:59.999 of the week for a given date.
 */
export function getEndOfWeek(date: Date = new Date()): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Returns a human-friendly week label like "Oct 12 – Oct 18, 2026".
 */
export function getWeekLabel(date: Date = new Date()): string {
  const start = getStartOfWeek(date);
  const end = getEndOfWeek(date);

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

/**
 * Generates an ISO-style week identifier, e.g. "2026-W42".
 */
export function getWeekKey(date: Date = new Date()): string {
  const start = getStartOfWeek(date);
  const yearStart = new Date(start.getFullYear(), 0, 1);
  const daysDiff = Math.floor((start.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((daysDiff + yearStart.getDay() + 1) / 7);
  return `${start.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

/**
 * Retrieves the user's weekly reading target from localStorage.
 */
export function getWeeklyTarget(): number {
  if (typeof window === 'undefined') return DEFAULT_WEEKLY_TARGET;
  try {
    const raw = localStorage.getItem(WEEKLY_TARGET_STORAGE_KEY);
    if (!raw) return DEFAULT_WEEKLY_TARGET;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed < 1 ? DEFAULT_WEEKLY_TARGET : Math.min(parsed, 50);
  } catch {
    return DEFAULT_WEEKLY_TARGET;
  }
}

/**
 * Updates the user's weekly reading target in localStorage.
 */
export function setWeeklyTarget(target: number): void {
  if (typeof window === 'undefined') return;
  const sanitized = Math.max(1, Math.min(50, Math.round(target)));
  try {
    localStorage.setItem(WEEKLY_TARGET_STORAGE_KEY, String(sanitized));
    dispatchGoalEvent();
  } catch (error) {
    console.error('Failed to save weekly reading target:', error);
  }
}

/**
 * Retrieves read tip logs for the current week.
 * Also seamlessly incorporates any article visits recorded in recentHistory that occurred this week.
 */
export function getWeeklyReadTips(date: Date = new Date()): ReadTipLog[] {
  if (typeof window === 'undefined') return [];

  const startOfWeek = getStartOfWeek(date).getTime();
  const endOfWeek = getEndOfWeek(date).getTime();

  let storedLogs: ReadTipLog[] = [];
  try {
    const raw = localStorage.getItem(WEEKLY_READ_LOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        storedLogs = parsed.filter(
          (item) =>
            item &&
            typeof item.tipId === 'string' &&
            typeof item.readAt === 'number' &&
            item.readAt >= startOfWeek &&
            item.readAt <= endOfWeek
        );
      }
    }
  } catch {
    storedLogs = [];
  }

  // Also harvest from recentHistory for articles visited within this calendar week
  try {
    const history = getRecentHistory();
    const historyInWeek = history.filter(
      (h) => h.visitedAt >= startOfWeek && h.visitedAt <= endOfWeek
    );

    // Merge without duplicate tipIds (prefer the earliest or existing readAt)
    const logMap = new Map<string, ReadTipLog>();
    for (const log of storedLogs) {
      logMap.set(log.tipId, log);
    }

    for (const h of historyInWeek) {
      if (!logMap.has(h.tipId)) {
        logMap.set(h.tipId, {
          tipId: h.tipId,
          slug: h.slug,
          title: h.title,
          categoryLabel: h.categoryLabel,
          category: h.category,
          readAt: h.visitedAt,
        });
      }
    }

    const merged = Array.from(logMap.values()).sort((a, b) => b.readAt - a.readAt);
    return merged;
  } catch {
    return storedLogs;
  }
}

/**
 * Records a tip as read for the weekly reading goal.
 * Avoids duplicates in the same week.
 */
export function recordWeeklyTipRead(tip: {
  id: string;
  title: string;
  categoryLabel?: string;
  category?: string;
  slug?: string;
}): { isNew: boolean; currentCount: number } {
  if (typeof window === 'undefined' || !tip || !tip.id) {
    return { isNew: false, currentCount: 0 };
  }

  try {
    const now = Date.now();
    const currentTips = getWeeklyReadTips();
    const existingIndex = currentTips.findIndex((t) => t.tipId === tip.id);

    let isNew = false;
    let updatedLogs: ReadTipLog[];

    const slug = tip.slug || getTipSlug(tip as BeautyTip);

    if (existingIndex >= 0) {
      // Already counted this week; update readAt timestamp
      updatedLogs = [...currentTips];
      updatedLogs[existingIndex].readAt = now;
      if (!updatedLogs[existingIndex].slug) {
        updatedLogs[existingIndex].slug = slug;
      }
    } else {
      isNew = true;
      const newLog: ReadTipLog = {
        tipId: tip.id,
        slug,
        title: tip.title,
        categoryLabel: tip.categoryLabel,
        category: tip.category,
        readAt: now,
      };
      updatedLogs = [newLog, ...currentTips];
    }

    localStorage.setItem(WEEKLY_READ_LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
    dispatchGoalEvent();

    return { isNew, currentCount: updatedLogs.length };
  } catch (error) {
    console.error('Failed to record weekly tip read:', error);
    return { isNew: false, currentCount: 0 };
  }
}

/**
 * Removes a specific tip from the weekly read log.
 */
export function removeWeeklyTipRead(tipId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const currentTips = getWeeklyReadTips();
    const filtered = currentTips.filter((t) => t.tipId !== tipId);
    localStorage.setItem(WEEKLY_READ_LOGS_STORAGE_KEY, JSON.stringify(filtered));
    dispatchGoalEvent();
  } catch (error) {
    console.error('Failed to remove weekly tip read:', error);
  }
}

/**
 * Resets the current week's reading logs.
 */
export function resetWeeklyProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    const startOfWeek = getStartOfWeek().getTime();
    const endOfWeek = getEndOfWeek().getTime();

    // Preserve logs from past or future weeks if any, only clear this week
    const raw = localStorage.getItem(WEEKLY_READ_LOGS_STORAGE_KEY);
    let otherLogs: ReadTipLog[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          otherLogs = parsed.filter(
            (item) => item.readAt < startOfWeek || item.readAt > endOfWeek
          );
        }
      } catch {
        otherLogs = [];
      }
    }

    localStorage.setItem(WEEKLY_READ_LOGS_STORAGE_KEY, JSON.stringify(otherLogs));
    dispatchGoalEvent();
  } catch (error) {
    console.error('Failed to reset weekly reading progress:', error);
  }
}

/**
 * Calculates complete weekly reading goal progress metrics.
 */
export function calculateWeeklyProgress(date: Date = new Date()): WeeklyProgressResult {
  const target = getWeeklyTarget();
  const readTips = getWeeklyReadTips(date);
  const count = readTips.length;
  const percentage = target > 0 ? Math.round((count / target) * 100) : 0;
  const remaining = Math.max(0, target - count);
  const isGoalMet = count >= target;
  const weekKey = getWeekKey(date);
  const weekLabel = getWeekLabel(date);

  return {
    target,
    count,
    percentage,
    remaining,
    isGoalMet,
    weekKey,
    weekLabel,
    readTips,
  };
}

/**
 * Dispatches a custom window event for instant reactivity across components.
 */
function dispatchGoalEvent(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(READING_GOAL_EVENT));
  }
}
