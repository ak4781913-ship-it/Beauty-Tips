import { toLocalDateString, recordDailyActivity } from './streak';

export type SkinMood = 'radiant' | 'calm' | 'hydrated' | 'reactive' | 'dry' | 'breakout';

export interface SkinMoodConfig {
  id: SkinMood;
  label: string;
  emoji: string;
  desc: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  dotClass: string;
}

export const SKIN_MOODS: SkinMoodConfig[] = [
  {
    id: 'radiant',
    label: 'Radiant Glow',
    emoji: '✨',
    desc: 'Bouncy, luminous, vibrant',
    colorClass: 'text-amber-300',
    bgClass: 'bg-amber-950/40',
    borderClass: 'border-amber-700/60',
    dotClass: 'bg-amber-400',
  },
  {
    id: 'calm',
    label: 'Calm & Balanced',
    emoji: '🌿',
    desc: 'Even tone, no redness, peaceful',
    colorClass: 'text-emerald-300',
    bgClass: 'bg-emerald-950/40',
    borderClass: 'border-emerald-700/60',
    dotClass: 'bg-emerald-400',
  },
  {
    id: 'hydrated',
    label: 'Deeply Hydrated',
    emoji: '💧',
    desc: 'Plump, dewy, supple',
    colorClass: 'text-cyan-300',
    bgClass: 'bg-cyan-950/40',
    borderClass: 'border-cyan-700/60',
    dotClass: 'bg-cyan-400',
  },
  {
    id: 'dry',
    label: 'Dry / Tight',
    emoji: '🍂',
    desc: 'Craving lipids, slight flaking',
    colorClass: 'text-orange-300',
    bgClass: 'bg-orange-950/40',
    borderClass: 'border-orange-700/60',
    dotClass: 'bg-orange-400',
  },
  {
    id: 'reactive',
    label: 'Sensitive / Flushed',
    emoji: '🌸',
    desc: 'Stinging, windburn, fragile barrier',
    colorClass: 'text-rose-300',
    bgClass: 'bg-rose-950/40',
    borderClass: 'border-rose-700/60',
    dotClass: 'bg-rose-400',
  },
  {
    id: 'breakout',
    label: 'Congested / Blemish',
    emoji: '🔴',
    desc: 'Active spots, clogged pores',
    colorClass: 'text-red-300',
    bgClass: 'bg-red-950/40',
    borderClass: 'border-red-700/60',
    dotClass: 'bg-red-400',
  },
];

export const POPULAR_PRODUCTS_TAGS = [
  'Gentle Low-pH Cleanser',
  'Oil Cleanser / Balm',
  'Hyaluronic Essence',
  'Vitamin C 15%',
  'Niacinamide Serum',
  'Salicylic Acid (BHA)',
  'Gentle Retinoid',
  'Ceramide Cream',
  'Squalane Oil',
  'Broad-Spectrum SPF 50',
  'Centella Gel',
  'Soothing Sheet Mask',
  'Slugging Balm',
  'Scalp Rosemary Oil',
];

export interface BeautyJournalEntry {
  date: string; // 'YYYY-MM-DD'
  updatedAt: number;
  skinMood: SkinMood;
  productsUsed: string[];
  observations: string;
  waterGlasses?: number; // 0-12
  sleepHours?: number; // 0-12
  stressLevel?: 'low' | 'moderate' | 'high';
}

export const JOURNAL_STORAGE_KEY = 'beauty_skin_journal_entries';
export const JOURNAL_EVENT = 'beauty_journal_updated';

/**
 * Retrieves all journal entries as a record keyed by date 'YYYY-MM-DD'
 */
export function getAllJournalEntries(): Record<string, BeautyJournalEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return getInitialDemoEntries();
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Returns journal entry for a specific date, or undefined
 */
export function getJournalEntryForDate(dateStr: string): BeautyJournalEntry | undefined {
  const entries = getAllJournalEntries();
  return entries[dateStr];
}

/**
 * Saves or updates a journal entry and triggers daily streak reward
 */
export function saveJournalEntry(entry: BeautyJournalEntry): void {
  try {
    const entries = getAllJournalEntries();
    entries[entry.date] = {
      ...entry,
      updatedAt: Date.now(),
    };
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));

    // Award daily streak for logging in the journal
    recordDailyActivity();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(JOURNAL_EVENT));
    }
  } catch (err) {
    console.error('Failed to save beauty journal entry:', err);
  }
}

