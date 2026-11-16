import { BeautyTip } from '../types';

export interface ReadingStats {
  minutes: number;
  wordCount: number;
  formatted: string;
  detailed: string;
  wpm: number;
}

/**
 * Standard adult non-fiction reading speed benchmark (words per minute).
 */
export const DEFAULT_WORDS_PER_MINUTE = 200;

/**
 * Calculates reading time statistics (minutes, word count, formatted string)
 * accurately based on the full text corpus of a beauty tip article.
 */
export function calculateArticleReadingStats(
  tip: BeautyTip,
  additionalContent: string[] = []
): ReadingStats {
  const textCorpus = [
    tip.title || '',
    tip.shortExplanation || '',
    tip.fullDescription || '',
    tip.recommendedRoutine || '',
    tip.proTip || '',
    ...(tip.dos || []),
    ...(tip.donts || []),
    ...(tip.usefulIngredients || []),
    ...(tip.steps?.map((s) => `${s.title} ${s.instruction}`) || []),
    ...additionalContent,
  ].join(' ');

  // Split on any whitespace sequence to count words accurately
  const words = textCorpus.trim().split(/\s+/).filter(Boolean).length;
  
  // Minimum 1 min read, calculating at 200 WPM
  const minutes = Math.max(1, Math.ceil(words / DEFAULT_WORDS_PER_MINUTE));

  return {
    minutes,
    wordCount: words,
    formatted: `${minutes} min read`,
    detailed: `${minutes} min read (${words.toLocaleString()} words)`,
    wpm: DEFAULT_WORDS_PER_MINUTE,
  };
}

/**
 * Calculates estimated minutes to read based on the full textual word count
 * of a beauty tip (assuming an average adult reading speed of 200 words/min).
 */
export function calculateReadTime(tip: BeautyTip, additionalContent?: string[]): string {
  return calculateArticleReadingStats(tip, additionalContent).formatted;
}
