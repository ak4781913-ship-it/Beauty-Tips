export interface RoutineStep {
  stepNumber: number;
  title: string;
  productType: string;
  action: string;
  keyIngredients: string;
  whyItWorks: string;
  durationMinutes?: number;
}

export interface GeneratedRoutine {
  id: string;
  generatedAt: number;
  skinType: string;
  primaryConcerns: string[];
  sensitivityLevel: string;
  summary: string;
  barrierAdvice: string;
  keyRecommendedActives: string[];
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  weeklyRituals: string[];
  incompatibleActives: string[];
  abbasProTip: string;
  isAiGenerated: boolean;
}

export interface RoutineBuilderInputs {
  skinType: string;
  primaryConcerns: string[];
  sensitivity: 'low' | 'normal' | 'high';
  complexity: 'minimalist' | 'balanced' | 'comprehensive';
  additionalNotes?: string;
}

export interface AvailableProduct {
  id: string;
  name: string;
  brand?: string;
  category: 'cleanser' | 'exfoliant' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment' | 'oil' | 'mask';
  activeIngredients?: string;
}

export interface DaySchedule {
  day: string; // 'Monday', 'Tuesday', ...
  dayCode: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  focus: string; // e.g. "Exfoliation Night", "Barrier Recovery", "Retinoid Night"
  morningNotes: string;
  eveningNotes: string;
  activeUsed?: string;
  productsToUse: string[];
}

export interface CustomRoutineScheduleStep extends RoutineStep {
  matchedProduct?: string;
  frequency?: string;
}

export interface GeneratedCustomSchedule extends GeneratedRoutine {
  availableProductsCount?: number;
  availableProductsMatched?: string[];
  morningRoutine: CustomRoutineScheduleStep[];
  eveningRoutine: CustomRoutineScheduleStep[];
  weeklySchedule: DaySchedule[];
  shelfGaps: string[];
  productClashWarnings: string[];
}

export interface CustomRoutineBuilderInputs extends RoutineBuilderInputs {
  availableProducts: AvailableProduct[];
}

