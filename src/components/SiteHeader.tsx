import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Scissors,
  Flame,
  ShieldCheck,
  CalendarCheck,
  Bot,
  FlaskConical,
  FileText,
  HelpCircle,
  Mail,
  Info,
  Zap,
  Camera,
  CheckCircle2,
  Palette,
  Droplets,
  Layers,
  History,
  Clock,
} from 'lucide-react';
import { RecentArticleItem, formatRelativeTime } from '../utils/recentHistory';

interface SiteHeaderProps {
  favoritesCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  historyCount?: number;
  onOpenHistory?: () => void;
  recentHistory?: RecentArticleItem[];
  onClearHistory?: () => void;
  streakCount?: number;
  streakHasReadToday?: boolean;
  onOpenAchievements?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  favoritesCount,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  historyCount = 0,
  onOpenHistory,
  recentHistory = [],
  onClearHistory,
  streakCount = 0,
  streakHasReadToday = false,
  onOpenAchievements,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [skincareDropdownOpen, setSkincareDropdownOpen] = useState(false);
  const [hairMakeupDropdownOpen, setHairMakeupDropdownOpen] = useState(false);
  const [routinesDropdownOpen, setRoutinesDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const [expandedMobileCategories, setExpandedMobileCategories] = useState<Record<string, boolean>>({
    skincare: false,
    hairmakeup: false,
    routines: false,
    more: false,
  });

  const skincareRef = useRef<HTMLDivElement>(null);
  const hairMakeupRef = useRef<HTMLDivElement>(null);
  const routinesRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSkincareDropdownOpen(false);
    setHairMakeupDropdownOpen(false);
    setRoutinesDropdownOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (skincareRef.current && !skincareRef.current.contains(target)) {
        setSkincareDropdownOpen(false);
      }
      if (hairMakeupRef.current && !hairMakeupRef.current.contains(target)) {
        setHairMakeupDropdownOpen(false);
      }
      if (routinesRef.current && !routinesRef.current.contains(target)) {
        setRoutinesDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const toggleMobileCategory = (catKey: string) => {
    setExpandedMobileCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Beauty Tips', path: '/beauty-tips' },
    { label: 'Skin Care', path: '/skin-care' },
    { label: 'Makeup', path: '/makeup' },
    { label: 'Hair Care', path: '/hair-care' },
    { label: 'Routines', path: '/routines' },
    { label: 'Acne & Pimples', path: '/acne-pimples' },
    { label: 'Dark Spots', path: '/dark-spots' },
  ];

  const moreLinks = [
    { label: 'Beauty & Skin Journal', path: '/beauty-journal', icon: BookOpen, badge: 'Trends' },
    { label: 'Progress Gallery', path: '/progress-gallery', icon: Camera, badge: 'Private' },
    { label: 'Routine Builder (AI)', path: '/routine-builder', icon: Sparkles, badge: 'Gemini' },
    { label: 'Skin Diagnostic (AI)', path: '/skin-analysis', icon: Zap, badge: 'Smart' },
    { label: 'Professional Treatments', path: '/treatments', icon: ShieldCheck, badge: 'Clinical' },
    { label: 'Ingredients Guide', path: '/ingredients', icon: FlaskConical, badge: 'Matrix' },
    { label: 'Beauty Posters', path: '/posters', icon: FileText, badge: 'Visuals' },
    { label: 'Ask Abbas AI', path: '/ai', icon: Bot, badge: '24/7' },
    { label: 'About Abbas', path: '/about', icon: Info },
    { label: 'Contact Us', path: '/contact', icon: Mail },
    { label: 'Help Center & FAQs', path: '/help', icon: HelpCircle },
    { label: 'Privacy Policy', path: '/privacy-policy', icon: FileText },
    { label: 'Medical Disclaimer', path: '/disclaimer', icon: ShieldCheck },
  ];

  // Mobile grouped nested navigation
  const mobileCategoryGroups = [
    {
      id: 'skincare',
      title: 'Skin Care',
      mainPath: '/skin-care',
      icon: Sparkles,
      subtopics: [
        { title: 'Overview & Barrier Health', path: '/skin-care' },
        { title: 'Acne & Blemishes (BHA Guide)', path: '/skin-care/acne-pimples' },
        { title: 'Dark Spots & Melanin Inhibit', path: '/skin-care/dark-spots' },
        { title: 'Two-Finger Sunscreen Rule', path: '/skin-care/sunscreen' },
        { title: 'Evening Double Cleanse', path: '/skin-care/daily-routine' },
        { title: 'Barrier Slugging Protocol', path: '/skin-care/slugging' },
      ],
    },
    {
      id: 'makeup',
      title: 'Makeup',
      mainPath: '/makeup',
      icon: Palette,
      subtopics: [
        { title: 'Makeup Editorial Hub', path: '/makeup' },
        { title: '5-Minute Everyday Beauty', path: '/makeup/everyday-makeup' },
        { title: 'Pre-Makeup Glass Skin Prep', path: '/makeup/glass-skin' },
        { title: 'Velvet Eye Definition', path: '/makeup/eye-makeup' },
        { title: 'Overnight Peptide Lip Plump', path: '/makeup/lip-care' },
      ],
    },
    {
      id: 'haircare',
      title: 'Hair Care',
      mainPath: '/hair-care',
      icon: Scissors,
      subtopics: [
        { title: 'Hair Care Hub', path: '/hair-care' },
        { title: 'Rosemary Scalp Density Tonic', path: '/hair-care/hair-growth' },
        { title: 'Pre-Wash Warm Oil Basting', path: '/hair-care/hair-oil-slugging' },
      ],
    },
    {
      id: 'routines',
      title: 'Beauty Routines',
      mainPath: '/routines',
      icon: CalendarCheck,
      subtopics: [
        { title: 'Regimen Builder & Tracker', path: '/routines' },
        { title: 'Beauty & Skin Journal (30-Day Trends)', path: '/beauty-journal' },
        { title: 'Skin Progress Gallery (Private)', path: '/progress-gallery' },
        { title: 'Morning Radiance Protocol', path: '/skin-care/daily-routine' },
        { title: 'Night Cellular Recovery', path: '/skin-care/retinoid-sandwich' },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Wordmark (Real Link) */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-xl py-1"
          aria-label="Beauty Tips by Abbas Home"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/25 via-rose-600/10 to-amber-500/10 border border-rose-500/30 flex items-center justify-center text-rose-300 group-hover:scale-105 group-hover:border-rose-400 transition-all shadow-sm shadow-rose-950/40">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-white group-hover:text-rose-200 transition-colors leading-tight">
              Beauty Tips <span className="text-rose-400 font-light italic text-lg sm:text-xl">by Abbas</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase font-medium text-stone-400 -mt-0.5 hidden sm:inline">
              Your Personal Skincare & Self-Care Guide
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar (Unified for all screens >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-stone-300" aria-label="Main Navigation">
          {/* 1. Home */}
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl transition-all duration-150 ${
              isActive('/') && location.pathname === '/'
                ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-800/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
            }`}
          >
            Home
          </Link>

          {/* 2. Skincare & Concerns Dropdown */}
          <div className="relative" ref={skincareRef}>
            <button
              onClick={() => {
                setSkincareDropdownOpen(!skincareDropdownOpen);
                setHairMakeupDropdownOpen(false);
                setRoutinesDropdownOpen(false);
                setMoreDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                skincareDropdownOpen || isActive('/skin-care') || isActive('/acne-pimples') || isActive('/dark-spots')
                  ? 'bg-stone-900 text-rose-300 font-semibold border border-stone-800'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
              }`}
              aria-expanded={skincareDropdownOpen}
            >
              <span>Skincare</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${skincareDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {skincareDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-800 mb-1">
                  Skincare & Clinical Concerns
                </div>
                <Link
                  to="/skin-care"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Skincare Overview</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-300">Hub</span>
                </Link>
                <Link
                  to="/acne-pimples"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-amber-400" />
                    <span>Acne & Pimples</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/40">BHA</span>
                </Link>
                <Link
                  to="/dark-spots"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-orange-400" />
                    <span>Dark Spots & Tone</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-950/80 text-orange-300 border border-orange-800/40">Glow</span>
                </Link>
                <Link
                  to="/beauty-tips"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                    <span>All Beauty Tips Library</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300">Archive</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Hair & Makeup Dropdown */}
          <div className="relative" ref={hairMakeupRef}>
            <button
              onClick={() => {
                setHairMakeupDropdownOpen(!hairMakeupDropdownOpen);
                setSkincareDropdownOpen(false);
                setRoutinesDropdownOpen(false);
                setMoreDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                hairMakeupDropdownOpen || isActive('/hair-care') || isActive('/makeup')
                  ? 'bg-stone-900 text-rose-300 font-semibold border border-stone-800'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
              }`}
              aria-expanded={hairMakeupDropdownOpen}
            >
              <span>Hair & Makeup</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${hairMakeupDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {hairMakeupDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-800 mb-1">
                  Haircare & Makeup Guides
                </div>
                <Link
                  to="/hair-care"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hair & Scalp Health</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">Trichology</span>
                </Link>
                <Link
                  to="/makeup"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-pink-400" />
                    <span>Makeup Artistry & Prep</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-950/80 text-pink-300 border border-pink-800/40">Editorial</span>
                </Link>
                <Link
                  to="/hair-care/hair-growth"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-xs pl-6"
                >
                  <span>→ Rosemary Density Tonic</span>
                </Link>
                <Link
                  to="/makeup/everyday-makeup"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-xs pl-6"
                >
                  <span>→ 5-Minute Minimal Complexion</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Routines & AI Dropdown */}
          <div className="relative" ref={routinesRef}>
            <button
              onClick={() => {
                setRoutinesDropdownOpen(!routinesDropdownOpen);
                setSkincareDropdownOpen(false);
                setHairMakeupDropdownOpen(false);
                setMoreDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                routinesDropdownOpen || isActive('/routine-builder') || isActive('/routines') || isActive('/ai')
                  ? 'bg-stone-900 text-rose-300 font-semibold border border-stone-800'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
              }`}
              aria-expanded={routinesDropdownOpen}
            >
              <span>AI & Routines</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${routinesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {routinesDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-800 mb-1">
                  Intelligent Regimens & Diagnostics
                </div>
                <Link
                  to="/routine-builder"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Smart Routine Builder</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40">Gemini</span>
                </Link>
                <Link
                  to="/ai"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ask Abbas AI Advisor</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40">24/7</span>
                </Link>
                <Link
                  to="/skin-analysis"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Skin Diagnostic Matrix</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/40">Diagnostic</span>
                </Link>
                <Link
                  to="/routines"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Beauty Routines Hub</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-300">Regimens</span>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Beauty Journal with Trends badge */}
          <Link
            to="/beauty-journal"
            className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
              isActive('/beauty-journal') || isActive('/journal') || isActive('/skin-journal')
                ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-800/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
            }`}
          >
            <span>Journal</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              Trends
            </span>
          </Link>

          {/* 6. Progress Gallery */}
          <Link
            to="/progress-gallery"
            className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 ${
              isActive('/progress-gallery')
                ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-800/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
            }`}
          >
            <span>Gallery</span>
          </Link>

          {/* 7. More Hubs Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => {
                setMoreDropdownOpen(!moreDropdownOpen);
                setSkincareDropdownOpen(false);
                setHairMakeupDropdownOpen(false);
                setRoutinesDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                moreDropdownOpen
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
              }`}
              aria-expanded={moreDropdownOpen}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-800 mb-1">
                  Guides & Community Hubs
                </div>
                {moreLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40 font-medium">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Quick Search, Saved Articles, Dark Mode & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-rose-500/40 text-stone-300 hover:text-white text-xs transition-all cursor-pointer"
            title="Search all beauty tips (Ctrl+K)"
            aria-label="Search all beauty tips"
          >
            <Search className="w-4 h-4 text-rose-400" />
            <span className="hidden md:inline text-stone-400">Search tips...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-stone-800 rounded text-stone-400 border border-stone-700">
              ⌘K
            </kbd>
          </button>

          {/* Daily Reading Streak Flame Indicator */}
          <button
            onClick={onOpenAchievements}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              streakCount > 0
                ? streakHasReadToday
                  ? 'bg-gradient-to-r from-orange-950/70 to-amber-950/70 border-orange-500/50 text-orange-300 shadow-sm shadow-orange-950/50 ring-1 ring-orange-500/20'
                  : 'bg-stone-900 border-stone-800 text-orange-400/90 hover:border-orange-500/40 hover:text-orange-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
            }`}
            title={
              streakCount > 0
                ? `${streakCount}-day beauty reading streak! ${streakHasReadToday ? '(Completed today)' : '(Read 1 tip today to maintain)'}. Click to view achievements.`
                : 'Start your daily beauty reading streak! Click to view milestones.'
            }
            aria-label={`Daily reading streak: ${streakCount} days. Open milestones.`}
          >
            <Flame
              className={`w-4 h-4 transition-transform ${
                streakCount > 0
                  ? 'text-orange-400 fill-orange-500/40 animate-pulse'
                  : 'text-stone-500'
              }`}
            />
            <span className="text-xs font-bold text-stone-100">
              {streakCount}
            </span>
          </button>

          {/* Recent History Button */}
          <button
            onClick={onOpenHistory}
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
              isActive('/history')
                ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
            }`}
            title="Recently Visited Articles"
            aria-label={`Recently Visited Articles (${historyCount})`}
          >
            <History className="w-4 h-4 text-rose-400" />
            {historyCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-4.5 h-4.5 rounded-full bg-stone-800 border border-stone-700 text-[10px] font-bold text-rose-300 flex items-center justify-center shadow-md animate-in zoom-in-75">
                {historyCount}
              </span>
            )}
          </button>

          {/* Saved Articles Real Link */}
          <Link
            to="/saved"
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
              isActive('/saved')
                ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
            }`}
            title="View Saved Articles"
            aria-label={`View Saved Articles (${favoritesCount})`}
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-4.5 h-4.5 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center shadow-md animate-in zoom-in-75">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-rose-300" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu - Structured with Grouped Categories First */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950/98 max-h-[85vh] overflow-y-auto px-4 py-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
          {/* Daily Streak & Milestones Bar */}
          <div className="rounded-2xl border border-stone-850 bg-stone-900/60 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Flame className={`w-4.5 h-4.5 ${streakCount > 0 ? 'fill-orange-500/30 animate-pulse' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-200 block">
                  {streakCount} Day Daily Reading Streak
                </span>
                <span className="text-[10px] text-stone-400">
                  {streakHasReadToday ? '✓ Read today' : 'Read 1 tip today to maintain flame'}
                </span>
              </div>
            </div>
            {onOpenAchievements && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAchievements();
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
              >
                Badges
              </button>
            )}
          </div>

          {/* Recent History Quick Access in Sidebar / Drawer */}
          {recentHistory.length > 0 && (
            <div className="rounded-2xl border border-stone-850 bg-stone-900/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent History ({recentHistory.length})</span>
                </div>
                {onClearHistory && (
                  <button
                    onClick={onClearHistory}
                    className="text-[10px] text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {recentHistory.slice(0, 3).map((item) => (
                  <Link
                    key={item.tipId}
                    to={`/beauty-tips/${item.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-stone-850 transition-colors group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-stone-800"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-stone-200 group-hover:text-rose-200 truncate font-medium">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-stone-400" />
                        <span>{formatRelativeTime(item.visitedAt)}</span>
                        <span>· {item.categoryLabel}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-stone-850/60 text-xs">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenHistory) onOpenHistory();
                  }}
                  className="text-rose-400 hover:text-rose-300 font-medium text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Open History Drawer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-stone-400 hover:text-stone-200 text-[11px]"
                >
                  Full History
                </Link>
              </div>
            </div>
          )}

          {/* 1. Main Navigation Categories (Expandable Nested Submenus) */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 px-3 mb-1">
              Main Categories & Topics
            </div>

            {/* Home link */}
            <Link
              to="/"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                location.pathname === '/'
                  ? 'bg-rose-950/70 text-rose-300 font-semibold border border-rose-800/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900'
              }`}
            >
              <span>Home</span>
              {location.pathname === '/' && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
            </Link>

            {/* All Beauty Tips */}
            <Link
              to="/beauty-tips"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                location.pathname === '/beauty-tips'
                  ? 'bg-rose-950/70 text-rose-300 font-semibold border border-rose-800/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900'
              }`}
            >
              <span>All Beauty Tips (Archive)</span>
              {location.pathname === '/beauty-tips' && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
            </Link>

            {/* Expandable Category Groups */}
            {mobileCategoryGroups.map((group) => {
              const isExpanded = expandedMobileCategories[group.id];
              const Icon = group.icon;
              const isGroupActive = isActive(group.mainPath);

              return (
                <div key={group.id} className="rounded-2xl border border-stone-850 bg-stone-900/40 overflow-hidden">
                  <div className="flex items-center justify-between p-2">
                    <Link
                      to={group.mainPath}
                      className={`flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium transition-colors ${
                        isGroupActive ? 'text-rose-300 font-semibold' : 'text-stone-200 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{group.title}</span>
                    </Link>

                    <button
                      onClick={() => toggleMobileCategory(group.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-300 hover:bg-stone-850 transition-colors cursor-pointer"
                      aria-label={`Toggle ${group.title} subtopics`}
                      aria-expanded={isExpanded}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-rose-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Nested Subtopics */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 space-y-1 border-t border-stone-800/60 bg-stone-950/50">
                      {group.subtopics.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
                        >
                          <ChevronRight className="w-3 h-3 text-rose-400/80 shrink-0" />
                          <span>{sub.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct Concern Links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/acne-pimples"
                className={`p-3 rounded-xl border text-xs font-medium text-center transition-colors ${
                  isActive('/acne-pimples')
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                Acne & Pimples →
              </Link>
              <Link
                to="/dark-spots"
                className={`p-3 rounded-xl border text-xs font-medium text-center transition-colors ${
                  isActive('/dark-spots')
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                Dark Spots →
              </Link>
            </div>
          </div>

          {/* 2. Dedicated Hubs & Interactive Consultations */}
          <div className="space-y-1 border-t border-stone-800/80 pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 px-3 mb-2">
              Interactive Tools & AI Hubs
            </div>
            {moreLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-rose-950/70 text-rose-300 font-semibold border border-rose-800/40'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/40 font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 3. Footer info */}
          <div className="border-t border-stone-800/80 pt-4 flex items-center justify-between px-3 text-xs text-stone-400">
            <span>© {new Date().getFullYear()} Beauty Tips by Abbas</span>
            <Link to="/saved" className="text-rose-400 font-medium hover:underline">
              Saved Articles ({favoritesCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
