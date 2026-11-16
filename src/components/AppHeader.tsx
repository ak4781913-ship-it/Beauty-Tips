import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bot,
  Bookmark,
  Sun,
  Moon,
  User,
  ChevronRight,
  Sparkles,
  Info,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { AppViewId } from './AppSidebar';

interface AppHeaderProps {
  currentView: AppViewId;
  onOpenMobileSidebar: () => void;
  onOpenSearchModal: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfileDrawer: () => void;
  onNavigate: (viewId: AppViewId) => void;
  onOpenAboutContact?: (tab: 'about' | 'contact') => void;
  sidebarCollapsed: boolean;
}

const VIEW_METADATA: Record<AppViewId, { title: string; category: string; description: string }> = {
  dashboard: {
    title: 'Dashboard & Beauty World',
    category: 'Home',
    description: 'Explore curated beauty categories, daily essentials, and quick access hubs.',
  },
  analysis: {
    title: 'Smart Skin Diagnostic',
    category: 'Analysis',
    description: 'Evaluate skin barrier health, pore balance, and custom regimen formulas.',
  },
  skincare: {
    title: 'Skincare Solutions Hub',
    category: 'Skincare',
    description: '10 core skin concerns, natural remedies, and clinical barrier restoration.',
  },
  treatments: {
    title: 'Beauty & Clinical Treatments',
    category: 'Treatments',
    description: 'Chemical peels, microneedling, laser therapies, and professional safety guides.',
  },
  products: {
    title: 'Recommended Products & Trends',
    category: 'Products',
    description: 'Evidence-based ingredient concentrations, product categories, and popularity analytics.',
  },
  posters: {
    title: 'Educational Beauty Posters',
    category: 'Visual Guides',
    description: 'High-resolution layering hierarchies, 14-day barrier protocol, and cheatsheets.',
  },
  routines: {
    title: 'Skincare Routines & Scheduler',
    category: 'Routines',
    description: 'AM/PM regimen builder, daily checklist tracker, and browser reminder alerts.',
  },
  ingredients: {
    title: 'Skincare Ingredients Guide',
    category: 'Formulation',
    description: 'Comprehensive ingredient directory, molecular functions, and active clash checker.',
  },
  articles: {
    title: 'Beauty Knowledge Library',
    category: 'Articles',
    description: 'In-depth educational articles covering skin, hair, makeup, and holistic grooming.',
  },
  ai: {
    title: 'Ask Abbas AI Consultation',
    category: 'AI Assistant',
    description: 'Conversational beauty advisor grounded in clinical dermatology and multi-language support.',
  },
  help: {
    title: 'Help Center & Guidance',
    category: 'Support',
    description: 'Frequently asked skincare questions, product layering tutorials, and platform assistance.',
  },
  settings: {
    title: 'Settings & Personalization',
    category: 'App Settings',
    description: 'Manage skin profile preferences, theme appearance, and saved favorites vault.',
  },
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  onOpenMobileSidebar,
  onOpenSearchModal,
  onOpenFavorites,
  favoritesCount,
  darkMode,
  onToggleDarkMode,
  onOpenProfileDrawer,
  onNavigate,
  onOpenAboutContact,
  sidebarCollapsed,
}) => {
  const currentMeta = VIEW_METADATA[currentView] || VIEW_METADATA.dashboard;

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-stone-950/90 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-850/80 transition-colors duration-200">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs & Dynamic Title */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-rose-300 transition-colors cursor-pointer"
              >
                Abbas Beauty
              </button>
              <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" />
              <span className="text-stone-300 truncate">{currentMeta.category}</span>
            </div>
            <h2 className="text-sm sm:text-base font-serif font-medium text-stone-100 truncate -mt-0.5">
              {currentMeta.title}
            </h2>
          </div>
        </div>

        {/* Right: Global Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Search Launcher */}
          <button
            onClick={onOpenSearchModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white text-xs transition-all cursor-pointer group"
            title="Global Smart Search (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-300 transition-colors" />
            <span className="hidden md:inline text-stone-400 group-hover:text-stone-300">
              Search tips...
            </span>
            <kbd className="hidden md:inline text-[10px] bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800 text-stone-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Abbas AI Quick Switch */}
          <button
            onClick={() => onNavigate('ai')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'ai'
                ? 'bg-rose-900/90 text-rose-100 border border-rose-700'
                : 'bg-rose-950/60 hover:bg-rose-900 border border-rose-900/60 text-rose-200'
            }`}
            title="Open Abbas AI Consultation"
          >
            <Bot className="w-3.5 h-3.5 text-rose-400" />
            <span>Abbas AI</span>
          </button>

          {/* Saved Vault Button with count badge */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            title="Saved Beauty Vault"
          >
            <Bookmark className="w-4 h-4 text-rose-400 fill-rose-500/20" />
            <span className="hidden md:inline">Saved</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Ivory Light Mode' : 'Switch to Dark Luxury Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Moon className="w-4 h-4 text-rose-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* User Profile Trigger */}
          <button
            onClick={onOpenProfileDrawer}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
            title="User Profile & Skin Settings"
            aria-label="User profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
