import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Filter,
  X,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Layers,
} from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { BeautyTip, CategoryId, SkinType } from '../types';
import { TipCard } from '../components/TipCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';

interface BeautyTipsPageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

const CATEGORY_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'skin-care', label: 'Skin Care' },
  { id: 'acne-pimples', label: 'Acne & Pimples' },
  { id: 'dark-spots', label: 'Dark Spots' },
  { id: 'dry-skin', label: 'Dry Skin' },
  { id: 'hair-care', label: 'Hair Care' },
  { id: 'natural-remedies', label: 'Natural Remedies' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'face-care', label: 'Face Care' },
  { id: 'body-care', label: 'Body Care' },
];

const SKIN_TYPES: { id: SkinType; label: string }[] = [
  { id: 'all', label: 'All Skin Types' },
  { id: 'dry', label: 'Dry Skin' },
  { id: 'oily', label: 'Oily Skin' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'normal', label: 'Normal' },
];

export const BeautyTipsPage: React.FC<BeautyTipsPageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const catParam = searchParams.get('cat') || 'all';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>('all');

  useEffect(() => {
    document.title = 'All Beauty Tips & Articles | Beauty Tips by Abbas';
  }, []);

  // Sync state if URL search params change
  useEffect(() => {
    if (queryParam !== searchQuery) setSearchQuery(queryParam);
    if (catParam !== selectedCategory) setSelectedCategory(catParam);
  }, [queryParam, catParam]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId !== 'all') {
      newParams.set('cat', catId);
    } else {
      newParams.delete('cat');
    }
    setSearchParams(newParams, { replace: true });
  };

  const filteredTips = useMemo(() => {
    return BEAUTY_TIPS.filter((tip) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCat =
          tip.category === selectedCategory ||
          tip.concerns.some((c) => c.toLowerCase().includes(selectedCategory.replace('-', ' ')));
        if (!matchesCat) return false;
      }

      // Skin Type filter
      if (selectedSkinType !== 'all') {
        if (!tip.skinTypes.includes('all') && !tip.skinTypes.includes(selectedSkinType)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = tip.title.toLowerCase().includes(q);
        const inDesc = tip.shortExplanation.toLowerCase().includes(q) || tip.fullDescription.toLowerCase().includes(q);
        const inIngredients = tip.usefulIngredients.some((ing) => ing.toLowerCase().includes(q));
        const inConcerns = tip.concerns.some((c) => c.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inIngredients && !inConcerns) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedSkinType, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSkinType('all');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'All Beauty Tips & Articles', active: true }]} />

      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>Curated Educational Library</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-100 font-normal leading-tight tracking-tight">
          All Beauty Tips & Articles
        </h1>
        <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
          Browse our complete collection of skincare, haircare, and beauty rituals. Every article is grounded in evidence-based barrier health and ingredient science.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-5 bg-stone-900/80 p-5 sm:p-6 rounded-3xl border border-stone-800">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-rose-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search all articles by keyword, active ingredient, or concern..."
            className="w-full pl-12 pr-10 py-3 bg-stone-950/80 border border-stone-800 rounded-2xl text-stone-100 placeholder:text-stone-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
            Categories
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-stone-950/90 hover:bg-stone-800 border border-stone-800 text-stone-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skin Type Pills */}
        <div className="space-y-2 pt-1 border-t border-stone-800/80">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
            Skin Type Compatibility
          </span>
          <div className="flex flex-wrap gap-2">
            {SKIN_TYPES.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedSkinType(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedSkinType === st.id
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'bg-stone-950/50 hover:bg-stone-800 border border-stone-800 text-stone-400'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <div className="w-full flex justify-center py-2">
        <AdsterraBanner type="728x90" />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-b border-stone-800 pb-3">
        <span>
          Showing <strong className="text-stone-200 font-medium">{filteredTips.length}</strong> of{' '}
          {BEAUTY_TIPS.length} articles
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedSkinType !== 'all') && (
          <button
            onClick={resetFilters}
            className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Grid of Articles */}
      {filteredTips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              isFavorite={favorites.includes(tip.id)}
              onToggleFavorite={onToggleFavorite}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-stone-900/40 rounded-3xl border border-stone-800">
          <BookOpen className="w-10 h-10 text-stone-500 mx-auto" />
          <h3 className="font-serif text-xl text-stone-200">No articles matched your criteria</h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or clearing active filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
