import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Flame,
  Award,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Leaf,
  Bookmark,
  GraduationCap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Calendar,
  Clock,
  Bell,
  Brain,
} from 'lucide-react';
import { useBeautyMilestones } from '../hooks/useBeautyMilestones';
import { useDailyReminder } from '../hooks/useDailyReminder';
import { BeautyMilestone } from '../utils/milestones';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoritesList?: string[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Leaf,
  Flame,
  Award,
  Trophy,
  Bookmark,
  GraduationCap,
  Brain,
};

const TIER_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  bronze: {
    border: 'border-amber-700/50',
    bg: 'bg-amber-950/30',
    text: 'text-amber-300',
  },
  silver: {
    border: 'border-stone-400/50',
    bg: 'bg-stone-800/40',
    text: 'text-stone-200',
  },
  gold: {
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-950/40',
    text: 'text-yellow-300',
  },
  platinum: {
    border: 'border-rose-400/50',
    bg: 'bg-rose-950/40',
    text: 'text-rose-200',
  },
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  favoritesList,
}) => {
  const { milestones, unlockedCount, totalCount, streak } = useBeautyMilestones(favoritesList);
  const {
    settings: reminderSettings,
    notificationPermission,
    toggleEnabled: toggleReminderEnabled,
    enablePushNotifications,
    testReminder,
  } = useDailyReminder();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked' | 'streak'>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<BeautyMilestone | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredMilestones = milestones.filter((m) => {
    if (activeFilter === 'unlocked') return m.isUnlocked;
    if (activeFilter === 'locked') return !m.isUnlocked;
    if (activeFilter === 'streak') return m.category === 'habit';
    return true;
  });

  const overallPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="p-6 sm:p-7 border-b border-stone-800 bg-gradient-to-r from-stone-900 via-rose-950/30 to-stone-900 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
                <Trophy className="w-4 h-4 text-rose-400" />
                <span>Beauty Milestones & Achievements</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
                Your Skincare Honor Vault
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Unlock digital master badges by cultivating daily reading streaks and rituals.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {/* Daily Streak Counter */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Flame className={`w-5 h-5 ${streak.currentStreak > 0 ? 'fill-orange-500/40 animate-pulse' : ''}`} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                  Daily Streak
                </span>
                <span className="font-serif text-lg font-bold text-stone-100">
                  {streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            {/* Best Streak */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                  Best Streak
                </span>
                <span className="font-serif text-lg font-bold text-stone-100">
                  {streak.bestStreak} {streak.bestStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            {/* Badges Unlocked */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                  Badges Earned
                </span>
                <span className="font-serif text-lg font-bold text-stone-100">
                  {unlockedCount} / {totalCount}
                </span>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                  Mastery
                </span>
                <span className="font-serif text-lg font-bold text-stone-100 block">
                  {overallPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* 8 PM Daily Streak Reminder Bar */}
          <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-200">
                    8:00 PM Daily Streak Reminder
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      reminderSettings.enabled
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                        : 'bg-stone-800 text-stone-400 border border-stone-700'
                    }`}
                  >
                    {reminderSettings.enabled ? 'Active' : 'Muted'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Sends an in-app toast or browser push reminder if you haven't read today's beauty tip by 8:00 PM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {notificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={enablePushNotifications}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-medium transition-colors cursor-pointer"
                  title="Enable browser notifications for offline desktop alerts"
                >
                  Enable Push
                </button>
              )}

              <button
                type="button"
                onClick={testReminder}
                className="px-2.5 py-1.5 rounded-xl bg-orange-950/60 hover:bg-orange-900/70 text-orange-300 hover:text-white border border-orange-800/60 text-xs font-semibold transition-colors cursor-pointer"
                title="Simulate and test the 8 PM reminder toast & notification immediately"
              >
                Test 8 PM Alert
              </button>

              <button
                type="button"
                onClick={() => toggleReminderEnabled(!reminderSettings.enabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  reminderSettings.enabled
                    ? 'bg-rose-950/80 border-rose-800 text-rose-300 hover:bg-rose-900'
                    : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750'
                }`}
              >
                {reminderSettings.enabled ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-6 py-3 border-b border-stone-800 flex items-center justify-between gap-3 overflow-x-auto bg-stone-900/50">
          <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All Badges ({totalCount})
            </button>
            <button
              onClick={() => setActiveFilter('unlocked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFilter === 'unlocked'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setActiveFilter('locked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFilter === 'locked'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              In Progress ({totalCount - unlockedCount})
            </button>
            <button
              onClick={() => setActiveFilter('streak')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFilter === 'streak'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Streak Milestones
            </button>
          </div>

          <div className="text-[11px] text-stone-500 hidden sm:block">
            {streak.hasReadToday ? (
              <span className="text-emerald-400 font-medium">✓ Today's streak maintained</span>
            ) : (
              <span className="text-orange-400 font-medium">Read 1 tip today to boost streak</span>
            )}
          </div>
        </div>

        {/* Milestones Grid Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMilestones.map((milestone) => {
              const IconComponent = ICON_MAP[milestone.iconName] || Sparkles;
              const tierStyle = TIER_COLORS[milestone.rewardTier] || TIER_COLORS.bronze;

              return (
                <div
                  key={milestone.id}
                  onClick={() => setSelectedMilestone(milestone)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    milestone.isUnlocked
                      ? 'bg-stone-950/70 border-rose-800/40 hover:border-rose-500/60 hover:bg-stone-950 shadow-md'
                      : 'bg-stone-950/40 border-stone-800 hover:border-stone-700 opacity-85'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            milestone.isUnlocked
                              ? 'bg-gradient-to-br from-rose-500/20 to-amber-500/20 border-rose-500/40 text-rose-300 shadow-md shadow-rose-950/40'
                              : 'bg-stone-900 border-stone-800 text-stone-500'
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${milestone.isUnlocked && milestone.id.includes('streak') ? 'text-orange-400 fill-orange-500/30' : ''}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-500">
                              {milestone.rewardTier}
                            </span>
                            {milestone.isUnlocked && (
                              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Unlocked
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-lg font-medium text-stone-100 leading-snug group-hover:text-rose-200 transition-colors">
                            {milestone.badgeName}
                          </h4>
                          <span className="text-[11px] text-rose-300 font-medium block">
                            {milestone.title}
                          </span>
                        </div>
                      </div>

                      {!milestone.isUnlocked && (
                        <div className="p-1 rounded-lg bg-stone-900 text-stone-600">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-stone-400 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Progress Bar & Readout */}
                  <div className="mt-4 pt-3 border-t border-stone-850/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>
                        Progress: <strong className="text-stone-200">{milestone.current}</strong> / {milestone.target} {milestone.unit}
                      </span>
                      <span className="font-semibold text-stone-300">
                        {milestone.progressPercentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden border border-stone-800">
                      <div
                        style={{ width: `${milestone.progressPercentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          milestone.isUnlocked
                            ? 'bg-gradient-to-r from-emerald-500 to-amber-300'
                            : 'bg-rose-500/70'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMilestones.length === 0 && (
            <div className="py-12 text-center text-stone-500 text-xs">
              No milestones found in this category.
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>
              Tip: Read just one beauty article every day to keep your flame glowing and unlock streak awards!
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
