import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Trophy,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Sliders,
  Check,
  X,
  Flame,
} from 'lucide-react';
import { useWeeklyReadingGoal } from '../hooks/useWeeklyReadingGoal';
import { getDailyStreak } from '../utils/streak';

interface WeeklyReadingGoalProps {
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
  onOpenAchievements?: () => void;
  className?: string;
}

const PRESET_TARGETS = [
  { value: 3, label: '3 Tips', desc: 'Gentle Habit' },
  { value: 5, label: '5 Tips', desc: 'Recommended' },
  { value: 7, label: '7 Tips', desc: 'Daily Ritual' },
  { value: 10, label: '10 Tips', desc: 'Deep Dive' },
];

export const WeeklyReadingGoal: React.FC<WeeklyReadingGoalProps> = ({
  onShowToast,
  onOpenAchievements,
  className = '',
}) => {
  const streak = getDailyStreak();
  const {
    target,
    count,
    percentage,
    remaining,
    isGoalMet,
    weekLabel,
    readTips,
    updateTarget,
    removeTip,
    resetCurrentWeek,
  } = useWeeklyReadingGoal();

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [customInput, setCustomInput] = useState<number>(target);
  const [isTipsListOpen, setIsTipsListOpen] = useState(false);

  const handleSelectPreset = (newTarget: number) => {
    updateTarget(newTarget);
    setCustomInput(newTarget);
    setIsEditingGoal(false);
    if (onShowToast) {
      onShowToast(`Weekly target updated to ${newTarget} tips per week`, 'success');
    }
  };

  const handleIncrement = () => {
    const next = Math.min(30, target + 1);
    updateTarget(next);
    setCustomInput(next);
  };

  const handleDecrement = () => {
    const next = Math.max(1, target - 1);
    updateTarget(next);
    setCustomInput(next);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Math.max(1, Math.min(30, customInput));
    updateTarget(val);
    setIsEditingGoal(false);
    if (onShowToast) {
      onShowToast(`Weekly target updated to ${val} beauty tips`, 'success');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset your reading progress for this current week?')) {
      resetCurrentWeek();
      if (onShowToast) {
        onShowToast('Weekly reading progress has been reset', 'info');
      }
    }
  };

  // Clamped progress percentage for CSS width (can exceed 100% in text readout)
  const displayPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <section
      aria-label="Weekly Reading Goal"
      className={`rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Subtle ambient luxury backdrop glow */}
      <div
        className={`absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isGoalMet
            ? 'bg-emerald-500/10'
            : percentage >= 50
            ? 'bg-rose-500/15'
            : 'bg-rose-500/5'
        }`}
      />

      <div className="relative z-10 space-y-6">
        {/* Header: Title, metadata, and Goal Adjustment Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider">
              {isGoalMet ? (
                <Trophy className="w-4 h-4 text-amber-400" />
              ) : (
                <Target className="w-4 h-4 text-rose-400" />
              )}
              <span>Weekly Reading Goal</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              {isGoalMet
                ? 'Weekly Ritual Accomplished!'
                : 'Nurture Your Beauty Wisdom'}
            </h2>
            {/* Clean unboxed metadata with typographic separators */}
            <p className="text-xs text-stone-400 flex flex-wrap items-center gap-2 pt-0.5">
              <span>{weekLabel}</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Target: <strong className="text-stone-200 font-medium">{target} {target === 1 ? 'tip' : 'tips'}</strong></span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Read: <strong className="text-stone-200 font-medium">{count}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-800/60 text-orange-300 text-xs font-semibold transition-colors cursor-pointer"
                title="View your reading streak & unlocked digital badges"
              >
                <Flame className={`w-3.5 h-3.5 text-orange-400 ${streak.currentStreak > 0 ? 'fill-orange-500/40' : ''}`} />
                <span>{streak.currentStreak}d Streak</span>
              </button>
            )}

            <button
              onClick={() => setIsEditingGoal((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Change your weekly reading target"
              aria-expanded={isEditingGoal}
            >
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span>{isEditingGoal ? 'Close Target' : 'Set Target'}</span>
            </button>

            {count > 0 && (
              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                title="Reset this week's reading count"
                aria-label="Reset weekly reading progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Goal Setting Editor Panel (collapsible) */}
        {isEditingGoal && (
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/70 border border-rose-900/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-rose-300">
                  Select Weekly Reading Target
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  How many beauty tips & rituals would you like to explore each week?
                </p>
              </div>
              <button
                onClick={() => setIsEditingGoal(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close goal editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_TARGETS.map((preset) => {
                const isActive = target === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleSelectPreset(preset.value)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md ring-1 ring-rose-500/40'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{preset.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      {preset.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Target Stepper */}
            <form onSubmit={handleCustomSubmit} className="pt-2 flex flex-wrap items-center gap-3 border-t border-stone-850">
              <span className="text-xs text-stone-400">Or custom number:</span>
              <div className="flex items-center bg-stone-900 border border-stone-700 rounded-xl p-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={customInput <= 1}
                  className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Decrease target"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={customInput}
                  onChange={(e) => setCustomInput(parseInt(e.target.value, 10) || 1)}
                  className="w-12 text-center text-sm font-semibold bg-transparent text-stone-100 focus:outline-none"
                  aria-label="Custom weekly target"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={customInput >= 30}
                  className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Increase target"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Apply Target
              </button>
            </form>
          </div>
        )}

        {/* Progress Bar & Metric Numbers */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-semibold text-stone-100">
                {count}
              </span>
              <span className="text-stone-400 text-sm">
                / {target} tips read
              </span>
            </div>

            {/* Percentage Display */}
            <div className="flex items-center gap-1.5">
              <span
                className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${
                  isGoalMet
                    ? 'text-emerald-400'
                    : percentage >= 50
                    ? 'text-rose-300'
                    : 'text-stone-300'
                }`}
              >
                {percentage}%
              </span>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                goal
              </span>
            </div>
          </div>

          {/* Simple, Crisp Progress Track & Fill Bar */}
          <div
            className="w-full bg-stone-950 rounded-2xl p-1 border border-stone-800 shadow-inner relative"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Weekly reading goal progress: ${percentage}%`}
          >
            <div className="relative h-4 w-full rounded-xl overflow-hidden bg-stone-900/60">
              {/* Animated Progress Fill */}
              <div
                style={{ width: `${displayPercentage}%` }}
                className={`h-full rounded-xl transition-all duration-700 ease-out relative ${
                  isGoalMet
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-md shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 shadow-md shadow-rose-950/50'
                }`}
              >
                {/* Subtle sheen reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* Milestone Dividers (25%, 50%, 75%) */}
              <div className="absolute inset-0 flex justify-between pointer-events-none px-[25%] opacity-30">
                <div className="w-px h-full bg-stone-950/80" />
                <div className="w-px h-full bg-stone-950/80" />
              </div>
            </div>
          </div>

          {/* Milestone Labels */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 font-medium">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span className={isGoalMet ? 'text-emerald-400 font-semibold' : ''}>
              100%
            </span>
          </div>
        </div>

        {/* Motivational Callout & Action Bar */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            {isGoalMet ? (
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <p className="text-stone-300 leading-snug">
              {isGoalMet ? (
                <>
                  <strong className="text-emerald-300 font-semibold">
                    Outstanding commitment!
                  </strong>{' '}
                  You reached your {target}-tip reading goal for this week.
                </>
              ) : remaining === 1 ? (
                <>
                  <strong className="text-rose-300 font-semibold">Just 1 more tip</strong>{' '}
                  to complete your weekly skincare education ritual!
                </>
              ) : (
                <>
                  Read <strong className="text-rose-300 font-semibold">{remaining} more {remaining === 1 ? 'tip' : 'tips'}</strong>{' '}
                  this week to achieve your personalized learning target.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {readTips.length > 0 && (
              <button
                onClick={() => setIsTipsListOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                aria-expanded={isTipsListOpen}
              >
                <span>Read this week ({readTips.length})</span>
                {isTipsListOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs font-medium"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Badges</span>
              </button>
            )}

            <Link
              to="/beauty-tips"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all shadow-sm group"
            >
              <span>{isGoalMet ? 'Explore More Tips' : 'Read Next Tip'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Read Tips Drawer/Tray for the Current Week */}
        {isTipsListOpen && readTips.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/80 border border-stone-850 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2 text-xs">
              <span className="font-semibold text-stone-300">
                Tips You Completed This Week
              </span>
              <span className="text-stone-500">
                {readTips.length} total
              </span>
            </div>

            <div className="divide-y divide-stone-850/60 max-h-56 overflow-y-auto pr-1">
              {readTips.map((log) => {
                const dateStr = new Date(log.readAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <div
                    key={log.tipId}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <Link
                          to={`/beauty-tips/${log.slug}`}
                          className="font-medium text-stone-200 hover:text-rose-300 transition-colors truncate block"
                        >
                          {log.title}
                        </Link>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          {log.categoryLabel && <span>{log.categoryLabel}</span>}
                          {log.categoryLabel && <span aria-hidden="true">·</span>}
                          <span>{dateStr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to={`/beauty-tips/${log.slug}`}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-300 hover:bg-stone-850 transition-colors"
                        title="Re-read guide"
                        aria-label={`Re-read ${log.title}`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => removeTip(log.tipId)}
                        className="p-1 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-850 transition-colors cursor-pointer"
                        title="Remove from this week's progress"
                        aria-label={`Remove ${log.title} from weekly progress`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
