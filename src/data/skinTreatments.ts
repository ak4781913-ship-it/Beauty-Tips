export interface SkinConcernTreatment {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  badge: string;
  overview: string;
  commonCauses: string[];
  careRecommendations: string[];
  suggestedIngredients: string[];
  contraindicatedIngredients: string[];
  routineSteps: {
    timing: 'Morning (AM)' | 'Evening (PM)' | 'Weekly Ritual';
    steps: string[];
  }[];
  applicationInstructions: string[];
  precautions: string[];
  whenToConsultDoctor: string[];
  referencedPosterId?: string;
}

export const SKIN_TREATMENTS_SOLUTIONS: SkinConcernTreatment[] = [
  {
    id: 'dry-skin-care',
    title: 'Dry Skin Care & Lipid Restoration',
    shortDescription: 'Deep nourishing protocols for lipid-depleted, flaking, and rough skin.',
    iconName: 'Droplets',
    badge: 'Lipid Depletion',
    overview: 'Dry skin is a genetic skin type characterized by insufficient natural sebum and lipid production in sebaceous glands, leading to a porous stratum corneum that cannot hold moisture.',
    commonCauses: [
      'Genetically reduced sebaceous gland activity',
      'Cold, low-humidity winter weather or dry indoor air conditioning',
      'Overwashing with alkaline, high-pH foaming soaps',
      'Hot showers stripping cutaneous sebum',
      'Aging, which naturally reduces epidermal lipid synthesis',
    ],
    careRecommendations: [
      'Switch immediately to non-foaming cream or oil-based milky cleansers',
      'Apply hydrators and moisturizers onto damp skin within 60 seconds of bathing',
      'Incorporate lipid-identical ceramides, cholesterol, and squalane',
      'Run an ultrasonic cool-mist humidifier in the bedroom overnight',
      'Avoid abrasive physical scrubs or rough washcloths',
    ],
    suggestedIngredients: ['Ceramides NP/AP', 'Plant Squalane', 'Glycerin', 'Shea Butter', 'Colloidal Oatmeal', 'Hyaluronic Acid'],
    contraindicatedIngredients: ['Denatured Alcohol', 'High-strength Glycolic Acid (>10%) on broken skin', 'Sodium Lauryl Sulfate (SLS)', 'Astringent witch hazel'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Rinse with lukewarm water or gentle milk cleanser',
          'Pat hydrating glycerin & hyaluronic acid essence onto damp face',
          'Smooth barrier-repair ceramide cream across face and neck',
          'Apply moisturizing broad-spectrum SPF 50 sunscreen',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Gently cleanse with nourishing cleansing balm or oil',
          'Second wash with hydrating creamy lotion cleanser',
          'Layer hyaluronic acid and panthenol recovery serum',
          'Seal with rich ceramide lipid cream followed by 2 drops of squalane oil',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Gentle lactic acid 5% exfoliation once per week to smooth flaking cells',
          'Overnight barrier sleeping mask with honey or colloidal oat extract',
        ],
      },
    ],
    applicationInstructions: [
      'Press, do not rub, dense creams between palms before patting into skin.',
      'Always apply products to slightly damp skin to trap ambient water.',
    ],
    precautions: [
      'Flaking can be confused with fungal conditions (seborrheic dermatitis); if scaling is greasy and accompanied by yellow crusts, see a dermatologist.',
    ],
    whenToConsultDoctor: [
      'Skin develops painful cracks, fissures, or bleeding.',
      'Severe intractable itching disrupts sleep.',
      'Signs of secondary bacterial infection (oozing, yellow crusting, warmth).',
    ],
    referencedPosterId: 'hydration-vs-moisture',
  },
  {
    id: 'oily-skin-care',
    title: 'Oily Skin Care & Sebum Normalization',
    shortDescription: 'Balancing hyperactive sebaceous glands without stripping the acid mantle.',
    iconName: 'Flame',
    badge: 'Sebum Regulation',
    overview: 'Oily skin stems from enlarged sebaceous glands overproducing sebum under androgenic influence. Stripping oil with harsh astringents paradoxically triggers compensatory rebound oil production.',
    commonCauses: [
      'Genetic predisposition and hormonal fluctuations (DHT/androgens)',
      'High humidity and heat stimulating sweat and sebum flow',
      'Using harsh, dehydrating alcohol-based toners',
      'Dietary factors high in refined sugars and dairy stimulating IGF-1',
    ],
    careRecommendations: [
      'Cleanse twice daily with a balanced pH 5.5 foaming gel cleanser',
      'Use lipophilic Salicylic Acid (BHA) to unclog sebum-clogged pores from within',
      'Keep skin hydrated with oil-free water-gel formulations so it does not overcompensate',
      'Incorporate 2-5% Niacinamide daily to visibly down-regulate oil output',
    ],
    suggestedIngredients: ['Niacinamide', 'Salicylic Acid (BHA)', 'Zinc PCA', 'Green Tea Extract', 'Hyaluronic Acid Gel'],
    contraindicatedIngredients: ['Heavy Coconut Oil', 'Dense Mineral Waxes on face', 'Alcohol Denat.', 'Abrasive walnut shells'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Gentle gel cleanse with tea tree or zinc amino acid wash',
          'Niacinamide 4% serum to regulate shine throughout the day',
          'Ultra-lightweight oil-free water cream moisturizer',
          'Matte-finish or fluid broad-spectrum SPF 50 sunscreen',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Micellar water or light oil cleanse to remove sunscreen and urban grime',
          'Gentle foaming cleanser rinse',
          'Salicylic Acid 2% liquid exfoliant (3 times per week)',
          'Lightweight ceramide gel-cream to maintain lipid balance',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Kaolin or bentonite clay mask for 10 minutes on T-zone only (never let dry to cracking point)',
        ],
      },
    ],
    applicationInstructions: [
      'Pat BHA liquid gently over oily zones; avoid pulling delicate eye contours.',
      'Do not skip moisturizer—dehydrated oily skin produces twice as much shine.',
    ],
    precautions: [
      'Over-cleansing more than twice daily destroys the barrier and increases breakout frequency.',
    ],
    whenToConsultDoctor: [
      'Oily skin accompanied by severe cystic nodules or painful cystic clusters.',
      'Suspected PCOS or sudden severe hormonal acne flare-ups.',
    ],
    referencedPosterId: 'acne-lifecycle',
  },
  {
    id: 'acne-education',
    title: 'Acne Education & Blemish Management',
    shortDescription: 'Clinical guidance on comedones, papules, inflammatory acne, and safe healing.',
    iconName: 'ShieldAlert',
    badge: 'Clinical Blemish Science',
    overview: 'Acne vulgaris is an inflammatory disease of the pilosebaceous unit triggered by follicular hyperkeratinization, excess sebum, Cutibacterium acnes proliferation, and host inflammatory cascades.',
    commonCauses: [
      'Follicular pore plugging by sticky desquamated keratinocytes',
      'Excess sebum feeding bacterial colonization',
      'Chronic stress elevating cortisol and neurogenic inflammation',
      'Mechanical friction from face masks, phone screens, or pillowcases (Acne mechanica)',
      'Hormonal cyclic surges triggering deep jawline flare-ups',
    ],
    careRecommendations: [
      'Never pick, scratch, or extract active lesions; use hydrocolloid pimple patches',
      'Wash pillowcases every 3-4 days and disinfect smartphone screens daily',
      'Apply topical antimicrobial actives (Benzoyl Peroxide or Azelaic Acid) consistently across zones',
      'Introduce Retinoids at night to prevent new microcomedones from forming',
    ],
    suggestedIngredients: ['Salicylic Acid (BHA)', 'Benzoyl Peroxide (2.5%)', 'Azelaic Acid', 'Adapalene / Retinol', 'Centella Asiatica'],
    contraindicatedIngredients: ['Comedogenic heavy oils (Cocoa butter, Wheatgerm)', 'Abrasive scrubs that rupture pustules', 'Fragrances and essential oils'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Wash with gentle anti-bacterial foaming cleanser',
          'Apply Azelaic Acid 10% or Niacinamide serum',
          'Light non-comedogenic gel moisturizer',
          'Oil-free, non-pore-clogging broad-spectrum SPF 50',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Gentle micellar water wipe down followed by low-pH cleanser',
          'Allow skin to dry completely for 10 minutes',
          'Apply pea-sized Retinol or OTC Adapalene across the entire face (not just spots)',
          'Soothing Centella Asiatica barrier lotion',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Zinc sulfur spot treatment mask for stubborn deep spots',
        ],
      },
    ],
    applicationInstructions: [
      'Treat the entire blemish-prone zone proactively, rather than merely spot-treating visible heads.',
      'Place a hydrocolloid patch over whiteheads to absorb exudate and eliminate the urge to pick.',
    ],
    precautions: [
      'Benzoyl peroxide bleaches colored fabrics and pillowcases; use white linens or apply carefully.',
    ],
    whenToConsultDoctor: [
      'Nodular or deep cystic acne that feels painful under the skin.',
      'Lesions leaving depressed, pitted "ice-pick" or rolling scars.',
      'Over-the-counter regimens showing no improvement after 8-12 weeks.',
    ],
    referencedPosterId: 'acne-lifecycle',
  },
  {
    id: 'dark-spot-education',
    title: 'Dark Spot Education & Pigment Correction',
    shortDescription: 'Evidence-based protocols for post-acne marks, sun spots, and melasma.',
    iconName: 'Sparkles',
    badge: 'Tyrosinase Inhibition',
    overview: 'Hyperpigmentation results from hyperactive melanocytes depositing excess melanin granules into keratinocytes, triggered by UV radiation, hormonal shifts, or post-inflammatory trauma (PIH/PIE).',
    commonCauses: [
      'Post-inflammatory hyperpigmentation (PIH) left after picked acne lesions',
      'Chronic cumulative ultraviolet (UVA/UVB) sun exposure',
      'Hormonal triggers (pregnancy, oral contraceptives) causing Melasma',
      'High-energy visible (HEV) blue light stimulating deep pigment',
    ],
    careRecommendations: [
      'Daily 365-day broad-spectrum SPF 50+ is mandatory—UV exposure undoes months of fading in hours',
      'Use multi-pathway tyrosinase inhibitors (Vitamin C, Alpha Arbutin, Tranexamic Acid)',
      'Accelerate cellular turnover with evening retinoids or gentle AHAs',
      'Never pick at scabs or active spots, which turns temporary erythema into permanent pigment',
    ],
    suggestedIngredients: ['Tranexamic Acid', 'Vitamin C (L-Ascorbic Acid)', 'Alpha Arbutin', 'Azelaic Acid', 'Niacinamide', 'Licorice Root'],
    contraindicatedIngredients: ['Unbuffered raw lemon juice (causes severe phytophotodermatitis / chemical burns)', 'Harsh physical bleach creams containing illegal steroids or mercury'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Gentle antioxidant cleanser',
          'Vitamin C 15% serum + Ferulic Acid to neutralize free radicals',
          'Alpha Arbutin or Tranexamic Acid brightening serum',
          'Light barrier moisturizer',
          'Broad-spectrum SPF 50+ (mineral or tinted with iron oxides for melasma)',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Double cleanse to lift daytime sunscreen and pollution',
          'Azelaic Acid 10% or Niacinamide 5% serum',
          'Retinol 0.3% to accelerate epidermal pigment shedding',
          'Ceramide restorative night cream',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Lactic acid or mandelic acid gentle peel once a week to brighten surface veil',
        ],
      },
    ],
    applicationInstructions: [
      'Apply tyrosinase inhibitors consistently for at least 8 to 12 weeks to see clinical fading.',
      'Reapply sunscreen every 2 hours when outdoors to prevent melanocyte reactivation.',
    ],
    precautions: [
      'Aggressive chemical peeling or harsh lasers in deeper skin tones (Fitzpatrick IV-VI) can trigger severe rebound PIH.',
    ],
    whenToConsultDoctor: [
      'Any pigmented spot that changes shape, size, color irregularity, or has asymmetrical borders (ABCDE melanoma check).',
      'Stubborn deep dermal melasma requiring prescription triple combination cream (hydroquinone protocol).',
    ],
    referencedPosterId: 'sun-protection-spectrum',
  },
  {
    id: 'skin-hydration',
    title: 'Skin Hydration vs Moisture Therapy',
    shortDescription: 'Restoring intracellular water reserves and halting transepidermal loss.',
    iconName: 'Droplets',
    badge: 'Cellular Quenching',
    overview: 'Dehydration refers to a lack of water content in the epidermis, occurring regardless of whether your skin is naturally oily or dry. Proper hydration requires both humectant binding and lipid sealing.',
    commonCauses: [
      'Low environmental humidity and winter indoor heating',
      'Inadequate daily water intake and high caffeine/alcohol consumption',
      'Damaged skin barrier allowing water to evaporate freely (elevated TEWL)',
      'Excessive hot baths and long plane flights',
    ],
    careRecommendations: [
      'Layer multiple light watery humectant layers rather than one heavy greasy balm',
      'Apply hyaluronic acid strictly to damp skin after cleansing or misting',
      'Always seal humectants with an emollient or ceramide cream immediately',
      'Incorporate multi-molecular weight hyaluronic acid that hydrates both surface and deeper layers',
    ],
    suggestedIngredients: ['Multi-Weight Hyaluronic Acid', 'Glycerin', 'Polyglutamic Acid', 'Beta-Glucan', 'Panthenol (B5)', 'Aloe Vera'],
    contraindicatedIngredients: ['High alcohol astringents', 'Bentonite clay left on to bone-dry cracking state', 'Overly aggressive chemical peels'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Hydrating toner or pure rose water mist',
          'Hyaluronic Acid 2% serum smoothed over damp face',
          'Beta-Glucan or Snail Mucin lightweight essence',
          'Hydra-gel ceramide moisturizer',
          'Hydrating fluid SPF 50 sunscreen',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Gentle hydrating cleansing oil',
          'Creamy milk second cleanser',
          'Generous botanical hydrosol misting',
          'Polyglutamic acid + Panthenol deeply quenching serum',
          'Rich barrier lipid cream to lock all moisture overnight',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Biodegradable hydrogel sheet mask soaked in hyaluronic acid for 20 minutes',
        ],
      },
    ],
    applicationInstructions: [
      'The "7-Skin Method": Pat 2 to 3 thin layers of alcohol-free toner successively into skin for deeply plump bounce.',
    ],
    precautions: [
      'In arid climates with <30% humidity, pure hyaluronic acid without an occlusive will pull water OUT of your skin.',
    ],
    whenToConsultDoctor: [
      'Severe tightness accompanied by generalized full-body scaling or suspicion of Ichthyosis.',
    ],
    referencedPosterId: 'hydration-vs-moisture',
  },
  {
    id: 'sensitive-skin-care',
    title: 'Sensitive & Reactive Skin Care',
    shortDescription: 'Gentle, anti-inflammatory protocols for hyper-reactive, easily flushed complexions.',
    iconName: 'Heart',
    badge: 'Neuro-Sensory Soothing',
    overview: 'Sensitive skin displays heightened neuro-sensory responsiveness to external environmental factors and cosmetics, manifesting as stinging, burning, erythema, and tightness.',
    commonCauses: [
      'Hyper-reactive epidermal nerve endings releasing substance P',
      'Thin or impaired stratum corneum with high permeability',
      'Synthetic fragrances, essential oils, and harsh preservatives',
      'Rosacea, atopic dermatitis diathesis, or contact allergies',
    ],
    careRecommendations: [
      'Strip your routine down to a 3-step minimal core: gentle cleanse, calm barrier, mineral SPF',
      'Perform a 24-hour patch test inside the forearm before testing any new product',
      'Avoid synthetic perfumes, essential oils (e.g. lavender, citrus, peppermint)',
      'Use cool or lukewarm water; never wash face with hot shower water',
    ],
    suggestedIngredients: ['Centella Asiatica (Madecassoside)', 'Colloidal Oatmeal', 'Panthenol (Pro-Vitamin B5)', 'Allantoin', 'Bifida Ferment Lysate'],
    contraindicatedIngredients: ['Synthetic Fragrance / Parfum', 'Essential oils (Eucalyptus, Citrus, Peppermint)', 'Direct Glycolic Acid', 'High % L-Ascorbic Acid (>10%)', 'Physical facial scrubs'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Lukewarm water rinse or ultra-gentle oat milk cleanser',
          'Centella Asiatica soothing ampoule or thermal spring water mist',
          'Hypoallergenic barrier cream with Ceramides and Allantoin',
          '100% Mineral Zinc Oxide SPF 50 (Zinc is naturally anti-inflammatory)',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Fragrance-free cleansing oil or micellar water for sensitive skin',
          'Gentle creamy cleanser rinse',
          'Panthenol 5% recovery serum',
          'Rich soothing recovery balm with Madecassoside',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Pure colloidal oatmeal cool paste mask for 15 minutes to extinguish redness flare-ups',
        ],
      },
    ],
    applicationInstructions: [
      'Pat products onto skin with gentle open palms; avoid friction or vigorous rubbing.',
    ],
    precautions: [
      'Always check ingredient labels for "Fragrance" and "Linalool/Limonene", common sensitizing allergens.',
    ],
    whenToConsultDoctor: [
      'Persistent facial flushing, visible telangiectasias (broken capillaries), or ocular irritation (Rosacea).',
      'Sudden swelling of lips, eyes, or hives (acute allergic reaction).',
    ],
    referencedPosterId: 'skin-barrier-protocol',
  },
  {
    id: 'skin-barrier-care',
    title: 'Skin Barrier Care & Acid Mantle Defense',
    shortDescription: 'The science of repairing cracked lipid mortar and optimizing the pH 5.5 biome.',
    iconName: 'ShieldCheck',
    badge: 'Stratum Corneum Health',
    overview: 'The skin barrier functions like a brick wall: corneocyte skin cells are the bricks, and lipids (ceramides, cholesterol, fatty acids) are the mortar. When this wall is compromised, pathogens enter and moisture escapes.',
    commonCauses: [
      'Over-exfoliation (combining AHA, BHA, and Retinol simultaneously)',
      'Abrasive cleansing brushes or harsh exfoliating gloves',
      'Alkaline soaps disrupting the natural acidic mantle (normal skin is pH 4.7-5.5)',
      'Climatic extremes, windburn, or severe indoor dry heat',
    ],
    careRecommendations: [
      'Implement an immediate 14-day actives pause (no acids, no retinoids, no scrubs)',
      'Supply physiological lipids: ceramides, cholesterol, and free fatty acids',
      'Maintain an acidic cutaneous pH with pH 5.5 balanced cleansers',
      'Incorporate "slugging" with plant squalane or pure petrolatum over dry zones at night',
    ],
    suggestedIngredients: ['Ceramides NP, AP, EOP', 'Cholesterol', 'Free Fatty Acids', 'Plant Squalane', 'Ectoin', 'Beta-Glucan'],
    contraindicatedIngredients: ['All chemical exfoliants (AHA/BHA/PHA)', 'Retinoids during active compromise', 'Foaming SLS sulfate cleansers', 'Clay drying masks'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Splash with cool water only (skip cleanser if skin is very sensitive)',
          'Soothing panthenol or cica essence',
          'Physiological ceramide-cholesterol lipid cream',
          'Gentle mineral zinc oxide sunscreen',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Gentle fragrance-free cleansing lotion',
          'Ceramide essence pat into skin',
          'Heavy lipid barrier restorative ointment',
          'Thin layer of squalane or petrolatum over compromised flaky patches',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Rest! Zero exfoliation until skin passes the "water splash test" with zero stinging for 7 consecutive days.',
        ],
      },
    ],
    applicationInstructions: [
      'Warm ceramide creams between fingers to melt lipid crystals before gently pressing onto face.',
    ],
    precautions: [
      'Do not "slug" (petrolatum occlusive) on top of active retinoids or strong acids, as it magnifies their potency and causes chemical burns.',
    ],
    whenToConsultDoctor: [
      'Widespread skin oozing, honey-colored crusting (Impetigo), or persistent severe dermatitis.',
    ],
    referencedPosterId: 'skin-barrier-protocol',
  },
  {
    id: 'sun-protection',
    title: 'Sun Protection & Photoprotection Science',
    shortDescription: 'UVA/UVB shielding, PA++++ ratings, and broad-spectrum photostability.',
    iconName: 'Sun',
    badge: 'Photobiology',
    overview: 'Ultraviolet radiation causes 80-90% of all premature facial skin aging (photoaging). Photoprotection is the foundational cornerstone of every effective skincare regimen.',
    commonCauses: [
      'Inadequate sunscreen quantity applied (most people apply only 1/3 of the needed dose)',
      'Failure to reapply after 2 hours of sun exposure or after swimming/sweating',
      'Relying solely on makeup with SPF 15 (requires 7x normal makeup amount to reach label SPF)',
      'Believing clouds block UVA radiation (up to 80% of UVA penetrates thick cloud cover)',
    ],
    careRecommendations: [
      'Use the Two-Finger Rule: two solid lengths of sunscreen along index and middle finger for face and neck',
      'Choose broad-spectrum SPF 30 or higher with PA++++ or high UVA circle rating',
      'Apply 15 minutes before stepping into direct sunlight',
      'Wear wide-brimmed UV-protective hats and UV400 sunglasses during peak hours',
    ],
    suggestedIngredients: ['Zinc Oxide (Mineral filter)', 'Titanium Dioxide', 'Modern Chemical Filters (Tinosorb, Uvinul)', 'Iron Oxides (blocks blue light)', 'Vitamin C (neutralizes UV free radicals)'],
    contraindicatedIngredients: ['Expired sunscreens whose emulsion has separated or changed odor', 'Tanning oils that magnify solar radiation damage'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Gentle antioxidant cleanse',
          'Vitamin C 15% serum (boosts photoprotection by neutralizing free radicals that slip past filters)',
          'Lightweight hydrator',
          'Two full finger lengths of broad-spectrum SPF 50 applied evenly to face, ears, and neck',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Oil cleanser or micellar water to break down water-resistant sunscreen polymers',
          'Gentle water-based second cleanser',
          'Antioxidant repair serum with Niacinamide or Peptides',
          'Nourishing night recovery cream',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Inspect full body skin for any changing or asymmetrical moles.',
        ],
      },
    ],
    applicationInstructions: [
      'Do not vigorously rub sunscreen into nothingness; spread an even, uninterrupted film across skin and let it set for 3 minutes.',
    ],
    precautions: [
      'Chemical filters may sting eyes in some individuals; switch to mineral Zinc Oxide around the eye contour.',
    ],
    whenToConsultDoctor: [
      'Any new, changing, irregularly pigmented, or bleeding mole or lesion.',
      'Severe blistered sunburn accompanied by chills, fever, or dizziness.',
    ],
    referencedPosterId: 'sun-protection-spectrum',
  },
  {
    id: 'uneven-skin-tone',
    title: 'Uneven Skin Tone & Texture Smoothing',
    shortDescription: 'Refining coarse skin texture, enlarged pores, and patchy discoloration.',
    iconName: 'Palette',
    badge: 'Epidermal Uniformity',
    overview: 'Uneven skin tone and texture manifests when irregular keratinocyte shedding causes micro-roughness alongside patchy melanin distribution across the forehead, cheeks, and chin.',
    commonCauses: [
      'Sluggish epidermal turnover leading to buildup of dull, dead surface cells',
      'Chronic sub-clinical inflammation triggering localized melanogenesis',
      'Enlarged sebaceous pores with oxidized sebum plugs',
      'Uneven sun exposure and pollution nanoparticle deposition',
    ],
    careRecommendations: [
      'Combine gentle chemical exfoliants (AHA/BHA) with tyrosinase inhibitors',
      'Use daily Niacinamide to normalize pore elasticity and even out patchy tone',
      'Stay away from aggressive microdermabrasion scrubs that scratch delicate skin',
      'Maintain diligent daily photoprotection to stop existing pigment from darkening',
    ],
    suggestedIngredients: ['Glycolic Acid', 'Mandelic Acid', 'Niacinamide', 'Tranexamic Acid', 'Licorice Root Extract', 'Galactomyces Ferment'],
    contraindicatedIngredients: ['Harsh abrasive physical face scrubs', 'Drying high-alcohol astringents'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Gentle balancing cleanser',
          'Niacinamide 5% + Zinc PCA brightening serum',
          'Antioxidant fluid moisturizer',
          'Broad-spectrum SPF 50 sunscreen',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Double cleanse to lift daytime impurities',
          'Alternate nights: Mandelic/Glycolic toner on Night 1; Retinol on Night 2; Recovery on Night 3',
          'Hydrating hyaluronic acid essence',
          'Velvety ceramide smoothing cream',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Enzyme peeling mask (papaya or pumpkin enzymes) for gentle non-acid smoothing',
        ],
      },
    ],
    applicationInstructions: [
      'When using AHA toners, swipe smoothly in upward motions with a cotton pad without scrubbing.',
    ],
    precautions: [
      'Always wear SPF 50 during daytime when using chemical exfoliants, as AHAs increase photosensitivity.',
    ],
    whenToConsultDoctor: [
      'Patches of depigmentation (Vitiligo) or sudden rapid textural changes accompanied by itching.',
    ],
    referencedPosterId: 'layering-hierarchy',
  },
  {
    id: 'age-related-skin-care',
    title: 'Age-Related Skincare & Pro-Collagen Care',
    shortDescription: 'Stimulating fibroblast vitality, elastin preservation, and structural fullness.',
    iconName: 'Sparkle',
    badge: 'Pro-Collagen Longevity',
    overview: 'From age 20 onwards, dermal collagen synthesis decreases by approximately 1% each year. Age-related skincare focuses on preserving existing extracellular matrix, boosting fibroblast signaling, and locking deep hydration.',
    commonCauses: [
      'Chronological reduction in fibroblast collagen and elastin synthesis',
      'MMP (Matrix Metalloproteinase) enzyme activation from UV exposure breaking down collagen',
      'Loss of subcutaneous fat volume and slower epidermal turnover (extends from 28 to 45+ days)',
      'Decline in natural estrogen levels leading to rapid loss of dermal thickness and ceramides',
    ],
    careRecommendations: [
      'Gold standard active: Retinoids (Retinol / Tretinoin) to stimulate type I & III collagen genes',
      'Signal Peptides (Matrixyl, Copper Peptides) to trigger dermal remodeling',
      'High-potency antioxidant defenses (Vitamin C, CoQ10, Resveratrol)',
      'Rich multi-lipid barrier replenishment with ceramides and squalane',
    ],
    suggestedIngredients: ['Retinol / Retinaldehyde', 'Signal Peptides', 'Copper Tripeptide-1', 'Vitamin C (L-Ascorbic Acid)', 'Ceramides', 'Resveratrol'],
    contraindicatedIngredients: ['Abrasive physical scrubs that stretch fragile skin', 'Aggressive alcohol toners that deplete vital lipids'],
    routineSteps: [
      {
        timing: 'Morning (AM)',
        steps: [
          'Nourishing creamy cleanser',
          'Vitamin C 15% + Ferulic Acid pro-collagen antioxidant serum',
          'Multi-Peptide Matrixyl firming serum',
          'Peptide eye contour cream',
          'Rich peptide broad-spectrum SPF 50 sunscreen',
        ],
      },
      {
        timing: 'Evening (PM)',
        steps: [
          'Rich cleansing balm to melt makeup and grime',
          'Gentle creamy cleanser',
          'Pea-sized Retinol 0.5% or Retinal applied to dry face, neck, and chest',
          'Deep nourishing ceramide and peptide night cream',
          '2 drops of organic rosehip seed oil or squalane sealed on top',
        ],
      },
      {
        timing: 'Weekly Ritual',
        steps: [
          'Gentle lymphatic facial massage with cold jade stone or fingertips to encourage microcirculation',
        ],
      },
    ],
    applicationInstructions: [
      'Extend all anti-aging products down past the jawline to cover the neck and décolletage.',
    ],
    precautions: [
      'Retinoids can cause initial dryness; cushion with the "sandwich method" (Moisturizer -> Retinol -> Moisturizer).',
    ],
    whenToConsultDoctor: [
      'Guidance on in-office clinical therapies (laser resurfacing, radiofrequency microneedling, neuromodulators).',
    ],
    referencedPosterId: 'active-ingredients-clock',
  },
];
