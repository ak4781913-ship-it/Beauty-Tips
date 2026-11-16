/**
 * Beauty Tips by Abbas - Comprehensive Backup & Restore Storage Utility
 * Allows users to safely export all locally stored routines, journal entries,
 * photo tags, reading history, and preferences into a portable JSON backup,
 * and restore them with schema validation.
 */

export interface AppBackupPayload {
  version: number;
  appName: string;
  exportedAt: string;
  data: {
    userProfile?: any;
    favorites?: string[];
    journalEntries?: any[];
    customRoutine?: any;
    savedRoutines?: any[];
    dailyChecklist?: any;
    progressPhotos?: any[];
    recentHistory?: any[];
    streak?: any;
    readingGoal?: any;
    pollVotes?: any;
    quizResults?: any;
  };
}

const STORAGE_KEYS: Record<string, string> = {
  userProfile: 'beauty_user_profile',
  favorites: 'beauty_favorites',
  journalEntries: 'beauty_journal_entries',
  customRoutine: 'beauty_custom_routine_v2',
  savedRoutines: 'beauty_saved_routines',
  dailyChecklist: 'beauty_daily_checklist_state',
  progressPhotos: 'beauty_progress_photos',
  recentHistory: 'beauty_recent_history',
  streak: 'beauty_streak',
  readingGoal: 'beauty_weekly_reading_goal',
  pollVotes: 'beauty_daily_poll_votes',
  quizResults: 'beauty_quiz_results',
};

/**
 * Gathers all user data from localStorage and returns a structured backup object.
 */
export function exportAllUserData(): AppBackupPayload {
  const backupData: AppBackupPayload['data'] = {};

  for (const [prop, storageKey] of Object.entries(STORAGE_KEYS)) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        backupData[prop as keyof AppBackupPayload['data']] = JSON.parse(raw);
      }
    } catch (e) {
      console.warn(`Could not export storage key ${storageKey}:`, e);
    }
  }

  return {
    version: 1,
    appName: 'Beauty Tips by Abbas',
    exportedAt: new Date().toISOString(),
    data: backupData,
  };
}

/**
 * Downloads the backup data as a timestamped JSON file.
 */
export function downloadBackupFile(): void {
  const payload = exportAllUserData();
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const nowStr = new Date().toISOString().slice(0, 10);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `beauty-tips-by-abbas-backup-${nowStr}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Validates and restores user data from a parsed backup JSON object.
 */
export function restoreUserDataFromJSON(parsed: any): { success: boolean; message: string; restoredCount: number } {
  if (!parsed || typeof parsed !== 'object') {
    return { success: false, message: 'Invalid file format: Not a JSON object.', restoredCount: 0 };
  }

  if (!parsed.appName || !parsed.data || typeof parsed.data !== 'object') {
    return { success: false, message: 'Invalid backup schema: Missing required application data fields.', restoredCount: 0 };
  }

  let count = 0;
  for (const [prop, storageKey] of Object.entries(STORAGE_KEYS)) {
    const val = parsed.data[prop];
    if (val !== undefined && val !== null) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(val));
        count++;
      } catch (e) {
        console.error(`Failed to restore ${storageKey}:`, e);
      }
    }
  }

  return {
    success: true,
    message: `Successfully restored ${count} data categories from backup.`,
    restoredCount: count,
  };
}

/**
 * Safe reset function: clears only application-specific keys, preserving any other domain storage.
 */
export function resetAllApplicationData(): void {
  for (const storageKey of Object.values(STORAGE_KEYS)) {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error(`Failed to remove ${storageKey}:`, e);
    }
  }
}
