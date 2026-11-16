import { useState, useEffect, useCallback } from 'react';
import {
  getReminderSettings,
  saveReminderSettings,
  shouldTriggerDailyReminder,
  triggerDailyReminder,
  simulate8pmReminder,
  requestNotificationPermission,
  ReminderSettings,
  ReminderPayload,
  REMINDER_TRIGGER_EVENT,
} from '../utils/dailyReminder';
import { STREAK_EVENT } from '../utils/streak';

export function useDailyReminder(
  onReminderTrigger?: (payload: ReminderPayload) => void
) {
  const [settings, setSettings] = useState<ReminderSettings>(() => getReminderSettings());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const checkAndTrigger = useCallback(() => {
    const status = shouldTriggerDailyReminder();
    if (status.shouldTrigger) {
      triggerDailyReminder();
    }
  }, []);

  useEffect(() => {
    // 1. Check on mount
    checkAndTrigger();

    // 2. Poll every 60 seconds
    const interval = setInterval(() => {
      checkAndTrigger();
    }, 60000);

    // 3. Check on tab focus / visibility return
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndTrigger();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. Listen for in-app reminder trigger event
    const handleTriggerEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ReminderPayload>;
      if (customEvent.detail && onReminderTrigger) {
        onReminderTrigger(customEvent.detail);
      }
    };
    window.addEventListener(REMINDER_TRIGGER_EVENT, handleTriggerEvent);
    window.addEventListener(STREAK_EVENT, checkAndTrigger);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener(REMINDER_TRIGGER_EVENT, handleTriggerEvent);
      window.removeEventListener(STREAK_EVENT, checkAndTrigger);
    };
  }, [checkAndTrigger, onReminderTrigger]);

  const toggleEnabled = useCallback((enabled: boolean) => {
    const updated = saveReminderSettings({ enabled });
    setSettings(updated);
  }, []);

  const updateTargetHour = useCallback((targetHour: number) => {
    const updated = saveReminderSettings({ targetHour });
    setSettings(updated);
  }, []);

  const enablePushNotifications = useCallback(async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    setSettings(getReminderSettings());
    return perm;
  }, []);

  const testReminder = useCallback(() => {
    return simulate8pmReminder();
  }, []);

  return {
    settings,
    notificationPermission,
    toggleEnabled,
    updateTargetHour,
    enablePushNotifications,
    testReminder,
    checkAndTrigger,
  };
}
