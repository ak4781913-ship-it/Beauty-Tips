import React from 'react';
import {
  X,
  Bookmark,
  Check,
  Sparkles,
  Clock,
  Share2,
  Copy,
  Printer,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { BeautyTip } from '../types';
import { calculateReadTime } from '../utils/readTime';
import { AdsterraBanner } from './ads/AdsterraBanner';

interface TipDetailModalProps {
  tip: BeautyTip | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const TipDetailModal: React.FC<TipDetailModalProps> = ({
  tip,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShowToast,
}) => {
  if (!isOpen || !tip) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}#tip-${tip.id}`
    );
    onShowToast('Tip link copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-rose-100 dark:border-stone-800 flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4.5 border-b border-rose-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400">
            <span>{tip.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>By Abbas</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Copy Tip Link"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Print Tip"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(tip.id)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800'
              }`}
              title={isFavorite ? 'Remove from saved' : 'Save tip'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-rose-950 dark:text-rose-50 font-normal leading-snug">
              {tip.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-2.5">
              <div className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{calculateReadTime(tip)}</span>
              </div>
              {tip.duration && (
                <>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{tip.duration}</span>
                  </div>
                </>
              )}
              {tip.suitableTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Time: {tip.suitableTime}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="capitalize">
                Ideal for: {tip.skinTypes.includes('all') ? 'All skin types' : tip.skinTypes.join(', ')}
              </span>
            </div>
          </div>

          {/* Full explanation */}
          <div className="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed space-y-3 font-normal">
            <p>{tip.fullDescription}</p>
          </div>

          {/* Recommended Routine Box */}
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-stone-800 border border-rose-100 dark:border-stone-700">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-rose-800 dark:text-rose-300">
              Optimal Application Routine
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1">
              {tip.recommendedRoutine}
            </p>
          </div>

          {/* Step-by-Step Breakdown if available */}
          {tip.steps && tip.steps.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Step-by-Step Instructions
              </h3>
              <div className="space-y-2.5">
                {tip.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {st.stepNumber}
                    </span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {st.title}
                      </h5>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                        {st.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Useful Actives */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-300 mb-2">
              Key Beneficial Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {tip.usefulIngredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-stone-800 text-rose-900 dark:text-rose-200 border border-rose-100 dark:border-stone-700"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Do's and Don'ts side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Do's */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2.5 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>The Do’s</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                {tip.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-2.5 flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600" />
                <span>The Don’ts</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                {tip.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Abbas Pro Tip */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                Abbas’s Pro Secret
              </p>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic mt-0.5">
                {tip.proTip}
              </p>
            </div>
          </div>

          {/* Adsterra 300x250 Ad Slot inside modal */}
          <div className="flex justify-center py-1">
            <AdsterraBanner type="300x250" />
          </div>

          {/* Educational disclaimer notice inside tip */}
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-[11px] text-stone-500 dark:text-stone-400 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>
              Disclaimer: Provided for general beauty and skincare education only. Patch test any new active ingredients on your forearm before applying to the face.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-rose-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <button
            onClick={() => onToggleFavorite(tip.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
                : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:border-rose-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-700' : ''}`} />
            <span>{isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
