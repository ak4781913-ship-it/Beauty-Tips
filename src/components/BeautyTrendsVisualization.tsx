import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Layers,
  Activity,
  Info,
  Check,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

// Common industry interest index data (0 to 100 relative popularity)
const INGREDIENT_TREND_DATA = [
  {
    year: '2020',
    retinol: 72,
    niacinamide: 48,
    ceramides: 35,
    hyaluronicAcid: 85,
    salicylicAcid: 60,
    cica: 30,
  },
  {
    year: '2021',
    retinol: 78,
    niacinamide: 64,
    ceramides: 45,
    hyaluronicAcid: 88,
    salicylicAcid: 65,
    cica: 44,
  },
  {
    year: '2022',
    retinol: 82,
    niacinamide: 80,
    ceramides: 60,
    hyaluronicAcid: 86,
    salicylicAcid: 68,
    cica: 58,
  },
  {
    year: '2023',
    retinol: 86,
    niacinamide: 92,
    ceramides: 78,
    hyaluronicAcid: 89,
    salicylicAcid: 71,
    cica: 70,
  },
  {
    year: '2024',
    retinol: 89,
    niacinamide: 96,
    ceramides: 91,
    hyaluronicAcid: 90,
    salicylicAcid: 74,
    cica: 82,
  },
  {
    year: '2025',
    retinol: 92,
    niacinamide: 98,
    ceramides: 97,
    hyaluronicAcid: 91,
    salicylicAcid: 76,
    cica: 89,
  },
  {
    year: '2026',
    retinol: 95,
    niacinamide: 100,
    ceramides: 99,
    hyaluronicAcid: 92,
    salicylicAcid: 79,
    cica: 94,
  },
];

interface IngredientMeta {
  key: string;
  name: string;
  color: string;
  gradientId: string;
  benefit: string;
  trendStatus: string;
  abbasInsight: string;
}

