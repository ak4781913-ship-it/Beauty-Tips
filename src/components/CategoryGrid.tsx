import React from 'react';
import {
  Sparkles,
  Scissors,
  Palette,
  Leaf,
  Sun,
  Droplets,
  Heart,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { CategoryId } from '../types';

interface CategoryGridProps {
  onSelectCategory: (catId: CategoryId) => void;
}

interface CategoryCardItem {
  id: CategoryId;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  badge: string;
}

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: 'skin-care',
    title: 'Skin Care',
    tagline: 'Barrier Health & Clinical Hydration',
    description: 'Protect your acid mantle, lock in hydration with ceramides, and restore luminous skin resilience.',
    icon: Sparkles,
    accentColor: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
    badge: 'Core Ritual',
  },
  {
    id: 'hair-care',
    title: 'Hair Care',
    tagline: 'Scalp Vitality & Strand Density',
    description: 'Root-to-tip trichology principles, botanical oils, anti-breakage protocols, and frizz control.',
    icon: Scissors,
    accentColor: 'from-amber-500/20 to-rose-500/10 text-amber-400 border-amber-500/30',
    badge: 'Trichology',
  },
  {
    id: 'makeup',
    title: 'Makeup',
    tagline: 'Skin-First Prep & Seamless Complexions',
    description: 'Flawless skin preparation, non-cakey foundation techniques, and soft radiant makeup finishes.',
    icon: Palette,
    accentColor: 'from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/30',
    badge: 'Artistry',
  },
  {
    id: 'natural-remedies',
    title: 'Natural Remedies',
    tagline: 'Kitchen Wisdom & Herbal Infusions',
    description: 'Gentle, food-grade botanical masks, honey-oat compresses, and restorative floral waters.',
    icon: Leaf,
    accentColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    badge: 'Botanical',
  },
  {
    id: 'face-glow',
    title: 'Face Care',
    tagline: 'Facial Sculpting & Contour Rituals',
    description: 'Lymphatic drainage massage, delicate eye contour brightening, and non-invasive de-puffing.',
    icon: Sun,
    accentColor: 'from-rose-500/20 to-amber-500/10 text-rose-300 border-rose-500/30',
    badge: 'Sculpt & Glow',
  },
  {
    id: 'skin-care',
    title: 'Body Care',
    tagline: 'Full-Body Ceramide Replenishment',
    description: 'Keratosis pilaris smoothing, dry brushing protocols, and all-day skin barrier replenishment.',
    icon: Droplets,
    accentColor: 'from-sky-500/20 to-indigo-500/10 text-sky-400 border-sky-500/30',
    badge: 'Hydration',
  },
  {
    id: 'self-care',
    title: 'Nail Care',
    tagline: 'Keratin Strength & Cuticle Nutrition',
    description: 'Natural nail bed reinforcement, botanical cuticle conditioning, and non-damaging manicures.',
    icon: Heart,
    accentColor: 'from-rose-500/20 to-purple-500/10 text-rose-300 border-rose-500/30',
    badge: 'Nail Bed',
  },
  {
    id: 'skin-care',
    title: "Men's Grooming",
    tagline: 'Streamlined Skincare & Beard Discipline',
    description: 'Effortless 3-step protocols, razor bump defense, sebum balancing, and matte sun protection.',
    icon: Flame,
    accentColor: 'from-amber-600/20 to-stone-600/10 text-amber-300 border-amber-500/30',
    badge: 'Daily Discipline',
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section id="categories" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 mb-3 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/40">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Bespoke Beauty Sanctuary</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 tracking-tight">
          Explore Your <span className="italic font-light text-rose-300">Beauty World</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
          Select a dedicated domain below to explore verified step-by-step rituals, scientifically grounded guidance, and holistic self-care disciplines curated by Abbas.
        </p>
      </div>

      {/* 8 Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {CATEGORY_CARDS.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={`${cat.title}-${idx}`}
              className="group relative flex flex-col justify-between bg-stone-900/80 hover:bg-stone-900 border border-stone-800 hover:border-rose-500/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/30 hover:-translate-y-1"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cat.accentColor} border shadow-inner transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-rose-300 bg-rose-950/60 border border-rose-900/40 px-2.5 py-1 rounded-full">
                    {cat.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-100 group-hover:text-rose-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs font-semibold text-rose-400/90 mt-1 uppercase tracking-wider">
                  {cat.tagline}
                </p>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Working Explore Action Link */}
              <div className="mt-6 pt-4 border-t border-stone-800/80">
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full inline-flex items-center justify-between text-xs font-medium text-stone-300 group-hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <span>Explore {cat.title}</span>
                  <div className="w-7 h-7 rounded-full bg-stone-800 group-hover:bg-rose-900/60 flex items-center justify-center transition-all group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-rose-200" />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
