export interface BeautyAffirmation {
  id: string;
  quote: string;
  theme: string;
  themeCategory: 'barrier' | 'mindfulness' | 'consistency' | 'glow' | 'compassion' | 'protection';
  author: string;
  reflectionPrompt: string;
}

export const BEAUTY_AFFIRMATIONS: BeautyAffirmation[] = [
  {
    id: 'aff-barrier-ecosystem',
    quote: 'Your skin is not a canvas to cover or correct, but a living ecosystem to nourish with patience and gentle discipline.',
    theme: 'Acid Mantle & Skin Biology',
    themeCategory: 'barrier',
    author: 'Abbas, Skincare Formulator',
    reflectionPrompt: 'When cleansing today, treat your moisture barrier like delicate silk. No harsh tugging.',
  },
  {
    id: 'aff-consistency-over-complexity',
    quote: 'Consistency will always outshine complexity. Four intentional steps practiced daily will heal what ten erratic products never could.',
    theme: 'Ritual Discipline',
    themeCategory: 'consistency',
    author: 'Abbas, Formulation Educator',
    reflectionPrompt: 'Commit to your basic 3-step ritual tonight without rushing.',
  },
  {
    id: 'aff-healing-pace',
    quote: 'Cellular renewal takes time. Honor the pace of your stratum corneum and trust the quiet healing happening underneath.',
    theme: 'Cellular Patience',
    themeCategory: 'barrier',
    author: 'Abbas, Clinical Wisdom',
    reflectionPrompt: 'Notice one area of your skin that feels soft and hydrated today, and celebrate it.',
  },
  {
    id: 'aff-radiance-within',
    quote: 'True radiance is not perfection; it is deep hydration, self-acceptance, and honoring the skin you wake up in every morning.',
    theme: 'Inner & Outer Glow',
    themeCategory: 'glow',
    author: 'Abbas, Natural Beauty Wisdom',
    reflectionPrompt: 'Take three slow, grounding breaths before applying your morning antioxidant serum.',
  },
  {
    id: 'aff-sun-gratitude',
    quote: 'Applying sunscreen today is a gift of gratitude to your future self. Shield your light with steadfast devotion.',
    theme: 'Photoprotection',
    themeCategory: 'protection',
    author: 'Abbas, Skincare Educator',
    reflectionPrompt: 'Apply your two full finger lengths of SPF today with mindful appreciation for UV defense.',
  },
  {
    id: 'aff-gentle-touch',
    quote: 'The way you touch your face matters as much as the formulations you apply. Press in moisture with gentleness and respect.',
    theme: 'Mindful Application',
    themeCategory: 'mindfulness',
    author: 'Abbas, Ritual Philosophy',
    reflectionPrompt: 'Use the warmth of your clean palms to gently press your moisturizer into your cheeks.',
  },
  {
    id: 'aff-stress-anti-inflammatory',
    quote: 'A peaceful breath is the most potent anti-inflammatory compound you have access to. Release tension from your jaw and forehead.',
    theme: 'Nervous System & Complexion',
    themeCategory: 'mindfulness',
    author: 'Abbas, Holistic Care',
    reflectionPrompt: 'Consciously drop your shoulders and relax your brow right now.',
  },
  {
    id: 'aff-comparison-free',
    quote: 'Do not compare your bare skin to filtered highlights. Your texture tells the real story of resilience, laughter, and living.',
    theme: 'Authentic Skin',
    themeCategory: 'compassion',
    author: 'Abbas, Everyday Beauty',
    reflectionPrompt: 'Look in the mirror today and smile at your natural bare skin without judgment.',
  },
  {
    id: 'aff-ceramides-replenish',
    quote: 'Replenishing ceramides and lipids is an act of self-preservation. When your barrier is strong, external irritation fades away.',
    theme: 'Barrier Resilience',
    themeCategory: 'barrier',
    author: 'Abbas, Barrier Specialist',
    reflectionPrompt: 'Layer a nourishing lipid cream tonight to seal in your water hydration.',
  },
  {
    id: 'aff-sleep-reparative',
    quote: 'No serum can substitute for the reparative circadian repair of deep sleep. Rest deeply, and allow your cells to regenerate.',
    theme: 'Circadian Recovery',
    themeCategory: 'consistency',
    author: 'Abbas, Nocturnal Biology',
    reflectionPrompt: 'Turn off harsh blue-light screens 30 minutes before bed tonight for nocturnal cellular renewal.',
  },
  {
    id: 'aff-acne-compassion',
    quote: 'Breakouts are not personal failures; they are temporary inflammatory signals from your pores asking for gentle care, not punishment.',
    theme: 'Blemish Compassion',
    themeCategory: 'compassion',
    author: 'Abbas, Clarifying Care',
    reflectionPrompt: 'Do not pick or scrub active blemishes today; apply a soothing cold compress or hydrocolloid instead.',
  },
  {
    id: 'aff-water-infusion',
    quote: 'Hydration is the fountainhead of cellular elasticity. Drink pure water and pat botanical essences into damp, welcoming skin.',
    theme: 'Deep Hydration',
    themeCategory: 'glow',
    author: 'Abbas, Formulation Wisdom',
    reflectionPrompt: 'Never let your humectants dry out; apply your hyaluronic essence while your face is freshly damp.',
  },
  {
    id: 'aff-sacred-minutes',
    quote: 'Your morning skincare ritual is not a chore—it is five sacred minutes where you dedicate complete care to yourself before giving to the world.',
    theme: 'Morning Sanctuary',
    themeCategory: 'mindfulness',
    author: 'Abbas, Self-Care Rituals',
    reflectionPrompt: 'Protect these five morning minutes as uninterrupted quiet time for yourself.',
  },
  {
    id: 'aff-aging-grace',
    quote: 'Lines of expression are proof of a life fully lived, loved, and deeply felt. Treat maturing skin with reverence, moisture, and peptides.',
    theme: 'Timeless Beauty',
    themeCategory: 'compassion',
    author: 'Abbas, Pro-Aging Philosophy',
    reflectionPrompt: 'Gently massage your smile lines with uplifting circular motions today.',
  },
  {
    id: 'aff-scalp-wellness',
    quote: 'Lush hair is born from nourished scalp roots. Treat your scalp like the fertile soil from which your crown blooms.',
    theme: 'Trichology & Hair Care',
    themeCategory: 'consistency',
    author: 'Abbas, Scalp Care Specialist',
    reflectionPrompt: 'Give yourself a 2-minute stimulating scalp massage with clean fingertips today.',
  },
  {
    id: 'aff-nature-remedies',
    quote: 'The simplest remedies—aloe, oat, rose, and green tea—carry centuries of botanical wisdom. Let nature calm your skin today.',
    theme: 'Botanical Harmony',
    themeCategory: 'glow',
    author: 'Abbas, Natural Remedies',
    reflectionPrompt: 'Brew a cup of antioxidant green tea and let the warm steam gently soften your complexion.',
  },
  {
    id: 'aff-boundary-protection',
    quote: 'Saying no to overwhelming stress is the ultimate antioxidant shield. Guard your energy as fiercely as you guard your UV barrier.',
    theme: 'Emotional Antioxidant',
    themeCategory: 'protection',
    author: 'Abbas, Mindful Living',
    reflectionPrompt: 'Set one healthy boundary today that brings calm and clarity to your afternoon.',
  },
  {
    id: 'aff-slow-beauty',
    quote: 'Beauty cannot be rushed by aggressive acid peeling. Slow beauty, built on balanced pH and lipid cement, creates lasting health.',
    theme: 'Slow Beauty Movement',
    themeCategory: 'barrier',
    author: 'Abbas, Formulation Educator',
    reflectionPrompt: 'Pause strong active exfoliants today and give your skin a restorative barrier rest day.',
  },
  {
    id: 'aff-evening-unwind',
    quote: 'As you wash away the day with an evening oil cleanse, let go of every heavy thought you carried since morning.',
    theme: 'Evening Release',
    themeCategory: 'mindfulness',
    author: 'Abbas, Double Cleanse Ritual',
    reflectionPrompt: 'Visualize melting away mental fatigue as your oil cleanser dissolves surface impurities.',
  },
  {
    id: 'aff-everyday-confidence',
    quote: 'You do not need an occasion to feel beautiful. Every single day of breath and life is worthy of radiant self-care.',
    theme: 'Everyday Worth',
    themeCategory: 'glow',
    author: 'Abbas, Everyday Beauty',
    reflectionPrompt: 'Wear your favorite lip balm or facial mist today simply for your own private joy.',
  },
  {
    id: 'aff-patience-progress',
    quote: 'Notice progress in the small triumphs: a calmer forehead, a less reactive cheek, a softer smile. Healing is happening.',
    theme: 'Micro Triumphs',
    themeCategory: 'compassion',
    author: 'Abbas, Clinical Wisdom',
    reflectionPrompt: 'Write down or mentally note one small skincare improvement you appreciate.',
  },
];

