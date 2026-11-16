import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Search,
  User,
  Bot,
  ChevronDown,
  Leaf,
  Scissors,
  Palette,
  Droplets,
  Heart,
  Flame,
  ShoppingBag,
  TrendingUp,
  Tag,
  Compass,
  Stethoscope,
  FlaskConical,
  FileText,
  BookOpen,
  Info,
  Mail,
} from 'lucide-react';
import { CategoryId } from '../types';

interface NavbarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenSearchModal: () => void;
  onOpenProfileDrawer: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSelectCategory: (catId: CategoryId) => void;
  onOpenAboutContact?: (defaultTab?: 'about' | 'contact') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount,
  onOpenFavorites,
  onOpenSearchModal,
  onOpenProfileDrawer,
  darkMode,
  onToggleDarkMode,
  onSelectCategory,
  onOpenAboutContact,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Close explore dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollTo = (targetId: string) => {
    setMobileMenuOpen(false);
    setExploreMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (catId: CategoryId) => {
    setMobileMenuOpen(false);
    setExploreMenuOpen(false);
    onSelectCategory(catId);
    const el = document.getElementById('tips-library');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAboutTab = (tab: 'about' | 'contact') => {
    setMobileMenuOpen(false);
    setExploreMenuOpen(false);
    if (onOpenAboutContact) {
      onOpenAboutContact(tab);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark & Logo */}
        <a
          href="#hero"
          onClick={() => handleScrollTo('hero')}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-stone-100 hover:text-rose-300 transition-colors flex items-center gap-2.5 shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500/30 to-amber-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shadow-sm shadow-rose-950">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="truncate">Beauty Tips by Abbas</span>
        </a>

        {/* Center: Clean Text Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-stone-300">
          <button
            onClick={() => handleScrollTo('hero')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleScrollTo('smart-suggestions')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Skin Analysis
          </button>
          <button
            onClick={() => handleScrollTo('skin-treatments-solutions')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Skin Concerns
          </button>
          <button
            onClick={() => handleScrollTo('routine-builder')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Routines
          </button>
          <button
            onClick={() => handleScrollTo('ingredients-guide')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Ingredients
          </button>
          <button
            onClick={() => handleScrollTo('beauty-posters')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Posters
          </button>
          <button
            onClick={() => handleCategoryClick('hair-care')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Hair Care
          </button>
          <button
            onClick={() => handleCategoryClick('body-care')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            Body Care
          </button>

          {/* Accessible Explore Mega Dropdown */}
          <div className="relative" ref={exploreRef}>
            <button
              onClick={() => setExploreMenuOpen(!exploreMenuOpen)}
              className="flex items-center gap-1 hover:text-rose-300 transition-colors py-1 cursor-pointer"
              aria-expanded={exploreMenuOpen}
            >
              <span>Explore</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  exploreMenuOpen ? 'rotate-180 text-rose-400' : ''
                }`}
              />
            </button>

            {exploreMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleScrollTo('skin-treatments-solutions')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-200 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-medium">10 Skin Concerns</span>
                </button>
                <button
                  onClick={() => handleScrollTo('ingredients-guide')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-200 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-medium">Ingredients Guide</span>
                </button>
                <button
                  onClick={() => handleScrollTo('beauty-posters')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-200 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">Beauty Posters</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('natural-remedies')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-200 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">Natural Remedies</span>
                </button>
                <button
                  onClick={() => handleCategoryClick('face-glow')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-200 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-medium">Face Care</span>
                </button>
                <button
                  onClick={() => handleScrollTo('product-suggestions')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-200 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">Products Guide</span>
                </button>
                <button
                  onClick={() => handleScrollTo('beauty-trends')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-200 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-medium">Beauty Trends</span>
                </button>
                <a
                  href="https://arwf.org/4/eccd80231d38dcd138ab15392982c219"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">Featured Deals</span>
                </a>
                <button
                  onClick={() => handleScrollTo('professional-treatments')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-rose-300 hover:text-rose-200 transition-colors cursor-pointer col-span-2 bg-rose-950/30 border border-rose-900/40"
                >
                  <Stethoscope className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">Professional Skin Treatments</span>
                </button>
                <button
                  onClick={() => handleOpenAboutTab('about')}
                  className="p-2.5 rounded-xl hover:bg-stone-800 text-left flex items-center gap-2.5 text-xs text-stone-300 hover:text-white transition-colors cursor-pointer col-span-2 border-t border-stone-850 mt-1"
                >
                  <Info className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>About Abbas & Contact Us</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleOpenAboutTab('about')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => handleOpenAboutTab('contact')}
            className="hover:text-rose-300 transition-colors py-1 cursor-pointer text-rose-300"
          >
            Contact
          </button>
        </nav>

        {/* Right: Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Smart Search */}
          <button
            onClick={onOpenSearchModal}
            className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
            title="Global Smart Search (⌘K)"
            aria-label="Search beauty tips"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Ask Abbas AI Button */}
          <button
            onClick={() => handleScrollTo('ask-abbas')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-xs font-semibold text-rose-200 transition-all cursor-pointer"
            title="Consult Abbas AI"
          >
            <Bot className="w-3.5 h-3.5 text-rose-400" />
            <span>Ask Abbas AI</span>
          </button>

          {/* Saved Tips Button with Counter */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 hover:text-white transition-all cursor-pointer"
            title="Saved Beauty Vault"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
            <span className="hidden sm:inline">Saved</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-stone-300" />}
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenProfileDrawer}
            className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
            title="User Profile & Preferences"
            aria-label="User profile"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-800 bg-stone-950 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleScrollTo('hero')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Home
            </button>
            <button
              onClick={() => handleScrollTo('smart-suggestions')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Skin Analysis
            </button>
            <button
              onClick={() => handleScrollTo('skin-treatments-solutions')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Skin Concerns
            </button>
            <button
              onClick={() => handleScrollTo('routine-builder')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Skincare Routines
            </button>
            <button
              onClick={() => handleScrollTo('ingredients-guide')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Ingredients Guide
            </button>
            <button
              onClick={() => handleScrollTo('beauty-posters')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Beauty Posters
            </button>
            <button
              onClick={() => handleCategoryClick('skin-care')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Skin Care
            </button>
            <button
              onClick={() => handleCategoryClick('hair-care')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Hair Care
            </button>
            <button
              onClick={() => handleCategoryClick('body-care')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Body Care
            </button>
            <button
              onClick={() => handleCategoryClick('makeup-tips')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              Makeup
            </button>
            <button
              onClick={() => handleScrollTo('professional-treatments')}
              className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-left font-medium col-span-2 flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>Professional Skin Treatments</span>
            </button>
            <button
              onClick={() => handleOpenAboutTab('about')}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 text-left font-medium"
            >
              About Abbas
            </button>
            <button
              onClick={() => handleOpenAboutTab('contact')}
              className="p-2.5 rounded-xl bg-stone-900 text-rose-300 text-left font-medium"
            >
              Contact Us
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => handleScrollTo('ask-abbas')}
              className="flex items-center gap-2 text-xs font-semibold text-rose-300"
            >
              <Bot className="w-4 h-4 text-rose-400" />
              <span>Ask Abbas AI</span>
            </button>
            <a
              href="https://arwf.org/4/eccd80231d38dcd138ab15392982c219"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-300"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Beauty Deals</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
