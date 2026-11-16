import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
  Flame,
  Star,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { ProductSuggestionsSection } from './ProductSuggestionsSection';
import { BeautyTrendsVisualization } from './BeautyTrendsVisualization';
import { AdsterraBanner } from './ads/AdsterraBanner';
import { SmartlinkCard } from './ads/SmartlinkPromo';

export const ProductsTrendsView: React.FC = () => {
  const [subTab, setSubTab] = useState<'products' | 'trends'>('products');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner with Subtab Switcher */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Formulation Guide & Market Trends</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
            Recommended Products & Beauty Trends
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-300 max-w-xl font-light">
            Evidence-based product category recommendations and interactive ingredient popularity analytics.
          </p>
        </div>

        <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-1.5 flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'products'
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Recommended Products</span>
          </button>

          <button
            onClick={() => setSubTab('trends')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'trends'
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Beauty Trends</span>
          </button>
        </div>
      </div>

      {/* Panels */}
      {subTab === 'products' && (
        <div className="space-y-8">
          <ProductSuggestionsSection />

          {/* Adsterra Deals Integration */}
          <div className="bg-stone-900/60 rounded-3xl p-6 sm:p-8 border border-stone-800">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
                Exclusive Deals
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-100 mt-1">
                Curated Partner Deals & Skincare Offers
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-items-center">
              <AdsterraBanner type="300x250" />
              <div className="w-full max-w-sm h-full flex flex-col justify-center">
                <SmartlinkCard className="h-full" />
              </div>
              <AdsterraBanner type="300x250" />
            </div>
          </div>
        </div>
      )}

      {subTab === 'trends' && (
        <div className="space-y-6">
          <BeautyTrendsVisualization />
        </div>
      )}
    </div>
  );
};
