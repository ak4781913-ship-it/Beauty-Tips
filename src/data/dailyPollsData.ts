export interface PollOption {
  id: string;
  label: string;
  initialVotes: number;
  guideSlug: string;
  guideTitle: string;
}

export interface BeautyPoll {
  id: string;
  question: string;
  subtitle: string;
  options: PollOption[];
  editorialInsight: string;
}

export const BEAUTY_POLLS: BeautyPoll[] = [
  {
    id: 'poll-skin-concern-primary',
    question: 'What is your primary skin concern right now?',
    subtitle: 'Share your current skin priority to help Abbas curate tomorrow’s formulation guides.',
    options: [
      {
        id: 'opt-barrier-dryness',
        label: 'Dryness, tight sensation & compromised barrier',
        initialVotes: 512,
        guideSlug: 'tip-ceramide-barrier-shield',
        guideTitle: 'Ceramide Barrier Strengthening',
      },
      {
        id: 'opt-acne-congestion',
        label: 'Persistent breakouts, blackheads & congested pores',
        initialVotes: 448,
        guideSlug: 'tip-salicylic-pore-clear',
        guideTitle: 'Salicylic Acid for Deep Pore Clarity',
      },
      {
        id: 'opt-dark-spots',
        label: 'Post-acne dark marks, sun spots & uneven tone',
        initialVotes: 389,
        guideSlug: 'tip-fade-dark-spots-tranexamic',
        guideTitle: 'Targeted Dark Spot Fading Protocol',
      },
      {
        id: 'opt-oil-balance',
        label: 'Excess midday shine & enlarged pores',
        initialVotes: 236,
        guideSlug: 'tip-double-cleanse-clarity',
        guideTitle: 'The Double Cleanse Method for Clarity',
      },
    ],
    editorialInsight:
      'Over 60% of readers report barrier dryness and post-inflammatory dark marks as their top concerns during seasonal transitions.',
  },
  {
    id: 'poll-essential-step',
    question: 'What is the one beauty step you never skip, even on busy days?',
    subtitle: 'Tell us your non-negotiable daily self-care anchor.',
    options: [
      {
        id: 'opt-spf50',
        label: 'Dedicated Broad-Spectrum SPF 50',
        initialVotes: 624,
        guideSlug: 'tip-sunscreen-two-finger-rule',
        guideTitle: 'The Two-Finger Sunscreen Rule',
      },
      {
        id: 'opt-evening-cleanse',
        label: 'Double cleansing away daily SPF & oil',
        initialVotes: 489,
        guideSlug: 'tip-double-cleanse-clarity',
        guideTitle: 'The Double Cleanse Method for Clarity',
      },
      {
        id: 'opt-barrier-cream',
        label: 'Nourishing barrier repair moisturizer',
        initialVotes: 372,
        guideSlug: 'tip-ceramide-barrier-shield',
        guideTitle: 'Ceramide Barrier Strengthening',
      },
      {
        id: 'opt-lip-care',
        label: 'Peptide or botanical lip treatment',
        initialVotes: 198,
        guideSlug: 'tip-lip-overnight-plumping-ritual',
        guideTitle: 'Overnight Lip Plumping & Barrier Care',
      },
    ],
    editorialInsight:
      'Daily UV defense remains the single most impactful ritual for preventing collagen breakdown and premature hyperpigmentation.',
  },
  {
    id: 'poll-active-ingredient',
    question: 'Which active ingredient made the biggest difference in your complexion?',
    subtitle: 'Vote on the formulation powerhouse your skin loves most.',
    options: [
      {
        id: 'opt-vitamin-c',
        label: 'L-Ascorbic Acid (Vitamin C) for radiance',
        initialVotes: 476,
        guideSlug: 'tip-vitamin-c-glow',
        guideTitle: 'Vitamin C for Daily Radiance & Protection',
      },
      {
        id: 'opt-salicylic-acid',
        label: 'Salicylic Acid (BHA) for pore refining',
        initialVotes: 432,
        guideSlug: 'tip-salicylic-pore-clear',
        guideTitle: 'Salicylic Acid for Deep Pore Clarity',
      },
      {
        id: 'opt-ceramides',
        label: 'Ceramides & Fatty Acids for barrier calm',
        initialVotes: 518,
        guideSlug: 'tip-ceramide-barrier-shield',
        guideTitle: 'Ceramide Barrier Strengthening',
      },
      {
        id: 'opt-tranexamic',
        label: 'Tranexamic Acid for stubborn spots',
        initialVotes: 265,
        guideSlug: 'tip-fade-dark-spots-tranexamic',
        guideTitle: 'Targeted Dark Spot Fading Protocol',
      },
    ],
    editorialInsight:
      'Ceramide complexes consistently rank as the most universally tolerated active, rebuilding lipid architecture without irritation.',
  },
];

/**
 * Returns the current daily poll based on calendar day.
 */
export function getDailyPoll(date: Date = new Date(), offset: number = 0): BeautyPoll {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const total = BEAUTY_POLLS.length;
  const index = Math.abs((dayOfYear + offset) % total);
  return BEAUTY_POLLS[index];
}
