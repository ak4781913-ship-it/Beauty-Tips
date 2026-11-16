/**
 * ============================================================================
 * BEAUTY TIPS BY ABBAS - SITE & SEO CONFIGURATION
 * ============================================================================
 */

export interface SiteConfig {
  name: string;
  brandName: string;
  tagline: string;
  description: string;
  author: string;
  defaultProductionDomain: string;
  getBaseUrl: () => string;
}

export const SITE_CONFIG: SiteConfig = {
  name: 'Beauty Tips by Abbas',
  brandName: 'Beauty Tips by Abbas',
  tagline: 'Your Personal Skincare, Beauty & Self-Care Guide',
  description:
    'Evidence-based skincare routines, hair trichology, makeup artistry, and natural barrier rituals curated with clinical principles.',
  author: 'Abbas',

  // Confirmed production domain default
  defaultProductionDomain:
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL
      ? import.meta.env.VITE_SITE_URL
      : 'https://www.beautytipsbyabbas.com',

  // Safe runtime origin resolver: uses active browser origin in preview/staging,
  // falling back to configured production domain
  getBaseUrl: (): string => {
    if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')) {
      return window.location.origin;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) {
      return import.meta.env.VITE_SITE_URL;
    }
    return 'https://www.beautytipsbyabbas.com';
  },
};
