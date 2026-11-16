import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Clock,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Play,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

export interface SkincareReminder {
  id: string;
  title: string;
  time: string; // "HH:MM" 24h format
  type: 'morning' | 'night' | 'spf' | 'custom';
  message: string;
  enabled: boolean;
}

const DEFAULT_REMINDERS: SkincareReminder[] = [
  {
    id: 'rem-morning-ritual',
    title: 'Morning Awakening & SPF Shield',
    time: '08:00',
    type: 'morning',
    message: 'Time for your morning skincare ritual! Cleanse gently, layer your antioxidants, and apply 2 fingers of SPF 50.',
    enabled: true,
  },
  {
    id: 'rem-spf-reapply',
    title: 'Midday Sunscreen Refresh',
    time: '13:00',
    type: 'spf',
    message: 'Sun protection refresh! Reapply your sunscreen powder or cushion to maintain true photoprotection.',
    enabled: false,
  },
  {
    id: 'rem-night-repair',
    title: 'Evening Double Cleanse & Repair',
    time: '21:30',
    type: 'night',
    message: 'Evening self-care time! Melt away daily sunscreen with an oil cleanser and seal your barrier with ceramides.',
    enabled: true,
  },
];

interface RoutineSchedulerProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const RoutineScheduler: React.FC<RoutineSchedulerProps> = ({ onShowToast }) => {
  const [reminders, setReminders] = useState<SkincareReminder[]>(() => {
    const saved = localStorage.getItem('beauty_routine_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_REMINDERS;
      }
    }
    return DEFAULT_REMINDERS;
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Reminder form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newType, setNewType] = useState<'morning' | 'night' | 'spf' | 'custom'>('morning');
  const [newMessage, setNewMessage] = useState('');