/**
 * Deletes an entry for a specific date
 */
export function deleteJournalEntry(dateStr: string): void {
  try {
    const entries = getAllJournalEntries();
    if (entries[dateStr]) {
      delete entries[dateStr];
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(JOURNAL_EVENT));
      }
    }
  } catch (err) {
    console.error('Failed to delete journal entry:', err);
  }
}

/**
 * Calculates monthly analytics for a given month and year
 */
export interface MonthlyOverviewStats {
  year: number;
  month: number; // 0-indexed
  monthName: string;
  totalDaysInMonth: number;
  loggedDaysCount: number;
  completionRate: number;
  moodCounts: Record<SkinMood, number>;
  topMood: SkinMoodConfig | null;
  topProducts: { name: string; count: number }[];
}

export function calculateMonthlyStats(
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth()
): MonthlyOverviewStats {
  const entries = getAllJournalEntries();
  const dateObj = new Date(year, month, 1);
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthEntries = Object.values(entries).filter((e) => e.date.startsWith(monthPrefix));

  const moodCounts: Record<SkinMood, number> = {
    radiant: 0,
    calm: 0,
    hydrated: 0,
    reactive: 0,
    dry: 0,
    breakout: 0,
  };

  const productCounts: Record<string, number> = {};

  monthEntries.forEach((entry) => {
    if (moodCounts[entry.skinMood] !== undefined) {
      moodCounts[entry.skinMood]++;
    }
    entry.productsUsed.forEach((prod) => {
      productCounts[prod] = (productCounts[prod] || 0) + 1;
    });
  });

  // Determine top mood
  let maxMoodCount = 0;
  let topMoodId: SkinMood | null = null;
  (Object.keys(moodCounts) as SkinMood[]).forEach((m) => {
    if (moodCounts[m] > maxMoodCount) {
      maxMoodCount = moodCounts[m];
      topMoodId = m;
    }
  });

  const topMood = topMoodId ? SKIN_MOODS.find((m) => m.id === topMoodId) || null : null;

  // Determine top products
  const topProducts = Object.entries(productCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const loggedDaysCount = monthEntries.length;
  const completionRate = Math.round((loggedDaysCount / totalDaysInMonth) * 100);

  return {
    year,
    month,
    monthName,
    totalDaysInMonth,
    loggedDaysCount,
    completionRate,
    moodCounts,
    topMood,
    topProducts,
  };
}

export const MOOD_SCORES: Record<SkinMood, number> = {
  radiant: 6,
  hydrated: 5,
  calm: 4,
  dry: 3,
  reactive: 2,
  breakout: 1,
};

export const SCORE_TO_MOOD_CONFIG: Record<
  number,
  { mood: SkinMood; label: string; emoji: string; color: string; hex: string }
> = {
  6: { mood: 'radiant', label: 'Radiant Glow', emoji: '✨', color: 'text-amber-300', hex: '#f59e0b' },
  5: { mood: 'hydrated', label: 'Deeply Hydrated', emoji: '💧', color: 'text-cyan-300', hex: '#06b6d4' },
  4: { mood: 'calm', label: 'Calm & Balanced', emoji: '🌿', color: 'text-emerald-300', hex: '#10b981' },
  3: { mood: 'dry', label: 'Dry / Tight', emoji: '🍂', color: 'text-orange-300', hex: '#f97316' },
  2: { mood: 'reactive', label: 'Sensitive / Flushed', emoji: '🌸', color: 'text-rose-300', hex: '#f43f5e' },
  1: { mood: 'breakout', label: 'Congested / Blemish', emoji: '🔴', color: 'text-red-400', hex: '#ef4444' },
};

export interface DayMoodTrendPoint {
  date: string; // 'YYYY-MM-DD'
  displayDate: string; // 'Oct 12'
  shortDay: string; // 'Mo'
  dayNum: number;
  hasEntry: boolean;
  score: number | null;
  skinMood?: SkinMood;
  moodLabel?: string;
  moodEmoji?: string;
  moodHex?: string;
  waterGlasses?: number;
  sleepHours?: number;
  stressLevel?: 'low' | 'moderate' | 'high';
  productsUsed?: string[];
  observations?: string;
}

/**
 * Transforms stored journal entries into an ordered array of 30 daily data points for Recharts.
 */
export function get30DaySkinMoodTrendData(
  entries: Record<string, BeautyJournalEntry>,
  daysCount: number = 30
): DayMoodTrendPoint[] {
  const points: DayMoodTrendPoint[] = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - i);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const displayDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const shortDay = targetDate.toLocaleDateString('en-US', { weekday: 'narrow' });

    const entry = entries[dateStr];

    if (entry) {
      const moodConfig = SCORE_TO_MOOD_CONFIG[MOOD_SCORES[entry.skinMood] || 4];
      points.push({
        date: dateStr,
        displayDate,
        shortDay,
        dayNum: targetDate.getDate(),
        hasEntry: true,
        score: MOOD_SCORES[entry.skinMood] ?? 4,
        skinMood: entry.skinMood,
        moodLabel: moodConfig?.label || entry.skinMood,
        moodEmoji: moodConfig?.emoji || '✨',
        moodHex: moodConfig?.hex || '#f59e0b',
        waterGlasses: entry.waterGlasses ?? 8,
        sleepHours: entry.sleepHours ?? 8,
        stressLevel: entry.stressLevel ?? 'low',
        productsUsed: entry.productsUsed || [],
        observations: entry.observations || '',
      });
    } else {
      points.push({
        date: dateStr,
        displayDate,
        shortDay,
        dayNum: targetDate.getDate(),
        hasEntry: false,
        score: null,
      });
    }
  }

  return points;
}

