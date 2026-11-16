import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Sun, ShieldCheck, Droplet, Clock, Check } from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { TipCard } from '../components/TipCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';

interface DarkSpotsPageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const DarkSpotsPage: React.FC<DarkSpotsPageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
}) => {
  useEffect(() => {
    document.title = 'Dark Spots & Pigmentation Education | Beauty Tips by Abbas';
  }, []);

  const darkSpotTips = BEAUTY_TIPS.filter(
    (t) =>
      t.category === 'dark-spots' ||
      t.concerns.includes('Dark Spots') ||
      t.concerns.includes('Uneven Skin Tone') ||
      t.concerns.includes('Dull Skin')
  );

  const brighteningActives = [
    {
      name: 'Vitamin C (L-Ascorbic Acid)',
      role: 'Antioxidant & Tyrosinase Inhibitor',
      detail: 'Neutralizes free radical damage while downregulating excess melanin synthesis for radiant clarity.',
    },
    {
      name: 'Alpha Arbutin (2%)',
      role: 'Gentle Hydroquinone Derivative',
      detail: 'Slowly releases hydroquinone naturally, fading stubborn brown spots without risk of paradox ochronosis.',
    },
    {
      name: 'Tranexamic Acid (3–5%)',
      role: 'Plasmin Inhibitor for Melasma',
      detail: 'Interrupts the inflammatory cascade between keratinocytes and melanocytes caused by heat and UV.',
    },
    {
      name: 'Broad-Spectrum SPF50+',
      role: 'Non-Negotiable Shield',
      detail: 'UV rays stimulate melanocyte receptors in under 60 seconds; daily sunscreen prevents spots from darkening.',
    },
  ];

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Skincare', path: '/skin-care' },
          { label: 'Dark Spots & Pigmentation', active: true },
        ]}
      />

      {/* Category Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-950/30 via-stone-900 to-stone-900 border border-orange-900/40 p-8 sm:p-12 space-y-5 overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-orange-400 bg-orange-950/60 border border-orange-900/40 px-3 py-1 rounded-full">
          <Sun className="w-3.5 h-3.5 text-orange-400" />
          <span>Pigmentation & Tone Correction</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 leading-tight">
          Dark Spots, Hyperpigmentation & Glow
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed">
          Hyperpigmentation develops when overstimulated melanocytes deposit excess pigment into epidermal and dermal layers. Fading dark spots requires patience, barrier tolerance, and non-negotiable daily sun defense.
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <Link
            to="/skincare"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-orange-300 transition-colors"
          >
            ← Skincare Overview
          </Link>
          <Link
            to="/acne-pimples"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-orange-300 transition-colors"
          >
            Acne & Blemishes →
          </Link>
        </div>
      </div>

      {/* Tyrosinase Pathway Actives */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-medium text-stone-100">
          Proven Brightening & Pigment Inhibitors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brighteningActives.map((act, i) => (
            <div key={i} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-orange-400">
                {act.role}
              </span>
              <h3 className="font-serif text-lg text-stone-100 font-medium">{act.name}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{act.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <div className="w-full flex justify-center py-2">
        <AdsterraBanner type="728x90" />
      </div>

      {/* Fading Timeline Expectations */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400">
          <Clock className="w-4 h-4 text-rose-400" />
          <span>Realistic Skin Biology Timeline</span>
        </div>
        <h3 className="font-serif text-2xl text-stone-100 font-normal">
          How Long Does Fading Actually Take?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm text-stone-300">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
            <h4 className="font-semibold text-stone-100 text-sm">Weeks 1 – 4: Cellular Prep</h4>
            <p className="text-stone-400 leading-relaxed text-xs">
              Antioxidants calm baseline inflammation and prevent new pigment synthesis from occurring.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
            <h4 className="font-semibold text-rose-300 text-sm">Weeks 4 – 8: Surface Softening</h4>
            <p className="text-stone-400 leading-relaxed text-xs">
              Natural epidermal turnover sweeps away surface melanin, noticeably brightening overall skin tone.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
            <h4 className="font-semibold text-emerald-400 text-sm">Weeks 8 – 16: Deep Resolution</h4>
            <p className="text-stone-400 leading-relaxed text-xs">
              Stubborn post-acne marks and solar lentigines gradually fade as cellular turnover completes multiple cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Relevant Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Dark Spots & Brightening Articles
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Showing {darkSpotTips.length} educational guides
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
          {darkSpotTips.map((tip) => (
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
    </article>
  );
};
