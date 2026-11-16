import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Copy,
  Sun,
  Moon,
  Clock,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { BeautyConcern, SkinType } from '../types';
import { generateCustomRoutine, GeneratedRoutinePlan } from '../utils/routineGenerator';

interface SmartRoutineGeneratorProps {
  onFilterConcern: (concern: BeautyConcern) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

const ALL_CONCERNS: BeautyConcern[] = [
  'Acne',
  'Dry Skin',
  'Oily Skin',
  'Dark Spots',
  'Dull Skin',
  'Uneven Skin Tone',
  'Sensitive Skin',
  'Blackheads',
  'Large-looking Pores',
  'Sun Exposure',
  'Hair Fall',
  'Dry Hair',
  'Damaged Hair',
  'Lip Dryness',
  'General Skin Care',
];

const SKIN_TYPES: { id: SkinType; label: string; desc: string }[] = [
  { id: 'dry', label: 'Dry Skin', desc: 'Tight, flaky, craves rich lipids' },
  { id: 'oily', label: 'Oily Skin', desc: 'Shiny, active sebum, prone to pores' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, normal or dry cheeks' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Easily flushed, reactive, stings' },
  { id: 'normal', label: 'Balanced / Normal', desc: 'Comfortable, neither dry nor oily' },
];

const AGE_RANGES = ['Teens & 20s', '30s', '40s', '50s & Beyond'];

export const SmartRoutineGenerator: React.FC<SmartRoutineGeneratorProps> = ({
  onFilterConcern,
  onShowToast,
}) => {
  const [selectedConcern, setSelectedConcern] = useState<BeautyConcern>('Dry Skin');
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>('dry');
  const [selectedAge, setSelectedAge] = useState<string>('Teens & 20s');
  const [routineDepth, setRoutineDepth] = useState<'simple' | 'complete'>('complete');
  const [timeFocus, setTimeFocus] = useState<'all' | 'morning' | 'night'>('all');

  const [generatedPlan, setGeneratedPlan] = useState<GeneratedRoutinePlan | null>(() =>
    generateCustomRoutine('dry', 'Dry Skin', 'Teens & 20s', 'complete', 'all')
  );

  const handleGenerate = () => {
    const plan = generateCustomRoutine(
      selectedSkinType,
      selectedConcern,
      selectedAge,
      routineDepth,
      timeFocus
    );
    setGeneratedPlan(plan);
    onShowToast('Personalized beauty routine generated!', 'success');
  };

  const handleCopyRoutine = () => {
    if (!generatedPlan) return;
    let text = `${generatedPlan.headline}\n${generatedPlan.focusSummary}\n\n`;
    if (generatedPlan.morningSteps.length > 0) {
      text += `--- MORNING ROUTINE ---\n`;
      generatedPlan.morningSteps.forEach((s) => {
        text += `Step ${s.step}: ${s.name} - ${s.action} (Key active: ${s.keyIngredient})\n`;
      });
      text += `\n`;
    }
    if (generatedPlan.nightSteps.length > 0) {
      text += `--- NIGHT ROUTINE ---\n`;
      generatedPlan.nightSteps.forEach((s) => {
        text += `Step ${s.step}: ${s.name} - ${s.action} (Key active: ${s.keyIngredient})\n`;
      });
      text += `\n`;
    }
    text += `Wisdom from Abbas:\n${generatedPlan.abbasWisdom}\n\n`;
    text += `Beauty Tips by Abbas — Your Everyday Beauty & Self-Care Guide`;

    navigator.clipboard.writeText(text);
    onShowToast('Routine copied to your clipboard!', 'success');
  };

  return (
    <section id="smart-suggestions" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Interactive Routine Diagnostic</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 dark:text-rose-50 font-normal">
          Find the Right Beauty Tips for You
        </h2>
        <p className="mt-3 text-stone-600 dark:text-stone-300 text-sm sm:text-base">
          Select your primary skin or beauty concern, skin type, and lifestyle preferences. We’ll generate a simple, tailored beauty routine backed by restorative skincare principles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form Selectors */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-rose-100 dark:border-stone-800 shadow-sm space-y-6">
          {/* 1. Main Concern */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-2.5">
              1. What is your primary concern?
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
              {ALL_CONCERNS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedConcern(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedConcern === c
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'bg-rose-50/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Skin Type */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-2.5">
              2. Select your skin type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SKIN_TYPES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedSkinType(st.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedSkinType === st.id
                      ? 'border-rose-700 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                      : 'border-stone-200 dark:border-stone-800 bg-transparent text-stone-700 dark:text-stone-300 hover:border-rose-300'
                  }`}
                >
                  <p className="text-xs font-semibold">{st.label}</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{st.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Age Range */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-2">
              3. Age Range
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AGE_RANGES.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg text-center transition-colors cursor-pointer border ${
                    selectedAge === age
                      ? 'bg-rose-700 text-white border-rose-700'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-rose-300'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Routine Depth & Time Focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Preferred Routine
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRoutineDepth('simple')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    routineDepth === 'simple'
                      ? 'bg-rose-700 text-white border-rose-700'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Simple (3 Steps)
                </button>
                <button
                  type="button"
                  onClick={() => setRoutineDepth('complete')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    routineDepth === 'complete'
                      ? 'bg-rose-700 text-white border-rose-700'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Complete (5-6 Steps)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Time Routine Focus
              </label>
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'AM & PM' },
                  { id: 'morning', label: 'Morning' },
                  { id: 'night', label: 'Night' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTimeFocus(item.id as any)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      timeFocus === item.id
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full py-3.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium text-sm transition-all shadow-md shadow-rose-900/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Personalized Routine</span>
          </button>
        </div>

        {/* Right Column: Generated Personalized Routine */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-rose-200/80 dark:border-stone-800 shadow-lg shadow-rose-900/5">
          {generatedPlan ? (
            <div className="space-y-6">
              {/* Header block */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-rose-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    <span>Personalized Prescription</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedAge}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-rose-950 dark:text-rose-50 mt-1">
                    {generatedPlan.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                    {generatedPlan.focusSummary}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={handleCopyRoutine}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Copy routine to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Copy Plan</span>
                  </button>
                  <button
                    onClick={() => onFilterConcern(selectedConcern)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100/70 dark:bg-rose-950/60 text-xs font-medium text-rose-900 dark:text-rose-200 hover:bg-rose-200/80 transition-colors cursor-pointer"
                  >
                    <span>View Matching Tips</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Morning Steps */}
              {generatedPlan.morningSteps.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Morning Ritual (Awaken & Shield)</span>
                  </div>
                  <div className="space-y-2.5">
                    {generatedPlan.morningSteps.map((step) => (
                      <div
                        key={step.step}
                        className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-stone-800/40 border border-amber-100/60 dark:border-stone-800 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                              {step.name}
                            </h4>
                            <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                              Active: {step.keyIngredient}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                            {step.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Night Steps */}
              {generatedPlan.nightSteps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>Night Ritual (Purify & Repair)</span>
                  </div>
                  <div className="space-y-2.5">
                    {generatedPlan.nightSteps.map((step) => (
                      <div
                        key={step.step}
                        className="p-3.5 rounded-xl bg-indigo-50/30 dark:bg-stone-800/40 border border-indigo-100/50 dark:border-stone-800 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-200/60 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                              {step.name}
                            </h4>
                            <span className="text-[11px] text-indigo-800 dark:text-indigo-300 font-medium">
                              Active: {step.keyIngredient}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                            {step.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Ingredients Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recommended Ingredients</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {generatedPlan.recommendedIngredients.join(' · ')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-900 dark:text-rose-300 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Ingredients to Minimize</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {generatedPlan.ingredientsToAvoid.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Abbas's Wisdom Quote */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                    Abbas’s Advice
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic mt-0.5">
                    {generatedPlan.abbasWisdom}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
                    {generatedPlan.weeklyBonusRitual}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-stone-500">
              Select your options and click generate to view your personalized routine.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
