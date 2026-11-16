import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Clock,
  History,
  Search,
  RotateCcw,
} from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { TipCard } from '../components/TipCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useRecentHistory } from '../hooks/useRecentHistory';
import { formatRelativeTime } from '../utils/recentHistory';

interface SavedArticlesPageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onClearAllFavorites: () => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
  defaultTab?: 'saved' | 'history';
}

export const SavedArticlesPage: React.FC<SavedArticlesPageProps> = ({
  favorites,
  onToggleFavorite,
  onClearAllFavorites,
  onShowToast,
  defaultTab = 'saved',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>(() => {
    if (tabParam === 'history' || defaultTab === 'history') return 'history';
    return 'saved';
  });

  const { history, removeItem: removeHistoryItem, clearAll: clearAllHistory } = useRecentHistory();
  const [historySearch, setHistorySearch] = useState('');

  useEffect(() => {
    if (tabParam === 'history') {
      setActiveTab('history');
    } else if (tabParam === 'saved') {
      setActiveTab('saved');
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'saved' | 'history') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (activeTab === 'saved') {
      document.title = `Saved Articles (${favorites.length}) | Beauty Tips by Abbas`;
    } else {
      document.title = `Reading History (${history.length}) | Beauty Tips by Abbas`;
    }
  }, [activeTab, favorites.length, history.length]);

  const savedTips = BEAUTY_TIPS.filter((t) => favorites.includes(t.id));

  const filteredHistory = history.filter((item) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      item.shortExplanation.toLowerCase().includes(q)
    );
  });

  const handleClearSaved = () => {
    if (window.confirm('Are you sure you want to remove all saved articles from your vault?')) {
      onClearAllFavorites();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire reading history?')) {
      clearAllHistory();
      onShowToast('Reading history has been cleared', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          {
            label: activeTab === 'saved' ? 'Saved Articles & Favorites' : 'Recent Reading History',
            active: true,
          },
        ]}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 mb-2">
            {activeTab === 'saved' ? (
              <>
                <Bookmark className="w-4 h-4 fill-current text-rose-400" />
                <span>Personal Beauty Vault</span>
              </>
            ) : (
              <>
                <History className="w-4 h-4 text-rose-400" />
                <span>Recent Reading Trail</span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100">
            {activeTab === 'saved' ? 'Saved Articles & Rituals' : 'Your Reading History'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {activeTab === 'saved'
              ? 'Access your bookmarked skincare guides and beauty recommendations anytime.'
              : 'Articles and beauty tips you previously visited. Quickly resume reading where you left off.'}
          </p>
        </div>

        {/* Clear buttons */}
        <div>
          {activeTab === 'saved' && savedTips.length > 0 && (
            <button
              onClick={handleClearSaved}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-rose-950/40 text-stone-400 hover:text-rose-300 border border-stone-800 hover:border-rose-900/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Saved</span>
            </button>
          )}

          {activeTab === 'history' && history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-rose-950/40 text-stone-400 hover:text-rose-300 border border-stone-800 hover:border-rose-900/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-850 pb-2">
        <button
          onClick={() => handleTabChange('saved')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-rose-950/80 text-rose-200 border border-rose-800/80 shadow-sm shadow-rose-950/50'
              : 'text-stone-400 hover:text-white hover:bg-stone-900 border border-transparent'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${activeTab === 'saved' ? 'fill-current text-rose-400' : ''}`} />
          <span>Saved Vault</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {favorites.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('history')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-rose-950/80 text-rose-200 border border-rose-800/80 shadow-sm shadow-rose-950/50'
              : 'text-stone-400 hover:text-white hover:bg-stone-900 border border-transparent'
          }`}
        >
          <History className="w-4 h-4 text-rose-400" />
          <span>Recent History</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
            {history.length}
          </span>
        </button>
      </div>

      {/* Tab Content: Saved Articles */}
      {activeTab === 'saved' && (
        <>
          {savedTips.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {savedTips.map((tip) => (
                  <TipCard
                    key={tip.id}
                    tip={tip}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                    onShowToast={onShowToast}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-6 bg-stone-900/40 rounded-3xl border border-stone-800 p-8 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-rose-950/40 border border-rose-900/40 text-rose-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-stone-100 font-normal">Your beauty vault is empty</h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                  Whenever you discover an article or ritual you want to reference later, tap the bookmark icon on the card to save it here.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  to="/beauty-tips"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore All Beauty Tips</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/skincare"
                  className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 font-semibold text-xs sm:text-sm border border-stone-700 transition-colors"
                >
                  Skincare Category
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab Content: Recent History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {history.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Filter your recently visited articles..."
                  className="w-full bg-stone-900/80 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                />
                {historySearch && (
                  <button
                    onClick={() => setHistorySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <span className="text-xs text-stone-400">
                Showing {filteredHistory.length} of {history.length} visited {history.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          )}

          {history.length === 0 ? (
            <div className="py-24 text-center space-y-6 bg-stone-900/40 rounded-3xl border border-stone-800 p-8 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-stone-900 border border-stone-850 text-stone-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-stone-100 font-normal">No reading history recorded yet</h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                  As you read beauty tips and skincare guides across the site, your browser will keep a private history here so you can easily return anytime.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  to="/beauty-tips"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 transition-colors inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Beauty Guides</span>
                </Link>
              </div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-sm space-y-3 bg-stone-900/30 rounded-2xl border border-stone-850 p-6">
              <p>No articles match your search query "{historySearch}"</p>
              <button
                onClick={() => setHistorySearch('')}
                className="text-rose-400 hover:underline text-xs"
              >
                Reset search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredHistory.map((item) => {
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
                        <button
                          onClick={() => {
                            removeHistoryItem(item.tipId);
                            onShowToast('Article removed from recent history', 'info');
                          }}
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
          )}
        </div>
      )}
    </div>
  );
};
