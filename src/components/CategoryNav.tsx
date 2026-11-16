import React from 'react';
import {
  Sparkles,
  Sun,
  Droplets,
  Flame,
  ShieldAlert,
  Target,
  Compass,
  Leaf,
  Palette,
  Scissors,
  Heart,
  ShieldCheck,
  ShoppingBag,
  Clock,
  Feather,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CategoryId } from '../types';

interface CategoryNavProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Sun':
        return <Sun className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'Feather':
      default:
        return <Feather className="w-5 h-5" />;
    }
  };

  return (
    <section id="categories" className="py-12 bg-rose-50/40 dark:bg-stone-900/40 border-y border-rose-100 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400">
              Curated Beauty Taxonomy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-rose-950 dark:text-rose-100 font-normal mt-1">
              Explore by Beauty Category
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-rose-300'
            }`}
          >
            Show All 15 Categories
          </button>
        </div>

        {/* 15 Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group text-left p-4 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between h-full border ${
                  isSelected
                    ? 'bg-rose-700 text-white border-rose-700 shadow-md transform -translate-y-0.5'
                    : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-rose-100/80 dark:border-stone-800 hover:border-rose-300 dark:hover:border-stone-700 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between mb-3 w-full">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-100/60 dark:bg-stone-800 text-rose-700 dark:text-rose-300 group-hover:bg-rose-200/60'
                    }`}
                  >
                    {getIcon(cat.iconName)}
                  </div>
                </div>
                <div>
                  <h3
                    className={`font-semibold text-sm leading-tight mb-1 ${
                      isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-rose-100' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {cat.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
