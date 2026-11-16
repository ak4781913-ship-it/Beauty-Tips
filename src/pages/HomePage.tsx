import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  CalendarCheck,
  Zap,
  FlaskConical,
  FileText,
  ShieldCheck,
  Scissors,
  Droplet,
  Heart,
  Droplets,
  Clock,
  Bookmark,
  Eye,
  Camera,
  CheckCircle2,
  Bot,
  Palette,
  History,
  Layers,
} from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { BeautyTip } from '../types';
import { getTipSlug } from '../utils/slug';
import { calculateReadTime } from '../utils/readTime';
import { TipCard } from '../components/TipCard';
import { PromoBannerSlider } from '../components/PromoBannerSlider';
import { WeeklyReadingGoal } from '../components/WeeklyReadingGoal';
import { DailyBeautyQuiz } from '../components/DailyBeautyQuiz';
import { DailyBeautyPoll } from '../components/DailyBeautyPoll';
import { DailyBeautyAffirmation } from '../components/DailyBeautyAffirmation';
import { DailyBeautyJournal } from '../components/DailyBeautyJournal';
import { RoutineBuilder } from '../components/RoutineBuilder';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { SmartlinkCard } from '../components/ads/SmartlinkPromo';

import heroImage from '../assets/images/hero_beauty_skincare_elegance_1791268845073.jpg';
import botanicalsImage from '../assets/images/natural_remedies_botanicals_1791268857904.jpg';
import routineImage from '../assets/images/routine_skincare_ritual_1791268873835.jpg';
import serumsImage from '../assets/images/beauty_serums_bottles_1791268884613.jpg';

const FEATURED_COVERS: Record<string, string> = {
  'tip-double-cleanse-clarity': heroImage,
  'tip-ceramide-barrier-shield': routineImage,
  'tip-vitamin-c-glow': serumsImage,
  'tip-rosemary-scalp-growth': botanicalsImage,
  'tip-salicylic-pore-clear': serumsImage,
  'tip-aloe-soothing-compress': botanicalsImage,
};

