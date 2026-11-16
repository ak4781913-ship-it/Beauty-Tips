import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Copy,
  Check,
  RotateCw,
  Share2,
  Calendar,
  Quote,
  Lightbulb,
  Bookmark,
  CheckCircle2,
  X,
  BookOpen,
} from 'lucide-react';
import {
  BeautyAffirmation,
  getStoredDailyAffirmation,
  cycleNextAffirmation,
  toggleFavoriteAffirmationId,
  getFavoritedAffirmationIds,
  BEAUTY_AFFIRMATIONS,
  AFFIRMATION_UPDATED_EVENT,
} from '../utils/affirmations';

interface DailyBeautyAffirmationProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  className?: string;
}

export const DailyBeautyAffirmation: React.FC<DailyBeautyAffirmationProps> = ({
  onShowToast,
  className = '',
}) => {
  const [data, setData] = useState(() => getStoredDailyAffirmation());
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [favoritesList, setFavoritesList] = useState<string[]>(() => getFavoritedAffirmationIds());

  const currentAffirmation = data.affirmation;
  const isFavorited = favoritesList.includes(currentAffirmation.id);

  // Sync state on events (cross-component and cross-tab)
  useEffect(() => {
    const handleUpdate = () => {
      setData(getStoredDailyAffirmation());
      setFavoritesList(getFavoritedAffirmationIds());
    };

    window.addEventListener(AFFIRMATION_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(AFFIRMATION_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Copy quote to clipboard
  const handleCopyQuote = () => {
    const text = `“${currentAffirmation.quote}”\n— ${currentAffirmation.author}\nDaily Beauty Affirmation · Beauty Tips by Abbas`;
    try {
      navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2200);
      onShowToast('Daily affirmation copied to clipboard!', 'success');
    } catch {
      onShowToast('Could not copy affirmation.', 'info');
    }
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    const isNowFav = toggleFavoriteAffirmationId(currentAffirmation.id);
    setFavoritesList(getFavoritedAffirmationIds());
    onShowToast(
      isNowFav
        ? 'Affirmation saved to your mindful favorites!'
        : 'Affirmation removed from favorites.',
      'favorite'
    );
  };

  // Cycle next affirmation
  const handleCycleNext = () => {
    setIsRotating(true);
    const next = cycleNextAffirmation();
    setData((prev) => ({ ...prev, affirmation: next }));
    setTimeout(() => setIsRotating(false), 500);
    onShowToast('Loaded another beauty affirmation!', 'info');
  };

  // Share via Web Share or Copy
  const handleShare = async () => {
    const text = `“${currentAffirmation.quote}”\n— ${currentAffirmation.author}\n\nToday's Beauty Affirmation: ${window.location.origin}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Beauty Affirmation | Beauty Tips by Abbas',
          text,
          url: window.location.origin,
        });
        onShowToast('Affirmation shared!', 'success');
      } catch (e) {
        if ((e as Error)?.name !== 'AbortError') {
          handleCopyQuote();
        }
      }
    } else {
      handleCopyQuote();
    }
  };

  // Category badge styling helper
  const getCategoryThemeClass = (cat: BeautyAffirmation['themeCategory']) => {
    switch (cat) {
      case 'barrier':
        return 'bg-emerald-950/70 border-emerald-800/50 text-emerald-300';
      case 'glow':
        return 'bg-amber-950/70 border-amber-800/50 text-amber-300';
      case 'mindfulness':
        return 'bg-rose-950/70 border-rose-800/50 text-rose-300';
      case 'protection':
        return 'bg-blue-950/70 border-blue-800/50 text-blue-300';
      case 'consistency':
        return 'bg-purple-950/70 border-purple-800/50 text-purple-300';
      default:
        return 'bg-stone-900 border-stone-800 text-stone-300';
    }
  };

  return (
    <>
      <section
        aria-label="Daily Beauty Affirmation"
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900/95 via-rose-950/30 to-stone-900/95 border border-rose-900/35 p-6 sm:p-8 shadow-xl transition-all duration-300 ${className}`}
      >
        {/* Ambient background bloom */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-900/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-6 relative z-10">
          {/* Top Bar: Label & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 shrink-0">
                <Sparkles className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-400">
                    Daily Beauty Affirmation
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-medium text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Refreshes Daily</span>
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-light mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>{data.displayDate}</span>
                </p>
              </div>
            </div>

            {/* Top quick controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {favoritesList.length > 0 && (
                <button
                  onClick={() => setShowFavoritesModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View your saved affirmations"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
                  <span>Saved ({favoritesList.length})</span>
                </button>
              )}

              <button
                onClick={handleCycleNext}
                disabled={isRotating}
                className="px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Shuffle / Next Affirmation"
              >
                <RotateCw className={`w-3.5 h-3.5 text-stone-400 ${isRotating ? 'animate-spin text-rose-400' : ''}`} />
                <span className="hidden sm:inline">Inspire Me</span>
              </button>
            </div>
          </div>

          {/* Affirmation Quote Body */}
          <div className="space-y-4 py-1">
            <div className="relative">
              <Quote className="w-10 h-10 text-rose-500/20 absolute -top-4 -left-3 pointer-events-none -z-10" />
              <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-stone-100 leading-snug italic tracking-tight">
                “{currentAffirmation.quote}”
              </blockquote>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-serif font-bold text-xs flex items-center justify-center">
                  A
                </span>
                <span className="text-xs sm:text-sm text-stone-300 font-medium">
                  {currentAffirmation.author}
                </span>
              </div>

              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryThemeClass(
                  currentAffirmation.themeCategory
                )}`}
              >
                {currentAffirmation.theme}
              </span>
            </div>
          </div>

          {/* Today's Mindful Action Prompt */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-850 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-300 block">
                Today’s Mindful Skincare Touch
              </span>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                {currentAffirmation.reflectionPrompt}
              </p>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80 text-xs">
            <span className="text-stone-400 text-[11px]">
              Stored in your local self-care diary · Refreshes each morning
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isFavorited
                    ? 'bg-rose-950 border-rose-700 text-rose-300 shadow-sm'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
                }`}
                title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isFavorited ? 'fill-rose-400 text-rose-400' : 'text-stone-400'
                  }`}
                />
                <span>{isFavorited ? 'Saved' : 'Save Quote'}</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title="Copy quote to clipboard"
              >
                {copiedQuote ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{copiedQuote ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Share affirmation"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Saved Affirmations Modal Dialog */}
      {showFavoritesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[85vh] rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 sm:p-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <h3 className="font-serif text-xl font-medium text-stone-100">
                  Saved Beauty Affirmations ({favoritesList.length})
                </h3>
              </div>
              <button
                onClick={() => setShowFavoritesModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 py-1 flex-1">
              {favoritesList.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400 space-y-2">
                  <Heart className="w-8 h-8 text-stone-600 mx-auto stroke-[1.5]" />
                  <p>You haven't saved any affirmations yet.</p>
                  <p className="text-stone-500">
                    Click "Save Quote" on any daily affirmation to bookmark it here.
                  </p>
                </div>
              ) : (
                BEAUTY_AFFIRMATIONS.filter((a) => favoritesList.includes(a.id)).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-2.5 hover:border-stone-700 transition-colors"
                  >
                    <blockquote className="font-serif text-base text-stone-200 italic leading-snug">
                      “{item.quote}”
                    </blockquote>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-850/80">
                      <span className="text-[11px] text-stone-400 font-medium">
                        — {item.author}
                      </span>
                      <button
                        onClick={() => {
                          toggleFavoriteAffirmationId(item.id);
                          setFavoritesList(getFavoritedAffirmationIds());
                        }}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setShowFavoritesModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