  // Keep track of triggered minutes to prevent spam
  const lastTriggeredMinuteRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setIsSupported(false);
      return;
    }
    setNotificationPermission(Notification.permission);
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem('beauty_routine_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Interval worker to check scheduled reminders every 15 seconds
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      if (lastTriggeredMinuteRef.current === currentTimeString) {
        return; // Already fired this minute
      }

      reminders.forEach((reminder) => {
        if (reminder.enabled && reminder.time === currentTimeString) {
          triggerNotification(reminder.title, reminder.message);
          lastTriggeredMinuteRef.current = currentTimeString;
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [reminders, notificationPermission]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      onShowToast('Web notifications are not supported in this browser.', 'info');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        onShowToast('Skincare reminder notifications enabled!', 'success');
        triggerNotification(
          'Beauty Tips by Abbas — Reminders Active',
          'You will now receive timely reminders for your daily skincare rituals!'
        );
      } else if (permission === 'denied') {
        onShowToast('Notifications were blocked. Enable them in site settings if desired.', 'info');
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  const triggerNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch (e) {
        // Fallback for browsers with strict service worker requirements
        onShowToast(`Reminder: ${title} — ${body}`, 'info');
      }
    } else {
      onShowToast(`Reminder: ${title}`, 'info');
    }
  };

  const handleTestNotification = () => {
    if (notificationPermission !== 'granted') {
      onShowToast('Please allow notification permission first.', 'info');
      requestPermission();
      return;
    }

    triggerNotification(
      'Beauty Tips by Abbas — Test Notification',
      'This is how your daily skincare reminder will appear! Stay consistent with your skin barrier.'
    );
    onShowToast('Test notification sent to your device!', 'success');
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextVal = !r.enabled;
          if (nextVal && notificationPermission !== 'granted') {
            requestPermission();
          }
          return { ...r, enabled: nextVal };
        }
        return r;
      })
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    onShowToast('Reminder removed.', 'info');
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onShowToast('Please enter a title for your reminder.', 'info');
      return;
    }

    const defaultMsg =
      newType === 'morning'
        ? 'Time for your morning skincare cleanse, hydration, and SPF protection.'
        : newType === 'night'
        ? 'Time for your restorative evening double cleanse and night barrier cream.'
        : newType === 'spf'
        ? 'Midday reminder: Reapply your broad-spectrum sunscreen.'
        : 'Skincare check-in: Time for your scheduled routine step.';

    const newReminder: SkincareReminder = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      type: newType,
      message: newMessage.trim() || defaultMsg,
      enabled: true,
    };

    setReminders((prev) => [...prev, newReminder]);
    setShowAddForm(false);
    setNewTitle('');
    setNewMessage('');
    onShowToast('New skincare reminder scheduled!', 'success');

    if (notificationPermission !== 'granted') {
      requestPermission();
    }
  };

  const resetToDefault = () => {
    setReminders(DEFAULT_REMINDERS);
    onShowToast('Reminders restored to recommended defaults.', 'info');
  };

  const formatDisplayTime = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
  };

  return (
    <section id="routine-scheduler" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-rose-50/70 via-stone-50/50 to-amber-50/40 dark:from-stone-900 dark:via-stone-900/90 dark:to-rose-950/20 rounded-3xl p-6 sm:p-9 border border-rose-100 dark:border-stone-800 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
              <BellRing className="w-4 h-4 text-rose-500" />
              <span>Smart Skincare Reminders</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-rose-950 dark:text-rose-50 font-normal">
              Skincare Routine Scheduler
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
              Never miss your morning SPF or evening double-cleanse ritual. Set daily alerts delivered right to your browser or device.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {notificationPermission !== 'granted' ? (
              <button
                onClick={requestPermission}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Alerts</span>
              </button>
            ) : (
              <button
                onClick={handleTestNotification}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-rose-300 text-xs font-medium transition-colors cursor-pointer"
                title="Send a sample notification to your device"
              >
                <Play className="w-3.5 h-3.5 text-rose-600" />
                <span>Test Alert</span>
              </button>
            )}

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-100/80 hover:bg-rose-200/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reminder</span>
            </button>

            <button
              onClick={resetToDefault}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              title="Reset to recommended presets"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Permission Info Banner */}
        {!isSupported ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Web Notifications API is not supported on this browser. In-app alerts will still display when you visit.</span>
          </div>
        ) : notificationPermission === 'denied' ? (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-stone-800/80 border border-rose-200 dark:border-stone-700 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
            <BellOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Notifications are currently blocked in your browser.</span>
              <p className="mt-0.5 text-stone-600 dark:text-stone-400">
                To receive skincare reminders, click the lock or site settings icon next to your URL bar and change notifications to "Allow".
              </p>
            </div>
          </div>
        ) : notificationPermission === 'default' ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-100 dark:border-stone-700 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Allow notifications to receive your morning sunscreen and evening skincare reminders automatically.</span>
            </div>
            <button
              onClick={requestPermission}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs whitespace-nowrap cursor-pointer"
            >
              Allow
            </button>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Active: Browser notifications are enabled. Alerts will trigger according to your scheduled routine times.</span>
            </div>
          </div>
        )}

        {/* Add Reminder Modal / Accordion Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddReminder}
            className="mb-8 p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-2xl border border-rose-100 dark:border-stone-800 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between pb-3 border-b border-rose-50 dark:border-stone-800">
              <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Schedule a New Skincare Reminder
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                  Reminder Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Morning Glow Serum & SPF"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                  Time of Day
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                  Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-400 cursor-pointer"
                >
                  <option value="morning">Morning Routine (AM)</option>
                  <option value="spf">SPF Reapplication</option>
                  <option value="night">Evening Routine (PM)</option>
                  <option value="custom">Custom Ritual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                Custom Alert Note (Optional)
              </label>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="e.g. Remember to double cleanse with oil cleanser first!"
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Schedule
              </button>
            </div>
          </form>
        )}

        {/* Reminders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map((reminder) => {
            const isEnabled = reminder.enabled;
            const Icon =
              reminder.type === 'morning'
                ? Sun
                : reminder.type === 'night'
                ? Moon
                : reminder.type === 'spf'
                ? ShieldCheck
                : Clock;

            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isEnabled
                    ? 'bg-white dark:bg-stone-900 border-rose-200/80 dark:border-stone-800 shadow-sm'
                    : 'bg-stone-50/40 dark:bg-stone-900/40 border-stone-200/50 dark:border-stone-800/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                      <Icon className="w-3.5 h-3.5 text-rose-600" />
                      <span>{formatDisplayTime(reminder.time)}</span>
                    </span>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleReminder(reminder.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          isEnabled ? 'bg-rose-600' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                        aria-label={`Toggle ${reminder.title}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Delete reminder"
                        aria-label="Delete reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100">
                    {reminder.title}
                  </h4>

                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
                    {reminder.message}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-rose-50 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="capitalize">{reminder.type} ritual</span>
                  <span className={isEnabled ? 'text-emerald-600 font-medium' : 'text-stone-400'}>
                    {isEnabled ? 'Scheduled Daily' : 'Paused'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
