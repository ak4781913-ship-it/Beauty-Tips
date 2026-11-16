import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Clock,
  ArrowRight,
  Trash2,
  Bookmark,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { RecentArticleItem, formatRelativeTime } from '../utils/recentHistory';

interface RecentHistorySectionProps {
  history: RecentArticleItem[];
  currentTipId?: string;
  onRemoveItem: (tipId: string) => void;
  onClearAll: () => void;
  favorites?: string[];
  onToggleFavorite?: (tipId: string) => void;
  title?: string;
  subtitle?: string;
  maxDisplay?: number;
  showClearButton?: boolean;
}

export const RecentHistorySection: React.FC<RecentHistorySectionProps> = ({
  history,
  currentTipId,
  onRemoveItem,
  onClearAll,
  favorites = [],
  onToggleFavorite,
  title = 'Recently Visited Articles',
  subtitle = 'Quickly resume reading beauty rituals and skincare guides you previously opened.',
  maxDisplay = 6,
  showClearButton = true,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Filter out the current article if viewing on ArticleDetailPage
  const displayItems = history
    .filter((item) => item.tipId !== currentTipId)
    .slice(0, maxDisplay);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 pt-6 border-t border-stone-850">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-rose-400 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Reading Trail</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showClearButton && (
            <>
              {showConfirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-300">Clear all?</span>
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowConfirmClear(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs cursor-pointer"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </>
          )}

          <Link
            to="/history"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <span>All History ({history.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayItems.map((item) => {
          const isFav = favorites.includes(item.tipId);

          return (
            <div
              key={item.tipId}
              className="group relative flex flex-col justify-between rounded-2xl bg-stone-900/60 hover:bg-stone-900 border border-stone-850 hover:border-rose-900/40 p-4 transition-all duration-200"
            >
              <div>
                <div className="flex items-start gap-3">
                  <Link
                    to={`/beauty-tips/${item.slug}`}
                    className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-850 border border-stone-800 block"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 truncate">
                        {item.categoryLabel}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-[10px] text-stone-400 shrink-0"
                        title={`Visited ${new Date(item.visitedAt).toLocaleString()}`}
                      >
                        <Clock className="w-3 h-3 text-stone-400" />
                        {formatRelativeTime(item.visitedAt)}
                      </span>
                    </div>

                    <Link
                      to={`/beauty-tips/${item.slug}`}
                      className="font-serif text-sm font-normal text-stone-100 hover:text-rose-200 leading-snug line-clamp-2 transition-colors"
                    >
                      {item.title}
                    </Link>

                    {item.readingTime && (
                      <p className="text-[11px] text-stone-400 mt-1">
                        {item.readingTime}
                      </p>
                    )}
                  </div>
                </div>

                {item.shortExplanation && (
                  <p className="text-xs text-stone-400 mt-3 line-clamp-2 leading-relaxed">
                    {item.shortExplanation}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-850/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {onToggleFavorite && (
                    <button
                      onClick={() => onToggleFavorite(item.tipId)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isFav
                          ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                          : 'bg-stone-850 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                      title={isFav ? 'Saved in vault' : 'Save to vault'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-400' : ''}`} />
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveItem(item.tipId)}
                    className="p-1.5 rounded-lg border border-stone-800 bg-stone-850 text-stone-400 hover:text-rose-400 hover:border-stone-700 transition-colors cursor-pointer"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link
                  to={`/beauty-tips/${item.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                >
                  <span>Resume Reading</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