export const STORAGE_KEY_DAILY_AFFIRMATION = 'beauty_daily_affirmation_state';
export const STORAGE_KEY_FAVORITE_AFFIRMATIONS = 'beauty_favorited_affirmations';
export const AFFIRMATION_UPDATED_EVENT = 'beauty_affirmation_updated';

export interface DailyAffirmationState {
  dateKey: string; // YYYY-MM-DD
  affirmationId: string;
  cycleIndex: number;
  lastUpdated: number;
}

/**
 * Generates formatted today date string YYYY-MM-DD
 */
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats date nicely e.g. "Saturday, October 17"
 */
export function getFormattedTodayDisplay(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Deterministically picks today's default affirmation based on day of year,
 * ensuring everyone receives the same cohesive daily wisdom for that calendar date.
 */
function getDeterministicDayIndex(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % BEAUTY_AFFIRMATIONS.length;
}

/**
 * Retrieves or initializes today's stored affirmation
 */
export function getStoredDailyAffirmation(): {
  affirmation: BeautyAffirmation;
  isToday: boolean;
  dateKey: string;
  displayDate: string;
  favorites: string[];
} {
  const todayKey = getTodayDateKey();
  const displayDate = getFormattedTodayDisplay();
  const favorites = getFavoritedAffirmationIds();

  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAILY_AFFIRMATION);
    if (raw) {
      const state: DailyAffirmationState = JSON.parse(raw);
      // Check if state belongs to today
      if (state.dateKey === todayKey && state.affirmationId) {
        const found = BEAUTY_AFFIRMATIONS.find((a) => a.id === state.affirmationId);
        if (found) {
          return {
            affirmation: found,
            isToday: true,
            dateKey: todayKey,
            displayDate,
            favorites,
          };
        }
      }
    }
  } catch (err) {
    console.error('Error parsing stored affirmation state:', err);
  }

  // Calculate today's default affirmation deterministically
  const defaultIndex = getDeterministicDayIndex(todayKey);
  const todayAffirmation = BEAUTY_AFFIRMATIONS[defaultIndex];

  // Persist state in localStorage
  const newState: DailyAffirmationState = {
    dateKey: todayKey,
    affirmationId: todayAffirmation.id,
    cycleIndex: defaultIndex,
    lastUpdated: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_DAILY_AFFIRMATION, JSON.stringify(newState));
  } catch (err) {
    console.error('Failed to save daily affirmation state:', err);
  }

  return {
    affirmation: todayAffirmation,
    isToday: true,
    dateKey: todayKey,
    displayDate,
    favorites,
  };
}

