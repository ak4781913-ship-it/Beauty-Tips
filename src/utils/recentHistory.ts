import { BeautyTip } from '../types';
import { getTipSlug } from './slug';
import { calculateReadTime } from './readTime';

import heroImage from '../assets/images/hero_beauty_skincare_elegance_1791268845073.jpg';
import botanicalsImage from '../assets/images/natural_remedies_botanicals_1791268857904.jpg';
import routineImage from '../assets/images/routine_skincare_ritual_1791268873835.jpg';
import serumsImage from '../assets/images/beauty_serums_bottles_1791268884613.jpg';
import makeupImage from '../assets/images/editorial_makeup_palette_1791795525301.jpg';

const TIP_IMAGE_MAP: Record<string, string> = {
  'tip-double-cleanse-clarity': heroImage,
  'tip-ceramide-barrier-shield': routineImage,
  'tip-vitamin-c-glow': serumsImage,
  'tip-rosemary-scalp-growth': botanicalsImage,
  'tip-rosemary-scalp-circulation': botanicalsImage,
  'tip-salicylic-pore-clear': serumsImage,
  'tip-salicylic-acid-blemish': serumsImage,
  'tip-fade-dark-spots-tranexamic': serumsImage,
  'tip-sunscreen-two-finger-rule': heroImage,
  'tip-skin-prep-flawless-makeup': makeupImage,
  'tip-everyday-clean-makeup': makeupImage,
  'tip-eye-makeup-definition': makeupImage,
  'tip-lip-overnight-plumping-ritual': makeupImage,
  'tip-aloe-soothing-compress': botanicalsImage,
  'skin-care': routineImage,
  'hair-care': botanicalsImage,
  'dry-skin': routineImage,
  'acne-pimples': serumsImage,
  'dark-spots': serumsImage,
  'natural-remedies': botanicalsImage,
  'makeup-tips': makeupImage,
  'lip-care': makeupImage,
};

export function getTipImageUrl(tip: BeautyTip): string {
  return TIP_IMAGE_MAP[tip.id] || TIP_IMAGE_MAP[tip.category] || heroImage;
}

export const RECENT_HISTORY_STORAGE_KEY = 'beauty_recent_history';
export const RECENT_HISTORY_EVENT = 'beauty_recent_history_updated';
export const MAX_RECENT_HISTORY_ITEMS = 25;

export interface RecentArticleItem {
  tipId: string;
  slug: string;
  title: string;
  categoryLabel: string;
  category: string;
  imageUrl: string;
  shortExplanation: string;
  visitedAt: number; // timestamp in milliseconds
  readingTime: string;
}

/**
 * Safely retrieves the recent reading history from localStorage.
 */
export function getRecentHistory(): RecentArticleItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ensure all items conform to RecentArticleItem structure
    return parsed.filter(
      (item) =>
        item &&
        typeof item.tipId === 'string' &&
        typeof item.title === 'string' &&
        typeof item.slug === 'string'
    );
  } catch (error) {
    console.error('Failed to parse recent history from localStorage:', error);
    return [];
  }
}

/**
 * Records an article visit to localStorage.
 * Deduplicates by tipId (moves existing article to the very top with updated visitedAt timestamp)
 * and enforces maximum history length.
 */
export function recordArticleVisit(tip: BeautyTip, customSlug?: string): RecentArticleItem[] {
  if (typeof window === 'undefined' || !tip || !tip.id) return [];

  try {
    const currentHistory = getRecentHistory();
    const slug = customSlug || getTipSlug(tip);
    const readingTime = calculateReadTime(tip);
    const imageUrl = getTipImageUrl(tip);

    const newItem: RecentArticleItem = {
      tipId: tip.id,
      slug,
      title: tip.title,
      categoryLabel: tip.categoryLabel || tip.category,
      category: tip.category,
      imageUrl,
      shortExplanation: tip.shortExplanation || '',
      visitedAt: Date.now(),
      readingTime,
    };

    // Filter out previous visit of the same tip
    const filtered = currentHistory.filter((item) => item.tipId !== tip.id);
    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_HISTORY_ITEMS);

    localStorage.setItem(RECENT_HISTORY_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for reactive UI updates across components
    window.dispatchEvent(
      new CustomEvent(RECENT_HISTORY_EVENT, {
        detail: { history: updated, addedItem: newItem },
      })
    );

    return updated;
  } catch (error) {
    console.error('Failed to record article visit to localStorage:', error);
    return [];
  }
}

/**
 * Removes a specific article from recent history by its tipId.
 */
export function removeRecentHistoryItem(tipId: string): RecentArticleItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getRecentHistory();
    const updated = current.filter((item) => item.tipId !== tipId);
    localStorage.setItem(RECENT_HISTORY_STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(
      new CustomEvent(RECENT_HISTORY_EVENT, {
        detail: { history: updated, removedTipId: tipId },
      })
    );
    return updated;
  } catch (error) {
    console.error('Failed to remove recent history item:', error);
    return [];
  }
}

/**
 * Clears the entire recent reading history.
 */
export function clearRecentHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_HISTORY_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(RECENT_HISTORY_EVENT, {
        detail: { history: [], cleared: true },
      })
    );
  } catch (error) {
    console.error('Failed to clear recent history:', error);
  }
}

/**
 * Formats a visit timestamp into friendly relative time
 * (e.g., 'Just now', '5m ago', '3h ago', 'Yesterday', or 'Oct 14').
 */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return 'Recently';

  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return 'Just now';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
