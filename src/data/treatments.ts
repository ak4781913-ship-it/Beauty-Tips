export interface TreatmentFAQ {
  question: string;
  answer: string;
  category: 'Suitability' | 'Expectations' | 'Comfort & Pain' | 'Cost & Sessions' | 'Safety';
}

export interface ProfessionalTreatment {
  id: string;
  name: string;
  category: 'Chemical Exfoliation' | 'Collagen Induction' | 'Energy & Laser Device' | 'Clinical Facial' | 'Dermatology Protocol';
  tagline: string;
  badge: string;
  whatItIs: string;
  howItWorks: string;
  targetConcerns: string[];
  depthLevel: 'Superficial' | 'Medium Depth' | 'Deep / Medical';
  downtime: string;
  typicalSessions: string;
  potentialBenefits: string[];
  potentialRisksAndSideEffects: string[];
  contraindications: string[];
  qualifiedPractitioners: string;
  preTreatmentPrep: string[];
  postTreatmentAftercare: {
    first48Hours: string[];
    days3to7: string[];
    sunProtectionRules: string[];
    bannedActivesUntilHealed: string[];
  };
  questionsToAskPractitioner: string[];
  whenToCallClinicUrgent: string[];
  scientificSummary: string;
  commonQuestions: TreatmentFAQ[];
}

