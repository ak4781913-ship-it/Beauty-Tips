import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, X, ArrowUpDown, Bookmark, RefreshCw } from 'lucide-react';
import { BeautyTip, CategoryId, SkinType, BeautyConcern } from '../types';
import { CATEGORIES } from '../data/categories';
import { TipCard } from './TipCard';

interface BeautyTipsLibraryProps {
  tips: BeautyTip[];
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onOpenDetail: (tip: BeautyTip) => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const BeautyTipsLibrary: React.FC<BeautyTipsLibraryProps> = ({
  tips,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  searchInputRef,
  onShowToast,
}) => {
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>('all');
  const [selectedConcern, setSelectedConcern] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'alpha' | 'duration'>('popular');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

  const concernsList = [
    'all',
    'Acne',
    'Dry Skin',
    'Oily Skin',
    'Dark Spots',
    'Dull Skin',
    'Sensitive Skin',
    'Blackheads',
    'Large-looking Pores',
    'Sun Exposure',
    'Hair Fall',
    'Dry Hair',
    'Lip Dryness',
  ];

  const filteredAndSortedTips = useMemo(() => {
    return tips
      .filter((tip) => {
        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = tip.title.toLowerCase().includes(q);
          const matchDesc = tip.shortExplanation.toLowerCase().includes(q) || tip.fullDescription.toLowerCase().includes(q);
          const matchCat = tip.categoryLabel.toLowerCase().includes(q);
          const matchIngredients = tip.usefulIngredients.some((ing) => ing.toLowerCase().includes(q));
          const matchConcerns = tip.concerns.some((c) => c.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchIngredients && !matchConcerns) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && tip.category !== selectedCategory) {
          return false;
        }

        // Skin type filter
        if (selectedSkinType !== 'all') {
          if (!tip.skinTypes.includes('all') && !tip.skinTypes.includes(selectedSkinType)) {
            return false;
          }
        }

        // Concern filter
        if (selectedConcern !== 'all') {
          if (!tip.concerns.includes(selectedConcern as BeautyConcern)) {
            return false;
          }
        }

        // Only saved filter
        if (onlySaved && !favorites.includes(tip.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        }
        if (sortBy === 'alpha') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'duration') {
          return (a.duration || '').localeCompare(b.duration || '');
        }
        return 0;
      });
  }, [tips, searchQuery, selectedCategory, selectedSkinType, selectedConcern, onlySaved, favorites, sortBy]);

  const resetAllFilters = () => {
    onSearchChange('');
    onSelectCategory('all');
    setSelectedSkinType('all');
    setSelectedConcern('all');
    setOnlySaved(false);
    setSortBy('popular');
  };

  return (
    <section id="tips-library" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Searchable Knowledge Vault</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 dark:text-rose-50 font-normal">
            Beauty Tips Library
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl">
            Browse our complete collection of skincare, hair, makeup, and wellness advice. Filter by concern, category, or skin type.
          </p>
        </div>

        {/* Total count badge */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span>Showing <strong className="text-stone-900 dark:text-stone-100 font-semibold tabular-nums">{filteredAndSortedTips.length}</strong> tips</span>
        </div>
      </div>

      {/* Control Bar: Search & Dynamic Filters */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-rose-100 dark:border-stone-800 shadow-sm space-y-4 mb-8">
        {/* Row 1: Real-time search bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by keyword (e.g., salicylic, hydration, glow, sunscreen)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-rose-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <label htmlFor="sort-select" className="sr-only">Sort tips by</label>
              <select
                id="sort-select"
                aria-label="Sort tips by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="alpha">Alphabetical (A-Z)</option>
                <option value="duration">Routine Duration</option>
              </select>
            </div>

            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                onlySaved
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-rose-700' : ''}`} />
              <span>Saved Only</span>
            </button>
          </div>
        </div>

        {/* Row 2: Secondary filter selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-50 dark:border-stone-800 text-xs">
          {/* Category Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Category:</span>
            <label htmlFor="category-select" className="sr-only">Filter by category</label>
            <select
              id="category-select"
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value as any)}
              className="py-1 px-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All 15 Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skin Type Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Skin Type:</span>
            <label htmlFor="skin-type-select" className="sr-only">Filter by skin type</label>
            <select
              id="skin-type-select"
              aria-label="Filter by skin type"
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value as any)}
              className="py-1 px-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Skin Types</option>
              <option value="dry">Dry Skin</option>
              <option value="oily">Oily Skin</option>
              <option value="combination">Combination Skin</option>
              <option value="sensitive">Sensitive Skin</option>
              <option value="normal">Normal Skin</option>
            </select>
          </div>

          {/* Concern Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">Concern:</span>
            <label htmlFor="concern-select" className="sr-only">Filter by concern</label>
            <select
              id="concern-select"
              aria-label="Filter by concern"
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
              className="py-1 px-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs focus:outline-none cursor-pointer"
            >
              {concernsList.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'All Concerns' : item}
                </option>
              ))}
            </select>
          </div>

          {/* Clear button if any filter is active */}
          {(searchQuery || selectedCategory !== 'all' || selectedSkinType !== 'all' || selectedConcern !== 'all' || onlySaved) && (
            <button
              onClick={resetAllFilters}
              className="ml-auto flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Tip Cards */}
      {filteredAndSortedTips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredAndSortedTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              isFavorite={favorites.includes(tip.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetail={onOpenDetail}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      ) : (
        /* Clean Empty State */
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-rose-100 dark:border-stone-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-stone-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
            No matching beauty tips found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            We couldn’t find tips matching your current search or filter combination. Try resetting your search terms or exploring all 15 categories.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
