import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Droplets, Sun, Layers, HelpCircle, ChevronDown } from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { TipCard } from '../components/TipCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';

interface SkincareCategoryPageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const SkincareCategoryPage: React.FC<SkincareCategoryPageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Skincare Category & Barrier Science | Beauty Tips by Abbas';
  }, []);

  const skincareTips = BEAUTY_TIPS.filter(
    (t) =>
      t.category === 'skin-care' ||
      t.category === 'dry-skin' ||
      t.category === 'oily-skin' ||
      t.category === 'dull-skin' ||
      t.category === 'sun-skincare'
  );

  const skincareFaqs = [
    {
      q: 'What is the correct order to apply skincare products in the morning and evening?',
      a: 'The cardinal rule is thinnest to thickest consistency: 1. Cleanse (oil then water cleanser at night), 2. Hydrating toner or essence on damp skin, 3. Treatment serums (antioxidants in AM, retinoids/acids in PM), 4. Barrier moisturizer or cream, and 5. Broad-spectrum SPF 50 sunscreen as your final daytime shield.',
    },
    {
      q: 'How do I heal a damaged, stinging skin barrier quickly?',
      a: 'Immediately pause all active acids (AHA, BHA, Vitamin C) and retinoids for 10-14 days. Wash only with lukewarm water or a gentle creamy low-pH cleanser, drench with glycerin/ceramide essence, seal with a barrier cream containing ceramides, cholesterol, and fatty acids, and apply pure mineral sunscreen.',
    },
    {
      q: 'How do I know if my skin is dry or just dehydrated?',
      a: 'Dry skin is a genetic skin type where sebaceous glands produce very little natural oil throughout the face. Dehydrated skin is a temporary condition where the upper epidermal layers lack water—often feeling tight, flaky, yet shiny with midday oil. Dehydrated skin needs water humectants, while dry skin needs rich lipid emollients.',
    },
    {
      q: 'Can I combine Vitamin C with Niacinamide in the same routine?',
      a: 'Yes! Modern formulation science has debunked the old myth that Vitamin C and Niacinamide cancel each other out. Together, they offer superior photoprotection, collagen support, and dark spot lightening.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Skincare Solutions', active: true }]} />

      {/* Category Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-stone-900 border border-rose-900/40 p-8 sm:p-12 space-y-5 overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Category Hub</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 leading-tight">
          Skincare Solutions & Barrier Health
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed">
          Foundational skincare science focused on restoring the acid mantle, maintaining essential lipids (ceramides, cholesterol, fatty acids), and achieving long-term skin clarity without aggression.
        </p>

        {/* Quick links to specific concerns & articles */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <span className="text-stone-400 self-center font-medium">Topic Guides:</span>
          <Link
            to="/skin-care/acne-pimples"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-300 transition-colors"
          >
            Acne Treatment Guide →
          </Link>
          <Link
            to="/skin-care/dark-spots"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-300 transition-colors"
          >
            Dark Spots & Pigmentation →
          </Link>
          <Link
            to="/skin-care/sunscreen"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-300 transition-colors"
          >
            Sunscreen Guide →
          </Link>
          <Link
            to="/skin-care/daily-routine"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-300 transition-colors"
          >
            Daily Routine →
          </Link>
          <Link
            to="/skin-care/slugging"
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-300 transition-colors"
          >
            Slugging Protocol →
          </Link>
        </div>
      </div>

      {/* 4 Pillars of Healthy Skin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-base text-stone-100 font-medium">1. Barrier Integrity</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Preserve your natural lipid barrier with low-pH cleansers and ceramides.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-base text-stone-100 font-medium">2. Cellular Hydration</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Layer humectants (glycerin, hyaluronic acid) on damp skin for deep plumping.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-base text-stone-100 font-medium">3. Purposeful Actives</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Introduce concentrated treatments gradually to prevent inflammatory purging.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-base text-stone-100 font-medium">4. Daily UV Shield</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Broad-spectrum SPF50+ every morning to halt photoaging and discoloration.
          </p>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <div className="w-full flex justify-center py-2">
        <AdsterraBanner type="728x90" />
      </div>

      {/* Filtered Articles Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Skincare Articles & Formulations
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Showing {skincareTips.length} expert skincare guides
            </p>
          </div>
          <Link
            to="/beauty-tips"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <span>All categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {skincareTips.map((tip) => (
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

      {/* Skincare FAQs Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium text-stone-100">
              Skincare & Acid Mantle FAQs
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Expert answers to clarify active layering, barrier healing, and skin types.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {skincareFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-stone-800 bg-stone-950/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-stone-900/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-stone-200 text-xs sm:text-sm">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-rose-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-stone-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
