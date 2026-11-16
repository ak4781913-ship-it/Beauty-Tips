import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Tag,
  Bookmark,
  TrendingUp,
  History,
} from 'lucide-react';
import { BeautyTip, CategoryId } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tips: BeautyTip[];
  favorites: string[];
  onOpenDetail: (tip: BeautyTip) => void;
  onToggleFavorite: (tipId: string) => void;
}

const POPULAR_SEARCH_TERMS = [
  'Dry Skin',
  'Acne',
  'Salicylic Acid',
  'Ceramides',
  'Vitamin C',
  'Rosemary Oil',
  'Dark Spots',
  'Double Cleanse',
  'Frizz Control',
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  tips,
  favorites,
  onOpenDetail,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('beauty_recent_searches');
      return saved ? JSON.parse(saved) : ['Barrier repair', 'Hyaluronic Acid'];
    } catch {
      return ['Barrier repair', 'Hyaluronic Acid'];
    }
  });

  // Save recent searches
  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('beauty_recent_searches', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('beauty_recent_searches');
    } catch {}
  };

  // Keyboard navigation & Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && selectedCategoryFilter === 'all') return [];

    return tips.filter((tip) => {
      if (selectedCategoryFilter !== 'all' && tip.category !== selectedCategoryFilter) {
        return false;
      }

      if (!q) return true;

      const titleMatch = tip.title.toLowerCase().includes(q);
      const descMatch =
        tip.shortExplanation.toLowerCase().includes(q) ||
        tip.fullDescription.toLowerCase().includes(q);
      const catMatch = tip.categoryLabel.toLowerCase().includes(q);
      const ingredientMatch = tip.usefulIngredients.some((i) => i.toLowerCase().includes(q));
      const concernMatch = tip.concerns.some((c) => c.toLowerCase().includes(q));

      return titleMatch || descMatch || catMatch || ingredientMatch || concernMatch;
    });
  }, [query, selectedCategoryFilter, tips]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Beauty & Skincare Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-16 px-3 sm:px-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Search Modal Box */}
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[86vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-5 border-b border-stone-800 flex items-center gap-3 bg-stone-900/95">
          <Search className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
          <label htmlFor="global-beauty-search-input" className="sr-only">
            Search beauty concerns, routines, and ingredients
          </label>
          <input
            id="global-beauty-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                addRecentSearch(query);
              }
            }}
            placeholder="Search concerns, ingredients, rituals... (e.g. Ceramide, Acne)"
            className="w-full bg-transparent text-sm sm:text-base text-stone-100 placeholder:text-stone-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Quick Filter Categories */}
        <div className="px-4 py-2.5 border-b border-stone-800/80 bg-stone-950/40 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-stone-500 text-[11px] uppercase tracking-wider shrink-0 font-medium">
            Category:
          </span>
          {[
            { id: 'all', label: 'All Disciplines' },
            { id: 'skin-care', label: 'Skin Care' },
            { id: 'hair-care', label: 'Hair Care' },
            { id: 'makeup-tips', label: 'Makeup' },
            { id: 'natural-remedies', label: 'Natural' },
            { id: 'acne-pimples', label: 'Acne' },
            { id: 'dry-skin', label: 'Dry Skin' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs ${
                selectedCategoryFilter === cat.id
                  ? 'bg-rose-500 text-white font-medium'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Modal Body / Results */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* Default State: Popular & Recent Searches */}
          {!query && selectedCategoryFilter === 'all' && (
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-stone-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={handleClearRecent}
                      className="text-[11px] text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 hover:text-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Search className="w-3 h-3 text-stone-500" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  <span>Trending Skincare & Haircare Inquiries</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCH_TERMS.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/40 text-xs text-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-rose-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Recommendations */}
              <div className="pt-2 border-t border-stone-800">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-3">
                  Editor's Recommendations
                </span>
                <div className="space-y-2">
                  {tips.slice(0, 3).map((tip) => (
                    <div
                      key={tip.id}
                      onClick={() => {
                        onClose();
                        onOpenDetail(tip);
                      }}
                      className="p-3 rounded-2xl bg-stone-950/50 hover:bg-stone-800/70 border border-stone-800 flex items-center justify-between cursor-pointer group transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-stone-200 group-hover:text-rose-300 transition-colors">
                          {tip.title}
                        </p>
                        <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                          {tip.shortExplanation}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-rose-400 transition-transform group-hover:translate-x-1 shrink-0 ml-3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          {(query || selectedCategoryFilter !== 'all') && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-stone-400">
                <span>Found {searchResults.length} verified beauty guides</span>
                {query && (
                  <span className="text-rose-400 font-medium">Matching "{query}"</span>
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2.5">
                  {searchResults.map((tip) => {
                    const isFav = favorites.includes(tip.id);
                    return (
                      <div
                        key={tip.id}
                        onClick={() => {
                          addRecentSearch(query || tip.title);
                          onClose();
                          onOpenDetail(tip);
                        }}
                        className="p-3.5 rounded-2xl bg-stone-950/60 hover:bg-stone-800 border border-stone-800 hover:border-rose-500/40 transition-all flex items-start justify-between gap-4 cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/40">
                              {tip.categoryLabel}
                            </span>
                            <span className="text-[11px] text-stone-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {tip.duration || '5 mins'}
                            </span>
                          </div>

                          <h4 className="font-serif text-base font-medium text-stone-100 group-hover:text-rose-300 transition-colors">
                            {tip.title}
                          </h4>

                          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                            {tip.shortExplanation}
                          </p>

                          {/* Ingredient tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {tip.usefulIngredients.slice(0, 3).map((ing, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(tip.id);
                            }}
                            className={`p-2 rounded-full transition-colors cursor-pointer ${
                              isFav
                                ? 'text-rose-400 hover:text-rose-300'
                                : 'text-stone-500 hover:text-stone-300'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                          <div className="w-8 h-8 rounded-full bg-stone-800 group-hover:bg-rose-900/60 flex items-center justify-center transition-all group-hover:translate-x-1">
                            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-200" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-800 text-rose-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6 stroke-1" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-stone-200">
                    No exact guides found
                  </h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Try searching for common terms like "hydration", "salicylic", "barrier", or "cleanser", or browse all categories.
                  </p>
                  <button
                    onClick={() => {
                      setQuery('');
                      setSelectedCategoryFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-900/50 hover:bg-rose-900 text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Reset Search Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
