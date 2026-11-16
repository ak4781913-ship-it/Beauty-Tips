import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Scissors,
  Palette,
  User,
  Bell,
  Layers,
  Camera,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { RoutineBuilder } from './RoutineBuilder';
import { DailyRoutineTracker } from './DailyRoutineTracker';
import { RoutineScheduler } from './RoutineScheduler';
import { ProgressGallery } from './ProgressGallery';

interface RoutinesViewProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  defaultTab?: 'tracker' | 'builder' | 'scheduler' | 'gallery';
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  onShowToast,
  defaultTab = 'tracker',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramTab = searchParams.get('tab') as 'tracker' | 'builder' | 'scheduler' | 'gallery' | null;

  const [subTab, setSubTab] = useState<'tracker' | 'builder' | 'scheduler' | 'gallery'>(() => {
    if (paramTab && ['tracker', 'builder', 'scheduler', 'gallery'].includes(paramTab)) {
      return paramTab;
    }
    return defaultTab;
  });

  const handleTabChange = (newTab: 'tracker' | 'builder' | 'scheduler' | 'gallery') => {
    setSubTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Regimen Management Suite</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
            Personalized Beauty & Skincare Routines
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-300 max-w-xl font-light">
            Build custom steps for morning, evening, haircare, and grooming. Track your daily consistency and activate browser notification reminders.
          </p>
        </div>

        {/* Subtab Switcher */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-1.5 flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleTabChange('tracker')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'tracker'
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Daily Checklist</span>
          </button>
          <button
            onClick={() => handleTabChange('builder')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'builder'
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Routine Builder</span>
          </button>
          <button
            onClick={() => handleTabChange('scheduler')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'scheduler'
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Reminders</span>
          </button>
          <button
            onClick={() => handleTabChange('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'gallery'
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Progress Gallery</span>
          </button>
        </div>
      </div>

      {/* Panels */}
      {subTab === 'tracker' && (
        <div className="space-y-6">
          <DailyRoutineTracker onShowToast={onShowToast} />
        </div>
      )}

      {subTab === 'builder' && (
        <div className="space-y-6">
          <RoutineBuilder onShowToast={onShowToast} />
        </div>
      )}

      {subTab === 'scheduler' && (
        <div className="space-y-6">
          <RoutineScheduler onShowToast={onShowToast} />
        </div>
      )}

      {subTab === 'gallery' && (
        <div className="space-y-6">
          <ProgressGallery onShowToast={onShowToast} />
        </div>
      )}
    </div>
  );
};
