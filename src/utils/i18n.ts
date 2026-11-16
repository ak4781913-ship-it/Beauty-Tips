import { SupportedLanguage } from '../types';

export interface Translations {
  siteTitle: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  exploreTipsCTA: string;
  findRoutineCTA: string;
  navHome: string;
  navSkinCare: string;
  navHairCare: string;
  navMakeup: string;
  navNaturalBeauty: string;
  navFaceCare: string;
  navBodyCare: string;
  navNailCare: string;
  navMensGrooming: string;
  navLibrary: string;
  navAIAssistant: string;
  navRoutine: string;
  navSearch: string;
  navSaved: string;
  navProfile: string;
  searchPlaceholder: string;
  categoriesTitle: string;
  concernsTitle: string;
  featuredArticles: string;
  trendingTitle: string;
  aiAssistantHeading: string;
  aiAssistantDesc: string;
  aiAssistantCTA: string;
  safetyTitle: string;
  safetyNotice: string;
  disclaimerText: string;
  readMore: string;
  saveTip: string;
  savedTip: string;
  share: string;
  listenArticle: string;
  stopAudio: string;
  tableOfContents: string;
  keyIngredients: string;
  routineTitle: string;
  morningRoutine: string;
  nightRoutine: string;
  routineReset: string;
  footerAbout: string;
  footerPrivacy: string;
  footerTerms: string;
  footerFaq: string;
  footerContact: string;
  allRightsReserved: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    siteTitle: 'Beauty Tips by Abbas',
    tagline: 'Your Everyday Beauty, Skincare & Holistic Self-Care Guide',
    heroHeadline: 'Discover Your Best Beauty Routine',
    heroSubtitle: 'Explore science-backed skincare wisdom, natural kitchen remedies, hair wellness rituals, and professional makeup techniques designed to honor and protect your natural beauty.',
    exploreTipsCTA: 'Explore Beauty Tips',
    findRoutineCTA: 'Find My Beauty Routine',
    navHome: 'Home',
    navSkinCare: 'Skin Care',
    navHairCare: 'Hair Care',
    navMakeup: 'Makeup',
    navNaturalBeauty: 'Natural Beauty',
    navFaceCare: 'Face Care',
    navBodyCare: 'Body Care',
    navNailCare: 'Nail Care',
    navMensGrooming: "Men's Grooming",
    navLibrary: 'Knowledge Library',
    navAIAssistant: 'AI Beauty Assistant',
    navRoutine: 'My Routine',
    navSearch: 'Search',
    navSaved: 'Saved Vault',
    navProfile: 'Profile',
    searchPlaceholder: 'Search by concern, ingredient, category or title...',
    categoriesTitle: 'Explore by Category',
    concernsTitle: 'Explore by Concern',
    featuredArticles: 'Featured Guides & Articles',
    trendingTitle: 'Trending Beauty Insights',
    aiAssistantHeading: 'Consult Your AI Beauty Assistant',
    aiAssistantDesc: 'Receive personalized, safe, barrier-first skincare guidance tailored to your unique skin type and concerns.',
    aiAssistantCTA: 'Start AI Consultation',
    safetyTitle: 'Beauty Safety & Verification',
    safetyNotice: 'Patch test every botanical recipe and active serum 24 hours prior to full application.',
    disclaimerText: 'The information provided on this website is for general beauty and skincare education only and is not medical advice. For persistent, severe, or painful skin conditions, consult a licensed dermatologist.',
    readMore: 'Read Full Guide',
    saveTip: 'Save to Vault',
    savedTip: 'Saved in Vault',
    share: 'Share',
    listenArticle: 'Listen to Article',
    stopAudio: 'Stop Audio',
    tableOfContents: 'Table of Contents',
    keyIngredients: 'Key Active Ingredients',
    routineTitle: 'Daily Beauty Routine',
    morningRoutine: 'Morning Ritual',
    nightRoutine: 'Night Recovery',
    routineReset: 'Reset Checklists',
    footerAbout: 'About Abbas',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Use',
    footerFaq: 'FAQs',
    footerContact: 'Contact Us',
    allRightsReserved: 'All rights reserved.',
  },
  ur: {
    siteTitle: 'بیوٹی ٹپس بائے عباس',
    tagline: 'خوبصورتی، جلد کی دیکھ بھال اور قدرتی سیلف کیئر کی روزانہ رہنما',
    heroHeadline: 'اپنی بہترین بیوٹی روٹین دریافت کریں',
    heroSubtitle: 'سائنسی اصولوں پر مبنی سکن کیئر، قدرتی گھریلو نسخے، بالوں کی نگہداشت اور میک اپ کی تکنیکوں کے ساتھ اپنی قدرتی خوبصورتی کو نکھاریں۔',
    exploreTipsCTA: 'ٹپس دریافت کریں',
    findRoutineCTA: 'میری روٹین تلاش کریں',
    navHome: 'ہوم',
    navSkinCare: 'سکن کیئر',
    navHairCare: 'ہیئر کیئر',
    navMakeup: 'میک اپ',
    navNaturalBeauty: 'قدرتی خوبصورتی',
    navFaceCare: 'چہرے کی نگہداشت',
    navBodyCare: 'باڈی کیئر',
    navNailCare: 'ناخنوں کی نگہداشت',
    navMensGrooming: 'مردانہ گرومنگ',
    navLibrary: 'معلوماتی لائبریری',
    navAIAssistant: 'اے آئی بیوٹی اسسٹنٹ',
    navRoutine: 'میری روٹین',
    navSearch: 'تلاش کریں',
    navSaved: 'محفوظ شدہ',
    navProfile: 'پروفائل',
    searchPlaceholder: 'مسئلہ، اجزاء، کیٹیگری یا عنوان کے ذریعے تلاش کریں...',
    categoriesTitle: 'کیٹیگریز کے مطابق دریافت کریں',
    concernsTitle: 'جلدی و بالوں کے مسائل',
    featuredArticles: 'نمایاں مضامین و گائیڈز',
    trendingTitle: 'مقبول ترین بیوٹی ٹرینڈز',
    aiAssistantHeading: 'اپنے اے آئی بیوٹی اسسٹنٹ سے مشورہ کریں',
    aiAssistantDesc: 'اپنی جلدی قسم اور مسائل کے لیے محفوظ اور موزوں بیوٹی روٹین کی فوری رہنمائی حاصل کریں۔',
    aiAssistantCTA: 'اے آئی مشاورت شروع کریں',
    safetyTitle: 'حفاظتی تدابیر و رہنمائی',
    safetyNotice: 'کوئی بھی نیا قدرتی نسخہ یا ایکٹیو سیرم لگانے سے پہلے 24 گھنٹے پیچ ٹیسٹ لازمی کریں۔',
    disclaimerText: 'اس ویب سائٹ پر فراہم کردہ معلومات صرف عمومی بیوٹی اور سکن کیئر آگاہی کے لیے ہیں اور یہ طبی مشورہ نہیں۔ شدید جلدی مسائل کی صورت میں مستند ماہر امراض جلد سے رجوع کریں۔',
    readMore: 'مکمل گائیڈ پڑھیں',
    saveTip: 'محفوظ کریں',
    savedTip: 'محفوظ شدہ',
    share: 'شیئر کریں',
    listenArticle: 'آواز میں سنیں',
    stopAudio: 'آڈیو بند کریں',
    tableOfContents: 'فہرست مضامین',
    keyIngredients: 'اہم فعال اجزاء',
    routineTitle: 'روزانہ کی بیوٹی روٹین',
    morningRoutine: 'صبح کی روٹین',
    nightRoutine: 'رات کی نگہداشت',
    routineReset: 'چیک لسٹ دوبارہ شروع کریں',
    footerAbout: 'عباس کے بارے میں',
    footerPrivacy: 'پرائیویسی پالیسی',
    footerTerms: 'شرائط و ضوابط',
    footerFaq: 'عام سوالات',
    footerContact: 'رابطہ کریں',
    allRightsReserved: 'جملہ حقوق محفوظ ہیں۔',
  },
  ar: {
    siteTitle: 'نصائح الجمال من عباس',
    tagline: 'دليلك اليومي للعناية بالبشرة والجمال الطبيعي',
    heroHeadline: 'اكتشف روتين الجمال المثالي لك',
    heroSubtitle: 'استكشف أسرار العناية بالبشرة المدعومة بالعلوم، والوصفات الطبيعية، وروتين العناية بالشعر والمكياج لحماية جمالك الطبيعي.',
    exploreTipsCTA: 'استكشف النصائح',
    findRoutineCTA: 'ابحث عن روتيني',
    navHome: 'الرئيسية',
    navSkinCare: 'العناية بالبشرة',
    navHairCare: 'العناية بالشعر',
    navMakeup: 'المكياج',
    navNaturalBeauty: 'الجمال الطبيعي',
    navFaceCare: 'العناية بالوجه',
    navBodyCare: 'العناية بالجسم',
    navNailCare: 'العناية بالأظافر',
    navMensGrooming: 'عناية الرجال',
    navLibrary: 'مكتبة المعرفة',
    navAIAssistant: 'مساعد الذكاء الاصطناعي',
    navRoutine: 'روتيني',
    navSearch: 'بحث',
    navSaved: 'المحفوظات',
    navProfile: 'الملف الشخصي',
    searchPlaceholder: 'ابحث حسب المشكلة، المكونات، أو القسم...',
    categoriesTitle: 'استكشف حسب القسم',
    concernsTitle: 'استكشف حسب المشكلة',
    featuredArticles: 'أبرز المقالات والدلائل',
    trendingTitle: 'الأكثر تداولاً',
    aiAssistantHeading: 'استشر مساعد الجمال بالذكاء الاصطناعي',
    aiAssistantDesc: 'احصل على إرشادات مخصصة وآمنة للعناية بحاجز البشرة بناءً على نوع بشرتك واحتياجاتك.',
    aiAssistantCTA: 'ابدأ الاستشارة',
    safetyTitle: 'إرشادات السلامة والتحقق',
    safetyNotice: 'قم دائماً باختبار الحساسية الموضعي لمدة 24 ساعة قبل تطبيق أي مكون جديد.',
    disclaimerText: 'المعلومات المقدمة هي لأغراض التثقيف العام بالجمال والعناية بالبشرة فقط ولا تعتبر نصيحة طبية. للحالات الشديدة، يرجى استشارة طبيب جلدية معتمد.',
    readMore: 'قراءة الدليل كاملاً',
    saveTip: 'حفظ',
    savedTip: 'تم الحفظ',
    share: 'مشاركة',
    listenArticle: 'استمع إلى المقال',
    stopAudio: 'إيقاف الصوت',
    tableOfContents: 'جدول المحتويات',
    keyIngredients: 'المكونات الفعالة الرئيسية',
    routineTitle: 'روتين الجمال اليومي',
    morningRoutine: 'روتين الصباح',
    nightRoutine: 'روتين المساء',
    routineReset: 'إعادة ضبط الروتين',
    footerAbout: 'عن عباس',
    footerPrivacy: 'سياسة الخصوصية',
    footerTerms: 'شروط الاستخدام',
    footerFaq: 'الأسئلة الشائعة',
    footerContact: 'اتصل بنا',
    allRightsReserved: 'جميع الحقوق محفوظة.',
  },
  hi: {
    siteTitle: 'ब्यूटी टिप्स बाय अब्बास',
    tagline: 'आपकी दैनिक सौंदर्य, स्किनकेयर और प्राकृतिक देखभाल की मार्गदर्शिका',
    heroHeadline: 'अपना सर्वश्रेष्ठ ब्यूटी रूटीन खोजें',
    heroSubtitle: 'विज्ञान-सम्मत स्किनकेयर ज्ञान, प्राकृतिक घरेलू उपचार, बालों की देखभाल और मेकअप तकनीकों के साथ अपनी प्राकृतिक सुंदरता को निखारें।',
    exploreTipsCTA: 'टिप्स देखें',
    findRoutineCTA: 'मेरा ब्यूटी रूटीन बनाएं',
    navHome: 'होम',
    navSkinCare: 'स्किन केयर',
    navHairCare: 'हेयर केयर',
    navMakeup: 'मेकअप',
    navNaturalBeauty: 'नेचुरल ब्यूटी',
    navFaceCare: 'फेस केयर',
    navBodyCare: 'बॉडी केयर',
    navNailCare: 'नेल केयर',
    navMensGrooming: 'मेंस ग्रूमिंग',
    navLibrary: 'नॉलेज लाइब्रेरी',
    navAIAssistant: 'एआई ब्यूटी असिस्टेंट',
    navRoutine: 'मेरा रूटीन',
    navSearch: 'सर्च',
    navSaved: 'सेव किए गए',
    navProfile: 'प्रोफाइल',
    searchPlaceholder: 'चिंता, सामग्री, श्रेणी या शीर्षक से खोजें...',
    categoriesTitle: 'श्रेणी के अनुसार देखें',
    concernsTitle: 'समस्या के अनुसार देखें',
    featuredArticles: 'विशेष गाइड्स और लेख',
    trendingTitle: 'ट्रेंडिंग ब्यूटी इनसाइट्स',
    aiAssistantHeading: 'एआई ब्यूटी असिस्टेंट से सलाह लें',
    aiAssistantDesc: 'अपनी त्वचा के प्रकार और प्राथमिकताओं के अनुसार सुरक्षित और व्यक्तिगत स्किनकेयर मार्गदर्शन पाएं।',
    aiAssistantCTA: 'एआई परामर्श शुरू करें',
    safetyTitle: 'सौंदर्य सुरक्षा दिशानिर्देश',
    safetyNotice: 'किसी भी नए घरेलू उपचार या सक्रिय सीरम का उपयोग करने से पहले 24 घंटे का पैच टेस्ट अवश्य करें।',
    disclaimerText: 'इस वेबसाइट पर दी गई जानकारी केवल सामान्य सौंदर्य और स्किनकेयर शिक्षा के लिए है और यह चिकित्सीय सलाह नहीं है। गंभीर त्वचा स्थितियों के लिए योग्य त्वचा विशेषज्ञ से परामर्श लें।',
    readMore: 'पूरी गाइड पढ़ें',
    saveTip: 'सेव करें',
    savedTip: 'सेव्ड',
    share: 'शेयर करें',
    listenArticle: 'ऑडियो सुनें',
    stopAudio: 'ऑडियो रोकें',
    tableOfContents: 'विषय सूची',
    keyIngredients: 'प्रमुख सक्रिय सामग्रियां',
    routineTitle: 'दैनिक ब्यूटी रूटीन',
    morningRoutine: 'सुबह का रूटीन',
    nightRoutine: 'रात की देखभाल',
    routineReset: 'चेकलिस्ट रीसेट करें',
    footerAbout: 'अब्बास के बारे में',
    footerPrivacy: 'गोपनीयता नीति',
    footerTerms: 'उपयोग की शर्तें',
    footerFaq: 'अक्सर पूछे जाने वाले सवाल',
    footerContact: 'संपर्क करें',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
  },
};

export function isRtlLanguage(lang: SupportedLanguage): boolean {
  return lang === 'ur' || lang === 'ar';
}

export function applyLanguageDirection(lang: SupportedLanguage) {
  if (typeof document !== 'undefined') {
    const isRtl = isRtlLanguage(lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }
}
