export interface QuizQuestion {
  id: string;
  category: 'Skincare' | 'Makeup' | 'Formulation' | 'Barrier Health';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceTipSlug: string;
  sourceTipTitle: string;
}

export const QUIZ_QUESTIONS_POOL: QuizQuestion[] = [
  {
    id: 'q-slugging-retinol',
    category: 'Barrier Health',
    question: 'Why should you never "slug" with petrolatum over prescription tretinoin or active exfoliating acids?',
    options: [
      'Petrolatum oxidizes active ingredients, neutralizing their benefits completely',
      'It traps actives under an occlusive seal, multiplying absorption and risking severe chemical burns',
      'The acid degrades cosmetic petrolatum into comedogenic free fatty acids',
      'Slugging makes the skin too oily to absorb water-based moisturizers',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Petrolatum creates a 99% occlusive barrier. When applied over potent actives like retinoids or AHA/BHA, it dramatically increases transdermal penetration, which can cause severe redness, peeling, and chemical irritation.',
    sourceTipSlug: 'tip-slugging-barrier-repair',
    sourceTipTitle: 'Overnight Slugging for Barrier Repair',
  },
  {
    id: 'q-spf-two-finger',
    category: 'Skincare',
    question: 'Why do dermatologists recommend the "Two-Finger Rule" for facial sunscreen application?',
    options: [
      'To ensure enough sunscreen transfers onto your hands for neck protection',
      'Because physical mineral filters reflect UV rays only at high thickness',
      'It yields ~1.25g of product, meeting the 2mg/cm² density mandated for labeled SPF ratings',
      'It prevents sunscreen from pilling beneath makeup primer and foundation',
    ],
    correctAnswerIndex: 2,
    explanation:
      'International SPF efficacy testing requires 2 milligrams of sunscreen per square centimeter of skin. Two full finger lengths (~1.25 grams) ensures the adult face, ears, and neck achieve the actual SPF defense stated on the bottle.',
    sourceTipSlug: 'tip-sunscreen-two-finger-rule',
    sourceTipTitle: 'The Two-Finger Sunscreen Rule',
  },
  {
    id: 'q-bha-vs-aha',
    category: 'Formulation',
    question: 'What unique chemical property allows Salicylic Acid (BHA) to unclog blackheads inside pores better than Glycolic Acid (AHA)?',
    options: [
      'Salicylic acid has a higher molecular weight that sits on the skin surface longer',
      'It is oil-soluble, allowing it to penetrate through sebum plugs directly into pores',
      'It contains vitamin C esters that dissolve keratinized cellular debris',
      'It lowers the skin pH below 2.0 to dissolve sebaceous plugs instantly',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Unlike water-soluble AHAs that exfoliate dead surface cells, BHA (Salicylic Acid) is lipid/oil-soluble. This allows it to penetrate sebum-rich hair follicles and dissolve hardened plugs from within.',
    sourceTipSlug: 'tip-salicylic-pore-clear',
    sourceTipTitle: 'Salicylic Acid for Deep Pore Clarity',
  },
  {
    id: 'q-double-cleanse',
    category: 'Skincare',
    question: 'If you do not wear makeup, is double cleansing in the evening still beneficial?',
    options: [
      'No, double cleansing is strictly designed for removing silicone cosmetics and heavy foundation',
      'Yes, broad-spectrum sunscreen and natural sebum are oil-soluble and resist water cleansers alone',
      'Only if your skin produces excessive sweat during high-intensity workouts',
      'No, oil cleansing on bare skin strips essential lipids and causes rebound oiliness',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Water-resistant SPF filters and environmental pollutants are lipophilic (oil-soluble). An emulsifying oil cleanser breaks down this daily film effortlessly without harsh scrubbing.',
    sourceTipSlug: 'tip-double-cleanse-clarity',
    sourceTipTitle: 'The Double Cleanse Method for Clarity',
  },
  {
    id: 'q-hyaluronic-damp',
    category: 'Skincare',
    question: 'Why should Hyaluronic Acid serum always be applied to damp skin rather than completely dry skin?',
    options: [
      'Dry skin contains too much sebum for hyaluronic molecules to bind',
      'Hyaluronic acid is a humectant that pulls moisture from the ambient air or deep dermis if surface water is absent',
      'Water activates the enzyme required for hyaluronic acid to absorb into the stratum corneum',
      'Damp skin prevents the hyaluronic acid from peeling when layered with foundation',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Hyaluronic acid can hold up to 1,000 times its weight in water. If applied to dry skin in low-humidity environments, it can pull moisture upward from deeper dermal layers, paradoxically dehydrating the skin.',
    sourceTipSlug: 'tip-ceramide-barrier-shield',
    sourceTipTitle: 'Ceramide Barrier Strengthening',
  },
  {
    id: 'q-vitamin-c-spf',
    category: 'Formulation',
    question: 'What synergistic benefit occurs when layering pure L-Ascorbic Acid (Vitamin C) underneath broad-spectrum SPF in the morning?',
    options: [
      'Vitamin C boosts the physical reflective index of mineral zinc oxide',
      'It neutralizes free radicals generated by UVA and infrared rays that penetrate past sunscreen filters',
      'It prevents chemical sunscreen filters from degrading in direct sunlight',
      'It eliminates the need for morning moisturizing cream',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Even broad-spectrum SPF 50 sunscreens permit ~2% of UV photons to penetrate. Vitamin C acts as a secondary antioxidant reservoir, scavenging reactive oxygen species (ROS) and preventing collagen breakdown.',
    sourceTipSlug: 'tip-vitamin-c-glow',
    sourceTipTitle: 'Vitamin C for Daily Radiance & Protection',
  },
  {
    id: 'q-rosemary-oil',
    category: 'Barrier Health',
    question: 'Why should pure concentrated rosemary essential oil never be applied undiluted directly to the scalp?',
    options: [
      'It coagulates natural sebum, worsening male and female pattern hair shedding',
      'Volatile terpene concentrations can trigger severe contact dermatitis and follicle shock',
      'Undiluted essential oils evaporate within 30 seconds before reaching the follicle',
      'It strips the hair shaft of keratin and changes dyed hair color',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Essential oils are intensely concentrated volatile compounds. Undiluted application can induce burning, contact dermatitis, and inflammation that damages follicles. Always dilute in a carrier oil like jojoba or squalane.',
    sourceTipSlug: 'tip-rosemary-scalp-growth',
    sourceTipTitle: 'Rosemary Scalp Infusion for Follicle Vitality',
  },
  {
    id: 'q-tranexamic-pigment',
    category: 'Formulation',
    question: 'How does Tranexamic Acid help fade persistent post-inflammatory dark spots and melasma?',
    options: [
      'By bleaching melanin clusters on the top stratum corneum layer',
      'By inhibiting plasmin and inflammatory pathways that trigger melanocyte hyperactivity',
      'By dissolving dead keratinocytes faster than 10% glycolic acid peels',
      'By permanently shutting down tyrosinase enzyme synthesis in melanocytes',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Tranexamic acid acts as a plasmin inhibitor, dampening the inflammatory cascade triggered by UV exposure and micro-injuries (such as acne blemishes) that stimulate melanocytes to overproduce pigment.',
    sourceTipSlug: 'tip-fade-dark-spots-tranexamic',
    sourceTipTitle: 'Targeted Dark Spot Fading Protocol',
  },
  {
    id: 'q-cream-blush-longevity',
    category: 'Makeup',
    question: 'What is Abbas’s professional editorial secret to prevent dewy cream blush from fading by mid-afternoon?',
    options: [
      'Setting the cheeks with a heavy layer of translucent baking powder before applying blush',
      'Lightly layering a sheer veil of matching powder blush over the cream, or finishing with hydrating setting mist',
      'Mixing the cream blush with waterproof liquid concealer prior to cheek application',
      'Using matte lipstick instead of formulated cosmetic cream blush on cheeks',
    ],
    correctAnswerIndex: 1,
    explanation:
      'The "cream-over-powder" or powder veil technique locks in emollients and pigment. A translucent dusting of matching powder blush or a fine hydrating setting spray holds dewiness while preventing pigment migration.',
    sourceTipSlug: 'tip-everyday-clean-makeup',
    sourceTipTitle: 'Minimalist Everyday Clean Makeup',
  },
  {
    id: 'q-skin-prep-makeup',
    category: 'Makeup',
    question: 'How long should you allow water-based moisturizer to settle on the skin before applying makeup base or skin tint?',
    options: [
      'Apply immediately while skin is dripping wet to blend pigments evenly',
      'At least 3 to 5 minutes so emollients can form a smooth, non-slippery canvas',
      '20 to 30 minutes until skin feels dry and tight to the touch',
      'Pre-drying with an electric hair dryer on cool air setting',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Allowing 3 to 5 minutes lets the emulsion absorb into the epidermis. Applying foundation onto unabsorbed moisturizer causes cosmetic pigments to slip, streak, or separate within hours.',
    sourceTipSlug: 'tip-skin-prep-flawless-makeup',
    sourceTipTitle: 'Skin Prep for Flawless Makeup Application',
  },
];

/**
 * Returns 3 questions for a given date seed, ensuring every day presents a consistent challenge.
 */
export function getDailyQuizQuestions(date: Date = new Date(), setOffset: number = 0): QuizQuestion[] {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalPool = QUIZ_QUESTIONS_POOL.length;
  const startIndex = (dayOfYear * 3 + setOffset * 3) % totalPool;

  const selected: QuizQuestion[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = (startIndex + i) % totalPool;
    selected.push(QUIZ_QUESTIONS_POOL[idx]);
  }

  return selected;
}
