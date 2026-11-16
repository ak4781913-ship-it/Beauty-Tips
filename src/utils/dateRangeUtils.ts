/**
 * Utility functions and preset definitions for date range filtering in Skin Progress Gallery.
 */

export type DateRangePreset =
  | 'all'
  | '7days'
  | '30days'
  | '3months'
  | '6months'
  | '1year'
  | 'custom';

export interface DateRangeFilter {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface DateRangePresetOption {
  id: DateRangePreset;
  label: string;
  shortLabel: string;
  description: string;
}

export const DATE_RANGE_PRESETS: DateRangePresetOption[] = [
  {
    id: 'all',
    label: 'All Time',
    shortLabel: 'All Time',
    description: 'All captured progress photos',
  },
  {
    id: '7days',
    label: 'Last 7 Days',
    shortLabel: 'Last 7 Days',
    description: 'Weekly skin routine check',
  },
  {
    id: '30days',
    label: 'Last Month (30 Days)',
    shortLabel: 'Last Month',
    description: 'One full epidermal skin renewal cycle (~28 days)',
  },
  {
    id: '3months',
    label: 'Last 3 Months',
    shortLabel: 'Last 3 Months',
    description: 'Quarterly active ingredient results (retinoids, AHA/BHA)',
  },
  {
    id: '6months',
    label: 'Last 6 Months',
    shortLabel: 'Last 6 Months',
    description: 'Medium-term hyperpigmentation & barrier restoration',
  },
  {
    id: '1year',
    label: 'Past Year',
    shortLabel: 'Past Year',
    description: 'Annual seasonal skin transformation',
  },
  {
    id: 'custom',
    label: 'Custom Range',
    shortLabel: 'Custom',
    description: 'Specify precise start and end dates',
  },
];

/**
 * Returns today's date formatted as YYYY-MM-DD using local time
 */
export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a date string YYYY-MM-DD that is N days before today
 */
export function getDateNDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a date string YYYY-MM-DD that is N months before today
 */
export function getDateNMonthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates start and end YYYY-MM-DD for a given preset
 */
export function calculateRangeForPreset(
  preset: DateRangePreset,
  customStart?: string,
  customEnd?: string
): { startDate: string; endDate: string } {
  const today = getTodayDateStr();

  switch (preset) {
    case '7days':
      return { startDate: getDateNDaysAgo(7), endDate: today };
    case '30days':
      return { startDate: getDateNDaysAgo(30), endDate: today };
    case '3months':
      return { startDate: getDateNMonthsAgo(3), endDate: today };
    case '6months':
      return { startDate: getDateNMonthsAgo(6), endDate: today };
    case '1year':
      return { startDate: getDateNMonthsAgo(12), endDate: today };
    case 'custom':
      return {
        startDate: customStart || '',
        endDate: customEnd || today,
      };
    case 'all':
    default:
      return { startDate: '', endDate: '' };
  }
}

/**
 * Formats a YYYY-MM-DD string into a human-friendly label like "Oct 19, 2026"
 */
export function formatDisplayDate(isoDateStr?: string, includeYear = true): string {
  if (!isoDateStr) return '';
  const parts = isoDateStr.split('-');
  if (parts.length !== 3) return isoDateStr;
  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const d = new Date(year, monthIndex, day);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined,
  });
}

/**
 * Formats an active DateRangeFilter into a concise UI summary
 */
export function formatDateRangeSummary(filter: DateRangeFilter): string {
  if (filter.preset === 'all' || (!filter.startDate && !filter.endDate)) {
    return 'All Time';
  }

  const presetObj = DATE_RANGE_PRESETS.find((p) => p.id === filter.preset);
  const label = presetObj ? presetObj.shortLabel : 'Custom';

  if (filter.startDate && filter.endDate) {
    return `${label}: ${formatDisplayDate(filter.startDate, false)} – ${formatDisplayDate(filter.endDate)}`;
  }
  if (filter.startDate) {
    return `Since ${formatDisplayDate(filter.startDate)}`;
  }
  if (filter.endDate) {
    return `Until ${formatDisplayDate(filter.endDate)}`;
  }

  return label;
}

/**
 * Checks if a photo's date falls within the selected date range
 */
export function isPhotoInDateRange(
  photoDateStr: string,
  filter: DateRangeFilter
): boolean {
  if (filter.preset === 'all' && !filter.startDate && !filter.endDate) {
    return true;
  }

  if (filter.startDate && photoDateStr < filter.startDate) {
    return false;
  }

  if (filter.endDate && photoDateStr > filter.endDate) {
    return false;
  }

  return true;
}
