import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  FlaskConical,
  FileText,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Leaf,
  Layers,
  Heart,
  Droplets,
  ShieldCheck,
  Bot,
  ShoppingBag,
} from 'lucide-react';
import { SkinTreatmentsSection } from './SkinTreatmentsSection';
import { NaturalRemediesSection } from './NaturalRemediesSection';
import { ProfessionalTreatmentsSection } from './ProfessionalTreatmentsSection';

interface SkincareViewProps {
  initialSubTab?: 'concerns' | 'natural' | 'professional';
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
  onNavigateToView: (viewId: string) => void;
}

export const SkincareView: React.FC<SkincareViewProps> = ({
  initialSubTab = 'concerns',
  onShowToast,
  onNavigateToView,
}) => {
  const [subTab, setSubTab] = useState<'concerns' | 'natural' | 'professional'>(initialSubTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Subtab Switcher */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-1.5 flex flex-wrap items-center gap-1.5 max-w-xl">
        <button
          onClick={() => setSubTab('concerns')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'concerns'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>10 Core Concerns</span>
        </button>

        <button
          onClick={() => setSubTab('natural')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'natural'
              ? 'bg-emerald-950 text-emerald-200 border border-emerald-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Natural & Home</span>
        </button>

        <button
          onClick={() => setSubTab('professional')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'professional'
              ? 'bg-indigo-950 text-indigo-200 border border-indigo-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Clinical & Peels</span>
        </button>
      </div>

      {/* Render selected view */}
      {subTab === 'concerns' && (
        <div className="space-y-6">
          <SkinTreatmentsSection onShowToast={onShowToast} />
        </div>
      )}

      {subTab === 'natural' && (
        <div className="space-y-6">
          <NaturalRemediesSection />
        </div>
      )}

      {subTab === 'professional' && (
        <div className="space-y-6">
          <ProfessionalTreatmentsSection
            onShowToast={onShowToast}
            onNavigateToView={onNavigateToView}
          />
        </div>
      )}
    </div>
  );
};
