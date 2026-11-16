import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Sparkles, ArrowRight, Droplets, Heart, Check, Clock } from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { TipCard } from '../components/TipCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';

interface HairCarePageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const HairCarePage: React.FC<HairCarePageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
}) => {
  useEffect(() => {
    document.title = 'Hair Care & Scalp Health | Beauty Tips by Abbas';
  }, []);

  const hairTips = BEAUTY_TIPS.filter(
    (t) =>
      t.category === 'hair-care' ||
      t.concerns.includes('Hair Fall') ||
      t.concerns.includes('Dry Hair') ||
      t.concerns.includes('Damaged Hair') ||
      t.concerns.includes('Frizz')
  );

  const scalpPractices = [
    {
      title: '1. Scalp Microcirculation',
      description: 'Gentle circular fingertip massage for 4 minutes daily increases blood flow to dermal papilla cells, supplying vital micronutrients.',
    },
    {
      title: '2. Botanical Infusions',
      description: 'Rosemary water and gentle botanical waters deliver natural ursolic acid to invigorate hair roots without greasy heaviness.',
    },
    {
      title: '3. Pre-Wash Oiling',
      description: 'Coating mid-lengths with light argan or jojoba oil before shampooing prevents hygral fatigue and strand cuticle swelling.',
    },
    {
      title: '4. Heat & Friction Shield',
      description: 'Switching to a silk pillowcase and micro-fiber towel dramatically minimizes mechanical breakage while sleeping and drying.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Hair Care & Scalp Health', active: true }]} />

      {/* Category Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/30 via-stone-900 to-stone-900 border border-emerald-900/40 p-8 sm:p-12 space-y-5 overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-3 py-1 rounded-full">
          <Scissors className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trichology & Strand Wellness</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 leading-tight">
          Hair Care, Scalp Health & Density
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed">
          Strong, lustrous hair originates from a nourished scalp microbiome. Explore trichology principles, botanical hair waters, breakage prevention, and restorative hair oils.
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <Link
            to="/hair-care/hair-growth"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-emerald-300 transition-colors"
          >
            Rosemary Scalp Tonic →
          </Link>
          <Link
            to="/hair-care/hair-oil-slugging"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-emerald-300 transition-colors"
          >
            Pre-Wash Oil Basting →
          </Link>
          <Link
            to="/routines"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-emerald-300 transition-colors"
          >
            Weekly Routine Checklist →
          </Link>
        </div>
      </div>

      {/* 4 Essential Scalp Habits */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-medium text-stone-100">
          The 4 Pillars of Root-to-Tip Density
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scalpPractices.map((prac, i) => (
            <div key={i} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
              <h3 className="font-serif text-lg text-emerald-300 font-medium">{prac.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{prac.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <div className="w-full flex justify-center py-2">
        <AdsterraBanner type="728x90" />
      </div>

      {/* Relevant Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Hair Care Articles & Rituals
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Showing {hairTips.length} educational hair guides
            </p>
          </div>
          <Link
            to="/beauty-tips"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {hairTips.map((tip) => (
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
    </div>
  );
};
