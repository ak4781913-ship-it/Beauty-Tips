import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  Droplets,
  Moon,
  Info,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Award,
  ShieldCheck,
} from 'lucide-react';
import {
  BeautyJournalEntry,
  get30DaySkinMoodTrendData,
  DayMoodTrendPoint,
  generate30DayDemoHistory,
  JOURNAL_STORAGE_KEY,
  JOURNAL_EVENT,
} from '../utils/beautyJournal';

interface SkinMoodTrendChartProps {
  entries: Record<string, BeautyJournalEntry>;
  onSelectDate?: (dateStr: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const SkinMoodTrendChart: React.FC<SkinMoodTrendChartProps> = ({
  entries,
  onSelectDate,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(30);
  const [chartMode, setChartMode] = useState<'mood' | 'correlation' | 'breakdown'>('mood');
  const [connectUnlogged, setConnectUnlogged] = useState<boolean>(true);

  // Generate trend data based on selected time range
  const trendData = useMemo(() => {
    return get30DaySkinMoodTrendData(entries, timeRange);
  }, [entries, timeRange]);

  // Aggregate statistics for the selected time range
  const stats = useMemo(() => {
    const loggedPoints = trendData.filter((p) => p.hasEntry && p.score !== null);
    const loggedCount = loggedPoints.length;
    const totalDays = trendData.length;
    const loggedPercentage = Math.round((loggedCount / totalDays) * 100);

    if (loggedCount === 0) {
      return {
        loggedCount: 0,
        totalDays,
        loggedPercentage: 0,
        avgScore: 0,
        avgWater: 0,
        avgSleep: 0,
        dominantMood: null,
        optimalDaysCount: 0,
        optimalPercentage: 0,
      };
    }

    const totalScore = loggedPoints.reduce((acc, p) => acc + (p.score || 0), 0);
    const avgScore = Number((totalScore / loggedCount).toFixed(1));

    const totalWater = loggedPoints.reduce((acc, p) => acc + (p.waterGlasses || 0), 0);
    const avgWater = Number((totalWater / loggedCount).toFixed(1));

    const totalSleep = loggedPoints.reduce((acc, p) => acc + (p.sleepHours || 0), 0);
    const avgSleep = Number((totalSleep / loggedCount).toFixed(1));

    // Mood distribution
    const moodCounts: Record<string, number> = {};
    loggedPoints.forEach((p) => {
      if (p.skinMood) {
        moodCounts[p.skinMood] = (moodCounts[p.skinMood] || 0) + 1;
      }
    });

    let topMoodKey: string | null = null;
    let topMoodMax = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > topMoodMax) {
        topMoodMax = count;
        topMoodKey = mood;
      }
    });

    // Optimal days: Radiant (6) or Hydrated (5) or Calm (4)
    const optimalDaysCount = loggedPoints.filter((p) => (p.score || 0) >= 4).length;
    const optimalPercentage = Math.round((optimalDaysCount / loggedCount) * 100);

    return {
      loggedCount,
      totalDays,
      loggedPercentage,
      avgScore,
      avgWater,
      avgSleep,
      dominantMood: topMoodKey,
      optimalDaysCount,
      optimalPercentage,
    };
  }, [trendData]);

