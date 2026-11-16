export interface BeautyPoster {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  themeColor: string;
  accentBorder: string;
  bgGradient: string;
  badge: string;
  keyRule: string;
  stagesOrSteps: {
    number: string;
    title: string;
    description: string;
    bulletPoints: string[];
    highlightTag?: string;
  }[];
  clinicalAdvice: string;
  goldenRule: string;
  downloadFilename: string;
}

export const BEAUTY_POSTERS: BeautyPoster[] = [
  {
    id: 'layering-hierarchy',
    title: 'The Golden Skincare Layering Hierarchy',
    subtitle: 'From Thin to Thick: Molecular Viscosity Rules for Maximum Absorption',
    tagline: 'Never waste an active ingredient again by mastering correct penetration physics.',
    themeColor: 'rose',
    accentBorder: 'border-rose-500/40',
    bgGradient: 'from-rose-950/40 via-stone-900 to-stone-950',
    badge: 'Formulation Physics',
    keyRule: 'Water-based formulations can NEVER penetrate through lipid/oil layers. Always layer by increasing molecular density.',
    stagesOrSteps: [
      {
        number: '01',
        title: 'Water Cleanser / Double Cleanse',
        description: 'Strip makeup and sebum with oil balm first, then cleanse with a low-pH gentle gel cleanser (pH 5.5).',
        bulletPoints: ['Oil or micellar cleanser first', 'Gentle non-foaming gel second', 'Lukewarm water only'],
        highlightTag: 'Clean Canvas',
      },
      {
        number: '02',
        title: 'Hydrosol & Water Toners',
        description: 'Lightweight water-thin textures that hydrate the outer stratum corneum and balance pH.',
        bulletPoints: ['Pat gently into skin', 'Leave skin damp for step 3', 'Zero alcohol formulations'],
        highlightTag: 'Hydration Foundation',
      },
      {
        number: '03',
        title: 'Water-Based Serums & Actives',
        description: 'Hyaluronic acid, Niacinamide, or low-pH Vitamin C that require damp/clean skin to absorb.',
        bulletPoints: ['Hyaluronic acid on damp face', 'Vitamin C on dry skin (if low pH)', 'Allow 60s to absorb'],
        highlightTag: 'Target Treatment',
      },
      {
        number: '04',
        title: 'Target Emulsions & Eye Creams',
        description: 'Light fluid milks and gentle peptide eye creams to cushion delicate micro-vascular areas.',
        bulletPoints: ['Ring finger pressure around orbital bone', 'Never pull eyelid tissue', 'Lightweight fluid texture'],
      },
      {
        number: '05',
        title: 'Lipid Barrier Cream / Moisturizer',
        description: 'Ceramides, cholesterol, and fatty acids that seal the water hydration below the stratum corneum.',
        bulletPoints: ['Locks all underlying serums', 'Restores lipid matrix mortar', 'Morning light gel, Night rich balm'],
        highlightTag: 'Mortar Seal',
      },
      {
        number: '06',
        title: 'Facial Oil / Slugging (Night)',
        description: 'Plant squalane, rosehip, or occlusive petrolatum to prevent transepidermal water loss overnight.',
        bulletPoints: ['Final night step only', '1-2 drops warmed between palms', 'Prevents dry air dehydration'],
        highlightTag: 'Occlusion Shield',
      },
      {
        number: '07',
        title: 'Broad-Spectrum SPF 50 (Day Only)',
        description: 'The outermost defensive shield against solar radiation. Never layer oils or thick balms over SPF.',
        bulletPoints: ['Two finger lengths for face & neck', 'Wait 15 mins before sun', 'Reapply every 2-3 hours outdoors'],
        highlightTag: 'Solar Shield',
      },
    ],
    clinicalAdvice: 'If you apply heavy facial oil before your water-soluble hyaluronic acid or niacinamide serum, the serum sits on top of the hydrophobic film and evaporates into the air without penetrating.',
    goldenRule: 'Rule of Thumb: Water -> Essence -> Serum -> Emulsion -> Cream -> Oil -> Sunscreen.',
    downloadFilename: 'Abbas-Skincare-Layering-Hierarchy.txt',
  },
  {
    id: 'skin-barrier-protocol',
    title: 'The 14-Day Barrier Recovery Protocol',
    subtitle: 'From Compromised Redness to Fortified Acid Mantle Resilience',
    tagline: 'When skin stings, turns red, or breaks out with tiny dehydration bumps, your lipid wall is cracked.',
    themeColor: 'emerald',
    accentBorder: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/40 via-stone-900 to-stone-950',
    badge: 'Clinical Barrier Health',
    keyRule: 'Cease all active acids (AHA/BHA), retinoids, and physical scrubs immediately. Switch exclusively to bio-compatible barrier replenishment.',
    stagesOrSteps: [
      {
        number: 'Days 1-3',
        title: 'Immediate Cessation & Crisis Calm',
        description: 'Stop all exfoliants, retinoids, vitamin C, foaming cleansers, and fragranced products.',
        bulletPoints: ['Wash with water or oat milk cleanser only', 'Zero active ingredients', 'Apply Centella Asiatica & Panthenol'],
        highlightTag: 'Acute Phase',
      },
      {
        number: 'Days 4-7',
        title: 'Lipid Mortar Reconstruction',
        description: 'Supply the stratum corneum with ceramides, cholesterol, and free fatty acids in the optimal 3:1:1 ratio.',
        bulletPoints: ['Ceramide NP / AP barrier moisturizers', 'Pure plant squalane drop seals', 'Mineral sunscreen only (zinc oxide calms)'],
        highlightTag: 'Lipid Filling',
      },
      {
        number: 'Days 8-10',
        title: 'Cellular Cohesion & Acid Mantle Reset',
        description: 'Restore the natural acidic micro-biome (pH 4.5-5.5) with prebiotic fermented extracts and colloidal oats.',
        bulletPoints: ['Colloidal oatmeal compress masks', 'Stinging sensation ceases completely', 'Skin rebound elasticity returns'],
        highlightTag: 'pH Normalization',
      },
      {
        number: 'Days 11-14',
        title: 'Fortified Tolerance & Gradual Reintroduction',
        description: 'Verify complete healing before introducing gentle non-irritating actives.',
        bulletPoints: ['Patch test any gentle active behind ear', 'Introduce retinol once per week only', 'Retain ceramide cream as permanent staple'],
        highlightTag: 'Resilience Regained',
      },
    ],
    clinicalAdvice: 'A healthy skin barrier has tight intercellular junctions that lock moisture in and keep pathogens out. When the barrier is damaged, transepidermal water loss skyrockets, causing redness and secondary breakouts.',
    goldenRule: 'Less is more: You cannot exfoliate away a compromised, stinging skin barrier.',
    downloadFilename: 'Abbas-14-Day-Barrier-Recovery-Protocol.txt',
  },
  {
    id: 'active-ingredients-clock',
    title: 'The 24-Hour Skincare Actives Clock',
    subtitle: 'Synchronizing Morning Defense vs Nighttime Cellular Regeneration',
    tagline: 'Circadian rhythms dictate skin biology: protect in daylight, repair under darkness.',
    themeColor: 'amber',
    accentBorder: 'border-amber-500/40',
    bgGradient: 'from-amber-950/40 via-stone-900 to-stone-950',
    badge: 'Circadian Skincare',
    keyRule: 'Antioxidants (Vitamin C) thrive under UV challenge; Photolabile actives (Retinol, Glycolic Acid) break down in sunlight and belong exclusively at night.',
    stagesOrSteps: [
      {
        number: '07:00 AM',
        title: 'Morning Antioxidant Defense Shield',
        description: 'Skin is entering daytime environmental combat: UV photons, ozone, urban particulate matter.',
        bulletPoints: ['Vitamin C (L-Ascorbic Acid) + Ferulic Acid', 'Niacinamide for sebum control', 'Hyaluronic Acid hydration lock'],
        highlightTag: 'Photoprotection',
      },
      {
        number: '08:00 AM',
        title: 'Impervious Photoprotection (SPF 50+)',
        description: 'Broad-spectrum mineral or chemical filter application. Protects the antioxidant layer beneath.',
        bulletPoints: ['SPF 50 with PA++++ rating', 'Generous 1/4 teaspoon for face', 'Reapplication every 2-3h outdoors'],
      },
      {
        number: '07:30 PM',
        title: 'Evening Decontamination & Barrier Rinse',
        description: 'Removing oxidized sebum, sunscreen filters, and airborne heavy metals from the day.',
        bulletPoints: ['Oil cleansing dissolves lipophilic sunscreen', 'Gentle second wash removes sweat/dust', 'Pat face dry gently with clean towel'],
        highlightTag: 'Decontamination',
      },
      {
        number: '09:00 PM',
        title: 'Night Cellular DNA Repair & Mitosis',
        description: 'Skin blood flow and cellular division peak during sleep between 10 PM and 2 AM.',
        bulletPoints: ['Retinoids (Retinol / Tretinoin) stimulate turnover', 'Alternated with AHA/BHA chemical exfoliation nights', 'Rich ceramide peptide night cream'],
        highlightTag: 'Mitosis & Repair',
      },
    ],
    clinicalAdvice: 'Never mix Retinol and Glycolic Acid in the same evening. Adopt the "Skin Cycling" routine: Night 1 Exfoliate, Night 2 Retinoid, Night 3 Recovery, Night 4 Recovery.',
    goldenRule: 'Daytime is for Defense. Nighttime is for Renewal.',
    downloadFilename: 'Abbas-24-Hour-Skincare-Clock.txt',
  },
  {
    id: 'sun-protection-spectrum',
    title: 'The Comprehensive Sun Defense & UV Spectrum',
    subtitle: 'Decoding UVA Aging, UVB Burning, and the Real Math of SPF Numbers',
    tagline: '90% of premature visible facial aging is directly caused by chronic ultraviolet exposure.',
    themeColor: 'sky',
    accentBorder: 'border-sky-500/40',
    bgGradient: 'from-sky-950/40 via-stone-900 to-stone-950',
    badge: 'Photobiology Guide',
    keyRule: 'SPF only measures UVB protection (burning rays). Always look for the Broad Spectrum label and PA++++ rating for full UVA protection.',
    stagesOrSteps: [
      {
        number: 'UVB Rays',
        title: 'Short Wave (290 - 320 nm) — The Burning Rays',
        description: 'Penetrates the epidermis; causes sunburn, direct DNA thymine dimers, and surface erythema.',
        bulletPoints: ['Blocked partially by standard glass windows', 'Peak intensity between 10:00 AM and 4:00 PM', 'Measured by SPF numbers (SPF 30 = 97%, SPF 50 = 98%)'],
        highlightTag: 'Surface Burn',
      },
      {
        number: 'UVA Rays',
        title: 'Long Wave (320 - 400 nm) — The Deep Aging Rays',
        description: 'Penetrates deep into the dermis; destroys collagen and elastin fibers, triggers deep melasma.',
        bulletPoints: ['Passes right through window glass and cloud cover', 'Constant intensity year-round, dawn to dusk', 'Measured by PA+ to PA++++ rating system'],
        highlightTag: 'Deep Aging',
      },
      {
        number: 'Blue Light',
        title: 'HEV (High Energy Visible Light) & Infrared',
        description: 'Emitted by the sun and electronic screens; can stimulate stubborn hyperpigmentation in melanin-rich skin.',
        bulletPoints: ['Tinted sunscreens containing Iron Oxides block HEV', 'Antioxidants (Vitamin C, Niacinamide) neutralize free radicals', 'Essential for melasma management'],
        highlightTag: 'Pigment Trigger',
      },
      {
        number: 'The Math',
        title: 'Proper Dosing: The Two-Finger Rule',
        description: 'Most people only apply 25% to 50% of the tested amount, drastically reducing real protection.',
        bulletPoints: ['Measure two solid strips along index and middle finger', 'Covers face, ears, and back of the neck', 'SPF 30 applied too thin performs like SPF 4'],
        highlightTag: 'Quantity Vital',
      },
    ],
    clinicalAdvice: 'An SPF 50 sunscreen blocks 98% of UVB rays; an SPF 30 sunscreen blocks 96.7%. The number difference is modest, but application thickness and reapplication are what guarantee real-world protection.',
    goldenRule: 'The best anti-aging cream in the world is the sunscreen you wear every single day.',
    downloadFilename: 'Abbas-Sun-Protection-Spectrum.txt',
  },
  {
    id: 'hydration-vs-moisture',
    title: 'Hydration vs Moisture: The Critical Difference',
    subtitle: 'Understanding Humectants, Emollients, and Occlusives',
    tagline: 'Dehydrated skin lacks water; dry skin lacks oil. Treating one with the wrong product solves nothing.',
    themeColor: 'teal',
    accentBorder: 'border-teal-500/40',
    bgGradient: 'from-teal-950/40 via-stone-900 to-stone-950',
    badge: 'Cosmetic Chemistry',
    keyRule: 'Hydration is putting water into skin cells. Moisture is building an oil-based roof so the water cannot evaporate.',
    stagesOrSteps: [
      {
        number: 'Group 1',
        title: 'Humectants (Water Magnets)',
        description: 'Hydrophilic molecules that attract and hold ambient water molecules directly into cells.',
        bulletPoints: ['Hyaluronic Acid, Glycerin, Sodium PCA, Urea', 'Texture: Watery, gel-like, lightweight serums', 'Skin Feel: Bouncy, quench, plump, fresh'],
        highlightTag: 'Attracts Water',
      },
      {
        number: 'Group 2',
        title: 'Emollients (Texture Smoothers)',
        description: 'Lipids and fatty acids that fill micro-cracks between flaking skin cells for instant silkiness.',
        bulletPoints: ['Ceramides, Squalane, Jojoba Oil, Caprylic Triglyceride', 'Texture: Milks, lotions, velvety creams', 'Skin Feel: Supple, smooth, velvety, conditioned'],
        highlightTag: 'Smooths Gaps',
      },
      {
        number: 'Group 3',
        title: 'Occlusives (The Moisture Seal)',
        description: 'Dense hydrophobic barriers that form an impermeable seal against evaporation.',
        bulletPoints: ['Petrolatum, Shea Butter, Beeswax, Dimethicone', 'Texture: Dense balms, salves, heavy butters', 'Skin Feel: Protective, rich, glossy, insulated'],
        highlightTag: 'Locks It In',
      },
    ],
    clinicalAdvice: 'If you only apply humectants (e.g. pure hyaluronic acid) without an emollient or occlusive, in dry ambient air the humectant will pull water from your deeper dermis and evaporate away, leaving you more dehydrated.',
    goldenRule: 'Step 1: Hydrate with Humectants -> Step 2: Smooth with Emollients -> Step 3: Seal with Occlusives.',
    downloadFilename: 'Abbas-Hydration-vs-Moisture-Matrix.txt',
  },
  {
    id: 'acne-lifecycle',
    title: 'The Acne Lifecycle & Healing Timeline',
    subtitle: 'From Invisible Microcomedone to Post-Inflammatory Mark Recovery',
    tagline: 'Acne develops weeks before you see it on the skin surface. Treat the root cause, not just the bump.',
    themeColor: 'purple',
    accentBorder: 'border-purple-500/40',
    bgGradient: 'from-purple-950/40 via-stone-900 to-stone-950',
    badge: 'Dermatological Pathology',
    keyRule: 'Never squeeze, pop, or extract active cystic lesions. Doing so ruptures the follicle wall and drives bacteria deeper into the dermis.',
    stagesOrSteps: [
      {
        number: 'Stage 1',
        title: 'Microcomedone Formation (Day -14 to Day -7)',
        description: 'Excess sebum mixes with sticky dead keratinocytes, plugging the sebaceous duct beneath the surface.',
        bulletPoints: ['Invisible to the naked eye', 'Prevented with Salicylic Acid (BHA) and Retinoids', 'Target with gentle daily cleansing'],
        highlightTag: 'Subsurface Seed',
      },
      {
        number: 'Stage 2',
        title: 'Bacterial Colonization & Papule (Day 1 to Day 3)',
        description: 'Cutibacterium acnes proliferates in the oxygen-deprived sebum plug, triggering inflammation.',
        bulletPoints: ['Tender red bump without visible pus head', 'Apply Benzoyl Peroxide (2.5%) or Azelaic Acid', 'Ice wrapped in cloth for 5 mins reduces swelling'],
        highlightTag: 'Inflammatory Peak',
      },
      {
        number: 'Stage 3',
        title: 'Pustule & White Blood Cell Response (Day 4 to Day 6)',
        description: 'Neutrophils rush to destroy bacteria, creating a visible white center.',
        bulletPoints: ['Hydrocolloid pimple patch absorbs fluid and stops picking', 'Avoid abrasive physical scrubs', 'Warm green tea compress calms tension'],
        highlightTag: 'Cellular Defense',
      },
      {
        number: 'Stage 4',
        title: 'PIE / PIH Mark Recovery (Week 2 to Week 12)',
        description: 'The bump heals, leaving erythema (pink/red vascular marks) or hyperpigmentation (melanin).',
        bulletPoints: ['Strict daily SPF 50 stops sun from darkening the mark', 'Niacinamide + Tranexamic Acid + Azelaic Acid fade spots', 'Patience: cellular turnover takes 28-40 days'],
        highlightTag: 'Pigment Repair',
      },
    ],
    clinicalAdvice: 'Picking a blemish turns a 5-day superficial pustule into a 6-month deep hyperpigmented scar or permanent pitted indent. Cover with a pimple patch and let your immune cells do their job.',
    goldenRule: 'Treat the entire face consistently with preventative actives, not just spot treatments when bumps appear.',
    downloadFilename: 'Abbas-Acne-Lifecycle-Guide.txt',
  },
];