interface HomePageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  onOpenAchievements?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
  onOpenAchievements,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/beauty-tips?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/beauty-tips');
    }
  };

  // Curated lists
  const featuredTips = BEAUTY_TIPS.filter((t) => t.isPopular).slice(0, 4);
  const popularTips = BEAUTY_TIPS.slice(4, 7);
  const recentTips = BEAUTY_TIPS.slice(7, 10);

  const categoryCards = [
    {
      title: 'Skin Care Solutions',
      description: 'Strengthen the barrier, restore hydration, and balance pH naturally.',
      path: '/skin-care',
      icon: Sparkles,
      color: 'from-rose-500/20 to-rose-600/5',
      badge: 'Core Hub',
    },
    {
      title: 'Makeup Artistry',
      description: 'Skin-first prep, minimalist complexion, and velvet definition.',
      path: '/makeup',
      icon: Sparkles,
      color: 'from-pink-500/20 to-rose-600/5',
      badge: 'Editorial',
    },
    {
      title: 'Acne & Pimples',
      description: 'Targeted unclogging, soothing active breakouts, and post-blemish care.',
      path: '/acne-pimples',
      icon: Droplets,
      color: 'from-amber-500/20 to-rose-600/5',
      badge: 'Clarifying',
    },
    {
      title: 'Dark Spots & Tone',
      description: 'Tyrosinase inhibition, vitamin C brightening, and daily UV protection.',
      path: '/dark-spots',
      icon: Droplet,
      color: 'from-orange-500/20 to-amber-600/5',
      badge: 'Radiance',
    },
    {
      title: 'Hair & Scalp Health',
      description: 'Scalp microcirculation, rosemary infusions, and breakage prevention.',
      path: '/hair-care',
      icon: Scissors,
      color: 'from-emerald-500/20 to-teal-600/5',
      badge: 'Trichology',
    },
    {
      title: 'Beauty Routines',
      description: 'Interactive AM/PM regimens, daily checklist tracker, and scheduler.',
      path: '/routines',
      icon: CalendarCheck,
      color: 'from-purple-500/20 to-rose-600/5',
      badge: 'Interactive',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 animate-in fade-in duration-200">
      {/* 0. First-Party Custom Promotional Image Banner Slider */}
      <PromoBannerSlider />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-2 pb-12 sm:pt-4 sm:pb-16">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-950/25 via-stone-900/10 to-transparent pointer-events-none blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Your Personal Guide to Better Skin, Beauty & Self-Care</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-100 font-normal leading-[1.12] tracking-tight">
                Discover Your Best <br className="hidden sm:inline" />
                <span className="italic font-light text-rose-300">Beauty Routine</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-xl font-normal leading-relaxed">
                Explore science-backed skincare wisdom, natural home rituals, hair wellness guides, and professional ingredient insights designed to honor and protect your natural beauty.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/beauty-tips"
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center gap-2 group"
                >
                  <span>Explore All Beauty Tips</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#routine-builder"
                  className="px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-rose-500/50 text-stone-200 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-rose-400" />
                  <span>Build Daily Routine</span>
                </a>
              </div>

              {/* Prominent Search Bar */}
              <form onSubmit={handleHeroSearchSubmit} className="relative max-w-xl mt-4">
                <div className="relative flex items-center shadow-2xl shadow-rose-950/30 rounded-2xl bg-stone-900/90 border border-stone-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-950/60 p-1.5 transition-all">
                  <Search className="w-5 h-5 text-rose-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search beauty concerns... (e.g. dry skin, acne, vitamin c, rosemary)"
                    className="w-full py-2.5 px-3 text-xs sm:text-sm bg-transparent text-stone-100 placeholder:text-stone-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Trending Quick Links */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="font-medium text-stone-400">Popular Categories:</span>
                <div className="flex flex-wrap gap-2">
                  <Link to="/skin-care" className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-200 transition-colors">
                    Skin Care
                  </Link>
                  <Link to="/makeup" className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-200 transition-colors">
                    Makeup
                  </Link>
                  <Link to="/acne-pimples" className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-200 transition-colors">
                    Acne & Pimples
                  </Link>
                  <Link to="/dark-spots" className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-200 transition-colors">
                    Dark Spots
                  </Link>
                  <Link to="/hair-care" className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-200 transition-colors">
                    Hair Care
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/40 border border-stone-800 bg-stone-900 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={heroImage}
                  alt="Minimalist luxury beauty and skincare bottles with delicate rose petals"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-stone-100">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-rose-300">The Golden Skincare Rule</p>
                  <p className="font-serif text-lg sm:text-xl font-medium mt-1 leading-snug text-white">
                    “Consistency outshines complexity. Cleanse gently, hydrate deeply, and shield with SPF.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ask Abbas AI Beauty Assistant Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-rose-950/40 to-stone-900 border border-stone-800 p-6 sm:p-9 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-300 bg-rose-950/80 border border-rose-800/60 px-3.5 py-1.5 rounded-full">
                <Bot className="w-4 h-4 text-rose-400" />
                <span>AI Beauty Advisor & Formulator</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-100 font-normal leading-tight">
                Ask Abbas: <span className="italic font-light text-rose-300">Intelligent Beauty Guidance</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Evidence-informed cosmetic chemistry, barrier recovery rituals, trichology hair wellness, and active ingredient clash warnings available 24/7.
              </p>

              {/* Quick Consultation Prompt Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'How to heal a damaged skin barrier?',
                  'Can I mix Salicylic Acid with Retinol?',
                  'Best rosemary scalp ritual for hair density?',
                  'How to prevent sunscreen pilling?',
                ].map((promptText, i) => (
                  <Link
                    key={i}
                    to="/ai"
                    className="text-xs px-3 py-1.5 rounded-xl bg-stone-950/80 hover:bg-rose-950/60 border border-stone-800 hover:border-rose-500/40 text-stone-300 hover:text-rose-200 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{promptText}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <Link
                to="/ai"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Start AI Consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Skin Concerns & Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
              Explore by Focus Area
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100 mt-1">
              Skin Concerns & Categories
            </h2>
          </div>
          <Link
            to="/beauty-tips"
            className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.path}
                to={cat.path}
                className="group p-6 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-rose-500/50 hover:bg-stone-850 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:bg-rose-500/20 group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-stone-100 group-hover:text-rose-200 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-rose-300">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Smart Routine Builder (Interactive with AM/PM Checklist) */}
      <section id="routine-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Gemini AI Formulation Engine</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100">
              Personalized Skincare Routine Builder
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Tell Abbas your skin type and primary concerns to generate an AI-formulated Morning (AM) and Evening (PM) ritual tailored to your acid mantle and barrier needs, complete with an interactive daily checklist.
            </p>
          </div>
          <Link
            to="/beauty-routines"
            className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Regimen Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <RoutineBuilder onShowToast={onShowToast} />
      </section>

      {/* 5. Daily Beauty Tip / Masterclass Formulations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
              Masterclass Formulations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100 mt-1">
              Featured Beauty Tips
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Hand-selected signature rituals for high efficacy and barrier preservation.
            </p>
          </div>
          <Link
            to="/beauty-tips"
            className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Complete Library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTips.map((tip) => {
            const isFav = favorites.includes(tip.id);
            const readTime = calculateReadTime(tip);
            const coverImg = FEATURED_COVERS[tip.id] || heroImage;
            const tipSlug = getTipSlug(tip);

            return (
              <article
                key={tip.id}
                className="group flex flex-col justify-between bg-stone-900/90 rounded-3xl border border-stone-800 hover:border-rose-500/40 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-800">
                    <img
                      src={coverImg}
                      alt={tip.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-stone-950/80 text-rose-200 backdrop-blur-md border border-rose-500/30">
                      {tip.categoryLabel}
                    </span>
                    <button
                      onClick={() => onToggleFavorite(tip.id)}
                      aria-label="Save tip"
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isFav
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-stone-950/70 text-stone-300 hover:text-white hover:bg-stone-900 border border-stone-700/60'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>{readTime}</span>
                      <span>·</span>
                      <span>By Abbas</span>
                    </div>

                    <Link to={`/beauty-tips/${tipSlug}`} className="block focus:outline-none">
                      <h3 className="font-serif text-lg font-medium text-stone-100 group-hover:text-rose-300 transition-colors leading-snug line-clamp-2">
                        {tip.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                      {tip.shortExplanation}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/beauty-tips/${tipSlug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-rose-900/60 border border-stone-700/80 hover:border-rose-500/50 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-rose-400" />
                    <span>Read Full Guide</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. Popular Beauty Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
              Community Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100 mt-1">
              Popular Beauty Articles
            </h2>
          </div>
          <Link
            to="/beauty-tips"
            className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <span>See more</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              isFavorite={favorites.includes(tip.id)}
              onToggleFavorite={onToggleFavorite}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      </section>

      {/* 7. Ingredients Matrix Guide Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-7 sm:p-9 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-900/40 px-3.5 py-1.5 rounded-full">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cosmetic Chemistry Guide</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal">
              Ingredients Guide & Compatibility Matrix
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Master the exact science behind your skincare bottle: Learn optimal pH levels, molecular weights, and safe pairings for Ceramides, BHA, Niacinamide, Vitamin C, and Retinoids.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Ceramides NP', 'Salicylic Acid 2%', 'Niacinamide 5%', 'Centella Asiatica', 'Hyaluronic Acid'].map((ing, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 font-mono">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link
              to="/ingredients"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-100 hover:text-white border border-stone-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span>Explore Ingredients Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Haircare & Makeup Spotlight Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Haircare Card */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-stone-900 via-emerald-950/20 to-stone-900 border border-stone-800 flex flex-col justify-between space-y-4 shadow-lg">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-stone-100 font-medium">Hair & Scalp Trichology</h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
                Stimulate follicular microcirculation with warm rosemary oil basting, clarify the scalp with gentle BHAs, and prevent friction breakage with mulberry silk sleep rituals.
              </p>
            </div>
            <Link
              to="/hair-care"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-2"
            >
              <span>Explore Hair Care Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Makeup Card */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-stone-900 via-pink-950/20 to-stone-900 border border-stone-800 flex flex-col justify-between space-y-4 shadow-lg">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-stone-100 font-medium">Skin-First Makeup Artistry</h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
                Create luminous glass-skin prep, master the 5-minute everyday minimal complexion, and lock in velvet hydration without clogging active blemish pores.
              </p>
            </div>
            <Link
              to="/makeup"
              className="inline-flex items-center gap-2 text-xs font-semibold text-pink-400 hover:text-pink-300 pt-2"
            >
              <span>Explore Makeup Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Professional Treatments Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-7 sm:p-9 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-900/40 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>In-Clinic Procedures</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-medium">
              Professional Treatments Guide
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Unbiased dermatological advice on Chemical Peels, Microneedling, Hydrafacials, and LED phototherapy. Understand expected downtime, pre-procedure prep, and post-treatment recovery.
            </p>
          </div>

          <Link
            to="/treatments"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white border border-stone-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>View In-Clinic Treatments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. Daily Beauty & Skin Journal with Recharts 30-Day Trends */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DailyBeautyJournal onShowToast={onShowToast} />
      </div>

      {/* 11. Private Skin Journey Progress Gallery Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-rose-950/30 to-stone-900 border border-stone-800 p-7 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% On-Device & Private</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
              Track Your Skin Journey with Photos
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-light leading-relaxed">
              Capture private camera snapshots directly with your device. Align with our built-in face framing guide, compare before-and-after results with our interactive split slider, and monitor your barrier recovery over time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
            <Link
              to="/progress-gallery"
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Camera className="w-4 h-4 text-rose-200" />
              <span>Open Progress Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Saved Favorites & Recently Visited Access Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-stone-900/70 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-100">
                You have {favorites.length} saved article{favorites.length === 1 ? '' : 's'} in your personal vault
              </p>
              <p className="text-xs text-stone-400">Quickly revisit your bookmarked formulations and reading history</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/saved"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold text-center transition-colors"
            >
              View Saved ({favorites.length})
            </Link>
            <Link
              to="/history"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-rose-400" />
              <span>History</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 13. Daily Engagement & Community Widgets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <DailyBeautyAffirmation onShowToast={onShowToast} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeeklyReadingGoal
            onShowToast={onShowToast}
            onOpenAchievements={onOpenAchievements}
          />
          <DailyBeautyPoll onShowToast={onShowToast} />
        </div>
        <DailyBeautyQuiz
          onShowToast={onShowToast}
          onOpenAchievements={onOpenAchievements}
        />
      </div>

      {/* 14. Partner Highlights & Sponsor Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
