import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Droplets, AlertTriangle, Check, X } from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { TipCard } from '../components/TipCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';

interface AcnePimplesPageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const AcnePimplesPage: React.FC<AcnePimplesPageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
}) => {
  useEffect(() => {
    document.title = 'Acne & Pimples Solutions | Beauty Tips by Abbas';
  }, []);

  const acneTips = BEAUTY_TIPS.filter(
    (t) =>
      t.category === 'acne-pimples' ||
      t.concerns.includes('Acne') ||
      t.concerns.includes('Blackheads') ||
      t.concerns.includes('Large-looking Pores')
  );

  const acneActives = [
    {
      name: 'Salicylic Acid (BHA)',
      role: 'Oil-Soluble Exfoliant',
      detail: 'Penetrates deeply inside sebaceous follicles to dissolve trapped oil and sticky keratin plugs.',
    },
    {
      name: 'Benzoyl Peroxide',
      role: 'Antibacterial Agent',
      detail: 'Introduces oxygen into pores, neutralizing anaerobic C. acnes bacteria without antibiotic resistance.',
    },
    {
      name: 'Azelaic Acid (10%)',
      role: 'Soothing & Anti-Redness',
      detail: 'Calms inflammatory papules and inhibits tyrosinase to prevent lingering post-acne dark marks.',
    },
    {
      name: 'Niacinamide (2–5%)',
      role: 'Sebum Regulator',
      detail: 'Moderates surface oiliness, strengthens ceramides, and shrinks the optical appearance of enlarged pores.',
    },
  ];

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Skincare', path: '/skin-care' },
          { label: 'Acne & Pimples', active: true },
        ]}
      />

      {/* Category Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/30 via-stone-900 to-stone-900 border border-amber-900/40 p-8 sm:p-12 space-y-5 overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-amber-400 bg-amber-950/60 border border-amber-900/40 px-3 py-1 rounded-full">
          <Droplets className="w-3.5 h-3.5 text-amber-400" />
          <span>Blemish & Pore Education</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 leading-tight">
          Acne, Pimples & Congestion Care
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed">
          Breakouts occur when oxidized sebum and sticky dead cells trap bacteria inside the follicle. The key to clearing acne is gentle, consistent cellular turnover without compromising the moisture barrier.
        </p>

        {/* Quick Nav Badges */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <Link
            to="/skincare"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 transition-colors"
          >
            ← Skincare Overview
          </Link>
          <Link
            to="/dark-spots"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 transition-colors"
          >
            Post-Acne Marks (PIE/PIH) →
          </Link>
        </div>
      </div>

      {/* Proven Actives Spotlight */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-medium text-stone-100">
          Target Ingredients for Blemish-Prone Skin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {acneActives.map((act, i) => (
            <div key={i} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
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

      {/* Do's and Don'ts for Acne */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
          <h3 className="font-serif text-lg font-semibold text-emerald-300 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Recommended for Acne Care</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Cleanse gently twice daily with a non-stripping, low-pH gel cleanser.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Apply oil-free, non-comedogenic moisturizers to keep skin from overproducing sebum.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Use hydrocolloid pimple patches over active pustules to prevent touching and scarring.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3">
          <h3 className="font-serif text-lg font-semibold text-rose-300 flex items-center gap-2">
            <X className="w-5 h-5 text-rose-400" />
            <span>Actions to Avoid</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Never pick, squeeze, or aggressively pop cysts; it forces bacteria deeper and causes scarring.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Do not strip skin with harsh rubbing alcohol, coarse walnut scrubs, or astringents.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Avoid combining multiple strong exfoliants (BHA + Retinol + Peels) on the same evening.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Relevant Article Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Acne & Blemish Articles
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Showing {acneTips.length} educational guides
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
          {acneTips.map((tip) => (
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

      {/* Dermatologist Consultation Notice */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-400 space-y-2">
        <div className="flex items-center gap-2 text-rose-300 font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>When to Consult a Qualified Dermatologist</span>
        </div>
        <p className="leading-relaxed">
          If your acne presents as deep, painful under-the-skin cysts or nodules that do not respond to over-the-counter salicylic acid or benzoyl peroxide after 8 to 12 weeks, or if you notice pitted ice-pick scarring, consult a board-certified dermatologist. Prescription therapies such as oral isotretinoin, spironolactone, or topical retinoids may be necessary.
        </p>
      </div>
    </article>
  );
};
