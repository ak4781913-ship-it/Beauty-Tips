import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Filter, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { PRODUCT_SUGGESTIONS } from '../data/products';
import { ProductItem, SkinType } from '../types';
import productsImage from '../assets/images/beauty_serums_bottles_1791268884613.jpg';

export const ProductSuggestionsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>('all');

  const categories = [
    'All',
    'Cleanser',
    'Moisturizer',
    'Sunscreen',
    'Serum',
    'Face Mask',
    'Shampoo',
    'Conditioner',
    'Lip Care',
  ];

  const skinTypes: { id: SkinType; label: string }[] = [
    { id: 'all', label: 'All Skin' },
    { id: 'dry', label: 'Dry' },
    { id: 'oily', label: 'Oily' },
    { id: 'combination', label: 'Combo' },
    { id: 'sensitive', label: 'Sensitive' },
  ];

  const filteredProducts = PRODUCT_SUGGESTIONS.filter((prod) => {
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSkin =
      selectedSkinType === 'all' || prod.idealFor.includes('all') || prod.idealFor.includes(selectedSkinType);
    return matchesCat && matchesSkin;
  });

  return (
    <section id="product-suggestions" className="py-16 bg-rose-50/20 dark:bg-stone-900/40 border-y border-rose-100 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
              <ShoppingBag className="w-4 h-4 text-rose-500" />
              <span>Curated Formulation Guidance</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 dark:text-rose-50 font-normal">
              Product Suggestions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl">
              An educational formulation guide to help you choose the right texture, key actives, and product categories for your barrier without marketing hype.
            </p>
          </div>

          {/* Skin Type Filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl self-start">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-2">Skin:</span>
            {skinTypes.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedSkinType(st.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                  selectedSkinType === st.id
                    ? 'bg-rose-700 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-sm'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-rose-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Product Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category & Ideal for */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2.5">
                  <span className="font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[11px]">
                    {product.category}
                  </span>
                  <span className="capitalize text-stone-500">
                    {product.idealFor.includes('all') ? 'All skin types' : product.idealFor.join(' / ')}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100 leading-snug">
                  {product.name}
                </h3>

                <p className="mt-1 text-xs text-rose-900/70 dark:text-rose-300/80 italic font-medium">
                  Texture: {product.texture}
                </p>

                <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {product.educationalNotes}
                </p>

                {/* Key Ingredients */}
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
                    Formulation Actives
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.keyIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Usage Tips */}
                <div className="mt-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800 text-xs">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Application Note: </span>
                  <span className="text-stone-600 dark:text-stone-300">{product.usageTips}</span>
                </div>
              </div>

              {/* Educational notice */}
              <div className="mt-5 pt-3 border-t border-rose-100/60 dark:border-stone-800 flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                <Info className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                <span>Non-sponsored educational recommendation</span>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              No products found matching this combination. Try selecting “All Skin” or “All Categories”.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
