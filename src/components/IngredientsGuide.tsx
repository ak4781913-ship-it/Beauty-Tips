import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Info,
  Droplets,
  Layers,
  FlaskConical,
  Sun,
  Moon,
} from 'lucide-react';
import { SKINCARE_INGREDIENTS, SkincareIngredient } from '../data/ingredients';

interface IngredientsGuideProps {
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const IngredientsGuide: React.FC<IngredientsGuideProps> = ({ onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(SKINCARE_INGREDIENTS[0].id);

  // Ingredient compatibility clash-checker state
  const [selectedIng1, setSelectedIng1] = useState<string>('retinol');
  const [selectedIng2, setSelectedIng2] = useState<string>('glycolic-acid');

  const categories = useMemo(() => {
    const set = new Set(SKINCARE_INGREDIENTS.map((i) => i.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredIngredients = useMemo(() => {
    return SKINCARE_INGREDIENTS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.inciName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.primaryConcerns.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.primaryBenefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Compatibility evaluation logic
  const compatibilityResult = useMemo(() => {
    const ing1 = SKINCARE_INGREDIENTS.find((i) => i.id === selectedIng1);
    const ing2 = SKINCARE_INGREDIENTS.find((i) => i.id === selectedIng2);

    if (!ing1 || !ing2) return null;
    if (ing1.id === ing2.id) {
      return {
        status: 'neutral',
        verdict: 'Same Ingredient Selected',
        explanation: 'Select two different active ingredients to check their scientific chemical interaction.',
      };
    }

    const name1 = ing1.name.toLowerCase();
    const name2 = ing2.name.toLowerCase();

    // Dangerous / irritating clashes
    const isRetinolAndAHA =
      (name1.includes('retinol') && (name2.includes('glycolic') || name2.includes('salicylic'))) ||
      (name2.includes('retinol') && (name1.includes('glycolic') || name1.includes('salicylic')));

    const isVitCAndRetinol =
      (name1.includes('vitamin c') && name2.includes('retinol')) ||
      (name2.includes('vitamin c') && name1.includes('retinol'));

    const isVitCAndAHA =
      (name1.includes('vitamin c') && name2.includes('glycolic')) ||
      (name2.includes('vitamin c') && name1.includes('glycolic'));

    const isCopperAndVitC =
      (name1.includes('peptides') && name2.includes('vitamin c')) ||
      (name2.includes('peptides') && name1.includes('vitamin c'));

    // Powerful synergies
    const isNiacinamideAndRetinol =
      (name1.includes('niacinamide') && name2.includes('retinol')) ||
      (name2.includes('niacinamide') && name1.includes('retinol'));

    const isHyaluronicAndAny =
      name1.includes('hyaluronic') || name2.includes('hyaluronic');

    const isCeramideAndAny =
      name1.includes('ceramides') || name2.includes('ceramides');

    const isVitCAndSunscreenOrNiacinamide =
      (name1.includes('vitamin c') && name2.includes('niacinamide')) ||
      (name2.includes('vitamin c') && name1.includes('niacinamide'));

    if (isRetinolAndAHA) {
      return {
        status: 'danger',
        verdict: 'High Irritation Risk — Do Not Layer Together',
        explanation:
          'Both ingredients accelerate cell shedding through distinct mechanisms. Layering them simultaneously strips the stratum corneum, causing severe burning, erythema, and barrier compromise. Use on alternating nights (Skin Cycling).',
      };
    }

    if (isVitCAndRetinol) {
      return {
        status: 'warning',
        verdict: 'Separate by Time of Day (AM vs PM)',
        explanation:
          'Pure L-Ascorbic Acid requires a low acidic pH (<3.5) while Retinol operates best at neutral pH (5.5-6.5). Layering both neutralizes efficacy and spikes irritation. Use Vitamin C in the morning (AM) for antioxidant defense and Retinol at night (PM).',
      };
    }

    if (isCopperAndVitC) {
      return {
        status: 'warning',
        verdict: 'Chemical Interaction — Avoid Co-Application',
        explanation:
          'Direct pure Vitamin C can oxidize copper ions in Copper Peptides (GHK-Cu), rendering both formulations inert and potentially causing temporary skin discoloration. Separate into AM and PM routines.',
      };
    }

    if (isVitCAndAHA) {
      return {
        status: 'warning',
        verdict: 'High Acid Load — Use with Extreme Caution',
        explanation:
          'Both are low-pH acids. Stacking them on the same skin application overwhelms the natural buffering capacity of the epidermis, triggering contact irritation.',
      };
    }

    if (isNiacinamideAndRetinol) {
      return {
        status: 'synergy',
        verdict: 'Golden Skincare Synergy — Highly Recommended!',
        explanation:
          'Niacinamide significantly boosts natural ceramide production and calms inflammatory pathways, perfectly buffering the dryness and flaking associated with Retinol. They work harmoniously together.',
      };
    }

    if (isCeramideAndAny || isHyaluronicAndAny) {
      return {
        status: 'synergy',
        verdict: 'Safe & Complementary Pairing',
        explanation:
          'Ceramides and Hyaluronic Acid are universal barrier-supporting biomolecules with 100% compatibility across all actives, acting as essential hydration and lipid cushions.',
      };
    }

    if (isVitCAndSunscreenOrNiacinamide) {
      return {
        status: 'synergy',
        verdict: 'Synergistic Antioxidant Duo',
        explanation:
          'Modern stabilized formulations of Vitamin C and Niacinamide can be used together to target dullness and hyperpigmentation across multiple distinct biological pathways.',
      };
    }

    return {
      status: 'safe',
      verdict: 'Compatible — Safe to Combine',
      explanation:
        'These ingredients operate through distinct, compatible physiological pathways without direct chemical antagonism. Maintain standard molecular layering (thinnest to thickest formulation).',
    };
  }, [selectedIng1, selectedIng2]);

  return (
    <section id="ingredients-guide" className="py-16 bg-stone-950 border-t border-stone-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1 rounded-full mb-3">
            <FlaskConical className="w-3.5 h-3.5 text-rose-400" />
            <span>Formulation Chemistry</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 tracking-tight">
            Skincare Ingredients <span className="italic text-rose-300">Guide & Science</span>
          </h2>
          <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed">
            Understand the exact molecular functions, pH sweet spots, optimal concentrations, and layering rules of the world’s most effective skincare actives.
          </p>
        </div>

        {/* 1. Interactive Ingredient Clash & Compatibility Checker */}
        <div className="mb-14 rounded-3xl bg-stone-900/80 border border-stone-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-400">
                Interactive Chemical Matrix
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-100 mt-1">
                "Can I Mix These Together?" Compatibility Checker
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Select any two skincare actives to instantly check scientific safety and compatibility rules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex-1 sm:flex-initial">
                <label className="block text-[11px] font-medium text-stone-400 mb-1">Active #1</label>
                <select
                  value={selectedIng1}
                  onChange={(e) => setSelectedIng1(e.target.value)}
                  className="w-full sm:w-48 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                >
                  {SKINCARE_INGREDIENTS.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-stone-500 font-bold text-sm px-1 pt-5">+</div>

              <div className="flex-1 sm:flex-initial">
                <label className="block text-[11px] font-medium text-stone-400 mb-1">Active #2</label>
                <select
                  value={selectedIng2}
                  onChange={(e) => setSelectedIng2(e.target.value)}
                  className="w-full sm:w-48 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                >
                  {SKINCARE_INGREDIENTS.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Compatibility Verdict Display */}
          {compatibilityResult && (
            <div className="mt-6 pt-2">
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  compatibilityResult.status === 'danger'
                    ? 'bg-red-950/30 border-red-800/60 text-red-200'
                    : compatibilityResult.status === 'warning'
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    : compatibilityResult.status === 'synergy'
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-stone-950/60 border-stone-800 text-stone-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {compatibilityResult.status === 'danger' ? (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  ) : compatibilityResult.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : compatibilityResult.status === 'synergy' ? (
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm sm:text-base tracking-wide">
                      {compatibilityResult.verdict}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                      {compatibilityResult.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredient, concern, or benefit (e.g. pores, dry, BHA)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-850 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Ingredient Cards Grid */}
        <div className="space-y-4">
          {filteredIngredients.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-stone-900/95 border-rose-500/50 shadow-xl'
                    : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Header Summary Bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <Droplets className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-100">
                          {item.name}
                        </h3>
                        <span className="text-[11px] font-mono text-stone-400 px-2 py-0.5 rounded bg-stone-950/60 border border-stone-800">
                          {item.recommendedConcentration}
                        </span>
                      </div>
                      <p className="text-xs text-rose-300 font-mono mt-0.5">{item.inciName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800">
                      {item.recommendedTiming.includes('Morning') && !item.recommendedTiming.includes('Evening') ? (
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                      ) : item.recommendedTiming.includes('Evening') && !item.recommendedTiming.includes('Morning') ? (
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>{item.recommendedTiming}</span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-rose-400' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Collapsible Deep-Dive Panel */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-stone-800/80 space-y-6 animate-in fade-in duration-200">
                    {/* Primary Benefits & Molecular Mechanism */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-850 space-y-2">
                        <span className="text-xs uppercase tracking-wider font-semibold text-rose-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Key Clinical Benefits
                        </span>
                        <ul className="space-y-1.5 text-xs text-stone-300">
                          {item.primaryBenefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-850 space-y-2">
                        <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          Molecular Mechanism
                        </span>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {item.molecularRole}
                        </p>
                        <div className="pt-1 text-[11px] text-stone-400 font-mono">
                          Optimal pH: <span className="text-stone-200">{item.pHOptimal}</span>
                        </div>
                      </div>
                    </div>

                    {/* Layer Sequence & Suitability */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-850">
                        <span className="text-stone-400 font-medium block mb-1">Layer Sequence:</span>
                        <p className="text-stone-200 font-medium">{item.layerSequence}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-850">
                        <span className="text-stone-400 font-medium block mb-1">Best For Skin Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.bestForSkinTypes.map((st) => (
                            <span
                              key={st}
                              className="px-2 py-0.5 rounded text-[10px] bg-stone-850 text-stone-300"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-850">
                        <span className="text-stone-400 font-medium block mb-1">Target Concerns:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.primaryConcerns.map((tc) => (
                            <span
                              key={tc}
                              className="px-2 py-0.5 rounded text-[10px] bg-rose-950/40 text-rose-300 border border-rose-900/30"
                            >
                              {tc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pairings vs Conflicts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Pairs Synergistically With:</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed">
                          {item.pairsWellWith.join(' · ')}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-red-300">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span>Avoid Layering In Same Step With:</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed">
                          {item.doNotMixWith.join(' · ')}
                        </p>
                      </div>
                    </div>

                    {/* Abbas's Expert Formulation Tip */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-stone-950 border border-rose-500/30 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs uppercase font-semibold text-rose-300 tracking-wider">
                          Abbas's Expert Formulation Tip
                        </span>
                        <p className="text-xs text-stone-200 leading-relaxed">
                          "{item.expertTip}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