/**
 * Generates an authentic 30-day skin healing journey showing progression from reactive to radiant
 */
export function generate30DayDemoHistory(): Record<string, BeautyJournalEntry> {
  const now = new Date();
  const demo: Record<string, BeautyJournalEntry> = {};

  // Curated 30-day timeline demonstrating barrier recovery under Abbas's principles
  const timelineData: Array<{
    daysAgo: number;
    mood: SkinMood;
    products: string[];
    notes: string;
    water: number;
    sleep: number;
    stress: 'low' | 'moderate' | 'high';
  }> = [
    {
      daysAgo: 29,
      mood: 'breakout',
      products: ['Salicylic Acid (BHA)', 'Gentle Low-pH Cleanser'],
      notes: 'Active blemish flare-up along jawline. Stripped skin barrier from over-exfoliating.',
      water: 6,
      sleep: 6,
      stress: 'high',
    },
    {
      daysAgo: 28,
      mood: 'reactive',
      products: ['Gentle Low-pH Cleanser', 'Centella Gel'],
      notes: 'Cheeks are stinging and flushed. Switched to minimal calming routine.',
      water: 7,
      sleep: 6.5,
      stress: 'moderate',
    },
    {
      daysAgo: 26,
      mood: 'dry',
      products: ['Gentle Low-pH Cleanser', 'Ceramide Cream'],
      notes: 'Flaking around mouth. Applied Abbas ceramide sandwich method.',
      water: 8,
      sleep: 7,
      stress: 'moderate',
    },
    {
      daysAgo: 25,
      mood: 'dry',
      products: ['Oil Cleanser / Balm', 'Ceramide Cream', 'Slugging Balm'],
      notes: 'Evening slugging over dry patches. Woke up feeling much softer.',
      water: 8,
      sleep: 7.5,
      stress: 'low',
    },
    {
      daysAgo: 24,
      mood: 'calm',
      products: ['Gentle Low-pH Cleanser', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Redness substantially calmed down. No burning during morning rinse.',
      water: 9,
      sleep: 8,
      stress: 'low',
    },
    {
      daysAgo: 22,
      mood: 'calm',
      products: ['Gentle Low-pH Cleanser', 'Hyaluronic Essence', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Introduced hyaluronic acid on damp skin. Hydration retention is holding up well.',
      water: 8,
      sleep: 7.5,
      stress: 'low',
    },
    {
      daysAgo: 21,
      mood: 'hydrated',
      products: ['Oil Cleanser / Balm', 'Hyaluronic Essence', 'Centella Gel', 'Ceramide Cream'],
      notes: 'Skin feels bouncy and supple after double cleansing ritual.',
      water: 10,
      sleep: 8,
      stress: 'low',
    },
    {
      daysAgo: 19,
      mood: 'calm',
      products: ['Gentle Low-pH Cleanser', 'Niacinamide Serum', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Tested low-percentage niacinamide for pore refinement. Zero tingling.',
      water: 8,
      sleep: 7,
      stress: 'moderate',
    },
    {
      daysAgo: 18,
      mood: 'hydrated',
      products: ['Gentle Low-pH Cleanser', 'Hyaluronic Essence', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Plump texture throughout the day. Makeup sat smoothly without creasing.',
      water: 9,
      sleep: 8,
      stress: 'low',
    },
    {
      daysAgo: 16,
      mood: 'radiant',
      products: ['Gentle Low-pH Cleanser', 'Vitamin C 15%', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Layered stabilized Vitamin C under SPF 50. First noticeable glass skin glow!',
      water: 10,
      sleep: 8.5,
      stress: 'low',
    },
    {
      daysAgo: 15,
      mood: 'hydrated',
      products: ['Oil Cleanser / Balm', 'Hyaluronic Essence', 'Ceramide Cream', 'Slugging Balm'],
      notes: 'Post-flight barrier rescue ritual. Deep hydration restored overnight.',
      water: 11,
      sleep: 8,
      stress: 'moderate',
    },
    {
      daysAgo: 13,
      mood: 'calm',
      products: ['Gentle Low-pH Cleanser', 'Gentle Retinoid', 'Ceramide Cream'],
      notes: 'Cautious buffer application of gentle retinoid over moisturizer.',
      water: 8,
      sleep: 7.5,
      stress: 'low',
    },
    {
      daysAgo: 12,
      mood: 'hydrated',
      products: ['Gentle Low-pH Cleanser', 'Centella Gel', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Retinoid rest day. Barrier feels fortified and zero peeling.',
      water: 9,
      sleep: 8,
      stress: 'low',
    },
    {
      daysAgo: 10,
      mood: 'radiant',
      products: ['Gentle Low-pH Cleanser', 'Vitamin C 15%', 'Niacinamide Serum', 'Broad-Spectrum SPF 50'],
      notes: 'Luminous complexion and refined texture. Compliments from colleagues.',
      water: 10,
      sleep: 8,
      stress: 'low',
    },
    {
      daysAgo: 9,
      mood: 'hydrated',
      products: ['Oil Cleanser / Balm', 'Soothing Sheet Mask', 'Ceramide Cream'],
      notes: 'Evening soothing mask ritual. Plump, dew-drenched skin feel.',
      water: 9,
      sleep: 8.5,
      stress: 'low',
    },
    {
      daysAgo: 7,
      mood: 'calm',
      products: ['Gentle Low-pH Cleanser', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Solid baseline. Balanced sebum levels throughout afternoon.',
      water: 8,
      sleep: 7,
      stress: 'moderate',
    },
    {
      daysAgo: 6,
      mood: 'radiant',
      products: ['Gentle Low-pH Cleanser', 'Vitamin C 15%', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Radiant morning glow that lasted all day without excess shine.',
      water: 10,
      sleep: 8,
      stress: 'low',
    },
    {
      daysAgo: 4,
      mood: 'calm',
      products: ['Gentle Low-pH Cleanser', 'Ceramide Cream', 'Broad-Spectrum SPF 50'],
      notes: 'Skin barrier felt calm all day. No stinging around cheekbones.',
      water: 8,
      sleep: 8,
      stress: 'low',
    },
    {
      daysAgo: 2,
      mood: 'hydrated',
      products: ['Oil Cleanser / Balm', 'Hyaluronic Essence', 'Centella Gel', 'Slugging Balm'],
      notes: 'Slugging on cheekbones gave incredible morning bounce and hydration.',
      water: 9,
      sleep: 7.5,
      stress: 'low',
    },
    {
      daysAgo: 1,
      mood: 'radiant',
      products: ['Gentle Low-pH Cleanser', 'Vitamin C 15%', 'Niacinamide Serum', 'Broad-Spectrum SPF 50'],
      notes: 'Vitamin C + SPF gave a healthy glass skin glow during daytime meetings.',
      water: 10,
      sleep: 8,
      stress: 'low',
    },
  ];

  timelineData.forEach((item) => {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - item.daysAgo);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dStr = `${year}-${month}-${day}`;

    demo[dStr] = {
      date: dStr,
      updatedAt: targetDate.getTime(),
      skinMood: item.mood,
      productsUsed: item.products,
      observations: item.notes,
      waterGlasses: item.water,
      sleepHours: item.sleep,
      stressLevel: item.stress,
    };
  });

  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(demo));
  } catch {
    // ignore
  }

  return demo;
}

/**
 * Demo seed entries so users immediately see a lively monthly view upon first visit
 */
function getInitialDemoEntries(): Record<string, BeautyJournalEntry> {
  return generate30DayDemoHistory();
}
