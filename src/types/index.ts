export type MajorCategory =
  | 'skin-care'
  | 'hair-care'
  | 'makeup'
  | 'natural-beauty'
  | 'face-care'
  | 'body-care'
  | 'nail-care'
  | 'mens-grooming';

export type CategoryId =
  | MajorCategory
  | 'face-glow'
  | 'dry-skin'
  | 'oily-skin'
  | 'acne-pimples'
  | 'dark-spots'
  | 'dull-skin'
  | 'natural-remedies'
  | 'makeup-tips'
  | 'hair-care-tips'
  | 'lip-care'
  | 'sun-skincare'
  | 'product-suggestions'
  | 'daily-routine'
  | 'self-care';

export type SkinType = 'all' | 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';

export type BeautyConcern =
  | 'Acne'
  | 'Dry Skin'
  | 'Oily Skin'
  | 'Dark Spots'
  | 'Dull Skin'
  | 'Uneven Skin Tone'
  | 'Sensitive Skin'
  | 'Blackheads'
  | 'Large-looking Pores'
  | 'Sun Exposure'
  | 'Hair Fall'
  | 'Dry Hair'
  | 'Damaged Hair'
  | 'Frizz'
  | 'Lip Dryness'
  | 'Basic Grooming'
  | 'General Skin Care';

export type SupportedLanguage = 'en' | 'ur' | 'ar' | 'hi';

export type ActiveView =
  | 'home'
  | 'category'
  | 'article'
  | 'library'
  | 'assistant'
  | 'routine'
  | 'search'
  | 'saved'
  | 'profile';

export interface SubCategory {
  id: string;
  name: string;
  description: string;
}

export interface CategoryInfo {
  id: CategoryId;
  majorCategory?: MajorCategory;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  subcategories?: SubCategory[];
  count?: number;
}

export interface TipStep {
  stepNumber: number;
  title: string;
  instruction: string;
}

export interface BeautyTip {
  id: string;
  title: string;
  shortExplanation: string;
  fullDescription: string;
  category: CategoryId;
  categoryLabel: string;
  skinTypes: SkinType[];
  concerns: BeautyConcern[];
  recommendedRoutine: string;
  usefulIngredients: string[];
  dos: string[];
  donts: string[];
  steps?: TipStep[];
  proTip: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  suitableTime?: 'Morning' | 'Night' | 'Anytime' | 'Weekly';
  isPopular?: boolean;
}

export interface ArticleSection {
  heading: string;
  content: string;
  steps?: { stepNumber: number; title: string; instruction: string }[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: MajorCategory;
  categoryLabel: string;
  subcategory: string;
  coverImage: string;
  author: string;
  authorRole: string;
  publishedDate: string;
  updatedDate: string;
  readingTimeMinutes: number;
  tableOfContents: { id: string; title: string }[];
  summary: string;
  sections: ArticleSection[];
  keyIngredients: string[];
  skinTypes: SkinType[];
  concerns: BeautyConcern[];
  dos: string[];
  donts: string[];
  safetyPrecautions: string[];
  sources: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  likesCount?: number;
}

export interface IngredientInfo {
  id: string;
  name: string;
  scientificName?: string;
  category: string;
  primaryPurpose: string;
  benefits: string[];
  suitableFor: SkinType[];
  bestPairedWith: string[];
  avoidCombiningWith: string[];
  precautions: string;
  evidenceSummary: string;
  relatedCategory: MajorCategory;
  relatedArticleIds?: string[];
}

export interface GlossaryTerm {
  term: string;
  pronunciation?: string;
  category: string;
  definition: string;
  practicalRelevance: string;
}

export interface NaturalRemedy {
  id: string;
  title: string;
  category: 'Face care' | 'Hair care' | 'Lip care' | 'Skin hydration' | 'General self-care';
  benefits: string;
  ingredients: string[];
  preparation: string[];
  howToUse: string;
  frequency: string;
  caution: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category:
    | 'Cleanser'
    | 'Moisturizer'
    | 'Sunscreen'
    | 'Serum'
    | 'Face Mask'
    | 'Shampoo'
    | 'Conditioner'
    | 'Lip Care';
  idealFor: SkinType[];
  texture: string;
  keyIngredients: string[];
  educationalNotes: string;
  usageTips: string;
}

export interface DailyRoutineStep {
  id: string;
  title: string;
  timeOfDay: 'morning' | 'night';
  stepNumber: number;
  description: string;
  keyBenefit: string;
  completed: boolean;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  relatedArticleIds?: string[];
}

export interface UserProfile {
  name: string;
  skinType: SkinType;
  hairType: string;
  primaryConcerns: BeautyConcern[];
  savedArticleIds: string[];
  savedTipIds: string[];
  savedRoutineIds: string[];
  readingHistory: { articleId: string; title: string; timestamp: string }[];
  preferredLanguage: SupportedLanguage;
  notificationsEnabled: boolean;
}
