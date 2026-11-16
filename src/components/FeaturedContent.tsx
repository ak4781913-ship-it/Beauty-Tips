import React from 'react';
import { Sparkles, Bookmark, Clock, ArrowRight, Eye } from 'lucide-react';
import { BeautyTip } from '../types';
import { calculateReadTime } from '../utils/readTime';
import { getTipSlug } from '../utils/slug';
import { Link } from 'react-router-dom';
import heroImage from '../assets/images/hero_beauty_skincare_elegance_1791268845073.jpg';
import botanicalsImage from '../assets/images/natural_remedies_botanicals_1791268857904.jpg';
import routineImage from '../assets/images/routine_skincare_ritual_1791268873835.jpg';
import serumsImage from '../assets/images/beauty_serums_bottles_1791268884613.jpg';

interface FeaturedContentProps {
  tips: BeautyTip[];
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onOpenDetail: (tip: BeautyTip) => void;
}

const FEATURED_IMAGES: Record<string, string> = {
  'tip-double-cleanse-clarity': heroImage,
  'tip-ceramide-barrier-shield': routineImage,
  'tip-vitamin-c-glow': serumsImage,
  'tip-rosemary-scalp-growth': botanicalsImage,
  'tip-salicylic-pore-clear': serumsImage,
  'tip-aloe-soothing-compress': botanicalsImage,
};

export const FeaturedContent: React.FC<FeaturedContentProps> = ({
  tips,
  favorites,
  onToggleFavorite,
  onOpenDetail,
}) => {
  // Select top curated essentials from existing library
  const featuredTips = tips.filter((t) => t.isPopular).slice(0, 4);

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Masterclass Formulations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 tracking-tight">
            Beauty Essentials, <span className="italic font-light text-rose-300">Curated for You</span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-stone-300 max-w-xl font-normal">
            Signature rituals hand-selected for high efficacy, barrier tolerance, and transformative daily consistency.
          </p>
        </div>

        <Link
          to="/beauty-tips"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors group cursor-pointer self-start md:self-auto"
        >
          <span>View Complete Library</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Editorial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {featuredTips.map((tip) => {
          const isFav = favorites.includes(tip.id);
          const readTime = calculateReadTime(tip);
          const coverImg = FEATURED_IMAGES[tip.id] || heroImage;

          const tipSlug = getTipSlug(tip);

          return (
            <article
              key={tip.id}
              className="group flex flex-col justify-between bg-stone-900/90 rounded-3xl border border-stone-800 hover:border-rose-500/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Visual Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-800">
                  <img
                    src={coverImg}
                    alt={tip.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />

                  {/* Category Pill */}
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-stone-950/80 text-rose-200 backdrop-blur-md border border-rose-500/30">
                    {tip.categoryLabel}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onToggleFavorite(tip.id)}
                    aria-label={isFav ? 'Remove from saved tips' : 'Save tip to vault'}
                    className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFav
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-stone-950/70 text-stone-300 hover:text-white hover:bg-stone-900 border border-stone-700/60'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  {/* Reading Time */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>{readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>By Abbas</span>
                  </div>

                  <Link to={`/beauty-tips/${tipSlug}`} className="block focus:outline-none">
                    <h3 className="font-serif text-xl font-medium text-stone-100 group-hover:text-rose-300 transition-colors leading-snug line-clamp-2">
                      {tip.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
                    {tip.shortExplanation}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 sm:p-6 pt-0">
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
  );
};
