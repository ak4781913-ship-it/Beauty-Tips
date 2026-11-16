import { getDailyStreak, toLocalDateString } from './streak';

export const REMINDER_SETTINGS_KEY = 'beauty_daily_reminder_settings';
export const REMINDER_TRIGGER_EVENT = 'beauty_daily_reminder_trigger';

export interface ReminderSettings {
  enabled: boolean;
  targetHour: number; // 24-hour format, default 20 for 8 PM
  lastRemindedDate: string; // 'YYYY-MM-DD'
  pushEnabled: boolean;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: true,
  targetHour: 20, // 8:00 PM
  lastRemindedDate: '',
  pushEnabled: false,
};

/**
 * Retrieves the user's daily reminder settings from localStorage.
 */
export function getReminderSettings(): ReminderSettings {
  if (typeof window === 'undefined') return DEFAULT_REMINDER_SETTINGS;
  try {
    const raw = localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (!raw) return DEFAULT_REMINDER_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      enabled: parsed.enabled !== undefined ? Boolean(parsed.enabled) : true,
      targetHour: typeof parsed.targetHour === 'number' ? parsed.targetHour : 20,
      lastRemindedDate: typeof parsed.lastRemindedDate === 'string' ? parsed.lastRemindedDate : '',
      pushEnabled: Boolean(parsed.pushEnabled),
    };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

/**
 * Saves updated reminder settings to localStorage.
 */
export function saveReminderSettings(settings: Partial<ReminderSettings>): ReminderSettings {
  if (typeof window === 'undefined') return DEFAULT_REMINDER_SETTINGS;
  try {
    const current = getReminderSettings();
    const updated: ReminderSettings = { ...current, ...settings };
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save reminder settings:', e);
    return DEFAULT_REMINDER_SETTINGS;
  }
}

/**
 * Requests native browser push notification permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      saveReminderSettings({ pushEnabled: true });
    } else {
      saveReminderSettings({ pushEnabled: false });
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Evaluates whether a daily reminder should be triggered right now.
 * Condition:
 * 1. Reminder feature is enabled.
 * 2. User has NOT read a beauty tip yet today.
 * 3. Local hour is >= targetHour (default 8:00 PM / 20:00).
 * 4. A reminder has NOT already been sent today.
 */
export function shouldTriggerDailyReminder(date: Date = new Date()): {
  shouldTrigger: boolean;
  streakCount: number;
  currentHour: number;
  targetHour: number;
  reason?: string;
} {
  const settings = getReminderSettings();
  const streak = getDailyStreak();
  const todayStr = toLocalDateString(date);
  const currentHour = date.getHours();

  if (!settings.enabled) {
    return {
      shouldTrigger: false,
      streakCount: streak.currentStreak,
      currentHour,
      targetHour: settings.targetHour,
      reason: 'Reminders disabled in settings',
    };
  }

  if (streak.hasReadToday) {
    return {
      shouldTrigger: false,
      streakCount: streak.currentStreak,
      currentHour,
      targetHour: settings.targetHour,
      reason: "User already completed today's daily beauty tip",
    };
  }

  if (settings.lastRemindedDate === todayStr) {
    return {
      shouldTrigger: false,
      streakCount: streak.currentStreak,
      currentHour,
      targetHour: settings.targetHour,
      reason: 'Daily reminder already dispatched today',
    };
  }

  if (currentHour < settings.targetHour) {
    return {
      shouldTrigger: false,
      streakCount: streak.currentStreak,
      currentHour,
      targetHour: settings.targetHour,
      reason: `Before target hour (${currentHour}:00 < ${settings.targetHour}:00)`,
    };
  }

  return {
    shouldTrigger: true,
    streakCount: streak.currentStreak,
    currentHour,
    targetHour: settings.targetHour,
  };
}

export interface ReminderPayload {
  title: string;
  message: string;
  streakCount: number;
  isSimulated?: boolean;
}

/**
 * Dispatches both an in-app reminder event and a native browser Push Notification
 * (if permission has been granted).
 */
export function triggerDailyReminder(options?: { force?: boolean; isSimulated?: boolean }): boolean {
  if (typeof window === 'undefined') return false;

  const now = new Date();
  const status = shouldTriggerDailyReminder(now);

  if (!status.shouldTrigger && !options?.force) {
    return false;
  }

  const streak = getDailyStreak();
  const streakCount = streak.currentStreak;
  const todayStr = toLocalDateString(now);

  const title = streakCount > 0
    ? `🔥 Keep your ${streakCount}-day beauty streak alive!`
    : '✨ Your 8 PM Daily Beauty Ritual Reminder';

  const message = streakCount > 0
    ? `It's past 8 PM! Read just 1 beauty ritual before midnight to protect your ${streakCount}-day streak.`
    : "It's past 8 PM! Take 2 minutes for your daily skincare wisdom ritual and start your streak.";

  const payload: ReminderPayload = {
    title,
    message,
    streakCount,
    isSimulated: options?.isSimulated || false,
  };

  // 1. Dispatch in-app event for toast and modal listeners
  window.dispatchEvent(new CustomEvent(REMINDER_TRIGGER_EVENT, { detail: payload }));

  // 2. Dispatch native browser Push Notification if granted and supported
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: `beauty-daily-reminder-${todayStr}`,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (window.location.pathname !== '/beauty-tips') {
          window.location.href = '/beauty-tips';
        }
      };
    } catch (e) {
      console.warn('Native browser push notification could not be created:', e);
    }
  }

  // 3. Record that today's reminder was sent (unless it was a forced simulation test)
  if (!options?.isSimulated) {
    saveReminderSettings({ lastRemindedDate: todayStr });
  }

  return true;
}

/**
 * Simulates the 8 PM reminder immediately for testing and preview purposes.
 */
export function simulate8pmReminder(): boolean {
  return triggerDailyReminder({ force: true, isSimulated: true });
}
