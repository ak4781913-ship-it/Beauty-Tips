import { getRecentHistory } from './recentHistory';
import { getDailyStreak, DailyStreakData } from './streak';
import { calculateWeeklyProgress } from './readingGoal';

export const MILESTONES_STORAGE_KEY = 'beauty_unlocked_milestones';
export const MILESTONES_EVENT = 'beauty_milestones_updated';

export interface MilestoneDef {
  id: string;
  badgeName: string;
  title: string;
  description: string;
  category: 'habit' | 'skincare' | 'ritual' | 'curator';
  iconName: string; // Identifier for UI icon
  target: number;
  unit: string;
  rewardTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface BeautyMilestone extends MilestoneDef {
  current: number;
  progressPercentage: number;
  isUnlocked: boolean;
  unlockedAt?: number; // timestamp
}

export const MILESTONE_DEFINITIONS: MilestoneDef[] = [
  {
    id: 'first-step',
    badgeName: 'Curious Seeker',
    title: 'First Step',
    description: 'Read your first beauty ritual guide and embark on conscious skincare.',
    category: 'habit',
    iconName: 'Sparkles',
    target: 1,
    unit: 'tip read',
    rewardTier: 'bronze',
  },
  {
    id: 'skincare-guru',
    badgeName: 'Skincare Guru',
    title: 'Barrier Master',
    description: 'Read 5 comprehensive skincare articles on skin barriers, hydration, and actives.',
    category: 'skincare',
    iconName: 'ShieldCheck',
    target: 5,
    unit: 'skincare guides',
    rewardTier: 'silver',
  },
  {
    id: 'morning-ritualist',
    badgeName: 'Morning Ritualist',
    title: 'Dawn Alchemist',
    description: 'Explore 3 morning-focused routines or antioxidant defense rituals.',
    category: 'ritual',
    iconName: 'Sun',
    target: 3,
    unit: 'morning rituals',
    rewardTier: 'silver',
  },
  {
    id: 'evening-restorer',
    badgeName: 'Evening Restorer',
    title: 'Nocturnal Glow',
    description: 'Read 3 restorative night care routines, slugging guides, or barrier repair rituals.',
    category: 'ritual',
    iconName: 'Moon',
    target: 3,
    unit: 'evening rituals',
    rewardTier: 'silver',
  },
  {
    id: 'botanical-alchemist',
    badgeName: 'Botanical Alchemist',
    title: 'Herbal Specialist',
    description: 'Read 3 natural remedies, botanicals, or hair microcirculation guides.',
    category: 'skincare',
    iconName: 'Leaf',
    target: 3,
    unit: 'botanical guides',
    rewardTier: 'silver',
  },
  {
    id: 'streak-3-days',
    badgeName: 'Flame Ignited',
    title: '3-Day Reading Streak',
    description: 'Read at least one beauty tip every day for 3 consecutive days.',
    category: 'habit',
    iconName: 'Flame',
    target: 3,
    unit: 'consecutive days',
    rewardTier: 'silver',
  },
  {
    id: 'streak-7-days',
    badgeName: 'Sacred Ritualist',
    title: '7-Day Reading Streak',
    description: 'Maintain a 7-day unbroken daily reading habit to establish deep skin discipline.',
    category: 'habit',
    iconName: 'Award',
    target: 7,
    unit: 'consecutive days',
    rewardTier: 'gold',
  },
  {
    id: 'weekly-goal-champion',
    badgeName: 'Goal Crusher',
    title: 'Weekly Champion',
    description: 'Complete 100% of your weekly reading target.',
    category: 'habit',
    iconName: 'Trophy',
    target: 1,
    unit: 'goal completed',
    rewardTier: 'gold',
  },
  {
    id: 'vault-curator',
    badgeName: 'Vault Curator',
    title: 'Archive Keeper',
    description: 'Save 5 or more essential beauty rituals to your personal saved vault.',
    category: 'curator',
    iconName: 'Bookmark',
    target: 5,
    unit: 'saved tips',
    rewardTier: 'bronze',
  },
  {
    id: 'beauty-scholar',
    badgeName: 'Beauty Scholar',
    title: 'Grand Formulator',
    description: 'Read 12 beauty articles across any category in the Abbas library.',
    category: 'skincare',
    iconName: 'GraduationCap',
    target: 12,
    unit: 'total guides',
    rewardTier: 'platinum',
  },
  {
    id: 'quiz-master',
    badgeName: 'Quiz Master',
    title: 'Knowledge Ascendant',
    description: 'Complete the Daily Beauty Quiz challenge with a 100% score.',
    category: 'habit',
    iconName: 'Brain',
    target: 1,
    unit: 'perfect quiz',
    rewardTier: 'gold',
  },
];

/**
 * Gets recorded unlock timestamps from localStorage: { [milestoneId]: timestamp }
 */
export function getStoredUnlockedMilestones(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MILESTONES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Evaluates current user progress against all milestone definitions,
 * records newly unlocked milestones, and returns full state.
 */
export function evaluateMilestones(favoritesList?: string[]): {
  milestones: BeautyMilestone[];
  unlockedCount: number;
  totalCount: number;
  newlyUnlocked: BeautyMilestone[];
} {
  const history = getRecentHistory();
  const streak = getDailyStreak();
  const weekly = calculateWeeklyProgress();

  let favoritesCount = 0;
  if (favoritesList && Array.isArray(favoritesList)) {
    favoritesCount = favoritesList.length;
  } else if (typeof window !== 'undefined') {
    try {
      const rawFav = localStorage.getItem('beauty_favorites_abbas');
      if (rawFav) {
        const arr = JSON.parse(rawFav);
        if (Array.isArray(arr)) favoritesCount = arr.length;
      }
    } catch {
      // ignore
    }
  }

  const storedUnlocks = getStoredUnlockedMilestones();
  const newlyUnlocked: BeautyMilestone[] = [];
  const updatedUnlocks = { ...storedUnlocks };

  // Calculate category counts from reading history
  const totalReadCount = history.length;

  const skincareCategories = new Set([
    'skin-care',
    'dry-skin',
    'oily-skin',
    'acne-pimples',
    'dark-spots',
    'sun-skincare',
  ]);
  const skincareCount = history.filter((h) => skincareCategories.has(h.category)).length;

  const botanicalCount = history.filter(
    (h) => h.category === 'natural-remedies' || h.category === 'hair-care'
  ).length;

  // Morning / Evening heuristic (either by title/content keywords or timestamps)
  const morningCount = history.filter((h) => {
    const titleLower = h.title.toLowerCase();
    const isMorningTitle =
      titleLower.includes('sunscreen') ||
      titleLower.includes('morning') ||
      titleLower.includes('vitamin c') ||
      titleLower.includes('cleanse') ||
      titleLower.includes('prep');
    const readHour = new Date(h.visitedAt).getHours();
    return isMorningTitle || (readHour >= 5 && readHour < 12);
  }).length;

  const eveningCount = history.filter((h) => {
    const titleLower = h.title.toLowerCase();
    const isNightTitle =
      titleLower.includes('night') ||
      titleLower.includes('evening') ||
      titleLower.includes('slugging') ||
      titleLower.includes('ceramide') ||
      titleLower.includes('repair') ||
      titleLower.includes('barrier') ||
      titleLower.includes('overnight');
    const readHour = new Date(h.visitedAt).getHours();
    return isNightTitle || (readHour >= 18 || readHour < 4);
  }).length;

  const bestStreak = Math.max(streak.bestStreak || 0, streak.currentStreak || 0);

  const results: BeautyMilestone[] = MILESTONE_DEFINITIONS.map((def) => {
    let current = 0;
    switch (def.id) {
      case 'first-step':
        current = totalReadCount;
        break;
      case 'skincare-guru':
        current = skincareCount;
        break;
      case 'morning-ritualist':
        current = morningCount;
        break;
      case 'evening-restorer':
        current = eveningCount;
        break;
      case 'botanical-alchemist':
        current = botanicalCount;
        break;
      case 'streak-3-days':
        current = bestStreak;
        break;
      case 'streak-7-days':
        current = bestStreak;
        break;
      case 'weekly-goal-champion':
        current = weekly.isGoalMet ? 1 : 0;
        break;
      case 'vault-curator':
        current = favoritesCount;
        break;
      case 'beauty-scholar':
        current = totalReadCount;
        break;
      case 'quiz-master': {
        let hasPassedQuiz = false;
        try {
          const rawQuiz = localStorage.getItem('beauty_quiz_master_unlocked');
          hasPassedQuiz = rawQuiz === 'true';
        } catch {
          hasPassedQuiz = false;
        }
        current = hasPassedQuiz ? 1 : 0;
        break;
      }
      default:
        current = 0;
    }

    const isUnlocked = current >= def.target;
    let unlockedAt = storedUnlocks[def.id];

    // If unlocked now for the first time, record timestamp and trigger alert
    if (isUnlocked && !unlockedAt) {
      unlockedAt = Date.now();
      updatedUnlocks[def.id] = unlockedAt;
      newlyUnlocked.push({
        ...def,
        current,
        progressPercentage: 100,
        isUnlocked: true,
        unlockedAt,
      });
    }

    const progressPercentage = Math.min(100, Math.round((current / def.target) * 100));

    return {
      ...def,
      current,
      progressPercentage,
      isUnlocked,
      unlockedAt,
    };
  });

  // Save new unlocks if any were newly achieved
  if (newlyUnlocked.length > 0 && typeof window !== 'undefined') {
    try {
      localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(updatedUnlocks));
      window.dispatchEvent(
        new CustomEvent('beauty_milestone_unlocked', { detail: newlyUnlocked[0] })
      );
      window.dispatchEvent(new CustomEvent(MILESTONES_EVENT));
    } catch (e) {
      console.error('Failed to save unlocked milestones:', e);
    }
  }

  const unlockedCount = results.filter((m) => m.isUnlocked).length;

  return {
    milestones: results,
    unlockedCount,
    totalCount: results.length,
    newlyUnlocked,
  };
}