export const POPULAR_SHELF_PRODUCTS: Omit<AvailableProduct, 'id'>[] = [
  { name: 'Hydrating Facial Cleanser', brand: 'CeraVe', category: 'cleanser', activeIngredients: 'Ceramides, Hyaluronic Acid' },
  { name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', category: 'serum', activeIngredients: '10% Niacinamide, Zinc PCA' },
  { name: 'Skin Perfecting 2% BHA Liquid Exfoliant', brand: "Paula's Choice", category: 'exfoliant', activeIngredients: '2% Salicylic Acid, Green Tea' },
  { name: 'Cicaplast Baume B5+ Soothing Cream', brand: 'La Roche-Posay', category: 'moisturizer', activeIngredients: 'Panthenol 5%, Madecassoside' },
  { name: 'Relief Sun: Rice + Probiotics SPF 50+', brand: 'Beauty of Joseon', category: 'sunscreen', activeIngredients: 'Rice Extract, Probiotics, Broad Spectrum Chemical Filters' },
  { name: 'Advanced Snail 96 Mucin Power Essence', brand: 'Cosrx', category: 'toner', activeIngredients: '96% Snail Secretion Filtrate, Sodium Hyaluronate' },
  { name: 'Differin Adapalene Gel 0.1%', brand: 'Differin', category: 'treatment', activeIngredients: 'Adapalene 0.1% Retinoid' },
  { name: 'C E Ferulic Antioxidant Serum', brand: 'SkinCeuticals', category: 'serum', activeIngredients: '15% L-Ascorbic Acid, Ferulic Acid' },
  { name: 'Speedy Cleansing Oil', brand: 'Kose Softymo', category: 'cleanser', activeIngredients: 'Jojoba Oil, Olive Fruit Oil' },
  { name: 'Moisturizing Cream (in tub)', brand: 'CeraVe', category: 'moisturizer', activeIngredients: 'Ceramides 1, 3, 6-II, Hyaluronic Acid, Petrolatum' },
  { name: 'Azelaic Acid Suspension 10%', brand: 'The Ordinary', category: 'treatment', activeIngredients: '10% Azelaic Acid' },
  { name: 'Hyaluronic Acid 2% + B5', brand: 'The Ordinary', category: 'serum', activeIngredients: 'Multi-molecular Hyaluronic Acid, Provitamin B5' },
];

export const STORAGE_AVAILABLE_PRODUCTS = 'beauty_user_available_products';

export const SKIN_TYPES = [
  {
    id: 'dry',
    label: 'Dry Skin',
    description: 'Feels tight, parched, flaky, and prone to compromised lipid barrier.',
  },
  {
    id: 'oily',
    label: 'Oily Skin',
    description: 'Excess midday shine, enlarged pores, and prone to blackheads or congestion.',
  },
  {
    id: 'combination',
    label: 'Combination Skin',
    description: 'Oily T-zone (forehead, nose, chin) with normal or parched cheekbones.',
  },
  {
    id: 'sensitive',
    label: 'Sensitive Skin',
    description: 'Easily stings, flushes red, reactive to fragrance or strong exfoliants.',
  },
  {
    id: 'normal',
    label: 'Normal / Balanced',
    description: 'Generally comfortable, balanced moisture levels, minimal excess sebum.',
  },
];

export const SKIN_CONCERNS = [
  { id: 'barrier-repair', label: 'Damaged Moisture Barrier & Stinging', category: 'barrier' },
  { id: 'acne-blemishes', label: 'Active Breakouts & Inflamed Blemishes', category: 'clarity' },
  { id: 'dark-spots', label: 'Post-Acne Dark Marks & Sun Pigmentation', category: 'radiance' },
  { id: 'dehydration', label: 'Deep Dehydration & Crepiness', category: 'hydration' },
  { id: 'dullness', label: 'Dull, Fatigued Complexion & Uneven Texture', category: 'glow' },
  { id: 'pores-blackheads', label: 'Enlarged Pores & Stubborn Blackheads', category: 'clarity' },
  { id: 'fine-lines', label: 'Early Fine Lines & Loss of Skin Bounciness', category: 'firmness' },
  { id: 'redness-rosacea', label: 'Facial Redness, Rosacea & Heat Flushes', category: 'calm' },
];

/**
 * Intelligent client-side fallback matrix based on Abbas's clinical formulations,
 * ensuring seamless user experience even if server or network experiences latency.
 */
export function generateCuratedRoutineFallback(inputs: RoutineBuilderInputs): GeneratedRoutine {
  const { skinType, primaryConcerns, sensitivity, complexity } = inputs;
  const isMinimal = complexity === 'minimalist';
  const isSensitive = sensitivity === 'high' || skinType === 'sensitive';
  const hasAcne = primaryConcerns.includes('acne-blemishes') || primaryConcerns.includes('pores-blackheads');
  const hasPigmentation = primaryConcerns.includes('dark-spots') || primaryConcerns.includes('dullness');
  const hasBarrierIssue = primaryConcerns.includes('barrier-repair') || primaryConcerns.includes('redness-rosacea') || skinType === 'dry';

  const morningRoutine: RoutineStep[] = [
    {
      stepNumber: 1,
      title: isSensitive || skinType === 'dry' ? 'Lukewarm Water Splash or Low-pH Milk Rinse' : 'Clarifying Gentle Amino Wash',
      productType: 'Cleanser',
      action: 'Wash face with lukewarm water to cleanse nocturnal sweat without dissolving the natural lipid barrier.',
      keyIngredients: isSensitive ? 'Thermal spring water & Colloidal Oat' : 'Amino acid surfactants & Glycerin',
      whyItWorks: 'Preserves the acid mantle (pH 4.7–5.5) and prevents early morning tight sensations.',
      durationMinutes: 1,
    },
    {
      stepNumber: 2,
      title: 'Plumping Hydration & Barrier Essence',
      productType: 'Hydrator / Essence',
      action: 'Press 3 to 4 splashes into damp skin immediately after rinsing.',
      keyIngredients: 'Multi-molecular Hyaluronic Acid, Centella Asiatica & Ectoin',
      whyItWorks: 'Delivers trans-epidermal hydration deep into the stratum corneum before applying actives.',
      durationMinutes: 1,
    },
    {
      stepNumber: 3,
      title: hasPigmentation && !isSensitive ? 'Antioxidant Vitamin C Radiance Serum' : 'Calming Niacinamide & Zinc Shield',
      productType: 'Targeted Serum',
      action: 'Smooth 3 drops across cheeks, forehead, and jawline.',
      keyIngredients: hasPigmentation && !isSensitive ? '15% Ethyl Ascorbic Acid + Ferulic Acid' : '4% Niacinamide + Centella Asiatica',
      whyItWorks: 'Scavenges free radicals from environmental pollution and suppresses tyrosinase enzyme activity.',
      durationMinutes: 1,
    },
    {
      stepNumber: 4,
      title: skinType === 'oily' ? 'Oil-Free Weightless Gel-Cream' : 'Ceramide Membrane Restorative Cream',
      productType: 'Moisturizer',
      action: 'Massage a dime-sized amount to lock in humectants and seal micro-moisture.',
      keyIngredients: skinType === 'oily' ? 'Centella gel & Squalane' : 'Ceramides NP/AP/EOP, Cholesterol & Free Fatty Acids',
      whyItWorks: 'Replicates natural intercellular skin cement to prevent trans-epidermal water loss (TEWL).',
      durationMinutes: 1,
    },
    {
      stepNumber: 5,
      title: 'Broad-Spectrum SPF 50+ Invisible Sun Shield',
      productType: 'Sunscreen',
      action: 'Apply two full finger lengths across face, neck, and ears as your daily non-negotiable step.',
      keyIngredients: isSensitive ? 'Non-nano Zinc Oxide' : 'Broad-spectrum hybrid UVA/UVB filters',
      whyItWorks: 'Defends cellular DNA from photodamage and prevents melanin reactivation in dark spots.',
      durationMinutes: 2,
    },
  ];

  if (isMinimal) {
    // Keep steps 1 (cleanser), 4 (moisturizer), and 5 (SPF)
    morningRoutine.splice(1, 2);
    morningRoutine.forEach((s, idx) => {
      s.stepNumber = idx + 1;
    });
  }

  const eveningRoutine: RoutineStep[] = [
    {
      stepNumber: 1,
      title: 'Lipophilic First Cleanse (Oil or Balm)',
      productType: 'First Cleanse',
      action: 'Gently massage onto completely dry skin for 60 seconds to melt sunscreen and stubborn sebum.',
      keyIngredients: 'Jojoba Oil, Caprylic Triglyceride & Sunflower Seed Extract',
      whyItWorks: 'Chemistry principle "like dissolves like"—oil dissolves hardened sebaceous plugs and water-resistant SPF without friction.',
      durationMinutes: 2,
    },
    {
      stepNumber: 2,
      title: 'Low-Foaming Water Cleanser',
      productType: 'Second Cleanse',
      action: 'Lather with warm water to rinse away all emulsified residue cleanly without squeakiness.',
      keyIngredients: 'Decyl Glucoside & Panthenol (Pro-Vitamin B5)',
      whyItWorks: 'Completes double cleansing, leaving pores clean and ready to absorb nighttime actives.',
      durationMinutes: 1,
    },
    {
      stepNumber: 3,
      title: hasAcne
        ? 'Salicylic Acid (BHA) 2% Pore Refiner (2-3x/week)'
        : hasPigmentation
        ? 'Tranexamic Acid & Alpha Arbutin Blemish Serum'
        : 'Biomimetic Copper Peptide & Repair Elixir',
      productType: 'Night Treatment Active',
      action: 'Smooth 3 drops evenly. On non-active evenings, substitute with a soothing barrier essence.',
      keyIngredients: hasAcne
        ? '2% Salicylic Acid + Tea Tree Hydrosol'
        : hasPigmentation
        ? '3% Tranexamic Acid + 2% Alpha Arbutin'
        : 'Copper Tripeptide-1 & Madecassoside',
      whyItWorks: hasAcne
        ? 'Lipophilic BHA penetrates deep inside sebaceous follicles to dissolve trapped dead keratin.'
        : 'Inhibits melanosome transfer to lighten hyperpigmentation safely during nocturnal cell renewal.',
      durationMinutes: 1,
    },
    {
      stepNumber: 4,
      title: 'Deep Nocturnal Barrier Recovery Cream',
      productType: 'Night Moisturizer',
      action: 'Warm in palms and gently press onto skin; extend down the neck and décolletage.',
      keyIngredients: 'Phytoceramides, Squalane & Beta-Glucan',
      whyItWorks: 'Skin temperature rises at night; this creates an optimal breathable lipid shield for cellular healing.',
      durationMinutes: 1,
    },
  ];

  if (hasBarrierIssue) {
    eveningRoutine.push({
      stepNumber: 5,
      title: 'Zone Slugging or Squalane Seal (Optional 1-2x/week)',
      productType: 'Occlusive Seal',
      action: 'Dab a pea-sized amount strictly over dry patches or irritated cheek zones before bed.',
      keyIngredients: 'Medical-grade Petrolatum or 100% Sugarcane Squalane',
      whyItWorks: 'Creates a 99% occlusive seal that halts moisture loss while barrier lipids regenerate overnight.',
      durationMinutes: 1,
    });
  }

  const activesList = [
    hasAcne ? 'Salicylic Acid (BHA 2%)' : null,
    hasPigmentation ? 'Tranexamic Acid & Vitamin C' : null,
    'Ceramides (NP, AP, EOP)',
    'Niacinamide (Vitamin B3)',
    'Centella Asiatica (Cica)',
    'Hyaluronic Acid (Multi-weight)',
  ].filter(Boolean) as string[];

  const incompatibleList = [
    'Do not layer strong exfoliating acids (AHA/BHA) directly with prescription Retinoids in the same PM session.',
    'Do not slug with petroleum jelly over high-strength active peeling acids or tretinoin.',
    hasAcne ? 'Avoid heavy comedogenic coconut oil or high-oleic plant butters on active breakouts.' : null,
  ].filter(Boolean) as string[];

  return {
    id: `routine-${Date.now()}`,
    generatedAt: Date.now(),
    skinType,
    primaryConcerns,
    sensitivityLevel: sensitivity,
    summary: `A customized clinical regimen designed to honor ${skinType} skin by resolving ${primaryConcerns.length} key concerns while strictly guarding your natural stratum corneum barrier.`,
    barrierAdvice: hasBarrierIssue
      ? 'Your moisture barrier requires gentle discipline: pause harsh physical scrubs and prioritize biomimetic ceramides and lukewarm water rinses.'
      : 'Maintain healthy acid mantle equilibrium by adhering to the rule of thinnest-to-thickest consistency and consistent daily UV defense.',
    keyRecommendedActives: activesList,
    morningRoutine,
    eveningRoutine,
    weeklyRituals: [
      'Perform a 24-hour patch test before introducing any newly formulated serums.',
      'Change your satin pillowcase twice weekly to eliminate bacterial transfer during sleep.',
      'Practice gentle facial lymphatic drainage during evening oil cleansing.',
    ],
    incompatibleActives: incompatibleList,
    abbasProTip:
      skinType === 'dry'
        ? 'Always apply humectant serums like hyaluronic acid to damp skin, never bone-dry skin, to prevent it from drawing moisture outward.'
        : skinType === 'oily'
        ? 'Oiliness is often a cry for water: dehydrating oily skin triggers rebound sebum. Hydrate thoroughly with weightless gel textures.'
        : 'Consistency always triumphs over complexity. A simple 4-step ritual practiced daily will outperform a 10-step routine used erratically.',
    isAiGenerated: false,
  };
}

/**
 * Calls the backend Gemini API route to generate a personalized skincare routine,
 * with automatic fallback to curated clinical formulations.
 */
export async function requestPersonalizedAiRoutine(
  inputs: RoutineBuilderInputs
): Promise<GeneratedRoutine> {
  try {
    const response = await fetch('/api/routine/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      console.warn(`Server Gemini route returned status ${response.status}. Using clinical fallback.`);
      return generateCuratedRoutineFallback(inputs);
    }

    const data = await response.json();
    if (data && data.morningRoutine && data.eveningRoutine) {
      return {
        ...data,
        id: `routine-ai-${Date.now()}`,
        generatedAt: Date.now(),
        skinType: inputs.skinType,
        primaryConcerns: inputs.primaryConcerns,
        sensitivityLevel: inputs.sensitivity,
        isAiGenerated: true,
      };
    }

    return generateCuratedRoutineFallback(inputs);
  } catch (error) {
    console.warn('Network error calling /api/routine/generate. Using clinical fallback:', error);
    return generateCuratedRoutineFallback(inputs);
  }
}

/**
 * Intelligent clinical fallback algorithm that slots user's actual available shelf products
 * into an optimized daily AM/PM protocol and 7-day weekly active rotation schedule.
 */
export function generateCuratedCustomScheduleFallback(
  inputs: CustomRoutineBuilderInputs
): GeneratedCustomSchedule {
  const { skinType, primaryConcerns, sensitivity, availableProducts } = inputs;
  const isSensitive = sensitivity === 'high' || skinType === 'sensitive';

  // Helper to find best matching product from shelf
  const findProd = (
    predicate: (p: AvailableProduct) => boolean
  ): AvailableProduct | undefined => {
    return availableProducts.find(predicate);
  };

  const userCleanser = findProd((p) => p.category === 'cleanser');
  const userOilCleanser = findProd(
    (p) =>
      p.category === 'cleanser' &&
      Boolean(
        p.name.toLowerCase().includes('oil') ||
          p.name.toLowerCase().includes('balm') ||
          p.name.toLowerCase().includes('melt')
      )
  );
  const userToner = findProd((p) => p.category === 'toner');
  const userSerum = findProd((p) => p.category === 'serum');
  const userAntioxidant = findProd(
    (p) =>
      Boolean(
        p.activeIngredients?.toLowerCase().includes('ascorbic') ||
          p.name.toLowerCase().includes('vitamin c') ||
          p.name.toLowerCase().includes('antioxidant')
      )
  );
  const userExfoliant = findProd(
    (p) =>
      p.category === 'exfoliant' ||
      Boolean(
        p.activeIngredients?.toLowerCase().includes('salicylic') ||
          p.activeIngredients?.toLowerCase().includes('bha') ||
          p.activeIngredients?.toLowerCase().includes('glycolic') ||
          p.activeIngredients?.toLowerCase().includes('aha')
      )
  );
  const userRetinoid = findProd(
    (p) =>
      p.category === 'treatment' &&
      Boolean(
        p.activeIngredients?.toLowerCase().includes('retin') ||
          p.activeIngredients?.toLowerCase().includes('adapalene') ||
          p.name.toLowerCase().includes('retinol') ||
          p.name.toLowerCase().includes('tretinoin')
      )
  );
  const userMoisturizer = findProd((p) => p.category === 'moisturizer');
  const userSunscreen = findProd(
    (p) =>
      p.category === 'sunscreen' ||
      Boolean(p.name.toLowerCase().includes('spf') || p.name.toLowerCase().includes('sun'))
  );

  // Shelf Gap Detection
  const shelfGaps: string[] = [];
  if (!userSunscreen) {
    shelfGaps.push(
      'Missing Broad-Spectrum Daily SPF 50+: UV radiation degrades skin barrier collagen and triggers melanin in dark spots.'
    );
  }
  if (!userMoisturizer) {
    shelfGaps.push(
      'Missing Dedicated Barrier Moisturizer: A ceramide or squalane lipid cream is essential to prevent trans-epidermal water loss.'
    );
  }
  if (!userCleanser) {
    shelfGaps.push(
      'Missing Gentle Non-Stripping Cleanser: Clean pores with a pH-balanced amino acid wash to maintain skin acid mantle.'
    );
  }

  // Clash & Compatibility Warnings
  const productClashWarnings: string[] = [];
  if (userExfoliant && userRetinoid) {
    productClashWarnings.push(
      `Do not use "${userExfoliant.name}" and "${userRetinoid.name}" on the same night. Separate them by at least 24-48 hours using the Skin Cycling rotation schedule below.`
    );
  }
  if (userExfoliant && userAntioxidant) {
    productClashWarnings.push(
      `Apply your antioxidant "${userAntioxidant.name}" in the morning, and reserve your chemical exfoliant "${userExfoliant.name}" strictly for evening sessions.`
    );
  }
  if (isSensitive && userExfoliant) {
    productClashWarnings.push(
      `Because of your sensitivity rating, introduce "${userExfoliant.name}" only once per week to avoid micro-tearing the stratum corneum.`
    );
  }

  // Morning AM Step Sequence
  const morningRoutine: CustomRoutineScheduleStep[] = [
    {
      stepNumber: 1,
      title: userCleanser ? `Cleanse with ${userCleanser.name}` : 'Gentle Lukewarm Water Splash or Milk Wash',
      productType: 'Cleanser',
      matchedProduct: userCleanser ? `${userCleanser.brand ? userCleanser.brand + ' ' : ''}${userCleanser.name}` : undefined,
      action: userCleanser
        ? 'Lather a nickel-sized amount with lukewarm water for 30 seconds. Gently rinse without tugging.'
        : 'Rinse with lukewarm water to remove overnight sebum without stripping natural protective lipids.',
      keyIngredients: userCleanser?.activeIngredients || 'Gentle Amino Surfactants & Glycerin',
      whyItWorks: 'Clears nocturnal sweat and prepares skin to absorb water-based daytime actives.',
      durationMinutes: 1,
      frequency: 'Daily (AM)',
    },
    ...(userToner
      ? [
          {
            stepNumber: 2,
            title: `Hydrate & Prep with ${userToner.name}`,
            productType: 'Toner / Essence',
            matchedProduct: `${userToner.brand ? userToner.brand + ' ' : ''}${userToner.name}`,
            action: 'Pat 3-4 drops directly into damp skin with palms. Never use a harsh cotton pad.',
            keyIngredients: userToner.activeIngredients || 'Hyaluronic Acid, Centella & Humectants',
            whyItWorks: 'Floods the upper stratum corneum with deep hydration and enhances downstream penetration.',
            durationMinutes: 1,
            frequency: 'Daily (AM)',
          },
        ]
      : []),
    {
      stepNumber: userToner ? 3 : 2,
      title: userAntioxidant
        ? `Defend with ${userAntioxidant.name}`
        : userSerum
        ? `Target Concerns with ${userSerum.name}`
        : 'Antioxidant Radiance Shield',
      productType: 'Antioxidant / Day Serum',
      matchedProduct: userAntioxidant
        ? `${userAntioxidant.brand ? userAntioxidant.brand + ' ' : ''}${userAntioxidant.name}`
        : userSerum
        ? `${userSerum.brand ? userSerum.brand + ' ' : ''}${userSerum.name}`
        : undefined,
      action: 'Dispense 3-4 drops onto fingertips and press gently into face and neck.',
      keyIngredients: userAntioxidant?.activeIngredients || userSerum?.activeIngredients || 'Niacinamide & Vitamin C Complex',
      whyItWorks: 'Neutralizes free radical oxidative stress from daily sunlight and urban pollution.',
      durationMinutes: 1,
      frequency: 'Daily (AM)',
    },
    {
      stepNumber: userToner ? 4 : 3,
      title: userMoisturizer ? `Moisturize with ${userMoisturizer.name}` : 'Barrier Replenishing Emulsion',
      productType: 'Moisturizer',
      matchedProduct: userMoisturizer ? `${userMoisturizer.brand ? userMoisturizer.brand + ' ' : ''}${userMoisturizer.name}` : undefined,
      action: 'Warm between fingers and press across cheekbones and forehead to seal humectants.',
      keyIngredients: userMoisturizer?.activeIngredients || 'Ceramides, Squalane & Fatty Acids',
      whyItWorks: 'Reinforces intercellular lipid bridges and blocks trans-epidermal moisture evaporation.',
      durationMinutes: 1,
      frequency: 'Daily (AM)',
    },
    {
      stepNumber: userToner ? 5 : 4,
      title: userSunscreen ? `Protect with ${userSunscreen.name}` : 'Broad-Spectrum SPF 50+ Invisible Shield (Essential)',
      productType: 'Sunscreen',
      matchedProduct: userSunscreen ? `${userSunscreen.brand ? userSunscreen.brand + ' ' : ''}${userSunscreen.name}` : 'Recommended: Broad-Spectrum SPF 50+',
      action: 'Apply two full finger-lengths across face, ears, and neck 15 minutes before sun exposure.',
      keyIngredients: userSunscreen?.activeIngredients || 'High-UVA/UVB Photostable Chemical or Mineral Filters',
      whyItWorks: 'Prevents cellular DNA damage, collagen fragmentation, and post-inflammatory hyperpigmentation recurrence.',
      durationMinutes: 2,
      frequency: 'Daily (AM) Non-Negotiable',
    },
  ];

  // Evening PM Step Sequence
  const eveningRoutine: CustomRoutineScheduleStep[] = [
    {
      stepNumber: 1,
      title: userOilCleanser ? `Double Cleanse First Step: ${userOilCleanser.name}` : 'Oil / Balm First Cleanse',
      productType: 'First Cleanse',
      matchedProduct: userOilCleanser ? `${userOilCleanser.brand ? userOilCleanser.brand + ' ' : ''}${userOilCleanser.name}` : undefined,
      action: 'Apply to completely dry skin; massage gently for 60 seconds to break down sunscreen and excess sebum.',
      keyIngredients: userOilCleanser?.activeIngredients || 'Botanical Jojoba & Plant Lipid Oils',
      whyItWorks: 'Dissolves stubborn lipophilic silicones, waterproof SPF, and hardened pore plugs without friction.',
      durationMinutes: 2,
      frequency: 'Nightly (PM)',
    },
    {
      stepNumber: 2,
      title: userCleanser ? `Second Cleanse with ${userCleanser.name}` : 'Gentle Foaming Water Wash',
      productType: 'Second Cleanse',
      matchedProduct: userCleanser ? `${userCleanser.brand ? userCleanser.brand + ' ' : ''}${userCleanser.name}` : undefined,
      action: 'Emulsify with warm water and wash for 45 seconds to rinse away all dissolved impurities.',
      keyIngredients: userCleanser?.activeIngredients || 'Decyl Glucoside & Panthenol',
      whyItWorks: 'Ensures the skin canvas is pristine for nocturnal cellular renewal.',
      durationMinutes: 1,
      frequency: 'Nightly (PM)',
    },
    {
      stepNumber: 3,
      title: userRetinoid
        ? `Nocturnal Treatment: ${userRetinoid.name}`
        : userExfoliant
        ? `Active Exfoliation: ${userExfoliant.name}`
        : userSerum
        ? `Targeted Serum: ${userSerum.name}`
        : 'Nocturnal Active Renewal Serum',
      productType: 'Targeted Night Active',
      matchedProduct: userRetinoid
        ? `${userRetinoid.brand ? userRetinoid.brand + ' ' : ''}${userRetinoid.name}`
        : userExfoliant
        ? `${userExfoliant.brand ? userExfoliant.brand + ' ' : ''}${userExfoliant.name}`
        : userSerum
        ? `${userSerum.brand ? userSerum.brand + ' ' : ''}${userSerum.name}`
        : undefined,
      action: 'Smooth a pea-sized amount onto dry skin. Follow the 7-day weekly schedule below for rotation frequency.',
      keyIngredients: userRetinoid?.activeIngredients || userExfoliant?.activeIngredients || 'Clinical Retinoid / BHA Complex',
      whyItWorks: 'Accelerates cellular turnover and clears deep folliculosebaceous congestion during sleep.',
      durationMinutes: 1,
      frequency: userRetinoid || userExfoliant ? 'Rotate 2-3x / week (See Weekly Schedule)' : 'Nightly (PM)',
    },
    {
      stepNumber: 4,
      title: userMoisturizer ? `Seal & Restore with ${userMoisturizer.name}` : 'Deep Nocturnal Barrier Recovery Cream',
      productType: 'Night Moisturizer',
      matchedProduct: userMoisturizer ? `${userMoisturizer.brand ? userMoisturizer.brand + ' ' : ''}${userMoisturizer.name}` : undefined,
      action: 'Generously massage over face and neck to wrap skin in a breathable protective lipid cushion.',
      keyIngredients: userMoisturizer?.activeIngredients || 'Biomimetic Ceramides, Cholesterol & Beta-Glucan',
      whyItWorks: 'Supports natural nocturnal lipid synthesis when skin permeability is highest.',
      durationMinutes: 1,
      frequency: 'Nightly (PM)',
    },
  ];

  // 7-Day Weekly Active Rotation Schedule (Monday – Sunday)
  const activeExfoliantName = userExfoliant?.name || 'Mild BHA / AHA Exfoliant';
  const activeRetinoidName = userRetinoid?.name || 'Retinoid Treatment';

  const weeklySchedule: DaySchedule[] = [
    {
      day: 'Monday',
      dayCode: 'mon',
      focus: 'Hydration & Barrier Prime',
      morningNotes: 'Gentle morning wash, plumping toner, moisturizer, SPF 50.',
      eveningNotes: `Double cleanse, soothing hydration essence, barrier cream. (No harsh actives tonight).`,
      activeUsed: 'None (Barrier Rest)',
      productsToUse: [userCleanser?.name, userMoisturizer?.name].filter(Boolean) as string[],
    },
    {
      day: 'Tuesday',
      dayCode: 'tue',
      focus: 'Exfoliation Night',
      morningNotes: 'Rinse, antioxidant serum, barrier cream, non-negotiable SPF 50.',
      eveningNotes: `Double cleanse, pat completely dry, apply ${activeExfoliantName}. Wait 5 mins, finish with barrier cream.`,
      activeUsed: userExfoliant?.name || 'BHA / AHA Exfoliant',
      productsToUse: [userCleanser?.name, activeExfoliantName, userMoisturizer?.name].filter(Boolean) as string[],
    },
    {
      day: 'Wednesday',
      dayCode: 'wed',
      focus: 'Recovery Night 1',
      morningNotes: 'Gentle hydration wash, soothing serum, rich moisturizer, SPF 50.',
      eveningNotes: 'Double cleanse, flood skin with hydrating essence and rich ceramide cream. Let barrier reset.',
      activeUsed: 'None (Recovery & Lipid Rebuilding)',
      productsToUse: [userCleanser?.name, userToner?.name, userMoisturizer?.name].filter(Boolean) as string[],
    },
    {
      day: 'Thursday',
      dayCode: 'thu',
      focus: 'Retinoid / Active Renewal Night',
      morningNotes: 'Rinse, antioxidant shield, moisturizer, SPF 50.',
      eveningNotes: `Double cleanse, dry skin thoroughly, apply pea-sized ${activeRetinoidName}. Buffer with moisturizer.`,
      activeUsed: userRetinoid?.name || 'Retinoid / Cellular Turnover Active',
      productsToUse: [userCleanser?.name, activeRetinoidName, userMoisturizer?.name].filter(Boolean) as string[],
    },
    {
      day: 'Friday',
      dayCode: 'fri',
      focus: 'Recovery Night 2',
      morningNotes: 'Gentle wash, soothing serum, barrier cream, SPF 50.',
      eveningNotes: 'Double cleanse, deep hydration serum, ceramide recovery balm.',
      activeUsed: 'None (Lipid Matrix Replenishment)',
      productsToUse: [userCleanser?.name, userMoisturizer?.name].filter(Boolean) as string[],
    },
    {
      day: 'Saturday',
      dayCode: 'sat',
      focus: userRetinoid ? 'Retinoid Check-in Night' : 'Targeted Serum Night',
      morningNotes: 'Rinse, hydration serum, barrier cream, SPF 50.',
      eveningNotes: userRetinoid
        ? `Double cleanse, apply second weekly dose of ${activeRetinoidName}, lock in with night cream.`
        : `Double cleanse, gentle antioxidant hydration serum, soothing night cream.`,
      activeUsed: userRetinoid ? userRetinoid.name : 'Targeted Peptide Serum',
      productsToUse: [userCleanser?.name, userRetinoid?.name || userSerum?.name, userMoisturizer?.name].filter(Boolean) as string[],
    },
    {
      day: 'Sunday',
      dayCode: 'sun',
      focus: 'Deep Reset & Slugging / Moisture Wrap',
      morningNotes: 'Gentle wash, antioxidant shield, moisturizer, SPF 50.',
      eveningNotes: 'Double cleanse, multi-layer hydration essence, rich night cream. Optional light occlusive on dry zones.',
      activeUsed: 'Ceramides & Squalane Wrap',
      productsToUse: [userCleanser?.name, userToner?.name, userMoisturizer?.name].filter(Boolean) as string[],
    },
  ];

  const matchedProductNames = Array.from(
    new Set(
      [
        userCleanser?.name,
        userOilCleanser?.name,
        userToner?.name,
        userSerum?.name,
        userAntioxidant?.name,
        userExfoliant?.name,
        userRetinoid?.name,
        userMoisturizer?.name,
        userSunscreen?.name,
      ].filter(Boolean) as string[]
    )
  );

  return {
    id: `custom-schedule-${Date.now()}`,
    generatedAt: Date.now(),
    skinType,
    primaryConcerns,
    sensitivityLevel: sensitivity,
    availableProductsCount: availableProducts.length,
    availableProductsMatched: matchedProductNames,
    summary: `A personalized skincare schedule curated around your ${availableProducts.length} shelf products, targeting ${primaryConcerns.length} key concerns with balanced weekly Skin Cycling.`,
    barrierAdvice:
      'By organizing your products into designated active and recovery evenings, your moisture barrier stays calm while active ingredients work at peak efficacy.',
    keyRecommendedActives: matchedProductNames.length > 0 ? matchedProductNames : ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'],
    morningRoutine,
    eveningRoutine,
    weeklySchedule,
    shelfGaps,
    productClashWarnings,
    weeklyRituals: [
      'Follow the 4-day Skin Cycling rhythm: Exfoliate ➔ Retinoid ➔ Recovery ➔ Recovery.',
      'Always wait 60 seconds between layering water-based serums and rich creams.',
      'Reapply your sunscreen every 2 hours when exposed to direct daylight.',
    ],
    incompatibleActives: productClashWarnings,
    abbasProTip:
      availableProducts.length > 0
        ? `The greatest mistake is using every product you own every single day. By rotating your ${matchedProductNames.length} key active products across our 7-day schedule, you eliminate barrier breakdown while accelerating radiant transformation.`
        : 'Consistency always beats complexity. Add your vanity shelf products to unlock tailored step assignments and active clash detection.',
    isAiGenerated: false,
  };
}

/**
 * Calls backend Gemini API to generate a personalized skincare schedule based on
 * user's stated skin concerns and available products.
 */
export async function requestPersonalizedAiCustomSchedule(
  inputs: CustomRoutineBuilderInputs
): Promise<GeneratedCustomSchedule> {
  try {
    const response = await fetch('/api/routine/generate-custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      console.warn(`Server Gemini custom route returned status ${response.status}. Using clinical schedule fallback.`);
      return generateCuratedCustomScheduleFallback(inputs);
    }

    const data = await response.json();
    if (data && data.morningRoutine && data.eveningRoutine && Array.isArray(data.weeklySchedule)) {
      return {
        ...data,
        id: `custom-schedule-ai-${Date.now()}`,
        generatedAt: Date.now(),
        skinType: inputs.skinType,
        primaryConcerns: inputs.primaryConcerns,
        sensitivityLevel: inputs.sensitivity,
        availableProductsCount: inputs.availableProducts.length,
        isAiGenerated: true,
      };
    }

    return generateCuratedCustomScheduleFallback(inputs);
  } catch (error) {
    console.warn('Network error calling /api/routine/generate-custom. Using clinical schedule fallback:', error);
    return generateCuratedCustomScheduleFallback(inputs);
  }
}

