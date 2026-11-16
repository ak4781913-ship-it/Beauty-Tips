import React, { useState } from 'react';
import {
  Droplets,
  Flame,
  ShieldAlert,
  Sparkles,
  Heart,
  ShieldCheck,
  Sun,
  Palette,
  Sparkle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserCheck,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { SKIN_TREATMENTS_SOLUTIONS, SkinConcernTreatment } from '../data/skinTreatments';

interface SkinTreatmentsSectionProps {
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const SkinTreatmentsSection: React.FC<SkinTreatmentsSectionProps> = ({ onShowToast }) => {
  const [activeConcernId, setActiveConcernId] = useState<string>(SKIN_TREATMENTS_SOLUTIONS[0].id);

  const activeTreatment =
    SKIN_TREATMENTS_SOLUTIONS.find((t) => t.id === activeConcernId) || SKIN_TREATMENTS_SOLUTIONS[0];

  const getConcernIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Heart':
        return <Heart className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Sun':
        return <Sun className="w-4 h-4" />;
      case 'Palette':
        return <Palette className="w-4 h-4" />;
      case 'Sparkle':
        return <Sparkle className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleScrollToPoster = (posterId?: string) => {
    const el = document.getElementById('beauty-posters');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (onShowToast && posterId) {
      onShowToast(`Scrolled to educational poster reference`, 'info');
    }
  };

  return (
    <section id="skin-treatments-solutions" className="py-16 bg-stone-950 border-t border-stone-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span>Targeted Dermatological Solutions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 tracking-tight">
            Skin Treatments & <span className="italic text-rose-300">Solutions</span>
          </h2>
          <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed">
            In-depth clinical educational dossiers across 10 core skin concerns: understanding root causes, structuring AM/PM routines, active ingredient selections, and when to seek professional care.
          </p>
        </div>

        {/* 10 Concern Horizontal Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {SKIN_TREATMENTS_SOLUTIONS.map((t) => {
            const isActive = t.id === activeConcernId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveConcernId(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50 scale-[1.02]'
                    : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-850 border border-stone-800'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-rose-400'}>
                  {getConcernIcon(t.iconName)}
                </span>
                <span>{t.title.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Active Concern Comprehensive Dossier Card */}
        <div className="rounded-3xl bg-stone-900/70 border border-stone-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Dossier Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-900/40">
                  {activeTreatment.badge}
                </span>
                <span className="text-xs text-stone-400">· Educational Overview</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
                {activeTreatment.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {activeTreatment.shortDescription}
              </p>
            </div>

            {activeTreatment.referencedPosterId && (
              <button
                onClick={() => handleScrollToPoster(activeTreatment.referencedPosterId)}
                className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
              >
                <span>View Linked Infographic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grid Layout: Causes, Recommendations & Biological Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
            {/* Left Column: Biological Overview & Causes (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Biological Overview */}
              <div className="p-5 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pathophysiology & Biological Context
                </span>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {activeTreatment.overview}
                </p>
              </div>

              {/* Common Causes */}
              <div className="p-5 rounded-2xl bg-stone-950/50 border border-stone-850 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Root Causes & Contributing Triggers
                </span>
                <ul className="space-y-2 text-xs text-stone-300">
                  {activeTreatment.commonCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* General Care Recommendations */}
              <div className="p-5 rounded-2xl bg-stone-950/50 border border-stone-850 space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  General Care Recommendations
                </span>
                <ul className="space-y-2 text-xs text-stone-300">
                  {activeTreatment.careRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Routine Steps & Formulations (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step-by-Step Routine Protocols */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                  Step-by-Step Care Regimen
                </span>

                <div className="space-y-4">
                  {activeTreatment.routineSteps.map((reg, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-stone-950/80 border border-stone-850 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {reg.timing}
                        </span>
                        <span className="text-[11px] text-stone-500 font-mono">
                          {reg.steps.length} sequential steps
                        </span>
                      </div>

                      <div className="space-y-2">
                        {reg.steps.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2.5 text-xs text-stone-300 p-2 rounded-xl bg-stone-900/60 border border-stone-800/40"
                          >
                            <span className="font-mono text-rose-400 font-bold shrink-0">
                              0{sIdx + 1}
                            </span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients Match Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2 text-xs">
                  <span className="font-semibold text-emerald-300 block">
                    Beneficial Active Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTreatment.suggestedIngredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-[11px]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-2 text-xs">
                  <span className="font-semibold text-red-300 block">
                    Ingredients to Avoid / Minimize
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTreatment.contraindicatedIngredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-red-950/40 border border-red-800/50 text-red-200 text-[11px]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Medical Consultation Banner */}
          <div className="mt-8 pt-6 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-850 space-y-1.5 text-xs">
              <span className="font-semibold text-stone-300 block">
                Application Precautions & Adverse Reaction Risks
              </span>
              <ul className="space-y-1 text-stone-400">
                {activeTreatment.precautions.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                <UserCheck className="w-4 h-4 text-rose-400" />
                <span>When to Consult a Qualified Dermatologist</span>
              </div>
              <ul className="space-y-1 text-stone-300">
                {activeTreatment.whenToConsultDoctor.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">!</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
