import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  FlaskConical,
  FileText,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Leaf,
  Layers,
  Heart,
  Droplets,
  ShieldCheck,
  Bot,
  Zap,
} from 'lucide-react';
import { Hero } from './Hero';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedContent } from './FeaturedContent';
import { CategoryNav } from './CategoryNav';
import { BeautyTip, CategoryId, BeautyConcern } from '../types';
import { BEAUTY_TIPS } from '../data/tips';
import { AdsterraBanner } from './ads/AdsterraBanner';
import { SmartlinkCard } from './ads/SmartlinkPromo';

interface DashboardViewProps {
  onNavigateToView: (viewId: string) => void;
  onSelectCategory: (catId: CategoryId | 'all') => void;
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onOpenDetail: (tip: BeautyTip) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToView,
  onSelectCategory,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  searchQuery,
  onSearchChange,
  onShowToast,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToView('articles');
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. Preserved Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSelectCategory={(catId) => {
          onSelectCategory(catId as any);
          onNavigateToView('articles');
        }}
        onOpenSearchFocus={() => onNavigateToView('articles')}
      />

      {/* Quick Access Feature Hub Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => onNavigateToView('analysis')}
            className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-925 border border-stone-800 hover:border-rose-500/40 text-left transition-all hover:scale-[1.01] cursor-pointer group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:bg-rose-500/20 transition-colors">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-sm font-medium text-stone-100 group-hover:text-rose-200 transition-colors">
              Skin Diagnostic
            </h4>
            <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
              Analyze barrier condition, sensitivity, and personalized routine steps.
            </p>
          </button>

          <button
            onClick={() => onNavigateToView('ingredients')}
            className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-925 border border-stone-800 hover:border-indigo-500/40 text-left transition-all hover:scale-[1.01] cursor-pointer group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-sm font-medium text-stone-100 group-hover:text-indigo-200 transition-colors">
              Ingredients Guide
            </h4>
            <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
              Interactive clash checker, formulation physics, and molecular roles.
            </p>
          </button>

          <button
            onClick={() => onNavigateToView('posters')}
            className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-925 border border-stone-800 hover:border-emerald-500/40 text-left transition-all hover:scale-[1.01] cursor-pointer group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-sm font-medium text-stone-100 group-hover:text-emerald-200 transition-colors">
              Beauty Posters
            </h4>
            <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
              Layering diagrams, 14-day recovery protocol, and downloadable cards.
            </p>
          </button>

          <button
            onClick={() => onNavigateToView('ai')}
            className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-925 border border-rose-900/40 hover:border-rose-500/60 bg-rose-950/20 text-left transition-all hover:scale-[1.01] cursor-pointer group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center justify-center mb-3 group-hover:bg-rose-500/30 transition-colors">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-sm font-medium text-rose-200">
              Ask Abbas AI
            </h4>
            <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
              Conversational beauty consultation with multi-language clinical advice.
            </p>
          </button>
        </div>
      </section>

      {/* 2. Top Adsterra Leaderboard Banner */}
      <div className="w-full py-2 flex justify-center bg-stone-900/40 border-y border-stone-800">
        <div className="hidden md:flex justify-center">
          <AdsterraBanner type="728x90" />
        </div>
        <div className="flex md:hidden justify-center">
          <AdsterraBanner type="320x50" />
        </div>
      </div>

      {/* 3. Category Grid */}
      <CategoryGrid
        onSelectCategory={(catId) => {
          onSelectCategory(catId);
          onNavigateToView('articles');
        }}
      />

      {/* 4. Featured Content Section */}
      <FeaturedContent
        tips={BEAUTY_TIPS}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onOpenDetail={onOpenDetail}
      />

      {/* Explore More Modules Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
              Dedicated Dedicated Modules
            </span>
            <h3 className="font-serif text-2xl font-normal text-stone-100">
              Ready to explore clinical treatments and routines?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl font-light">
              Switch smoothly between our dedicated panels in the sidebar or jump right into your daily regimen checklists.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToView('treatments')}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
            >
              10 Skin Concerns
            </button>
            <button
              onClick={() => onNavigateToView('routines')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30 transition-colors cursor-pointer"
            >
              Daily Routines & Scheduler
            </button>
          </div>
        </div>
      </section>

      {/* Sponsored Beauty Showcase */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900/60 rounded-3xl p-6 sm:p-8 border border-stone-800">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
              Partner Highlights
            </span>
            <h3 className="font-serif text-2xl font-normal text-stone-100 mt-1">
              Featured Beauty Deals & Sponsor Showcase
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-items-center">
            <div className="hidden lg:flex flex-col items-center">
              <AdsterraBanner type="160x600" />
            </div>
            <div className="w-full max-w-sm h-full flex flex-col justify-center">
              <SmartlinkCard className="h-full" />
            </div>
            <div className="flex flex-col items-center">
              <AdsterraBanner type="300x250" />
            </div>
            <div className="hidden md:flex flex-col items-center">
              <AdsterraBanner type="160x300" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
