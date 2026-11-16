import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  X,
  Trash2,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Search,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { RecentArticleItem, formatRelativeTime } from '../utils/recentHistory';

interface RecentHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: RecentArticleItem[];
  onRemoveItem: (tipId: string) => void;
  onClearAll: () => void;
}

export const RecentHistoryDrawer: React.FC<RecentHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRemoveItem,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query) ||
      item.shortExplanation.toLowerCase().includes(query)
    );
  });

  const handleClearAll = () => {
    onClearAll();
    setConfirmClear(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-stone-950 border-l border-stone-850 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-850/80 bg-stone-950/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-medium text-stone-100 flex items-center gap-2">
                    <span>Recent History</span>
                    {history.length > 0 && (
                      <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/50 font-medium">
                        {history.length}
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Articles and rituals you previously explored
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
                aria-label="Close recent history drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search within history */}
            {history.length > 3 && (
              <div className="mt-4 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter your reading history..."
                  className="w-full bg-stone-900/90 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* List of Visited Articles */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-500">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-base font-normal text-stone-200">
                    No reading history yet
                  </h3>
                  <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                    As you read beauty tips and skincare rituals, they will automatically appear here so you can quickly return anytime.
                  </p>
                </div>
                <Link
                  to="/beauty-tips"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Beauty Tips</span>
                </Link>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs space-y-2">
                <p>No articles match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-rose-400 hover:underline"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredHistory.map((item) => (
                  <div
                    key={item.tipId}
                    className="group relative p-3 rounded-2xl bg-stone-900/60 hover:bg-stone-900 border border-stone-850 hover:border-stone-750 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      {/* Image Thumbnail */}
                      <Link
                        to={`/beauty-tips/${item.slug}`}
                        onClick={onClose}
                        className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-850 border border-stone-800 block"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Content details */}
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
                          onClick={onClose}
                          className="block text-xs font-medium text-stone-200 hover:text-rose-200 leading-snug line-clamp-2 transition-colors"
                        >
                          {item.title}
                        </Link>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-850/60 text-[11px] text-stone-400">
                          <span className="text-stone-400 text-[10px]">
                            {item.readingTime || 'Quick read'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onRemoveItem(item.tipId)}
                              className="p-1 rounded text-stone-400 hover:text-rose-400 transition-colors"
                              title="Remove from history"
                              aria-label={`Remove ${item.title} from history`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              to={`/beauty-tips/${item.slug}`}
                              onClick={onClose}
                              className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium text-[11px]"
                            >
                              <span>Read</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Clear All History */}
          {history.length > 0 && (
            <div className="p-4 border-t border-stone-850/80 bg-stone-950/80 backdrop-blur-md">
              {confirmClear ? (
                <div className="space-y-2 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50">
                  <p className="text-xs text-rose-200 font-medium">
                    Clear all {history.length} articles from your reading history?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearAll}
                      className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Yes, Clear All
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear all history</span>
                  </button>

                  <Link
                    to="/history"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium"
                  >
                    <span>Full History View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