  // Handle seeding 30-day demo history if user wants to see full progression
  const handleSeedDemoHistory = () => {
    const sample = generate30DayDemoHistory();
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(sample));
      window.dispatchEvent(new CustomEvent(JOURNAL_EVENT));
      onShowToast('Loaded 30-day clinical skin healing trajectory!', 'success');
    } catch {
      onShowToast('Could not load demo history', 'info');
    }
  };

  // Custom Dot component rendered for each data point
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.hasEntry || payload.score === null) return null;

    const fillHex = payload.moodHex || '#f59e0b';

    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill={fillHex} stroke="#1c1917" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={2.5} fill="#ffffff" />
      </g>
    );
  };

  // Custom Tooltip component with high contrast luxury dark styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const point: DayMoodTrendPoint = payload[0].payload;

    if (!point.hasEntry) {
      return (
        <div className="p-3.5 rounded-2xl bg-stone-950/95 border border-stone-800 shadow-2xl text-xs space-y-1 backdrop-blur-md">
          <div className="text-stone-400 font-mono">{point.displayDate}</div>
          <div className="text-stone-500 italic">No journal entry recorded for this day.</div>
        </div>
      );
    }

    return (
      <div className="p-4 rounded-2xl bg-stone-950/95 border border-stone-800 shadow-2xl text-xs space-y-2.5 max-w-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between gap-3 border-b border-stone-800/80 pb-2">
          <span className="font-semibold text-stone-200">{point.displayDate}</span>
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border"
            style={{
              backgroundColor: `${point.moodHex}15`,
              color: point.moodHex,
              borderColor: `${point.moodHex}40`,
            }}
          >
            <span>{point.moodEmoji}</span>
            <span>{point.moodLabel}</span>
          </span>
        </div>

        <div className="space-y-1.5 text-stone-300">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-500">Skin Barrier Score:</span>
            <span className="font-mono font-bold text-stone-200">{point.score} / 6</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-500">Hydration & Sleep:</span>
            <span className="text-stone-300">
              {point.waterGlasses} glasses · {point.sleepHours}h
            </span>
          </div>

          {point.productsUsed && point.productsUsed.length > 0 && (
            <div className="pt-1 border-t border-stone-850">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                Products Layered:
              </span>
              <p className="text-[11px] text-stone-300 line-clamp-2">
                {point.productsUsed.join(', ')}
              </p>
            </div>
          )}

          {point.observations && (
            <div className="pt-1 border-t border-stone-850">
              <p className="text-[11px] text-stone-400 italic line-clamp-2">
                "{point.observations}"
              </p>
            </div>
          )}
        </div>

        {onSelectDate && (
          <button
            type="button"
            onClick={() => onSelectDate(point.date)}
            className="w-full mt-1 py-1 rounded-lg bg-stone-900 hover:bg-rose-950 text-rose-300 border border-stone-800 text-[10px] font-semibold transition-colors cursor-pointer"
          >
            Open in Journal Form
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-stone-950/80 border border-stone-850 shadow-xl space-y-6">
      {/* 1. Header & Title with Time Range Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-850">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span>Recharts Longitudinal Analytics</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-100">
            30-Day Skin Mood & Barrier Trends
          </h3>
          <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
            Visualizing your skin’s biological response to daily routines, active ingredients, hydration, and sleep over time.
          </p>
        </div>

        {/* View Controls & Time Range */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {/* Time range selector */}
          <div className="p-1 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange(7)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 7
                  ? 'bg-rose-950 text-rose-200 border border-rose-850 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange(14)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 14
                  ? 'bg-rose-950 text-rose-200 border border-rose-850 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              14 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange(30)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 30
                  ? 'bg-rose-950 text-rose-200 border border-rose-850 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="p-1 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setChartMode('mood')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                chartMode === 'mood'
                  ? 'bg-stone-800 text-stone-100 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Mood Curve
            </button>
            <button
              type="button"
              onClick={() => setChartMode('correlation')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                chartMode === 'correlation'
                  ? 'bg-stone-800 text-stone-100 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Water & Sleep
            </button>
          </div>

          <button
            type="button"
            onClick={handleSeedDemoHistory}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
            title="Seed 30-Day Clinical Sample Journey"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Average Score */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-850 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
            Average Skin Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-amber-300">
              {stats.avgScore > 0 ? stats.avgScore : '—'}
            </span>
            <span className="text-[11px] text-stone-500">/ 6.0</span>
          </div>
          <span className="text-[10px] text-stone-400 block truncate">
            {stats.avgScore >= 5
              ? '✨ Highly Radiant & Luminous'
              : stats.avgScore >= 4
              ? '🌿 Balanced Acid Mantle'
              : '🍂 Rebuilding Moisture Barrier'}
          </span>
        </div>

        {/* Metric 2: Barrier Stability */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-850 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
            Barrier Health Days
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-emerald-400">
              {stats.optimalPercentage}%
            </span>
            <span className="text-[11px] text-stone-500">
              ({stats.optimalDaysCount}d)
            </span>
          </div>
          <span className="text-[10px] text-stone-400 block">
            Calm, Hydrated, or Radiant
          </span>
        </div>

        {/* Metric 3: Logging Consistency */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-850 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
            Journal Consistency
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-rose-300">
              {stats.loggedCount}
            </span>
            <span className="text-[11px] text-stone-500">/ {stats.totalDays} Days</span>
          </div>
          <span className="text-[10px] text-stone-400 block">
            {stats.loggedPercentage}% Completion Rate
          </span>
        </div>

        {/* Metric 4: Lifestyle Correlation */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-850 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
            Daily Averages
          </span>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-cyan-300 font-mono font-bold text-sm">
              💧 {stats.avgWater > 0 ? `${stats.avgWater} gl` : '—'}
            </span>
            <span className="text-indigo-300 font-mono font-bold text-sm">
              🌙 {stats.avgSleep > 0 ? `${stats.avgSleep}h` : '—'}
            </span>
          </div>
          <span className="text-[10px] text-stone-400 block">
            Water Intake & Sleep
          </span>
        </div>
      </div>

      {/* 3. Recharts Line Chart Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendData}
            margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="skinMoodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(150, 150, 150, 0.12)"
            />

            <XAxis
              dataKey="displayDate"
              stroke="#a8a29e"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }}
              interval={timeRange === 30 ? 3 : timeRange === 14 ? 1 : 0}
            />

            <YAxis
              domain={[1, 6]}
              ticks={[1, 2, 3, 4, 5, 6]}
              stroke="#a8a29e"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                const labels: Record<number, string> = {
                  6: '✨ Radiant',
                  5: '💧 Hydrated',
                  4: '🌿 Calm',
                  3: '🍂 Dry',
                  2: '🌸 Sensitive',
                  1: '🔴 Blemish',
                };
                return labels[val] || `${val}`;
              }}
            />

            {/* Reference Line for Baseline Calm Barrier (Level 4) */}
            <ReferenceLine
              y={4}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{
                value: 'Baseline Barrier Equilibrium',
                fill: '#10b981',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area fill under curve */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="none"
              fill="url(#skinMoodGradient)"
              connectNulls={connectUnlogged}
            />

            {/* Primary Skin Mood Trend Line */}
            <Line
              type="monotone"
              dataKey="score"
              name="Skin Mood Score"
              stroke="#f43f5e"
              strokeWidth={2.5}
              connectNulls={connectUnlogged}
              dot={<CustomDot />}
              activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2, fill: '#f43f5e' }}
            />

            {/* Correlation Mode: Water and Sleep secondary lines */}
            {chartMode === 'correlation' && (
              <>
                <Line
                  type="monotone"
                  dataKey="waterGlasses"
                  name="Water Glasses"
                  stroke="#06b6d4"
                  strokeWidth={1.8}
                  strokeDasharray="3 3"
                  connectNulls={connectUnlogged}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sleepHours"
                  name="Sleep Hours"
                  stroke="#818cf8"
                  strokeWidth={1.8}
                  strokeDasharray="4 2"
                  connectNulls={connectUnlogged}
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Chart Footer Legend & Educational Guidance */}
      <div className="pt-3 border-t border-stone-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30" />
            <span>✨ Radiant (6)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" />
            <span>💧 Hydrated (5)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
            <span>🌿 Calm (4)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 ring-2 ring-rose-400/30" />
            <span>🌸 Sensitive (2)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 ring-2 ring-red-400/30" />
            <span>🔴 Blemish (1)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[11px] text-stone-400 cursor-pointer">
            <input
              type="checkbox"
              checked={connectUnlogged}
              onChange={(e) => setConnectUnlogged(e.target.checked)}
              className="rounded bg-stone-900 border-stone-800 text-rose-500 focus:ring-0"
            />
            <span>Connect Unlogged Days</span>
          </label>
        </div>
      </div>
    </div>
  );
};
