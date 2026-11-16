import { ProductItem } from '../types';

export const PRODUCT_SUGGESTIONS: ProductItem[] = [
  {
    id: 'prod-cleanser-hydrating-milk',
    name: 'Gentle Amino Acid & Ceramide Milk Cleanser',
    category: 'Cleanser',
    idealFor: ['dry', 'sensitive', 'normal'],
    texture: 'Silky, non-foaming hydrating emulsion',
    keyIngredients: ['Oat Amino Acids', 'Ceramides NP/AP', 'Glycerin', 'Panthenol'],
    educationalNotes: 'Cleanses without disrupting the delicate stratum corneum barrier lipid matrix. Leaves skin soft and cushioned with zero squeaky tightness.',
    usageTips: 'Massage for 45-60 seconds over damp skin in the morning or as your second cleanse in the evening. Rinse with lukewarm water.'
  },
  {
    id: 'prod-cleanser-gel-clarifying',
    name: 'Low-pH Salicylic & Tea Tree Clarifying Cleanser',
    category: 'Cleanser',
    idealFor: ['oily', 'combination'],
    texture: 'Light, micro-foaming refreshing gel',
    keyIngredients: ['0.5% Salicylic Acid', 'Zinc PCA', 'Centella Asiatica', 'Coco-Betaine'],
    educationalNotes: 'Provides gentle daily sebum regulation and pore clearing without aggressive sulfates that trigger rebound oiliness.',
    usageTips: 'Use morning and night. Work into a delicate foam in wet hands before touching face, concentrating on forehead and nose.'
  },
  {
    id: 'prod-serum-hyaluronic-b5',
    name: 'Multi-Weight Hyaluronic Acid & B5 Hydrator',
    category: 'Serum',
    idealFor: ['all', 'dry', 'sensitive', 'oily'],
    texture: 'Water-light, non-sticky gel serum',
    keyIngredients: ['Low & High MW Sodium Hyaluronate', 'Panthenol 5%', 'Madecassoside'],
    educationalNotes: 'Multi-molecular weights allow surface hydration to plump fine dehydration lines while deeper fractions reinforce dermal water reservoirs.',
    usageTips: 'Always pat onto damp skin immediately after cleansing or misting. Follow within 60 seconds with your moisturizer.'
  },
  {
    id: 'prod-serum-antioxidant-vitc',
    name: 'L-Ascorbic Acid 15% + Ferulic Illuminating Elixir',
    category: 'Serum',
    idealFor: ['normal', 'combination', 'dry'],
    texture: 'Rapid-absorbing golden liquid',
    keyIngredients: ['15% Pure L-Ascorbic Acid', '1% Alpha-Tocopherol', '0.5% Ferulic Acid'],
    educationalNotes: 'Clinically proven gold-standard antioxidant complex that scavenges atmospheric free radicals and fades post-blemish shadows.',
    usageTips: 'Press 4-5 drops onto dry face and neck every morning. Allow 1 minute before following with sunscreen.'
  },
  {
    id: 'prod-moisturizer-ceramide-barrier',
    name: 'Lipid Replenishing Barrier Recovery Cream',
    category: 'Moisturizer',
    idealFor: ['dry', 'sensitive', 'normal'],
    texture: 'Rich, velvety cashmere cream',
    keyIngredients: ['Ceramide Complex (1, 3, 6-II)', 'Cholesterol', 'Free Fatty Acids (3:1:1 ratio)', 'Colloidal Oatmeal'],
    educationalNotes: 'Mimics the physiological lipid ratio of healthy skin to repair cracked, dry, or retinoid-sensitized skin barriers.',
    usageTips: 'Warm a dime-sized amount between fingertips and press into skin morning and night.'
  },
  {
    id: 'prod-moisturizer-oilfree-watergel',
    name: 'Oil-Free Cloud Water-Gel Hydrator',
    category: 'Moisturizer',
    idealFor: ['oily', 'combination'],
    texture: 'Weightless, burst-of-water cooling gel',
    keyIngredients: ['Niacinamide 2%', 'Betaine', 'Aloe Vera Leaf Water', 'Trehalose'],
    educationalNotes: 'Delivers intense cellular hydration with zero occlusive waxes, preventing mid-day oily shine and pore congestion.',
    usageTips: 'Smooth evenly morning and night. Serves as an ideal primer before daytime makeup.'
  },
  {
    id: 'prod-sunscreen-invisible-fluid',
    name: 'Broad-Spectrum SPF 50+ Invisible Fluid',
    category: 'Sunscreen',
    idealFor: ['all', 'oily', 'combination', 'normal'],
    texture: 'Ultra-light, invisible, zero white-cast fluid',
    keyIngredients: ['Modern Photostable UV Filters', 'Vitamin E', 'Green Tea Extract'],
    educationalNotes: 'Broad-spectrum PA++++ protection against UVA (aging) and UVB (burning) rays without stinging sensitive eyes.',
    usageTips: 'Apply two finger lengths generously every morning 15 minutes before UV exposure. Reapply every 2 hours if outdoors.'
  },
  {
    id: 'prod-sunscreen-mineral-calming',
    name: '100% Mineral Zinc Oxide SPF 50 Gentle Shield',
    category: 'Sunscreen',
    idealFor: ['sensitive', 'dry'],
    texture: 'Moisturizing, soothing cream with natural soft-blur finish',
    keyIngredients: ['Non-Nano Zinc Oxide 18%', 'Bisabolol', 'Allantoin'],
    educationalNotes: 'Reflects UV rays physically on the surface, making it exceptionally gentle for reactive, rosacea-prone, or post-treatment skin.',
    usageTips: 'Warm slightly in fingertips and blend with gentle patting motions to ensure even mineral coverage.'
  },
  {
    id: 'prod-mask-kaolin-clarifying',
    name: 'Pore-Refining French Kaolin & Sulfur Clarifying Mud',
    category: 'Face Mask',
    idealFor: ['oily', 'combination'],
    texture: 'Creamy non-cracking botanical mud',
    keyIngredients: ['Kaolin Clay', 'Bentonite', '3% Colloidal Sulfur', 'Zinc Oxide'],
    educationalNotes: 'Draws out oxidized surface impurities and excess sebum without drying skin to the point of stinging or cracking.',
    usageTips: 'Apply an even layer over T-zone or congested areas once weekly for 10 minutes. Rinse thoroughly with lukewarm water.'
  },
  {
    id: 'prod-shampoo-scalp-clarifying',
    name: 'Scalp Balancing & Follicle Clarifying Shampoo',
    category: 'Shampoo',
    idealFor: ['all', 'oily'],
    texture: 'Fresh, clear botanical gel',
    keyIngredients: ['Rosemary Leaf Extract', 'Salicylic Acid 0.5%', 'Biotin', 'Apple Cider Vinegar Distillate'],
    educationalNotes: 'Sweeps away styling product buildup and calcified hard-water minerals while purifying follicle openings to support healthy growth.',
    usageTips: 'Apply directly to wet scalp, massage thoroughly with fingertips for 2 minutes to stimulate blood flow, then rinse.'
  },
  {
    id: 'prod-conditioner-peptide-repair',
    name: 'Deep Bond Repair & Moisture Lock Conditioner',
    category: 'Conditioner',
    idealFor: ['dry', 'all'],
    texture: 'Rich, buttery slip treatment',
    keyIngredients: ['Hydrolyzed Keratin Peptides', 'Argan Oil', 'Shea Butter', 'Panthenol'],
    educationalNotes: 'Replenishes lipid cement within damaged hair cuticles, smoothing frizz, sealing split ends, and reducing detangling breakage.',
    usageTips: 'Apply from mid-lengths to ends after shampooing. Leave on for 3-5 minutes before rinsing with cool water.'
  },
  {
    id: 'prod-lip-peptide-treatment',
    name: 'Overnight Peptide Lip Cushion & Barrier Glaze',
    category: 'Lip Care',
    idealFor: ['all', 'dry', 'sensitive'],
    texture: 'Lush, non-sticky glossy melting balm',
    keyIngredients: ['Maxi-Lip Peptide Complex', 'Ceramides', 'Murumuru Butter', 'Squalane'],
    educationalNotes: 'Stimulates collagen synthesis in delicate lip tissue while forming a protective non-evaporative moisture seal.',
    usageTips: 'Apply a generous coat before bed for overnight repair, or lightly throughout the day over lip liner for juicy shine.'
  }
];
