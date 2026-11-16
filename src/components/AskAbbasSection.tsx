import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  Heart,
  ShieldCheck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { BeautyConcern, SkinType } from '../types';

interface AskAbbasSectionProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
  onJumpToCategory: (catId: string) => void;
}

export const AskAbbasSection: React.FC<AskAbbasSectionProps> = ({
  onShowToast,
  onJumpToCategory,
}) => {
  const [skinType, setSkinType] = useState<SkinType>('combination');
  const [concern, setConcern] = useState<BeautyConcern>('Acne');
  const [currentRoutine, setCurrentRoutine] = useState<string>('Basic cleanser and random moisturizer');
  const [userQuery, setUserQuery] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generatedAdvice, setGeneratedAdvice] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) {
      onShowToast('Please describe what you want help with.', 'info');
      return;
    }

    // Generate Abbas's thorough consultation response
    const advice = {
      greeting: `Hello, friend. Thank you for reaching out to Beauty Tips by Abbas.`,
      analysis: `Given your ${skinType} skin and primary concern with ${concern}, your barrier requires a delicate balance of calming hydration rather than aggressive stripping. Many people struggling with ${concern} inadvertently over-treat their skin, which weakens the acid mantle and worsens inflammation.`,
      keyRecommendations: [
        `1. Normalize, Don't Neutralize: Keep your morning wash ultra-gentle. Never use hot water, and avoid squeaky-clean foaming agents.`,
        `2. Active Ingredient Precision: Introduce ${
          concern === 'Acne' || concern === 'Blackheads'
            ? '2% Salicylic Acid or 10% Azelaic Acid'
            : concern === 'Dry Skin'
            ? 'Multi-weight Ceramides and Hyaluronic Acid on damp skin'
            : concern === 'Dark Spots'
            ? 'Tranexamic Acid and broad-spectrum SPF 50+ daily'
            : 'Gentle Vitamin C antioxidant serum and barrier lipids'
        } slowly, no more than 3 evenings a week initially.`,
        `3. Daily Sun Defense: Direct sunlight darkens post-inflammatory marks and accelerates collagen degradation. Wear SPF 50+ every morning.`,
        `4. Hydration Layering: Instead of heavy pore-clogging waxes, apply thin watery layers of humectant essences.`,
      ],
      habitsToStop: [
        `Stop picking or touching blemishes with unwashed hands`,
        `Do not apply harsh astringents or high-percentage pure alcohols`,
        `Avoid scrubbing skin violently with coarse facial brushes`,
      ],
      abbasPersonalNote: `“Remember: true skin clarity is a marathon of consistency, not a weekend sprint. Be gentle with your reflection, stay consistent for at least 6 to 8 weeks, and treat your skin as an organ to be nurtured, not a battlefield.”`,
    };

    setGeneratedAdvice(advice);
    setIsSubmitted(true);
    onShowToast('Abbas’s suggestions prepared for you!', 'success');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setUserQuery('');
    setGeneratedAdvice(null);
  };

  return (
    <section id="ask-abbas" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-rose-100/60 via-amber-50/40 to-rose-50/50 dark:from-stone-900 dark:via-stone-900/90 dark:to-rose-950/20 rounded-3xl p-6 sm:p-10 border border-rose-200/80 dark:border-stone-800 shadow-md">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Interactive Beauty Consultation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 dark:text-rose-50 font-normal">
            Ask Beauty Tips by Abbas
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-300">
            Share your skin type, current routine, and beauty questions. Receive thoughtful, curated general guidance grounded in healthy barrier principles.
          </p>
        </div>

        {/* Content Box */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5 bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-rose-100 dark:border-stone-800 shadow-sm">
            {/* Skin Type & Concern Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Your Skin Type
                </label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value as SkinType)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-rose-400 cursor-pointer"
                >
                  <option value="dry">Dry Skin</option>
                  <option value="oily">Oily Skin</option>
                  <option value="combination">Combination Skin</option>
                  <option value="sensitive">Sensitive Skin</option>
                  <option value="normal">Normal / Balanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Main Concern
                </label>
                <select
                  value={concern}
                  onChange={(e) => setConcern(e.target.value as BeautyConcern)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-rose-400 cursor-pointer"
                >
                  <option value="Acne">Acne & Pimples</option>
                  <option value="Dry Skin">Dry Skin & Flaking</option>
                  <option value="Oily Skin">Excess Oily Shine</option>
                  <option value="Dark Spots">Dark Spots & PIH</option>
                  <option value="Dull Skin">Dull Skin / Loss of Glow</option>
                  <option value="Uneven Skin Tone">Uneven Skin Tone</option>
                  <option value="Sensitive Skin">Sensitive / Reactive Redness</option>
                  <option value="Blackheads">Blackheads & Clogged Pores</option>
                  <option value="Large-looking Pores">Large-looking Pores</option>
                  <option value="Sun Exposure">Sun Exposure / Tan</option>
                  <option value="Hair Fall">Hair Fall / Scalp Health</option>
                  <option value="Dry Hair">Dry & Damaged Hair</option>
                  <option value="Lip Dryness">Chapped / Dry Lips</option>
                  <option value="General Skin Care">General Maintenance</option>
                </select>
              </div>
            </div>

            {/* Current Routine */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Current Routine (What do you currently use?)
              </label>
              <input
                type="text"
                value={currentRoutine}
                onChange={(e) => setCurrentRoutine(e.target.value)}
                placeholder="e.g., Just face wash and moisturizer, or 10-step Korean skincare"
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* What you want help with */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                What do you want specific help with?
              </label>
              <textarea
                rows={3}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Describe your skin reaction, lifestyle changes, or what goal you want to achieve..."
                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium text-sm transition-all shadow-md shadow-rose-900/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Get Abbas’s General Suggestions</span>
            </button>
          </form>
        ) : (
          /* Response Display */
          <div className="max-w-3xl mx-auto bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-rose-200 dark:border-stone-800 shadow-lg space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-rose-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-rose-950 dark:text-rose-100">
                  Abbas’s Beauty Insights & Guidance
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ask Another Question</span>
              </button>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 italic">
              {generatedAdvice.greeting}
            </p>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {generatedAdvice.analysis}
            </p>

            {/* Core Action Steps */}
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-stone-800/60 border border-rose-100 dark:border-stone-700 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-rose-900 dark:text-rose-300">
                Key Action Recommendations
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                {generatedAdvice.keyRecommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Habits to Pause */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-900 dark:text-amber-300">
                Habits to Pause Immediately
              </h4>
              <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                {generatedAdvice.habitsToStop.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">✕</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quote */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/70 text-xs italic text-stone-600 dark:text-stone-300">
              {generatedAdvice.abbasPersonalNote}
            </div>
          </div>
        )}

        {/* Clear Medical Disclaimer Notice (MANDATORY FROM USER PROMPT) */}
        <div className="max-w-2xl mx-auto mt-8 p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Important Medical & Dermatological Disclaimer:</span>
            <p className="leading-relaxed text-amber-900 dark:text-stone-300">
              The information provided on this website is for general beauty and skincare education only and is not medical advice. It is not a substitute for professional medical diagnosis or treatment. For serious, persistent, painful, or worsening skin conditions (including severe cystic acne, dermatitis, suspected skin lesions, or infections), users should consult a qualified dermatologist or healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
