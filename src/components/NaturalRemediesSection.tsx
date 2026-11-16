import React, { useState } from 'react';
import { Leaf, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { NATURAL_REMEDIES } from '../data/remedies';
import { NaturalRemedy } from '../types';
import botanicalsImage from '../assets/images/natural_remedies_botanicals_1791268857904.jpg';

export const NaturalRemediesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Face care', 'Hair care', 'Lip care', 'Skin hydration', 'General self-care'];

  const filteredRemedies = activeCategory === 'All'
    ? NATURAL_REMEDIES
    : NATURAL_REMEDIES.filter((r) => r.category === activeCategory);

  return (
    <section id="natural-remedies" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Botanical & Kitchen Wisdom</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 dark:text-rose-50 font-normal">
            Natural & Home Remedies
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl">
            Gentle self-care preparations crafted from wholesome botanicals, raw honey, and kitchen staples to comfort your skin and hair naturally.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Botanical Card + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Philosophy Spotlight */}
        <div className="lg:col-span-4 rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 p-5 shadow-sm space-y-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800">
            <img
              src={botanicalsImage}
              alt="Artisanal natural remedies arrangement with fresh aloe vera, dried rosebuds, and honey"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-200">Abbas’s Botanical Rule</span>
              <p className="font-serif text-sm font-medium mt-0.5 leading-snug">
                “Natural does not mean non-reactive. Respect botanical potency by always patch-testing.”
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-amber-900/40 text-xs text-stone-700 dark:text-stone-300 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Safety & Patch Test Protocol</span>
            </div>
            <p className="leading-relaxed">
              Before applying any homemade botanical mask to your face, apply a dime-sized amount to your inner forearm or behind the ear for 24 hours. If any itching, tingling, or redness occurs, rinse immediately and discontinue.
            </p>
          </div>
        </div>

        {/* Remedies Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRemedies.map((remedy) => (
            <div
              key={remedy.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category & Frequency */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {remedy.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{remedy.frequency}</span>
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100 leading-snug">
                  {remedy.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {remedy.benefits}
                </p>

                {/* Ingredients */}
                <div className="mt-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                    Required Botanicals:
                  </p>
                  <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                    {remedy.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600">·</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How to use */}
                <div className="mt-3.5 text-xs text-stone-700 dark:text-stone-300">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Application: </span>
                  <span>{remedy.howToUse}</span>
                </div>
              </div>

              {/* Caution Footer */}
              <div className="mt-5 pt-3 border-t border-rose-100/60 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 italic">
                <span>Note: {remedy.caution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
