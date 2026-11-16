import React, { useEffect } from 'react';
import { BookOpen, Sparkles, TrendingUp, ShieldCheck, Heart, Moon, Droplets } from 'lucide-react';
import { DailyBeautyJournal } from '../components/DailyBeautyJournal';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface BeautyJournalPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
}

export const BeautyJournalPage: React.FC<BeautyJournalPageProps> = ({ onShowToast }) => {
  useEffect(() => {
    document.title = 'Beauty & Skin Journal | 30-Day Barrier Mood Trends | Beauty Tips by Abbas';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Beauty & Skin Journal (30-Day Trends)', active: true }]} />

      {/* Editorial Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Longitudinal Skin Diary & Barrier Analytics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100">
            Beauty & Skin Mood Journal
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-light leading-relaxed">
            Track your daily skin mood, active ingredient tolerance, hydration levels, and sleep. Use our interactive Recharts analytics to visualize your 30-day barrier recovery journey.
          </p>
        </div>

        {/* Abbas's Golden Journaling Rule */}
        <div className="p-4 rounded-2xl bg-stone-950/90 border border-rose-900/40 text-xs text-stone-300 max-w-sm shrink-0 space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-300 font-semibold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Abbas’s Rule of Skin Memory</span>
          </div>
          <p className="italic text-stone-300 text-xs leading-relaxed">
            "Skin responds in 28-day epidermal turnover cycles. Daily micro-journaling helps you pinpoint true active ingredient reactions versus transient hormonal changes."
          </p>
        </div>
      </div>

      {/* Embedded Full Daily Beauty Journal with Recharts 30-Day Visualization */}
      <DailyBeautyJournal onShowToast={onShowToast} defaultShowTrends={true} />

      {/* Best Practices Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-serif text-base font-medium">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span>Track Longitudinal Trends</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Spot patterns between compromised moisture barriers and environmental stress, travel, or lack of restorative sleep.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-serif text-base font-medium">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Hydration & Sebum Correlation</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Maintain adequate internal water intake to reduce trans-epidermal water loss and reinforce cellular lipid matrices.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-serif text-base font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Ingredient Tolerance</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Record every product layered to ensure active ingredients like Retinoids, Vitamin C, and BHA do not clash or cause irritation.
          </p>
        </div>
      </div>
    </div>
  );
};