const INGREDIENTS_CONFIG: IngredientMeta[] = [
  {
    key: 'niacinamide',
    name: 'Niacinamide (Vitamin B3)',
    color: '#e11d48', // rose-600
    gradientId: 'colorNiacinamide',
    benefit: 'Pore refining & sebum regulation',
    trendStatus: '+108% surge since 2020',
    abbasInsight: 'The MVP of universal tolerance. Pairs safely with almost every active ingredient.',
  },
  {
    key: 'ceramides',
    name: 'Ceramides Complex',
    color: '#d97706', // amber-600
    gradientId: 'colorCeramides',
    benefit: 'Stratum corneum barrier rebuilding',
    trendStatus: '+182% surge (Barrier-First era)',
    abbasInsight: 'Driven by the modern shift toward repairing over-exfoliated skin barriers.',
  },
  {
    key: 'retinol',
    name: 'Retinol & Retinoids',
    color: '#6366f1', // indigo-500
    gradientId: 'colorRetinol',
    benefit: 'Cell turnover & collagen synthesis',
    trendStatus: 'Continuous gold-standard growth',
    abbasInsight: 'Start low, go slow. The sandwich technique preserves tolerance without sacrificing results.',
  },
  {
    key: 'cica',
    name: 'Centella Asiatica (Cica)',
    color: '#059669', // emerald-600
    gradientId: 'colorCica',
    benefit: 'Redness reduction & anti-inflammation',
    trendStatus: '+213% global botanical adoption',
    abbasInsight: 'Essential for reactive skin. Calms heat and post-blemish inflammation rapidly.',
  },
  {
    key: 'hyaluronicAcid',
    name: 'Hyaluronic Acid',
    color: '#0284c7', // sky-600
    gradientId: 'colorHA',
    benefit: 'Deep cellular water binding',
    trendStatus: 'Stable foundational hydration',
    abbasInsight: 'Always apply onto damp skin to draw hydration in rather than out into dry air.',
  },
  {
    key: 'salicylicAcid',
    name: 'Salicylic Acid (BHA)',
    color: '#78716c', // stone-500
    gradientId: 'colorBHA',
    benefit: 'Lipophilic pore unclogging',
    trendStatus: 'Reliable blemish-fighting baseline',
    abbasInsight: 'Use 2-3 nights weekly on congested T-zones instead of aggressive daily stripping.',
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-rose-100 dark:border-stone-800 text-xs min-w-[200px]">
        <div className="flex items-center justify-between border-b border-rose-50 dark:border-stone-800 pb-2 mb-2">
          <span className="font-semibold text-rose-900 dark:text-rose-200">Year {label}</span>
          <span className="text-[10px] uppercase tracking-wider text-stone-400">Popularity Index</span>
        </div>
        <div className="space-y-1.5">
          {payload.map((item: any) => (
            <div key={item.dataKey} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-stone-700 dark:text-stone-300 font-medium capitalize">
                  {item.name}
                </span>
              </div>
              <span className="font-bold tabular-nums text-stone-900 dark:text-stone-100">
                {item.value} / 100
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const BeautyTrendsVisualization: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([
    'niacinamide',
    'ceramides',
    'retinol',
    'cica',
  ]);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  const toggleIngredient = (key: string) => {
    setActiveKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // Keep at least one active
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const selectAll = () => {
    setActiveKeys(INGREDIENTS_CONFIG.map((c) => c.key));
  };

  const selectCoreTrio = () => {
    setActiveKeys(['niacinamide', 'ceramides', 'retinol']);
  };

  return (
    <section id="beauty-trends" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-rose-100 dark:border-stone-800 shadow-sm space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-rose-50 dark:border-stone-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span>Skincare Formulation Analytics</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 dark:text-rose-50 font-normal">
              Skincare Ingredients Popularity Over Time
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
              Track the multi-year evolution of consumer search interest, clinical demand, and formulation adoption across the modern beauty landscape (2020 – 2026).
            </p>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
            <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Area View
              </button>
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Line View
              </button>
            </div>

            <button
              type="button"
              onClick={selectAll}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              All Actives
            </button>
            <button
              type="button"
              onClick={selectCoreTrio}
              className="px-3 py-1.5 rounded-xl bg-rose-100/70 hover:bg-rose-200/70 dark:bg-rose-950/60 text-xs font-medium text-rose-900 dark:text-rose-200 transition-colors cursor-pointer"
            >
              Core Trio
            </button>
          </div>
        </div>

        {/* Interactive Legend Filters */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Toggle Active Ingredients to Compare</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {INGREDIENTS_CONFIG.map((ing) => {
              const isSelected = activeKeys.includes(ing.key);
              return (
                <button
                  key={ing.key}
                  type="button"
                  onClick={() => toggleIngredient(ing.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'bg-transparent border-stone-200/60 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-opacity"
                    style={{
                      backgroundColor: ing.color,
                      opacity: isSelected ? 1 : 0.3,
                    }}
                  />
                  <span>{ing.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-stone-500 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-80 sm:h-96 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={INGREDIENT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {INGREDIENTS_CONFIG.map((ing) => (
                    <linearGradient key={ing.gradientId} id={ing.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ing.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={ing.color} stopOpacity={0.0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis
                  dataKey="year"
                  stroke="#a8a29e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#a8a29e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                {INGREDIENTS_CONFIG.map((ing) =>
                  activeKeys.includes(ing.key) ? (
                    <Area
                      key={ing.key}
                      type="monotone"
                      dataKey={ing.key}
                      name={ing.name}
                      stroke={ing.color}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill={`url(#${ing.gradientId})`}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  ) : null
                )}
              </AreaChart>
            ) : (
              <LineChart data={INGREDIENT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis
                  dataKey="year"
                  stroke="#a8a29e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#a8a29e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                {INGREDIENTS_CONFIG.map((ing) =>
                  activeKeys.includes(ing.key) ? (
                    <Line
                      key={ing.key}
                      type="monotone"
                      dataKey={ing.key}
                      name={ing.name}
                      stroke={ing.color}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: ing.color }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  ) : null
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Ingredient Trend Insights Grid */}
        <div className="pt-6 border-t border-rose-50 dark:border-stone-800">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Abbas’s Clinical Trend Analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INGREDIENTS_CONFIG.map((ing) => (
              <div
                key={ing.key}
                className="p-4 rounded-2xl bg-stone-50/60 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold" style={{ color: ing.color }}>
                      {ing.name}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 tabular-nums">
                      {ing.trendStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mb-2">
                    Primary Role: {ing.benefit}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 italic leading-relaxed">
                    "{ing.abbasInsight}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source Footnote */}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-400 dark:text-stone-500">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Industry Normalized Index: Aggregated from dermatology conference publications, global cosmetic search queries, and skincare database formulations (2020–2026).
          </span>
        </div>
      </div>
    </section>
  );
};
