import { BeautyConcern, SkinType } from '../types';

export interface GeneratedRoutinePlan {
  headline: string;
  focusSummary: string;
  morningSteps: { step: number; name: string; action: string; keyIngredient: string }[];
  nightSteps: { step: number; name: string; action: string; keyIngredient: string }[];
  abbasWisdom: string;
  recommendedIngredients: string[];
  ingredientsToAvoid: string[];
  weeklyBonusRitual: string;
}

export function generateCustomRoutine(
  skinType: SkinType,
  concern: BeautyConcern,
  ageRange: string,
  routineDepth: 'simple' | 'complete',
  timePreference: 'all' | 'morning' | 'night'
): GeneratedRoutinePlan {
  // Determine customized recommendation based on inputs
  let headline = `Abbas's Tailored ${skinType.charAt(0).toUpperCase() + skinType.slice(1)} Skin Protocol`;
  let focusSummary = `Designed specifically to target ${concern} while preserving barrier integrity for ${ageRange}.`;

  const recommendedIngredients: string[] = [];
  const ingredientsToAvoid: string[] = ['Synthetic fragrance', 'Denatured alcohol high on INCI', 'Harsh physical walnut scrubs'];

  // Concern-specific additions
  switch (concern) {
    case 'Acne':
    case 'Blackheads':
      recommendedIngredients.push('Salicylic Acid (BHA 1-2%)', 'Niacinamide (3%)', 'Zinc PCA', 'Centella Asiatica');
      ingredientsToAvoid.push('Heavy pore-clogging waxes', 'Pure coconut oil on face', 'Aggressive rubbing');
      break;
    case 'Dry Skin':
    case 'Lip Dryness':
      recommendedIngredients.push('Ceramides (NP, AP, EOP)', 'Hyaluronic Acid', 'Glycerin', 'Squalane');
      ingredientsToAvoid.push('Foaming sulfate cleansers', 'High alcohol toners', 'Excessive hot showers');
      break;
    case 'Oily Skin':
    case 'Large-looking Pores':
      recommendedIngredients.push('Niacinamide (4%)', 'Green Tea Extract', 'Lightweight Hyaluronic Acid', 'BHA');
      ingredientsToAvoid.push('Heavy occlusive butters', 'Skipping daily moisturizer', 'Harsh astringents');
      break;
    case 'Dark Spots':
    case 'Uneven Skin Tone':
      recommendedIngredients.push('Tranexamic Acid', 'Alpha Arbutin', 'L-Ascorbic Acid (Vitamin C)', 'SPF 50+');
      ingredientsToAvoid.push('Unprotected direct sun exposure', 'Picking active blemishes', 'Steroid skin lighteners');
      break;
    case 'Dull Skin':
      recommendedIngredients.push('Vitamin C', 'Lactic Acid', 'Ferulic Acid', 'Polyglutamic Acid');
      ingredientsToAvoid.push('Smoking / poor sleep', 'Skipping hydration layers', 'Over-exfoliation');
      break;
    case 'Sensitive Skin':
      recommendedIngredients.push('Colloidal Oatmeal', 'Centella Asiatica (Cica)', 'Panthenol (B5)', 'Allantoin');
      ingredientsToAvoid.push('Essential oils in high amounts', 'Rough washcloths', 'Extreme temperature water');
      break;
    case 'Hair Fall':
    case 'Dry Hair':
    case 'Damaged Hair':
      recommendedIngredients.push('Rosemary Extract', 'Biotin', 'Argan Oil', 'Hydrolyzed Keratin Peptides');
      ingredientsToAvoid.push('Excessive high heat without thermal protectant', 'Tight restrictive hairstyles', 'Scalding shower water');
      break;
    default:
      recommendedIngredients.push('Broad-Spectrum SPF', 'Ceramides', 'Niacinamide', 'Gentle Humectants');
      break;
  }

  // Morning steps
  const morningSteps = [];
  if (routineDepth === 'simple') {
    morningSteps.push(
      { step: 1, name: 'Gentle Wash', action: skinType === 'dry' ? 'Rinse with cool water or milky cleanser' : 'Wash with mild pH 5.5 foaming gel', keyIngredient: 'Glycerin' },
      { step: 2, name: 'Targeted Hydrator', action: `Apply lightweight serum addressing ${concern}`, keyIngredient: recommendedIngredients[0] || 'Niacinamide' },
      { step: 3, name: 'Shield SPF 50', action: 'Apply two fingers of broad-spectrum sunscreen', keyIngredient: 'Zinc Oxide / Broad UV Filters' }
    );
  } else {
    morningSteps.push(
      { step: 1, name: 'Gentle Balance Cleanse', action: 'Gently cleanse to remove sweat and nightly oil without stripping', keyIngredient: 'Oat Amino Acids' },
      { step: 2, name: 'Cellular Hydration Toner', action: 'Pat 2 layers of essence or toner into damp skin', keyIngredient: 'Hyaluronic Acid & Panthenol' },
      { step: 3, name: 'Active Treatment Serum', action: `Smooth 3-4 drops tailored for ${concern}`, keyIngredient: recommendedIngredients[0] || 'Vitamin C' },
      { step: 4, name: 'Barrier Seal Cream', action: skinType === 'oily' ? 'Lightweight oil-free water gel' : 'Rich barrier cream with lipids', keyIngredient: 'Ceramides & Squalane' },
      { step: 5, name: 'Broad-Spectrum SPF 50+', action: 'Non-negotiable daily defense against UV photoaging', keyIngredient: 'Photostable UV Shields' }
    );
  }

  // Night steps
  const nightSteps = [];
  if (routineDepth === 'simple') {
    nightSteps.push(
      { step: 1, name: 'Thorough Cleanse', action: 'Remove daily sunscreen and environmental residue completely', keyIngredient: 'Gentle Surfactants' },
      { step: 2, name: 'Nighttime Active', action: `Target ${concern} overnight while cellular turnover is elevated`, keyIngredient: recommendedIngredients[1] || 'Azelaic Acid' },
      { step: 3, name: 'Restorative Moisturizer', action: 'Seal in water and replenish lipids before sleep', keyIngredient: 'Ceramides' }
    );
  } else {
    nightSteps.push(
      { step: 1, name: 'First Cleanse (Oil/Balm)', action: 'Massage 60 seconds on dry skin to melt SPF and oxidized sebum', keyIngredient: 'Jojoba or Camellia Oil' },
      { step: 2, name: 'Second Cleanse (Water-Based)', action: 'Gentle lather to leave skin completely clean without squeakiness', keyIngredient: 'Coco-Glucoside' },
      { step: 3, name: 'Hydrating Essence Mist', action: 'Restore optimal skin pH and prep cellular channels', keyIngredient: 'Rosewater & Glycerin' },
      { step: 4, name: 'Targeted Night Treatment', action: `Apply specialized treatment for ${concern} on dry skin`, keyIngredient: recommendedIngredients[1] || 'Retinoid / BHA' },
      { step: 5, name: 'Barrier Recovery Night Cream', action: 'Nourish lipid layers and lock in hydration until sunrise', keyIngredient: 'Multi-Ceramide Matrix' },
      { step: 6, name: 'Lip & Eye Cushion', action: 'Protect delicate eye contour and vermilion lip border', keyIngredient: 'Peptides & Shea Butter' }
    );
  }

  const abbasWisdom = `“Real beauty is not about suffocating your skin under endless layers or chasing overnight miracles. It is about steady, gentle discipline. Treat your skin barrier like fine silk: nurture it with moisture, shield it from harsh UV light, and allow your body’s natural regenerative rhythm to do the rest.”`;

  const weeklyBonusRitual = concern === 'Acne' || concern === 'Oily Skin'
    ? 'Once a week: Apply a soothing French kaolin or sulfur clay mask to the T-zone for 10 minutes, followed by a cica gel recovery layer.'
    : 'Once a week: Treat yourself to a warm raw honey and chilled rosewater mask for 15 minutes, finished with an ice globe gentle facial massage.';

  return {
    headline,
    focusSummary,
    morningSteps: timePreference === 'night' ? [] : morningSteps,
    nightSteps: timePreference === 'morning' ? [] : nightSteps,
    abbasWisdom,
    recommendedIngredients,
    ingredientsToAvoid,
    weeklyBonusRitual,
  };
}
