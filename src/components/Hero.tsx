import React from 'react';
import { Search, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Droplet, Sparkle, Compass, Sparkles as SparklesIcon } from 'lucide-react';
import heroImage from '../assets/images/hero_beauty_skincare_elegance_1791268845073.jpg';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSelectCategory: (catId: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  onOpenSearchFocus: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  searchInputRef,
  onOpenSearchFocus,
}) => {
  const trendingSearches = [
    { label: 'Dry Skin', cat: 'dry-skin' },
    { label: 'Acne & Pimples', cat: 'acne-pimples' },
    { label: 'Dark Spots', cat: 'dark-spots' },
    { label: 'Hair Fall', cat: 'hair-care' },
    { label: 'Morning Glow', cat: 'face-glow' },
    { label: 'Natural Remedies', cat: 'natural-remedies' },
  ];

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient luxury blush glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-950/25 via-stone-900/15 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Copy, CTAs & Search */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed editorial kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Your Personal Guide to Better Skin, Beauty & Self-Care</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-100 font-normal leading-[1.12] tracking-tight">
              Discover Your Best <br className="hidden sm:inline" />
              <span className="italic font-light text-rose-300">Beauty Routine</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 max-w-xl font-normal leading-relaxed">
              Explore science-backed skincare wisdom, natural kitchen remedies, hair wellness rituals, and professional makeup techniques designed to honor and protect your natural beauty.
            </p>

            {/* Two Clear Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => handleScrollTo('categories')}
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore Beauty Tips</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => handleScrollTo('routine-builder')}
                className="px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-rose-500/50 text-stone-200 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Create My Beauty Routine</span>
              </button>
            </div>

            {/* Prominent Search Bar */}
            <form onSubmit={onSearchSubmit} className="relative max-w-xl mt-4">
              <div className="relative flex items-center shadow-2xl shadow-rose-950/30 rounded-2xl bg-stone-900/90 border border-stone-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-950/60 p-1.5 transition-all">
                <Search className="w-5 h-5 text-rose-400 ml-3.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search your beauty concern... (e.g. dry skin, acne, ceramides)"
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

            {/* Quick trending suggestions */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-medium text-stone-400">Popular concerns:</span>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onSelectCategory(item.cat)}
                    className="px-3 py-1 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-200 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust points */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-stone-800/80 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Barrier-First Philosophy</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-rose-400 shrink-0" />
                <span>No Miracle Claims</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Free Advice</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
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
  );
};
