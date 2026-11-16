import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Filter,
  Check,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { BeautyTipsLibrary } from './BeautyTipsLibrary';
import { CategoryNav } from './CategoryNav';
import { BeautyTip, CategoryId } from '../types';
import { BEAUTY_TIPS } from '../data/tips';

interface ArticlesViewProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onOpenDetail: (tip: BeautyTip) => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (catId: CategoryId | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  favorites,
  onToggleFavorite,
  onOpenDetail,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onShowToast,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Category Navigation Pills */}
      <div className="pt-2">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Main Knowledge Library */}
      <BeautyTipsLibrary
        tips={BEAUTY_TIPS}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onOpenDetail={onOpenDetail}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onShowToast={onShowToast}
      />
    </div>
  );
};
