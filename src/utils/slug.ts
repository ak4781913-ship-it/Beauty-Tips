import { BeautyTip } from '../types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getTipSlug(tip: BeautyTip): string {
  if (!tip) return '';
  const titleSlug = slugify(tip.title);
  return titleSlug || tip.id.replace(/^tip-/, '');
}

// Canonical route alias map for direct editorial URLs
const ALIAS_MAP: Record<string, string> = {
  // Skincare direct topic articles
  'acne-pimples': 'tip-salicylic-acid-blemish',
  'acne': 'tip-salicylic-acid-blemish',
  'acne-treatment': 'tip-salicylic-acid-blemish',
  'dark-spots': 'tip-fade-dark-spots-tranexamic',
  'hyperpigmentation': 'tip-fade-dark-spots-tranexamic',
  'sunscreen': 'tip-sunscreen-two-finger-rule',
  'sunscreen-guide': 'tip-sunscreen-two-finger-rule',
  'daily-routine': 'tip-double-cleanse-clarity',
  'daily-skincare-routine': 'tip-double-cleanse-clarity',
  'moisturizing': 'tip-hydration-vs-moisture',
  'barrier-repair': 'tip-slugging-barrier-repair',
  'slugging': 'tip-slugging-barrier-repair',
  'niacinamide': 'tip-niacinamide-pore-refining',
  'vitamin-c': 'tip-vitamin-c-glow',
  'glycolic-renewal': 'tip-dull-skin-glycolic-renewal',
  'honey-mask': 'tip-honey-rosewater-mask',
  'retinoid-sandwich': 'tip-retinoid-sandwich-method',
  'retinol': 'tip-retinoid-sandwich-method',
  'ice-roller': 'tip-lymphatic-ice-roller-depuff',

  // Makeup direct topic articles
  'makeup': 'tip-skin-prep-flawless-makeup',
  'everyday-makeup': 'tip-everyday-clean-makeup',
  'eye-makeup': 'tip-eye-makeup-definition',
  'glass-skin': 'tip-skin-prep-flawless-makeup',
  'pre-makeup': 'tip-skin-prep-flawless-makeup',
  'lip-care': 'tip-lip-overnight-plumping-ritual',
  'lip-plumping': 'tip-lip-overnight-plumping-ritual',

  // Hair care direct topic articles
  'hair-growth': 'tip-rosemary-scalp-circulation',
  'rosemary-water': 'tip-rosemary-scalp-circulation',
  'hair-oil-slugging': 'tip-hair-oil-slugging-ends',
  'split-ends': 'tip-hair-oil-slugging-ends',
};

export function findTipBySlug(slug: string, tips: BeautyTip[]): BeautyTip | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();

  // 1. Try matching curated alias map
  if (ALIAS_MAP[normalized]) {
    const aliasTipId = ALIAS_MAP[normalized];
    const matchByAlias = tips.find((t) => t.id === aliasTipId);
    if (matchByAlias) return matchByAlias;
  }

  // 2. Try matching slugified title
  const matchByTitle = tips.find((t) => slugify(t.title) === normalized);
  if (matchByTitle) return matchByTitle;

  // 3. Try matching full ID
  const matchById = tips.find((t) => t.id.toLowerCase() === normalized);
  if (matchById) return matchById;

  // 4. Try matching ID without 'tip-' prefix
  const matchByStrippedId = tips.find((t) => t.id.replace(/^tip-/, '').toLowerCase() === normalized);
  if (matchByStrippedId) return matchByStrippedId;

  // 5. Try partial match on title slug
  const matchPartial = tips.find(
    (t) => slugify(t.title).includes(normalized) || normalized.includes(slugify(t.title))
  );
  if (matchPartial) return matchPartial;

  return undefined;
}
