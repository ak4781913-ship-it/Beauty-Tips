import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Bell,
  Globe,
  Trash2,
  Bookmark,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
  Heart,
  Mail,
  Palette,
  ExternalLink,
  Flame,
  Download,
  Upload,
  HardDrive,
  AlertCircle,
} from 'lucide-react';
import { SkinType, SupportedLanguage } from '../types';
import { UserPreferences } from './UserProfileDrawer';
import { useDailyReminder } from '../hooks/useDailyReminder';
import {
  downloadBackupFile,
  restoreUserDataFromJSON,
  resetAllApplicationData,
} from '../utils/backupStorage';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  favoritesCount: number;
  onClearAllFavorites: () => void;
  onOpenFavorites: () => void;
  onOpenAboutContact?: (tab: 'about' | 'contact') => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  name: 'Beauty Enthusiast',
  skinType: 'combination',
  primaryConcern: 'Skin Barrier & Hydration',
  language: 'en',
  notificationsEnabled: false,
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  onToggleDarkMode,
  favoritesCount,
  onClearAllFavorites,
  onOpenFavorites,
  onOpenAboutContact,
  onShowToast,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('beauty_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    settings: reminderSettings,
    notificationPermission,
    toggleEnabled: toggleReminderEnabled,
    enablePushNotifications,
    testReminder,
  } = useDailyReminder();

  const handleExportBackup = () => {
    try {
      downloadBackupFile();
      onShowToast('Personal data backup downloaded successfully', 'success');
    } catch {
      onShowToast('Could not generate backup file', 'info');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const res = restoreUserDataFromJSON(parsed);
        if (res.success) {
          onShowToast(res.message, 'success');
          // Reload preferences state
          try {
            const saved = localStorage.getItem('beauty_user_profile');
            if (saved) setPreferences(JSON.parse(saved));
          } catch {}
        } else {
          onShowToast(res.message, 'info');
        }
      } catch {
        onShowToast('Invalid JSON file format', 'info');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExecuteReset = () => {
    resetAllApplicationData();
    setShowResetConfirm(false);
    setPreferences(DEFAULT_PREFERENCES);
    onClearAllFavorites();
    onShowToast('All local application data has been safely cleared', 'info');
  };

  useEffect(() => {
    try {
      localStorage.setItem('beauty_user_profile', JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('beauty_user_profile', JSON.stringify(preferences));
      setSavedSuccess(true);
      onShowToast('Settings and beauty preferences saved successfully!', 'success');
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      onShowToast('Failed to save preferences to local storage', 'info');
    }
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    onShowToast('Preferences restored to default values', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <Settings className="w-3.5 h-3.5" />
          <span>Application Preferences</span>
        </div>
        <h1 className="font-serif text-3xl font-normal text-stone-100">
          Settings & Personalization
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-300 font-light max-w-xl">
          Customize your profile, skincare profile filters, interface appearance, notifications, and stored data.
        </p>
      </div>

      {/* Profile & Skin Type Card */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-stone-100 font-medium">Beauty Profile</h2>
              <p className="text-xs text-stone-400">Personalize AI advice and diagnostic recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={preferences.name}
                onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-rose-400 rounded-xl text-sm text-stone-100 outline-none"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Primary Skin Type
              </label>
              <select
                value={preferences.skinType}
                onChange={(e) =>
                  setPreferences({ ...preferences, skinType: e.target.value as SkinType })
                }
                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-rose-400 rounded-xl text-sm text-stone-100 outline-none cursor-pointer"
              >
                <option value="combination">Combination Skin</option>
                <option value="dry">Dry / Dehydrated Skin</option>
                <option value="oily">Oily Skin</option>
                <option value="sensitive">Sensitive / Reactive Skin</option>
                <option value="normal">Normal Balanced Skin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Core Concern Focus
              </label>
              <select
                value={preferences.primaryConcern}
                onChange={(e) => setPreferences({ ...preferences, primaryConcern: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-rose-400 rounded-xl text-sm text-stone-100 outline-none cursor-pointer"
              >
                <option value="Skin Barrier & Hydration">Skin Barrier & Hydration</option>
                <option value="Acne & Blemish Clarification">Acne & Blemish Clarification</option>
                <option value="Dark Spots & Hyperpigmentation">Dark Spots & Hyperpigmentation</option>
                <option value="Fine Lines & Collagen Support">Fine Lines & Collagen Support</option>
                <option value="Redness & Rosacea Soothing">Redness & Rosacea Soothing</option>
                <option value="Hair Thinning & Scalp Health">Hair Thinning & Scalp Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                AI Consultation Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  setPreferences({ ...preferences, language: e.target.value as SupportedLanguage })
                }
                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-rose-400 rounded-xl text-sm text-stone-100 outline-none cursor-pointer"
              >
                <option value="en">English (English)</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950 flex items-center gap-2 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Interface & Theme Appearance */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-stone-100 font-medium">Appearance & Theme</h2>
            <p className="text-xs text-stone-400">Toggle dark luxury or warm ivory modes</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-950/60 border border-stone-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200">
              {darkMode ? <Moon className="w-4 h-4 text-rose-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-200">
                {darkMode ? 'Dark Luxury Mode (Active)' : 'Light Ivory Mode (Active)'}
              </p>
              <p className="text-xs text-stone-400">
                {darkMode
                  ? 'Sophisticated black background with rose-gold accents'
                  : 'Soft cream background with warm blush tones'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750 text-xs font-medium transition-colors cursor-pointer"
          >
            Switch to {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>

      {/* 8 PM Daily Streak Reminder & Push Notifications */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-stone-100 font-medium">Daily Streak & 8 PM Reminder</h2>
            <p className="text-xs text-stone-400">Receive evening reminders to protect and grow your daily reading streak</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-950/60 border border-stone-850">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200">
                <Bell className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-200">
                  8:00 PM Daily Tip Goal Reminder
                </p>
                <p className="text-xs text-stone-400">
                  Automatically alerts you via toast or push notification if you haven't read a beauty tip by 8 PM today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={testReminder}
                className="px-3 py-1.5 rounded-xl bg-orange-950/50 hover:bg-orange-900/60 border border-orange-800/60 text-orange-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Test how the 8 PM reminder toast & notification look"
              >
                Test 8 PM Alert
              </button>
              <button
                type="button"
                onClick={() => toggleReminderEnabled(!reminderSettings.enabled)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  reminderSettings.enabled
                    ? 'bg-rose-950 border-rose-800 text-rose-300 hover:bg-rose-900'
                    : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750'
                }`}
              >
                {reminderSettings.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-950/60 border border-stone-850">
            <div>
              <p className="text-sm font-medium text-stone-200">Browser Push Notifications</p>
              <p className="text-xs text-stone-400">
                {notificationPermission === 'granted'
                  ? 'Push notifications are granted. You will receive system alerts on your device.'
                  : 'Receive reminders even when this web tab is not currently in the foreground.'}
              </p>
            </div>

            {notificationPermission !== 'granted' ? (
              <button
                type="button"
                onClick={enablePushNotifications}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-750 text-xs font-medium transition-colors cursor-pointer"
              >
                Enable Push Alerts
              </button>
            ) : (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Browser Push Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stored Vault Data */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-stone-100 font-medium">Saved Beauty Vault</h2>
            <p className="text-xs text-stone-400">Manage bookmarks and local browser storage</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-950/60 border border-stone-850">
          <div>
            <p className="text-sm font-medium text-stone-200">
              {favoritesCount} Saved {favoritesCount === 1 ? 'Tip' : 'Tips'} in Vault
            </p>
            <p className="text-xs text-stone-400">Stored safely on your device in local storage</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFavorites}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
            >
              View Vault
            </button>
            {favoritesCount > 0 && (
              <button
                onClick={onClearAllFavorites}
                className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-900/60 text-rose-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Portability & Backup Vault */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-stone-100 font-medium">Data Portability & Vault Backup</h2>
            <p className="text-xs text-stone-400">Export your routines, skin mood journal, checklist, and gallery tags to a portable JSON backup</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Button */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-850 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-sm font-medium text-stone-200 flex items-center gap-2">
                <Download className="w-4 h-4 text-rose-400" />
                <span>Export My Beauty Data</span>
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Creates an encrypted-ready JSON backup of all your saved routines, skin moods, and personal settings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import Button */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-850 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-sm font-medium text-stone-200 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Restore from Backup</span>
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Import and restore a previously saved JSON file to reinstate your beauty profile on any device.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
                id="beauty-backup-file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select Backup File</span>
              </button>
            </div>
          </div>
        </div>

        {/* Safe Wipe / Reset Option */}
        <div className="pt-2 border-t border-stone-850">
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-stone-500 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset & Wipe All Local Application Data...</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>
                  Are you sure you want to wipe all local data? This action deletes routines, journal entries, and photo tags stored in this browser.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Yes, Wipe All Data
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About & Support Links */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-base text-stone-100 font-medium">About Abbas & Contact</h2>
            <p className="text-xs text-stone-400">Read our barrier-first editorial mission or send inquiries</p>
          </div>
        </div>

        <button
          onClick={() => onOpenAboutContact && onOpenAboutContact('about')}
          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Open Info</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
