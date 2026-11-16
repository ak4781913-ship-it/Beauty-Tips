import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  Eye,
  Heart,
  Droplets,
  HelpCircle,
  ChevronDown,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { TipCard } from '../components/TipCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import makeupBannerImage from '../assets/images/editorial_makeup_palette_1791795525301.jpg';

interface MakeupPageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const MakeupPage: React.FC<MakeupPageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Makeup Artistry & Skin-First Prep | Beauty Tips by Abbas';
  }, []);

  const makeupTips = BEAUTY_TIPS.filter(
    (t) => t.category === 'makeup-tips' || t.category === 'lip-care'
  );

  const pillars = [
    {
      title: '1. Skin-First Base Prep',
      description: 'Drenching the skin in lightweight humectants and waiting 3-5 minutes prevents foundation from drinking skin moisture and caking.',
      icon: Droplets,
    },
    {
      title: '2. Micro-Concealing',
      description: 'Pinpoint spot-concealing only target discolored areas preserves natural radiance and keeps texture looking undetectable.',
      icon: Sparkles,
    },
    {
      title: '3. Cream Layering Synergy',
      description: 'Applying cream blushes and bronzers before powder delivers seamless melt-in skin luminosity that mimics healthy circulation.',
      icon: Palette,
    },
    {
      title: '4. Strategic Zonal Setting',
      description: 'Powdering only the oily T-zone (forehead center and nose) leaves high cheekbones and temples dewy and youthful.',
      icon: ShieldCheck,
    },
  ];

  const faqs = [
    {
      q: 'How do I prevent my foundation from separating, peeling, or clinging to dry flakes?',
      a: 'Foundation separation almost always stems from mixing incompatible base formulas (e.g. silicone primer with water foundation) or applying pigment on dehydrated skin. Cleanse gently, press a hydrating hyaluronic serum into damp skin, seal with an oil-free moisturizer, and wait 3 full minutes before makeup. Never rub aggressively—use gentle bouncing motions with a damp beauty sponge.',
    },
    {
      q: 'Should cream blush be applied before or after setting powder?',
      a: 'Always apply cream and liquid blushes directly over your liquid base BEFORE any powder touches the face. Applying wet cream formulas on top of dry powder causes the powder to clump and cake into patchy textures. If you need extra all-day longevity, lightly set with a matching powder blush on top.',
    },
    {
      q: 'What is the most flattering everyday makeup routine for busy mornings?',
      a: 'The 5-minute skin-first routine is unbeatable: broad-spectrum SPF 50 as your base, a dab of luminous concealer under the eyes and around the nose, warm cream blush swept across cheekbones and bridge of nose, groomed feathered brows, and a tinted peptide lip balm.',
    },
    {
      q: 'How can I stop eyeliner from transferring onto hooded eyelids?',
      a: 'Set the upper eyelid canvas with an ultra-sheer dust of translucent powder to absorb eyelid oils. Choose a waterproof gel formula, wiggle it closely into the root of the lashes (tightlining), and allow 60 seconds for the polymer film to lock in completely before opening eyes wide.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Makeup Artistry & Prep', active: true }]} />

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-rose-900/40 bg-stone-900 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          <div className="lg:col-span-7 space-y-5 z-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-300 bg-rose-950/80 border border-rose-800/50 px-3.5 py-1.5 rounded-full">
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span>Editorial Editorial Hub</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 leading-tight">
              Makeup Artistry & <br className="hidden sm:inline" />
              <span className="italic font-light text-rose-300">Skin-First Enhancements</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl font-light leading-relaxed">
              Explore professional editorial makeup techniques centered around healthy, breathable skin prep, effortless everyday enhancement, velvet eye definition, and long-wear lip rituals.
            </p>

            {/* Quick links to featured makeup articles */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-stone-400 self-center font-medium">Quick Guides:</span>
              <Link
                to="/makeup/everyday-makeup"
                className="px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-rose-300 transition-colors"
              >
                Everyday 5-Min Protocol →
              </Link>
              <Link
                to="/makeup/glass-skin"
                className="px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-rose-300 transition-colors"
              >
                Pre-Makeup Glass Skin →
              </Link>
              <Link
                to="/makeup/eye-makeup"
                className="px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-rose-300 transition-colors"
              >
                Velvet Eye Definition →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-800 shadow-xl">
            <img
              src={makeupBannerImage}
              alt="Editorial luxury makeup flatlay with blush, highlighter, and soft brushes"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-xs text-rose-200 font-medium">
              Beauty Tips by Abbas · Editorial Artistry
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Skin-First Makeup */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
            Professional Principles
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
            The 4 Pillars of Skin-First Makeup
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2.5 hover:border-rose-500/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base text-stone-100 font-medium">{p.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Makeup Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
              Curated Guides
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
              Makeup Artistry & Prep Articles
            </h2>
          </div>
          <Link
            to="/beauty-tips"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <span>All Beauty Tips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {makeupTips.map((tip) => (
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

      {/* Adsterra Banner */}
      <div className="w-full flex justify-center py-2">
        <AdsterraBanner type="728x90" />
      </div>

      {/* Frequently Asked Makeup Questions */}
      <section className="p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium text-stone-100">
              Common Makeup Dilemmas & Answers
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Practical advice from Abbas to prevent cakey finishes and prolong wear.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
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