/**
 * Switches to next affirmation on user request (with local storage persistence)
 */
export function cycleNextAffirmation(): BeautyAffirmation {
  const todayKey = getTodayDateKey();
  let currentIndex = getDeterministicDayIndex(todayKey);

  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAILY_AFFIRMATION);
    if (raw) {
      const state: DailyAffirmationState = JSON.parse(raw);
      currentIndex = state.cycleIndex ?? currentIndex;
    }
  } catch (err) {
    // ignore
  }

  const nextIndex = (currentIndex + 1) % BEAUTY_AFFIRMATIONS.length;
  const nextAffirmation = BEAUTY_AFFIRMATIONS[nextIndex];

  const newState: DailyAffirmationState = {
    dateKey: todayKey,
    affirmationId: nextAffirmation.id,
    cycleIndex: nextIndex,
    lastUpdated: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_DAILY_AFFIRMATION, JSON.stringify(newState));
    window.dispatchEvent(new CustomEvent(AFFIRMATION_UPDATED_EVENT));
  } catch (err) {
    console.error('Failed to persist cycle affirmation:', err);
  }

  return nextAffirmation;
}

/**
 * Retrieves favorited affirmation IDs from localStorage
 */
export function getFavoritedAffirmationIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITE_AFFIRMATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Toggles bookmark/favorite for an affirmation ID in localStorage
 */
export function toggleFavoriteAffirmationId(id: string): boolean {
  try {
    const current = getFavoritedAffirmationIds();
    let updated: string[];
    let isNowFavorited = false;

    if (current.includes(id)) {
      updated = current.filter((x) => x !== id);
      isNowFavorited = false;
    } else {
      updated = [...current, id];
      isNowFavorited = true;
    }

    localStorage.setItem(STORAGE_KEY_FAVORITE_AFFIRMATIONS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(AFFIRMATION_UPDATED_EVENT));
    return isNowFavorited;
  } catch (err) {
    console.error('Failed to toggle favorite affirmation:', err);
    return false;
  }
}