export const PROFESSIONAL_TREATMENTS: ProfessionalTreatment[] = [
  {
    id: 'chemical-peels',
    name: 'Clinical Chemical Peels',
    category: 'Chemical Exfoliation',
    tagline: 'Controlled cellular turnover with medical-grade alpha/beta hydroxy & TCA formulations',
    badge: 'In-Clinic Acid Resurfacing',
    whatItIs: 'A clinical procedure where an acid solution of precise concentration and pH is applied to the skin by a medical esthetician or dermatologist. It breaks down the desmosomes (cellular glue) holding damaged epidermal or dermal layers together, inducing uniform shedding.',
    howItWorks: 'Depending on the depth (Glycolic, Salicylic, Jessner, or Trichloroacetic Acid / TCA), it dissolves keratinized surface buildup, signals regenerative fibroblast repair in the dermis, and accelerates melanin pigment dispersion.',
    targetConcerns: [
      'Stubborn post-inflammatory hyperpigmentation (PIH)',
      'Solar lentigines (sun spots) and melasma patches',
      'Persistent comedonal and inflammatory acne',
      'Coarse textural roughness and dull epidermal tone',
      'Fine superficial rhytids (wrinkles)'
    ],
    depthLevel: 'Medium Depth',
    downtime: '3 to 7 days (flaking/bronzing/tightness)',
    typicalSessions: 'Series of 3 to 6 sessions spaced 4 weeks apart',
    potentialBenefits: [
      'Substantially smoother tactile skin texture within 10–14 days',
      'Gradual clearing of stubborn epidermal pigment deposits',
      'Purged follicular plugs reducing new acne microcomedones',
      'Stimulated natural hyaluronic acid synthesis in basal layers'
    ],
    potentialRisksAndSideEffects: [
      'Post-inflammatory hyperpigmentation (PIH), particularly in Fitzpatrick skin types IV–VI without prep',
      'Persistent erythema (prolonged redness) lasting over 7 days',
      'Transient edema (swelling) around eyes and jawline',
      'Reactivation of dormant Herpes Simplex Virus (cold sores)',
      'Chemical blistering or scarring if peeled prematurely or unprofessionally neutralized'
    ],
    contraindications: [
      'Active oral Isotretinoin (Accutane) therapy within past 6–12 months',
      'Open cuts, active sunburn, bacterial infections, or eczema flare-ups',
      'Pregnancy or breastfeeding (for Salicylic acid & TCA formulations)',
      'History of keloid or hypertrophic scar formation'
    ],
    qualifiedPractitioners: 'Board-Certified Dermatologist, Plastic Surgeon, or Licensed Clinical Medical Esthetician working under physician medical direction.',
    preTreatmentPrep: [
      'Discontinue prescription retinoids (Tretinoin, Tazarotene), OTC retinol, and AHA/BHA exfoliants 5–7 days prior.',
      'Strictly avoid direct ultraviolet sun exposure and artificial tanning for at least 14 days before peel.',
      'Fitzpatrick IV–VI individuals should pre-condition with tyrosinase inhibitors (Azelaic acid, Alpha Arbutin) for 2–4 weeks as guided by physician.',
      'Avoid facial waxing, threading, or depilatory creams 7 days prior.'
    ],
    postTreatmentAftercare: {
      first48Hours: [
        'Wash only with cool water and an ultra-gentle non-foaming surfactant-free cleanser.',
        'DO NOT pick, scratch, rub, or force off peeling skin sheets—premature removal causes permanent hypopigmentation or scarring.',
        'Keep skin thoroughly coated with physician-prescribed bland petrolatum-based ointment or ceramide barrier balm.',
        'Avoid strenuous hot workouts, saunas, steam rooms, and hot showers that generate vascular flushing.'
      ],
      days3to7: [
        'Continue applying physiologic barrier repair creams containing ceramides, cholesterol, and squalane.',
        'Allow dead epithelial flakes to shed organically during gentle cleansing.',
        'Keep makeup completely off the face until active peeling has finished (typically day 5).'
      ],
      sunProtectionRules: [
        '100% strict mineral broad-spectrum SPF 50+ (Zinc Oxide / Titanium Dioxide) applied daily, rain or shine.',
        'Wear a wide-brimmed UV-protective hat when walking outdoors during daylight hours.',
        'Reapply sunscreen every 2 hours if near windows or outside.'
      ],
      bannedActivesUntilHealed: [
        'Prescription Retinoids (Tretinoin, Retin-A, Adapalene)',
        'L-Ascorbic Acid (Vitamin C Serums)',
        'Glycolic, Lactic, Salicylic, and Mandelic Acids',
        'Physical facial scrubs, cleansing brushes, and microdermabrasion devices'
      ]
    },
    questionsToAskPractitioner: [
      'What specific acid formulation, concentration, and pH are you recommending for my specific Fitzpatrick skin type?',
      'Do I need pigment-suppressing preparation before we proceed to reduce PIH risk?',
      'How does your clinic manage post-peel complications if unexpected blistering occurs?',
      'Is neutralization required during this specific peel, and is an emergency neutralizer on hand?'
    ],
    whenToCallClinicUrgent: [
      'Severe, spreading blistering, weeping yellow honey-colored crusts (indicative of impetigo or infection)',
      'Fever, extreme localized heat, or throbbing pain unresponsive to basic cold compresses',
      'Rapidly spreading clusters of painful fluid-filled vesicles (suspected viral outbreak)'
    ],
    scientificSummary: 'Chemical peels remain one of dermatology’s most verified modalities. When performed in clinical settings with customized depth profiling, they restructure solar-damaged tissue safely and reliably.',
    commonQuestions: [
      {
        question: 'How do I know if I am a suitable candidate for a peel or if my barrier is too delicate?',
        answer: 'A suitable chemical peel candidate has intact, healthy barrier function without active dermatitis, eczema flare-ups, open lesions, or active sunburn. If your skin routinely stings from basic moisturizers, your barrier must be rehabilitated first before introducing exfoliating acids. During your consultation, your clinician will evaluate your skin phototype and perform a patch test.',
        category: 'Suitability'
      },
      {
        question: 'What skincare products and treatments must I stop using before booking a peel?',
        answer: 'You must discontinue prescription retinoids (Tretinoin, Tazarotene), over-the-counter retinol, and AHA/BHA exfoliants at least 5 to 7 days before your appointment. Also avoid facial waxing, threading, laser hair removal, and direct UV tanning or sunburn for 14 days prior to prevent post-inflammatory hyperpigmentation or chemical burning.',
        category: 'Expectations'
      },
      {
        question: 'Will my face sheet-peel off like a sunburn, and can I go to work?',
        answer: 'With superficial peels (like 20%–30% Glycolic or Salicylic), you will likely experience only mild micro-flaking or dryness that is barely visible with moisturizer, allowing normal work the next day. Medium-depth peels (like Jessner’s or TCA) cause noticeable bronzing, tightness, and visible parchment-like shedding between days 3 and 6. Plan medium peels around a weekend or quiet work schedule.',
        category: 'Expectations'
      },
      {
        question: 'Are chemical peels safe for darker skin tones (Fitzpatrick IV–VI)?',
        answer: 'Yes, but ONLY with appropriate acid selection and careful pre-conditioning. Mandelic acid and low-percentage Salicylic acid are generally safe for rich melanin tones because of larger molecule sizes or lipophilic properties. High-strength Glycolic or unbuffered TCA carry high risks of Post-Inflammatory Hyperpigmentation (PIH) unless pre-treated for 2–4 weeks with tyrosinase inhibitors (Azelaic acid, Alpha Arbutin) under dermatologist direction.',
        category: 'Suitability'
      },
      {
        question: 'How painful is the peel application during the appointment?',
        answer: 'Superficial peels feel like mild prickling or warm itching for 2 to 5 minutes before neutralizing. Medium-depth peels cause a sharp, intense heat and stinging sensation rated around 5–7 out of 10 for 3 to 8 minutes; clinics typically provide handheld cooling fans to mitigate the thermal surge. The discomfort subsides rapidly once neutralized or crystallized.',
        category: 'Comfort & Pain'
      },
      {
        question: 'What happens if I accidentally pick or pull off a peeling skin flake?',
        answer: 'Never pull peeling sheets! The detached skin is still attached at microscopic basal junctions. Tearing it off prematurely removes vulnerable immature epidermis, exposing raw tissue that can result in persistent redness, bacterial infection, or permanent hyper/hypo-pigmented scars. If a flake is hanging, gently trim it with clean nail scissors and apply barrier ointment.',
        category: 'Safety'
      },
      {
        question: 'How many sessions will I need before seeing real results?',
        answer: 'A single peel will provide tactile smoothness and luminosity, but corrective goals (such as clearing years of melasma, post-acne dark marks, or sun damage) require a series of 3 to 6 treatments spaced 3 to 4 weeks apart to allow cumulative, controlled epidermal remodeling.',
        category: 'Cost & Sessions'
      }
    ]
  },
  {
    id: 'microneedling',
    name: 'Clinical Microneedling (Collagen Induction Therapy)',
    category: 'Collagen Induction',
    tagline: 'Percutaneous collagen induction via medical micro-punctures to stimulate neocollagenesis',
    badge: 'Micro-Needling & CIT',
    whatItIs: 'A clinical, minimally invasive procedural therapy employing a motorized medical pen with sterilized, surgical-grade microneedles that oscillate vertically, creating thousands of microscopic epidermal and dermal puncture channels at depths from 0.5mm to 2.5mm.',
    howItWorks: 'The micro-injuries bypass the stratum corneum without thermal heat, triggering the physiological 3-stage wound-healing cascade: Inflammation, Proliferation (fibroblast multiplication and type III collagen synthesis), and Remodeling (conversion to resilient type I collagen fibers).',
    targetConcerns: [
      'Atrophic acne scarring (boxcar, rolling, and superficial icepick indentations)',
      'Post-acne textural irregularities and enlarged pore architecture',
      'Perioral lines and fine glabellar / dynamic wrinkles',
      'Surgical scars and striae distensae (stretch marks)',
      'Loss of dermal density and skin laxity'
    ],
    depthLevel: 'Medium Depth',
    downtime: '24 to 72 hours (sunburn sensation, pinpoint bleeding, micro-scabbing)',
    typicalSessions: '3 to 6 treatments spaced 4 to 6 weeks apart for scar remodeling',
    potentialBenefits: [
      'Clinically proven improvement in dermal collagen and elastin thickness by up to 400%',
      'Visible softening of scarred depressions without heat-related pigment alteration',
      'Safe across darker Fitzpatrick skin phototypes (I–VI) because no thermal laser energy is deployed',
      'Enhances structural resilience and skin bounce over 3 to 6 months of remodeling'
    ],
    potentialRisksAndSideEffects: [
      'Microbial contamination / bacterial folliculitis if performed in non-sterile or home DIY environments',
      'Erythema, swelling, and mild pinpoint hematomas resembling petechiae',
      'Tram-track marking or permanent grid scratches from excessive pressure or dragging needle cartridges',
      'Granulomatous foreign body reactions if non-sterile cosmetic serums are driven into open channels',
      'Temporary skin tightness, flaking, and rough sandpaper texture during day 2–4'
    ],
    contraindications: [
      'Active papulopustular acne or cystic outbreaks across the treatment zone (dragging needles spreads P. acnes bacteria)',
      'Active facial herpes simplex, warts, or bacterial impetigo',
      'History of keloid scarring',
      'Bleeding disorders or concurrent anticoagulant / blood-thinner medications',
      'Oral Accutane / Isotretinoin within 6 months'
    ],
    qualifiedPractitioners: 'Licensed medical professional (Dermatologist, Nurse Practitioner, Physician Assistant, or certified Medical Esthetician working in a compliant medical facility). NEVER recommend motorized DIY microneedling rollers at home.',
    preTreatmentPrep: [
      'Stop blood-thinning OTC supplements (high-dose Omega-3, Ginkgo Biloba, high-dose Vitamin E) 5 days prior after consulting doctor.',
      'Stop topical retinoids and hydroxy acid exfoliants 3 to 5 days prior.',
      'Arrive with clean skin free of makeup, SPF, or synthetic oils for clinical antiseptic prep (Chlorhexidine or Betadine).',
      'Prophylactic antiviral medication if prone to cold sores.'
    ],
    postTreatmentAftercare: {
      first48Hours: [
        'For the first 24 hours: DO NOT apply commercial cosmetics, perfumes, or colored makeup products into open micro-channels.',
        'Use ONLY sterile medical-grade saline or sterile high-molecular-weight hyaluronic acid approved by your provider.',
        'Sleep on a freshly washed, clean silk or cotton pillowcase with head slightly elevated.',
        'Do not engage in cardio, gym sessions, hot baths, or touch face with unwashed hands.'
      ],
      days3to7: [
        'Introduce a hypoallergenic, fragrance-free barrier recovery cream rich in panthenol, glycerin, and colloidal oat.',
        'Cleanse with cool water and gentle non-foaming wash.',
        'Resist any temptation to pick fine sandpaper crusting; let them detach with normal washing.'
      ],
      sunProtectionRules: [
        'Avoid all direct sunlight during the first 48 hours while channels seal.',
        'Once channels close (after 24–48 hours), wear broad-spectrum mineral SPF 50+ Zinc Oxide daily.',
        'Utilize UV-shielding umbrellas and wide-brim hats.'
      ],
      bannedActivesUntilHealed: [
        'Retinol, Retinaldehyde, Tretinoin, and Differin (minimum 7 days pause)',
        'L-Ascorbic Acid and low-pH Vitamin C derivatives (minimum 7 days pause)',
        'AHA / BHA / PHA toners and chemical exfoliants',
        'Physical cleansing brushes, scrubs, or abrasive sponges'
      ]
    },
    questionsToAskPractitioner: [
      'Are you using an FDA-cleared medical motorized device with sterile single-use disposable needle cartridges?',
      'What depth (in millimeters) do you intend to treat on my forehead versus cheeks?',
      'What topical glide solution will be applied during channel creation to ensure sterile biocompatibility?',
      'How do you treat active acne lesions to prevent spreading bacteria?'
    ],
    whenToCallClinicUrgent: [
      'Signs of cellulitis: intense throbbing heat, expanding redness beyond 72 hours, or fever',
      'Pustular eruptions appearing along the needle tracks within 48–72 hours',
      'Sudden flare of vesicular cold sores around mouth or cheeks'
    ],
    scientificSummary: 'CIT operates via controlled micro-trauma without heat damage, making it a gold standard for acne scars and skin density when conducted under strictly sterile medical oversight.',
    commonQuestions: [
      {
        question: 'Is microneedling safe and suitable for melasma or rich melanin tones (Fitzpatrick IV–VI)?',
        answer: 'Because clinical microneedling is purely mechanical and delivers zero thermal heat energy, it carries significantly lower post-inflammatory hyperpigmentation (PIH) risks compared to traditional lasers. However, in melasma patients, high-friction passes can still stimulate unstable melanocytes. Conservative needle depths (0.5mm) paired with topical Tranexamic Acid or Glutathione under dermatologist guidance yield the safest results.',
        category: 'Suitability'
      },
      {
        question: 'How much social downtime should I realistically budget after a session?',
        answer: 'Expect 24 to 48 hours of noticeable skin flushing resembling a moderate sunburn with localized heat and mild tight puffiness. Most clients feel confident returning to work within 24 to 48 hours. Pinpoint micro-scabbing (sandpaper texture) flakes off organically by day 3 to 5.',
        category: 'Expectations'
      },
      {
        question: 'Why shouldn’t I just buy a cheap microneedling roller online for home use?',
        answer: 'Home dermarollers enter and exit the skin at an angle, creating tearing "troughs" rather than clean vertical punctures, leading to micro-scarring. Furthermore, household sanitizers cannot completely eliminate bacterial bio-films from porous metal pins, resulting in high rates of severe facial cellulitis and foreign-body granulomas when home serums are pushed into open tissue.',
        category: 'Safety'
      },
      {
        question: 'Does microneedling hurt, and is topical numbing required?',
        answer: 'Clinical microneedling penetrates 0.5mm to 2.5mm into the dermis where nerve endings reside. A prescription-strength topical compounded anesthetic (typically 23% Lidocaine / 7% Tetracaine or 4% Lidocaine) is applied 30–45 minutes beforehand. With numbing, you feel vibration and minor pressure rather than sharp puncture pain.',
        category: 'Comfort & Pain'
      },
      {
        question: 'Can microneedling be performed if I currently have active pimples?',
        answer: 'No—active inflammatory papules, pustules, or cysts are an absolute localized contraindication. Passing needle cartridges over active acne pops bacteria-filled pockets and inoculates Cutibacterium acnes across hundreds of surrounding puncture channels, triggering widespread breakouts. Providers must navigate carefully around lesions or defer until acne is clinically calm.',
        category: 'Suitability'
      },
      {
        question: 'How quickly will I see improvement in acne scars or enlarged pores?',
        answer: 'Initial tightness and a healthy flush occur in week one due to mild edema. However, true neocollagenesis (the synthesis of new type I and III collagen fibers) takes 6 to 12 weeks to mature. Optimal scar softening appears after a package of 3 to 6 sessions spaced 4 to 6 weeks apart.',
        category: 'Expectations'
      },
      {
        question: 'When can I safely apply makeup again after treatment?',
        answer: 'You must avoid all foundation, BB creams, powders, and concealer for a strict minimum of 24 to 48 hours until microscopic epidermal puncture channels have fully sealed. Applying cosmetic pigments into open micro-wounds can drive insoluble minerals into the dermis, causing permanent cosmetic tattoo discoloration or granulomas.',
        category: 'Safety'
      }
    ]
  },
  {
    id: 'laser-therapy',
    name: 'Medical Laser & Energy-Based Therapies',
    category: 'Energy & Laser Device',
    tagline: 'Selective photothermolysis: Ablative, Non-Ablative, Nd:YAG, and Pulsed Dye Laser modalities',
    badge: 'Clinical Laser Dermatology',
    whatItIs: 'Advanced medical laser systems emit coherent, single-wavelength light energy engineered to target specific chromophores (melanin in pigment, hemoglobin in blood vessels, or water in tissue collagen) without destroying adjacent healthy tissue.',
    howItWorks: 'Through selective photothermolysis, targeted energy vaporizes precise microscopic thermal zones (fractional ablative CO2 or Erbium:YAG) or gently heats the deep dermis to coagulate micro-columns (non-ablative 1550nm/1927nm, Nd:YAG, or Pulsed Dye Laser for vascular erythema).',
    targetConcerns: [
      'Persistent facial erythema, broken capillaries (telangiectasias), and rosacea redness',
      'Deep etched wrinkles, peri-orbital lines, and severe photodamage',
      'Deep atrophic surgical or acne scars resistant to superficial therapies',
      'Dermal melasma, stubborn café-au-lait macules, and age spots',
      'Skin crepiness and progressive collagen loss'
    ],
    depthLevel: 'Deep / Medical',
    downtime: 'Varies by modality: 2–3 days for non-ablative / vascular lasers; 7–14 days for ablative fractional resurfacing',
    typicalSessions: '1 to 3 sessions for aggressive ablative lasers; 3 to 5 sessions for vascular or non-ablative fractional',
    potentialBenefits: [
      'Significant contraction of collagen fibers causing noticeable tissue tightening',
      'Dramatic reduction of facial erythema, broken capillary webs, and chronic flushing',
      'Long-term dermal structural regeneration persisting up to 12–18 months post-treatment',
      'Visible clearance of deep refractory sun spots and epidermal irregularities'
    ],
    potentialRisksAndSideEffects: [
      'Post-inflammatory hyperpigmentation (PIH) or permanent hypopigmentation (loss of pigment) if wavelength is mismatched to skin phototype',
      'Prolonged erythema, edema, and micro-crusting resembling coffee grounds (MENDs)',
      'Thermal burns, blistering, and textural scarring if machine calibration or cooling is improper',
      'Ocular trauma if specialized protective laser eyewear is not fitted throughout the pulse sequence'
    ],
    contraindications: [
      'Recent sun tanning, tanning bed use, or self-tanners within the preceding 4 weeks',
      'Oral Isotretinoin (Accutane) within past 6 to 12 months',
      'Patients taking photosensitizing medications (e.g., Doxycycline, Tetracycline, St. John’s Wort)',
      'Active skin cancer or suspicious undiagnosed lesions in the treatment field',
      'Pregnancy'
    ],
    qualifiedPractitioners: 'Strictly Board-Certified Dermatologists, Board-Certified Facial Plastic Surgeons, or specialized Laser Registered Nurses working directly on-site with a supervising physician.',
    preTreatmentPrep: [
      'Zero sun exposure, UV tanning beds, or spray tans for 4 full weeks prior to laser treatment.',
      'Stop all topical actives (Retinoids, AHAs, BHAs, Vitamin C) 7 days before treatment.',
      'Discontinue blood-thinning medications and anti-inflammatory supplements (with prescribing physician approval).',
      'Begin oral antiviral prophylaxis 48 hours prior if treating around the mouth or full face.'
    ],
    postTreatmentAftercare: {
      first48Hours: [
        'Apply sterile chilled thermal water compresses or ice packs wrapped in clean towels to dissipate internal heat.',
        'Keep skin coated with physician-specified healing petrolatum ointment or sterile occlusive balms.',
        'Sleep with head elevated on 2 pillows to minimize morning periorbital and facial swelling.',
        'Do not take hot showers, visit saunas, or engage in vigorous physical exertion.'
      ],
      days3to7: [
        'Wash only with tepid water and ultra-mild, fragrance-free post-procedure cleansers.',
        'Do NOT rub, scrub, or mechanically exfoliate microscopic epidermal necrotic debris (MENDs / bronzed dots).',
        'Reapply healing barrier moisturizers whenever skin feels tight, parched, or warm.'
      ],
      sunProtectionRules: [
        'Absolute zero unshielded sun exposure. Healing post-laser tissue is at maximum vulnerability for hyperpigmentation.',
        'Broad-spectrum mineral Zinc Oxide SPF 50+ must be applied religiously once re-epithelialization occurs.',
        'Wear physical UV-protective shields, wide hats, and UV-filtering sunglasses.'
      ],
      bannedActivesUntilHealed: [
        'Retinoids and retinols for a minimum of 14–21 days post-procedure',
        'Exfoliating acids (Glycolic, Lactic, Salicylic) until full clearance by physician',
        'Alcohol-based astringents, toners, or scented formulas',
        'Clarisonic brushes, face sponges, or physical scrubs'
      ]
    },
    questionsToAskPractitioner: [
      'Is this specific laser wavelength (e.g., 532nm, 595nm, 1064nm, 1550nm, or CO2) safe for my Fitzpatrick skin tone?',
      'What is your protocol if post-inflammatory hyperpigmentation develops?',
      'Who is operating the device: you as the physician, or a technician?',
      'What eye protection shields (internal corneal or external metallic) will be utilized?'
    ],
    whenToCallClinicUrgent: [
      'Severe blisters, purulent discharge, or honey-colored crusting',
      'Excessive eye pain, changes in vision, or flashes of light',
      'Severe swelling closing the eyelids or spreading redness accompanied by chills or fever'
    ],
    scientificSummary: 'Laser dermatology utilizes physics-grade chromatic precision. Because photothermal interactions involve high energy densities, safe clinical execution requires specialized dermatologic diagnostics.',
    commonQuestions: [
      {
        question: 'Who is NOT a candidate for facial laser therapy, and when must booking be deferred?',
        answer: 'Strict contraindications include: any UV tanning, active sunburn, or self-tanning lotion within the preceding 4 weeks; active isotretinoin (Accutane) therapy within 6 to 12 months; active facial herpes simplex (cold sores); pregnancy; and photosensitizing prescription medications (such as Doxycycline). If any of these apply, treatment must be postponed.',
        category: 'Suitability'
      },
      {
        question: 'How do I know if I need a laser treatment versus a chemical peel or microneedling?',
        answer: 'Lasers excel at deep structural and vascular concerns that topicals cannot reach: stubborn broken capillaries (telangiectasias), persistent rosacea background flushing, deep etched wrinkles, and dense photodamage. Superficial pigment or overall texture can often be effectively addressed with chemical peels or microneedling at lower cost and shorter recovery time.',
        category: 'Expectations'
      },
      {
        question: 'What is the main difference between Ablative and Non-Ablative lasers?',
        answer: 'Ablative lasers (like Fractional CO2 and Erbium:YAG) vaporize the outer epidermal skin layers completely. They produce dramatic, long-lasting tightening and scar remodeling in 1 to 2 sessions, but require 7 to 14 days of intensive downtime with weeping and raw skin. Non-ablative lasers (like 1550nm Fraxel, Clear + Brilliant, or Nd:YAG) leave the epidermis intact while coagulating heat columns beneath, requiring 3 to 5 sessions with only 2 to 4 days of mild redness and sunburn sensation.',
        category: 'Expectations'
      },
      {
        question: 'Can laser treatments cause hyperpigmentation on darker skin tones?',
        answer: 'Yes, if the wrong wavelength is selected. Shorter wavelengths (such as 532nm or intense IPL pulses) strongly absorb melanin and can trigger burns, hypopigmentation, or severe rebound PIH in Fitzpatrick types IV–VI. However, long-pulsed 1064nm Nd:YAG lasers bypass epidermal melanin safely and are FDA-cleared for brown and deep skin tones when operated by experienced laser dermatologists.',
        category: 'Suitability'
      },
      {
        question: 'Why is recent sun exposure or fake tan a strict reason to cancel laser appointments?',
        answer: 'Lasers target chromophores (pigment or redness). Tanned skin—whether from real sun or dihydroxyacetone spray tans—floods the stratum corneum with competing pigment. The laser energy absorbs at the skin surface instead of reaching its dermal target, causing severe thermal burns, blistering, and permanent white scars. You must wait at least 4 full weeks after UV exposure before treating.',
        category: 'Safety'
      },
      {
        question: 'What does recovery actually feel and look like during the first few days?',
        answer: 'Immediately post-treatment, your skin radiates intense heat resembling a severe sunburn for 2 to 6 hours. By day 2, non-ablative treatments develop thousands of microscopic bronze dots called MENDs (Microscopic Epidermal Necrotic Debris) that feel like dry sandpaper. With ablative lasers, clear fluid weeping and swelling peak at 48 hours, followed by peeling over 7 to 10 days.',
        category: 'Comfort & Pain'
      },
      {
        question: 'Are laser results permanent?',
        answer: 'Treated broken capillaries and cleared solar lentigines are permanently removed; however, ongoing natural aging, hormone changes, and future unprotected UV exposure will stimulate new vascular dilation and melanin formation over the years. Annual maintenance sessions combined with daily mineral SPF 50+ preserve results indefinitely.',
        category: 'Cost & Sessions'
      }
    ]
  },
  {
    id: 'clinical-facials',
    name: 'Medical-Grade Hydradermabrasion & Clinical Facials',
    category: 'Clinical Facial',
    tagline: 'Vortex-fusion vacuum extraction and clinical transdermal serum infusion',
    badge: 'Clinical Esthetic Facial',
    whatItIs: 'Medical-grade multi-step treatments performed in clinical med-spas or dermatology clinics. Unlike traditional spa facials that focus purely on relaxation, clinical facials combine mechanical vortex exfoliation, gentle vacuum suction for pore sebum clearing, and synchronized peptide/antioxidant infusions.',
    howItWorks: 'A patented spiral or diamond tip simultaneously sloughs off dead corneocyte buildup while a gentle vortex vacuum vacuums blackheads and sebum filaments from the follicle, immediately bathing open pores in concentrated low-molecular humectants.',
    targetConcerns: [
      'Congested, dull, dehydrated skin with widespread blackheads',
      'Uneven skin texture prior to major events or seasonal changes',
      'Enlarged sebaceous filaments across the nose and central T-zone',
      'Skin that feels suffocated, flaky, or unable to absorb daily moisturizers'
    ],
    depthLevel: 'Superficial',
    downtime: '0 to 24 hours (immediate healthy luminosity with mild temporary flush)',
    typicalSessions: 'Monthly maintenance or quarterly seasonal resets',
    potentialBenefits: [
      'Immediate tactile softness and luminous hydration with zero downtime',
      'Painless extraction of oxidized pore sebum without traumatic manual squeezing',
      'Enhanced transdermal permeation of daily barrier skincare formulas',
      'Safe for virtually all skin tones and sensitive barrier profiles when customized'
    ],
    potentialRisksAndSideEffects: [
      'Mild temporary erythema (redness) that resolves within 2–4 hours',
      'Occasional minor purging breakout if underlying comedones are brought to the surface',
      'Mild surface sensitivity if vacuum pressure is adjusted too aggressively on fragile capillaries'
    ],
    contraindications: [
      'Severe active cystic acne outbreaks (suction can cause discomfort or irritate lesions)',
      'Active facial rashes, cold sores, or open dermatological abrasions',
      'Allergy to aspirin or shellfish (certain chemical peeling tips use salicylic acid or glucosamine)'
    ],
    qualifiedPractitioners: 'Licensed Medical Esthetician, Certified Dermal Therapist, or Clinical Skincare Nurse.',
    preTreatmentPrep: [
      'Pause OTC retinols and chemical exfoliating toners 48 hours prior.',
      'Avoid facial waxing, chemical depilatories, or laser hair removal 5 days prior.',
      'Arrive without heavy waterproof makeup if possible.'
    ],
    postTreatmentAftercare: {
      first48Hours: [
        'Keep skin bare of heavy foundation or powders for at least 12–24 hours to maximize serum benefits.',
        'Wash with gentle, non-stripping cleanser and apply rich humectants (Glycerin, Hyaluronic Acid).',
        'Avoid intense sweat sessions, hot saunas, and chlorinated pools for 24 hours.'
      ],
      days3to7: [
        'Maintain daily hydration routines and gentle skin barrier support.',
        'Reintroduce mild actives slowly according to your skin’s comfort.'
      ],
      sunProtectionRules: [
        'Apply broad-spectrum SPF 30+ or SPF 50+ every morning.',
        'Reapply before outdoor exposure to protect freshly exfoliated cells.'
      ],
      bannedActivesUntilHealed: [
        'Strong prescription retinoids for 48 hours post-facial',
        'Harsh physical face scrubs and alcohol-heavy astringents'
      ]
    },
    questionsToAskPractitioner: [
      'Can you customize the vacuum suction strength for my delicate cheek capillaries?',
      'Are the infusion serums free of artificial fragrances and sensitizing essential oils?',
      'What specific peel percentage will be incorporated into the chemical vortex phase?'
    ],
    whenToCallClinicUrgent: [
      'Persistent hives, swelling of lips or eyes (allergic response to botanical infusion)',
      'Unusual bruising or broken capillaries from aggressive suction'
    ],
    scientificSummary: 'Clinical hydradermabrasion bridges everyday topicals and invasive procedures by clearing follicular impactions cleanly while flooding epidermal cells with bio-compatible hydration.',
    commonQuestions: [
      {
        question: 'Is hydradermabrasion safe if I have rosacea, broken capillaries, or extreme barrier sensitivity?',
        answer: 'Yes, provided your clinical esthetician customizes the machine settings: reducing pneumatic vacuum suction to low-flow mode, bypassing abrasive mechanical diamond tips, and utilizing gentle lactic acid or pure hyaluronic acid infusions rather than high-concentration salicylic acid. It delivers cooling hydration without mechanical erythema.',
        category: 'Suitability'
      },
      {
        question: 'What should I avoid in the 48 hours leading up to booking a clinical facial?',
        answer: 'Pause strong active topicals: discontinue retinoids, exfoliating acid serums, and physical grain scrubs for at least 48 hours beforehand. Avoid facial waxing or laser hair removal within 5 days. Men should avoid wet razor shaving on the morning of treatment to prevent serum stinging over razor micro-cuts.',
        category: 'Expectations'
      },
      {
        question: 'How is a medical hydradermabrasion facial different from a spa facial?',
        answer: 'Traditional spa facials primarily involve manual massage, steam, and cosmetic masks that act superficially. Clinical hydradermabrasion uses medical-grade closed-loop pneumatic vortex technology to mechanically lift sebum plugs and infuse clinical concentrations of glycolic acid, salicylic acid, and hyaluronic peptides directly into pores with quantifiable vacuum pressure.',
        category: 'Expectations'
      },
      {
        question: 'Is it normal to break out (purge) a few days after a clinical facial?',
        answer: 'Yes, mild micro-purging can happen in the 48 to 72 hours following treatment if deep microcomedones (trapped sebum pockets) were brought to the surface by the suction and chemical exfoliation. These typically resolve rapidly within 3 to 4 days, leaving pores visibly cleaner.',
        category: 'Suitability'
      },
      {
        question: 'Can I get this done on the morning of a big event or wedding?',
        answer: 'For a wedding or high-stakes gala, it is best scheduled 3 to 5 days prior. While hydradermabrasion gives an instant luminous glow with no peeling, rare instances of minor suction redness or product sensitivity are best cleared with a brief buffer window.',
        category: 'Expectations'
      },
      {
        question: 'Is there any pain involved with vacuum extraction?',
        answer: 'No—most patients describe the sensation as a cool, wet paintbrush accompanied by gentle suction moving across the skin. Unlike manual extractions using sharp comedone extractors, vortex suction doesn’t rupture capillary walls or cause bruising.',
        category: 'Comfort & Pain'
      },
      {
        question: 'How often should I schedule clinical hydradermabrasion sessions?',
        answer: 'Because human epidermal turnover naturally takes 28 to 40 days, scheduling a session once every 4 to 6 weeks is the ideal cadence for maintaining pore clarity and preventing keratin accumulation.',
        category: 'Cost & Sessions'
      }
    ]
  },
  {
    id: 'dermatologist-acne',
    name: 'Dermatologist-Directed Acne Protocols',
    category: 'Dermatology Protocol',
    tagline: 'Prescription therapeutics: Oral isotretinoin, topical retinoid therapy, spironolactone, & intralesional injections',
    badge: 'Medical Dermatology Practice',
    whatItIs: 'Evidence-based medical management of chronic acne vulgaris, nodulocystic lesions, hormonal adult acne, and scarring inflammatory eruptions directed by a board-certified dermatologist.',
    howItWorks: 'Targets the four fundamental etiologies of acne: 1) follicular hyperkeratinization, 2) excessive sebaceous androgenic sebum production, 3) proliferation of Cutibacterium acnes, and 4) deep tissue inflammatory cytokines.',
    targetConcerns: [
      'Severe nodular, cystic, or conglobate acne that causes physical pain and permanent scars',
      'Persistent adult hormonal jawline acne unresponsive to over-the-counter benzoyl peroxide or salicylic acid',
      'Rapidly spreading inflammatory papulopustular outbreaks',
      'Acne associated with Polycystic Ovary Syndrome (PCOS)'
    ],
    depthLevel: 'Deep / Medical',
    downtime: 'Ongoing clinical journey (retinization flaking for 4–8 weeks; systemic monitoring)',
    typicalSessions: 'Monthly dermatologic follow-ups, laboratory blood tests when indicated, and tailored dosage titrations',
    potentialBenefits: [
      'Permanent or long-term clinical remission of severe cystic lesions',
      'Substantial prevention of irreversible atrophic skin scarring and dermal remodeling damage',
      'Comprehensive regulation of excess sebum production from within the sebaceous gland',
      'Rapid relief of acute painful cysts via in-clinic intralesional triamcinolone injections within 24–48 hours'
    ],
    potentialRisksAndSideEffects: [
      'Severe mucocutaneous xerosis (extreme dryness of lips, eyes, and skin barrier) with oral retinoids',
      'Teratogenicity (severe birth defects) requiring strict contraception protocols (e.g., iPLEDGE program for Isotretinoin)',
      'Initial inflammatory flare-up (the "purge" phase) during first 4–6 weeks of topical or systemic therapy',
      'Potential elevation of serum liver transaminases or triglycerides requiring scheduled laboratory panels',
      'Photosensitivity and increased susceptibility to solar erythema'
    ],
    contraindications: [
      'Pregnancy, planning pregnancy, or breastfeeding (absolute contraindication for oral Isotretinoin and topical Tazarotene/Tretinoin)',
      'Renal insufficiency or hyperkalemia (for Spironolactone therapy)',
      'Severe hepatic dysfunction or uncontrolled hyperlipidemia'
    ],
    qualifiedPractitioners: 'Strictly Board-Certified Dermatologists (MD / FAAD / DO) with prescribing authority and credentialed clinical lab diagnostic support.',
    preTreatmentPrep: [
      'Complete baseline dermatologic history, comprehensive medication review, and baseline blood panels if starting oral therapies.',
      'Undergo pregnancy testing and register with safety compliance registries (where legally mandated).',
      'Discontinue all abrasive OTC anti-acne scrubs, harsh astringents, and drying home remedies.'
    ],
    postTreatmentAftercare: {
      first48Hours: [
        'If receiving an intralesional cortisone injection: keep the injection puncture clean, avoid pressing or squeezing the cyst, and apply cold compress if tender.',
        'If initiating prescription topical retinoids: begin with the "sandwich technique" (moisturizer → retinoid pea size → moisturizer) 2 nights per week only.'
      ],
      days3to7: [
        'Heavily protect the compromised barrier with lipid-rich ceramide creams and 100% pure petrolatum on cracked lips.',
        'Never scrub away peeling flakes; hydration and time restore normal desquamation.'
      ],
      sunProtectionRules: [
        'Prescription acne therapies significantly thin the stratum corneum and heighten photosensitivity.',
        'SPF 50+ mineral or non-comedogenic fluid sunscreen is non-negotiable every morning.',
        'Avoid all recreational sunbathing and UV tanning.'
      ],
      bannedActivesUntilHealed: [
        'OTC Benzoyl Peroxide scrubs combined simultaneously with prescription retinoids unless specifically compounded by doctor',
        'Physical exfoliating loofahs, rotating brushes, or walnut scrubs',
        'Unregulated home acid peels or DIY lemon/baking soda concoctions'
      ]
    },
    questionsToAskPractitioner: [
      'Is my acne primarily hormonal, comedonal, or microbially driven?',
      'What is our timeline before we evaluate whether the prescribed protocol is effective (e.g., 8 vs 12 weeks)?',
      'How will we manage the initial purging and retinization phase so my skin barrier doesn’t become compromised?',
      'If I am planning a pregnancy in the future, what are the mandatory wash-out periods for these medications?'
    ],
    whenToCallClinicUrgent: [
      'Severe mood changes, persistent headaches, or visual disturbances on oral retinoids',
      'Signs of severe systemic drug reaction (spreading rash, swollen lymph nodes, fever)',
      'Local skin atrophy or indentation at the site of a steroid injection'
    ],
    scientificSummary: 'Medical dermatology cures or halts acne by treating systemic biochemistry and follicular architecture. It is distinctly separate from cosmetic maintenance and provides evidence-grounded solutions.',
    commonQuestions: [
      {
        question: 'Can I undergo chemical peels or microneedling while on prescription acne treatments?',
        answer: 'If you are taking oral Isotretinoin (Accutane), in-clinic chemical peels, microneedling, and ablative lasers are strictly contraindicated during the course and for 6 months afterward, as wound healing and scarring risks are altered. With topical prescription retinoids, pause applications 5–7 days prior to any procedural treatment with your dermatologist’s clearance.',
        category: 'Suitability'
      },
      {
        question: 'What should I bring and prepare for my initial dermatologist consultation?',
        answer: 'Bring a complete list of past and present skincare products, OTC acne medications, and oral supplements. Note any family history of acne or hormonal disorders. Arrive with clean, bare skin without foundation or color cosmetics so the clinician can examine your skin topography, pore congestion, and active inflammation under clinical magnification.',
        category: 'Expectations'
      },
      {
        question: 'When should I stop buying drugstore acne products and see a dermatologist?',
        answer: 'You should consult a board-certified dermatologist if you develop painful deep nodules or cysts, if acne leaves red/brown marks or indented scars that persist for months, or if compliant use of over-the-counter Benzoyl Peroxide and Adapalene fails to show clear improvement after 8 to 12 weeks.',
        category: 'Suitability'
      },
      {
        question: 'What is the "retinoid purge", and how long does it last?',
        answer: 'Prescription retinoids (like Tretinoin or Trifarotene) accelerate cell division, pushing existing microscopic sub-surface microcomedones to the surface all at once. This temporary flare typically starts between weeks 2 and 4 and resolves by weeks 8 to 12. Pushing through this phase under physician guidance reveals clear skin underneath.',
        category: 'Expectations'
      },
      {
        question: 'How fast does an in-clinic cortisone injection flatten a huge cyst?',
        answer: 'An intralesional triamcinolone injection (diluted corticosteroid injected directly into the cyst core) reduces vascular pressure and inflammatory cytokines rapidly. Most large, throbbing cysts shrink and flatten noticeably within 24 to 48 hours, significantly reducing scarring risk.',
        category: 'Expectations'
      },
      {
        question: 'Why are blood tests and strict pregnancy prevention required for Isotretinoin (Accutane)?',
        answer: 'Isotretinoin is a potent systemic teratogen that causes severe embryonic malformations if taken during pregnancy. Strict monitoring programs (like iPLEDGE) mandate two forms of birth control and monthly pregnancy tests. Periodic blood labs also track lipid levels and liver enzymes to ensure your body metabolizes the therapeutic dosage safely.',
        category: 'Safety'
      },
      {
        question: 'Can hormonal acne in adult women be cured without antibiotics?',
        answer: 'Yes. Long-term oral antibiotics are no longer the primary standard of care due to antibiotic resistance. Dermatologists commonly prescribe Spironolactone (an androgen receptor antagonist that decreases sebum excretion) or combined oral contraceptives that regulate hormonal flares at the sebaceous follicle level.',
        category: 'Suitability'
      }
    ]
  }
];
