/**
 * ============================================================================
 * BEAUTY TIPS BY ABBAS - FIRST-PARTY PROMOTIONAL SLIDER CONFIGURATION
 * ============================================================================
 * 
 * HOW TO ADD OR REPLACE PROMOTIONAL BANNERS:
 * -----------------------------------------
 * This file defines your first-party promotional announcements and banners.
 * You can easily replace the sample slides below with your own custom campaigns,
 * seasonal sales, masterclasses, or affiliate product features.
 * 
 * Each slide supports:
 * - id: Unique identifier
 * - imageUrl: Image file path or direct URL (e.g. from /assets or CDN)
 * - imageAlt: Accessible description of the promotional graphic
 * - badge: Optional tag (e.g. "Featured Masterclass", "Special Focus", "New Guide")
 * - headline: Promotional title (leave empty if your image already includes text)
 * - description: Brief 1-2 sentence promotional copy
 * - ctaText: Button text (e.g. "Explore Ritual", "Start Diagnosis", "Read Guide")
 * - ctaUrl: Destination link (internal like "/skin-care" or external like "https://...")
 * - isExternal: Optional boolean, opens link in safe new tab if true
 * ============================================================================
 */

import heroBeautyImg from '../assets/images/hero_beauty_skincare_elegance_1791268845073.jpg';
import editorialMakeupImg from '../assets/images/editorial_makeup_palette_1791795525301.jpg';
import serumsImg from '../assets/images/beauty_serums_bottles_1791268884613.jpg';
import botanicalsImg from '../assets/images/natural_remedies_botanicals_1791268857904.jpg';
import routineImg from '../assets/images/routine_skincare_ritual_1791268873835.jpg';

export interface PromoSlide {
  id: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  isExternal?: boolean;
}

export const HOMEPAGE_PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-barrier-masterclass',
    imageUrl: heroBeautyImg,
    imageAlt: 'Luxury minimalist skincare bottles surrounded by fresh rose petals',
    badge: 'Signature Masterclass',
    headline: 'The Lipid Barrier Masterclass & Cellular Hydration',
    description: 'Learn the exact science of the acid mantle. Discover how strategic double cleansing and bio-compatible ceramides restore compromised, reactive skin.',
    ctaText: 'Explore Skincare Hub',
    ctaUrl: '/skin-care',
    isExternal: false,
  },
  {
    id: 'promo-makeup-artistry',
    imageUrl: editorialMakeupImg,
    imageAlt: 'Editorial luxury makeup cosmetics with warm blush and rose gold highlighters',
    badge: 'New Editorial Hub',
    headline: 'Skin-First Makeup Artistry & Radiant Finishes',
    description: 'Elevate your everyday aesthetic with the 5-minute minimalist complexion technique, velvet eye definition, and undetectable glass skin prep.',
    ctaText: 'Discover Makeup Guides',
    ctaUrl: '/makeup',
    isExternal: false,
  },
  {
    id: 'promo-ai-diagnostic',
    imageUrl: serumsImg,
    imageAlt: 'Amber clinical glass serum bottles with dropper against dark background',
    badge: 'Interactive Consultation',
    headline: 'Personalized AI Skin Health Analysis',
    description: 'Answer 5 clinical questions regarding your oil production, sensitivity, and sun exposure to generate your bespoke AM/PM product protocol.',
    ctaText: 'Start Free Analysis',
    ctaUrl: '/skin-analysis',
    isExternal: false,
  },
  {
    id: 'promo-botanical-trichology',
    imageUrl: botanicalsImg,
    imageAlt: 'Natural botanical herbs and floral essences on dark slate stone',
    badge: 'Hair & Scalp Rituals',
    headline: 'Rosemary Scalp Density & Pre-Wash Oil Basting',
    description: 'Unlock maximum hair retention and root microcirculation with fresh botanical tonic brewing and lipid-rich protective basting rituals.',
    ctaText: 'View Hair Care Guides',
    ctaUrl: '/hair-care',
    isExternal: false,
  },
  {
    id: 'promo-daily-routines',
    imageUrl: routineImg,
    imageAlt: 'Calm evening beauty routine aesthetic with warm ambient glow',
    badge: 'Interactive Routine Builder',
    headline: 'Your Daily AM & PM Beauty Regimen Tracker',
    description: 'Build your custom morning defense and evening repair checklists with active ingredient conflict warnings and smart step reminders.',
    ctaText: 'Build Your Routine',
    ctaUrl: '/routines',
    isExternal: false,
  },
];
