import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bookmark,
  Clock,
  Share2,
  Copy,
  Printer,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Droplets,
  MessageCircle,
  Send,
  Calendar,
  User,
  Layers,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Headphones,
  Radio,
  MessageSquare,
  History,
} from 'lucide-react';
import { BEAUTY_TIPS } from '../data/tips';
import { BeautyTip } from '../types';
import { findTipBySlug, getTipSlug } from '../utils/slug';
import { calculateReadTime, calculateArticleReadingStats, ReadingStats } from '../utils/readTime';
import { recordArticleVisit } from '../utils/recentHistory';
import { useRecentHistory } from '../hooks/useRecentHistory';
import { recordDailyActivity } from '../utils/streak';
import { recordWeeklyTipRead } from '../utils/readingGoal';
import { evaluateMilestones } from '../utils/milestones';
import { TipCard } from '../components/TipCard';
import { ArticleAudioPlayer } from '../components/ArticleAudioPlayer';
import { CommentSection } from '../components/CommentSection';
import { RecentHistorySection } from '../components/RecentHistorySection';
import { ArticleShare } from '../components/ArticleShare';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { AdsterraNative } from '../components/ads/AdsterraNative';

import heroImage from '../assets/images/hero_beauty_skincare_elegance_1791268845073.jpg';
import botanicalsImage from '../assets/images/natural_remedies_botanicals_1791268857904.jpg';
import routineImage from '../assets/images/routine_skincare_ritual_1791268873835.jpg';
import serumsImage from '../assets/images/beauty_serums_bottles_1791268884613.jpg';
import makeupImage from '../assets/images/editorial_makeup_palette_1791795525301.jpg';

const TOPIC_IMAGES: Record<string, string> = {
  'tip-double-cleanse-clarity': heroImage,
  'tip-ceramide-barrier-shield': routineImage,
  'tip-vitamin-c-glow': serumsImage,
  'tip-rosemary-scalp-growth': botanicalsImage,
  'tip-rosemary-scalp-circulation': botanicalsImage,
  'tip-salicylic-pore-clear': serumsImage,
  'tip-salicylic-acid-blemish': serumsImage,
  'tip-fade-dark-spots-tranexamic': serumsImage,
  'tip-sunscreen-two-finger-rule': heroImage,
  'tip-skin-prep-flawless-makeup': makeupImage,
  'tip-everyday-clean-makeup': makeupImage,
  'tip-eye-makeup-definition': makeupImage,
  'tip-lip-overnight-plumping-ritual': makeupImage,
  'tip-aloe-soothing-compress': botanicalsImage,
  'skin-care': routineImage,
  'hair-care': botanicalsImage,
  'dry-skin': routineImage,
  'acne-pimples': serumsImage,
  'dark-spots': serumsImage,
  'natural-remedies': botanicalsImage,
  'makeup-tips': makeupImage,
  'lip-care': makeupImage,
};

const TOPIC_FAQS: Record<string, { q: string; a: string }[]> = {
  'tip-double-cleanse-clarity': [
    {
      q: 'Can I double cleanse if I do not wear makeup during the day?',
      a: 'Yes, absolutely. Even on bare skin days, broad-spectrum sunscreen and natural sebum are oil-soluble. A water-based cleanser alone often leaves sunscreen residues trapped in pores. Oil cleansing melts this daily film effortlessly without stripping moisture.',
    },
    {
      q: 'Will oil cleansing cause breakouts on naturally oily or acne-prone skin?',
      a: 'Not if you use an emulsifying, non-comedogenic oil (such as jojoba or camellia oil) and follow with a low-pH water cleanser. The basic chemistry principle "like dissolves like" means cleansing oil bonds with excess sebum inside pores and rinses away cleanly when emulsified with water.',
    },
    {
      q: 'How long should I massage the oil cleanser onto dry skin?',
      a: '60 to 90 seconds is the ideal window. This provides adequate time for the oils to solubilize hardened sebaceous plugs around the nose and chin without inducing unnecessary friction.',
    },
  ],
  'tip-slugging-barrier-repair': [
    {
      q: 'Can I slug on the same night I use retinol or prescription tretinoin?',
      a: 'No. Never slug over active retinoids or exfoliating AHA/BHA acids. Slugging traps ingredients beneath a 99% occlusive seal, multiplying their transdermal penetration rate and triggering severe redness or chemical burns. Only slug on hydrating rest nights.',
    },
    {
      q: 'Is petroleum jelly pore-clogging or comedogenic?',
      a: 'Cosmetic-grade petrolatum molecules are too large to physically penetrate inside human pores. Petrolatum sits on the epidermal surface as a non-reactive protective shield. However, if skin is not thoroughly cleansed beforehand, it can trap existing surface debris, so always cleanse properly first.',
    },
    {
      q: 'How many nights a week should I slug?',
      a: 'For very dry or compromised skin, 2 to 3 nights weekly is sufficient. For combination skin, practice "zone slugging" strictly on dry cheekbones once or twice a week, skipping the oily T-zone.',
    },
  ],
  'tip-sunscreen-two-finger-rule': [
    {
      q: 'Why are two full finger lengths necessary for proper facial UV protection?',
      a: 'International laboratory SPF efficacy ratings mandate a density of 2 milligrams per square centimeter of skin. Two full finger lengths equals roughly 1.25 grams, which reliably covers the surface area of the adult face, neck, and ears to achieve the promised SPF rating on the bottle.',
    },
    {
      q: 'Does moisturizer or makeup with SPF 15 or 30 provide adequate defense?',
      a: 'Rarely. To achieve the labeled SPF of a foundation, you would need to apply seven times the normal aesthetic amount of makeup, creating an unusable, heavy mask. Always apply a dedicated broad-spectrum SPF 50 sunscreen beneath your beauty products.',
    },
    {
      q: 'Do I need to reapply sunscreen if I work indoors all day?',
      a: 'If you sit directly next to unshaded windows (UVA penetrates standard glass) or step outside for a walk, reapplication is recommended. If you work deep inside an interior room without window exposure, a morning application is generally adequate until heading back outside.',
    },
  ],
  'tip-salicylic-acid-blemish': [
    {
      q: 'How quickly does Salicylic Acid (BHA) clear blackheads and congestion?',
      a: 'Surface pore clearing begins within 7 to 14 days, while full resolution of stubborn blackheads and sebaceous filaments typically takes 4 to 6 weeks of consistent 2-3x weekly application.',
    },
    {
      q: 'What should I do if I notice small breakout spots after starting BHA?',
      a: 'Mild purging (small whiteheads in areas where you typically get congestion) is normal during the first 2-3 weeks as cell turnover speeds up. However, if you develop widespread redness, burning, or breakouts in brand new areas, that indicates barrier irritation—reduce frequency or pause.',
    },
    {
      q: 'Can I apply BHA twice a day for faster acne clearing?',
      a: 'No. Applying BHA multiple times a day damages the stratum corneum barrier, resulting in inflammation that actually worsens breakouts. 2 to 3 evenings per week is optimal for most complexions.',
    },
  ],
  'tip-fade-dark-spots-tranexamic': [
    {
      q: 'How long does it take for post-inflammatory hyperpigmentation to fade?',
      a: 'Epidermal skin cells naturally renew every 28 to 40 days. Consistent use of tyrosinase inhibitors (like tranexamic acid and alpha arbutin) paired with daily SPF 50 will show visible lightening within 6 to 12 weeks.',
    },
    {
      q: 'Does sun exposure immediately reverse dark spot fading progress?',
      a: 'Yes. Melanocytes remain primed and hyper-reactive in previously inflamed areas. As little as 10 to 15 minutes of unprotected sun exposure can stimulate melanin production and darken the spot back to its original tone.',
    },
    {
      q: 'Can tranexamic acid be safely combined with Vitamin C and Niacinamide?',
      a: 'Yes! These three actives work through distinct biological pathways. Tranexamic acid calms UV-induced inflammatory pathways, Vitamin C neutralizes free radicals, and Niacinamide blocks melanosome transfer, creating an ideal brightening synergy.',
    },
  ],
  'tip-everyday-clean-makeup': [
    {
      q: 'What is the secret to making skin tint look like real skin all day?',
      a: 'Prepping with a lightweight water-based moisturizer and allowing it to settle for 3 minutes before applying the tint. Use warm fingers to melt the tint into the skin, and only powder the sides of the nose and center forehead.',
    },
    {
      q: 'How can I prevent cream blush from fading by mid-afternoon?',
      a: 'Set the cream blush lightly with a matching veil of soft powder blush, or finish with a fine mist of hydrating setting spray that locks cosmetic pigments in place without flattening dewiness.',
    },
    {
      q: 'Can I use cream blush on my lips for a monochromatic look?',
      a: 'Yes! High quality cream blushes contain nourishing emollients and pigments that look beautiful tapped onto bare lips, especially when topped with clear peptide balm.',
    },
  ],
};

function getArticleFaqs(tip: BeautyTip): { q: string; a: string }[] {
  if (TOPIC_FAQS[tip.id]) {
    return TOPIC_FAQS[tip.id];
  }
  return [
    {
      q: `How often should I incorporate "${tip.title}" into my routine?`,
      a: `For optimal results without overwhelming your skin barrier, follow the recommended schedule: ${tip.recommendedRoutine}. Always adjust based on how your skin responds over a 2-week period.`,
    },
    {
      q: `Which skin types benefit most from this specific ritual?`,
      a: `This formulation protocol is specifically balanced for ${tip.skinTypes.join(', ')} skin profiles. If you have sensitive skin, always perform a 24-hour patch test before full facial application.`,
    },
    {
      q: `Can this ritual be combined with other active treatments?`,
      a: `Yes, provided you do not layer conflicting potent actives simultaneously. Follow the rule of thinnest to thickest consistency, and avoid combining high-strength exfoliating acids with retinoids in the same single session.`,
    },
  ];
}

interface ArticleDetailPageProps {
  favorites: string[];
  onToggleFavorite: (tipId: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  favorites,
  onToggleFavorite,
  onShowToast,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeAudioSectionId, setActiveAudioSectionId] = useState<string | null>(null);

  const tip: BeautyTip | undefined = slug ? findTipBySlug(slug, BEAUTY_TIPS) : undefined;
  const articleSlug = slug || (tip ? getTipSlug(tip) : '');

  const {
    history: recentHistory,
    removeItem: removeRecentHistoryItem,
    clearAll: clearRecentHistory,
  } = useRecentHistory();

  // Reader Mode state (persisted in localStorage)
  const [readerMode, setReaderMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('beauty_reader_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Reader Mode font size: 'normal' | 'large' | 'xlarge'
  const [readerFontSize, setReaderFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      const saved = localStorage.getItem('beauty_reader_font_size');
      if (saved === 'large' || saved === 'xlarge') return saved;
      return 'normal';
    } catch {
      return 'normal';
    }
  });

  const toggleReaderMode = () => {
    setReaderMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('beauty_reader_mode', next ? 'true' : 'false');
      } catch (e) {
        // ignore
      }
      if (onShowToast) {
        onShowToast(
          next
            ? 'Reader Mode activated: distractions, ads, comments, and related tips hidden'
            : 'Reader Mode deactivated: full layout restored',
          'info'
        );
      }
      return next;
    });
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    setReaderFontSize(size);
    try {
      localStorage.setItem('beauty_reader_font_size', size);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pressing Escape exits Reader Mode
      if (e.key === 'Escape' && readerMode) {
        setReaderMode(false);
        try {
          localStorage.setItem('beauty_reader_mode', 'false');
        } catch (e) {
          // ignore
        }
        if (onShowToast) onShowToast('Exited Reader Mode', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readerMode, onShowToast]);

  useEffect(() => {
    if (tip) {
      document.title = `${tip.title} | Beauty Tips by Abbas`;
      recordArticleVisit(tip, articleSlug);
      recordDailyActivity();
      recordWeeklyTipRead(tip);
      const milestoneCheck = evaluateMilestones(favorites);
      if (milestoneCheck.newlyUnlocked.length > 0 && onShowToast) {
        const badge = milestoneCheck.newlyUnlocked[0];
        onShowToast(`🏆 Milestone Unlocked: "${badge.badgeName}"!`, 'favorite');
      }
    } else {
      document.title = 'Article Not Found | Beauty Tips by Abbas';
    }
  }, [tip, articleSlug, favorites, onShowToast]);

  if (!tip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-800/50 text-rose-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium">
          Article Not Found
        </h1>
        <p className="text-stone-400 max-w-md mx-auto text-sm leading-relaxed">
          The beauty tip or article you are looking for may have been moved, updated, or does not exist.
        </p>
        <div className="pt-2">
          <Link
            to="/beauty-tips"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Beauty Tips</span>
          </Link>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(tip.id);

  // Dynamically calculate estimated reading time based on the full article content length
  const readingStats = useMemo<ReadingStats>(() => {
    if (!tip) {
      return {
        minutes: 1,
        wordCount: 0,
        formatted: '1 min read',
        detailed: '1 min read',
        wpm: 200,
      };
    }
    const faqs = getArticleFaqs(tip);
    const faqTexts = faqs.flatMap((f) => [f.q, f.a]);
    const clinicalNotes = [
      'Before incorporating new active concentrations or botanical extracts into your routine, perform a 24-hour patch test on your inner forearm. If you experience stinging, rash, or persistent swelling, rinse immediately with cool water and cease use.',
    ];
    return calculateArticleReadingStats(tip, [...faqTexts, ...clinicalNotes]);
  }, [tip]);

  const readTime = readingStats.formatted;
  const currentSlug = getTipSlug(tip);
  const articleUrl = typeof window !== 'undefined' ? `${window.location.origin}/beauty-tips/${currentSlug}` : '';

  const bannerImg =
    TOPIC_IMAGES[tip.id] ||
    TOPIC_IMAGES[tip.category] ||
    (tip.category === 'hair-care' ? botanicalsImage : routineImage);

  // Curate related articles
  const relatedTips = BEAUTY_TIPS.filter(
    (t) => t.id !== tip.id && (t.category === tip.category || t.concerns.some((c) => tip.concerns.includes(c)))
  ).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    onShowToast('Article link copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const shareText = `Read this beauty guide: "${tip.title}" on Beauty Tips by Abbas`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${articleUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;

  // Mapping to category URL
  const getCategoryRoute = (catId: string) => {
    if (catId === 'skin-care' || catId === 'dry-skin' || catId === 'oily-skin' || catId === 'sun-skincare') return '/skin-care';
    if (catId === 'makeup-tips' || catId === 'makeup' || catId === 'lip-care') return '/makeup';
    if (catId === 'acne-pimples') return '/acne-pimples';
    if (catId === 'dark-spots') return '/dark-spots';
    if (catId === 'hair-care') return '/hair-care';
    if (catId === 'daily-routine') return '/routines';
    return '/beauty-tips';
  };

  const readerFontClass = readerMode
    ? readerFontSize === 'xlarge'
      ? 'text-lg sm:text-xl leading-loose'
      : readerFontSize === 'large'
      ? 'text-base sm:text-lg leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed'
    : '';

  const readerBodyTextClass = readerMode
    ? readerFontSize === 'xlarge'
      ? 'text-base sm:text-xl leading-loose text-stone-200'
      : readerFontSize === 'large'
      ? 'text-sm sm:text-lg leading-relaxed text-stone-200'
      : 'text-sm sm:text-base leading-relaxed text-stone-200'
    : 'text-sm sm:text-base text-stone-300 leading-relaxed';

  return (
    <article
      data-reading-container="true"
      data-total-minutes={readingStats.minutes}
      data-word-count={readingStats.wordCount}
      className={`mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 transition-all duration-300 ${
        readerMode ? 'max-w-3xl' : 'max-w-4xl lg:px-8 animate-in fade-in duration-200'
      }`}
    >
      {/* Offline Reference Print Header (only visible on printed paper) */}
      <div className="print-only border-b-2 border-stone-800 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-rose-700">
              Beauty Tips by Abbas · Clinical & Botanical Skincare Reference Guide
            </div>
            <div className="text-sm font-serif italic text-stone-600">
              Curated by Abbas · Formulation & Skin Barrier Specialist
            </div>
          </div>
          <div className="text-right text-[10px] text-stone-500">
            <div>Printed for offline reference</div>
            <div>beautytipsbyabbas.netlify.app</div>
          </div>
        </div>
      </div>

      {/* Reader Mode Sticky Control Banner */}
      {readerMode && (
        <div className="sticky top-2 z-30 p-3 sm:p-4 rounded-2xl bg-stone-900/95 backdrop-blur-md border border-rose-800/40 shadow-xl shadow-stone-950/80 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex items-center gap-2 text-xs text-stone-200">
              <span className="font-semibold text-rose-300">Reader Mode</span>
              <span className="text-stone-600">·</span>
              <span className="hidden sm:inline text-stone-400">Distraction-free environment</span>
              <span className="text-stone-600 hidden sm:inline">·</span>
              <span className="text-stone-300 font-medium">{readingStats.formatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size selectors */}
            <div className="flex items-center bg-stone-950 rounded-xl p-0.5 border border-stone-800 text-xs">
              <span className="text-[10px] text-stone-500 px-2 font-medium">Text</span>
              <button
                onClick={() => handleFontSizeChange('normal')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  readerFontSize === 'normal'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/60 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Default text size"
              >
                A
              </button>
              <button
                onClick={() => handleFontSizeChange('large')}
                className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  readerFontSize === 'large'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/60 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => handleFontSizeChange('xlarge')}
                className={`px-2.5 py-1 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                  readerFontSize === 'xlarge'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/60 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Share Guide Button in Reader Mode toolbar */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title="Share this guide via social media or copy link"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Print Guide Button in Reader Mode toolbar */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title="Print or Save as PDF for offline reference"
            >
              <Printer className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Exit Reader Mode Button */}
            <button
              onClick={toggleReaderMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-950 hover:text-rose-200 border border-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Exit Reader Mode (or press Esc)"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit Reader</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Breadcrumb navigation (only shown in standard mode) */}
      {!readerMode && (
        <nav className="flex items-center gap-2 text-xs text-stone-400 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-rose-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
          <Link to="/beauty-tips" className="hover:text-rose-300 transition-colors">
            Beauty Tips
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
          <Link to={getCategoryRoute(tip.category)} className="hover:text-rose-300 transition-colors text-rose-400/90 font-medium">
            {tip.categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
          <span className="text-stone-300 truncate max-w-[200px] sm:max-w-xs">{tip.title}</span>
        </nav>
      )}

      {/* 2. Article Header */}
      <header id="audio-intro" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={getCategoryRoute(tip.category)}
            className="px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/40 text-rose-300 text-xs font-semibold uppercase tracking-wider hover:bg-rose-900/60 transition-colors"
          >
            {tip.categoryLabel}
          </Link>
          <span
            className="text-xs text-stone-300 bg-stone-900/90 px-3 py-1 rounded-full border border-stone-800 flex items-center gap-1.5 shadow-sm"
            title={`Calculated from article content length: ${readingStats.detailed} at ~${readingStats.wpm} words/min`}
          >
            <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-medium text-stone-200">{readingStats.formatted}</span>
            <span className="text-stone-500 text-[11px] font-normal">
              ({readingStats.wordCount.toLocaleString()} words)
            </span>
          </span>
          {tip.duration && (
            <span className="text-xs text-stone-400">
              · Ritual duration: <strong className="text-stone-300 font-medium">{tip.duration}</strong>
            </span>
          )}
          {tip.suitableTime && (
            <span className="text-xs px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
              {tip.suitableTime} Routine
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 leading-[1.18] tracking-tight">
          {tip.title}
        </h1>

        <p className="text-base sm:text-lg text-rose-200/90 font-light leading-relaxed">
          {tip.shortExplanation}
        </p>

        {/* Author & Meta bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-800 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-serif font-bold">
                A
              </div>
              <div>
                <p className="text-stone-200 font-medium">Curated by Abbas</p>
                <p className="text-stone-400 text-[11px]">Skincare & Formulation Specialist</p>
              </div>
            </div>

            {/* Reading stats badge based on calculated article length */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-300 text-xs">
              <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-medium text-stone-200">{readingStats.formatted}</span>
              <span className="text-stone-500 text-[11px]">· {readingStats.wordCount.toLocaleString()} words</span>
            </div>
          </div>

          {/* Social Share & Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Reader Mode Toggle */}
            <button
              onClick={toggleReaderMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                readerMode
                  ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-950/50 ring-2 ring-rose-500/30'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-rose-500/40 hover:bg-stone-850'
              }`}
              title={
                readerMode
                  ? 'Exit Reader Mode (restore full editorial view)'
                  : 'Enable Reader Mode: strips away sidebar, ads, and related recommendations for focused reading'
              }
              aria-pressed={readerMode}
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-300" />
              <span>{readerMode ? 'Reader Active' : 'Reader Mode'}</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('article-audio-player');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-900/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition-all cursor-pointer"
              title="Listen to this article with hands-free audio narration"
            >
              <Headphones className="w-3.5 h-3.5 text-rose-400" />
              <span>Listen</span>
            </button>

            {!readerMode && (
              <button
                onClick={() => {
                  const el = document.getElementById('community-feedback');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title="Jump to reader reviews and feedback"
              >
                <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                <span>Reviews</span>
              </button>
            )}

            {!readerMode && recentHistory.some((h) => h.tipId !== tip.id) && (
              <button
                onClick={() => {
                  const el = document.getElementById('recent-reading-trail');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title="Jump to articles you previously visited"
              >
                <History className="w-3.5 h-3.5 text-rose-400" />
                <span>History</span>
              </button>
            )}

            <button
              onClick={() => onToggleFavorite(tip.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isFav
                  ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
              }`}
              title={isFav ? 'Remove from saved vault' : 'Save article'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-400' : ''}`} />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>

            {!readerMode && (
              <>
                {/* Share Trigger Button */}
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:border-rose-500/50 text-stone-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                  title="Share article via social media or copy link"
                >
                  <Share2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Share</span>
                </button>

                {/* Direct Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy Article Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* WhatsApp Quick Share */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-600/50 text-stone-300 hover:text-emerald-400 transition-colors"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Print Article */}
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Print Article"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2.5 Text-to-Speech Engine Audio Player */}
      <div id="article-audio-player">
        <ArticleAudioPlayer
          tip={tip}
          faqs={getArticleFaqs(tip)}
          activeSectionId={activeAudioSectionId}
          onActiveSectionChange={setActiveAudioSectionId}
        />
      </div>

      {/* 3. Hero Visual Asset */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-stone-900 border border-stone-800 shadow-xl">
        <img
          src={bannerImg}
          alt={tip.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-stone-300">
          <span className="font-serif italic">Beauty Tips by Abbas Editorial Collection</span>
          <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px]">
            Suitable for: {tip.skinTypes.join(', ')} skin
          </span>
        </div>
      </div>

      {/* 4. Main Educational Body */}
      <div className={`space-y-8 text-stone-300 font-normal transition-all duration-300 ${readerFontClass}`}>
        {/* Deep Dive & Biological Rationale */}
        <section
          id="audio-rationale"
          className={`space-y-3 p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
            activeAudioSectionId === 'audio-rationale'
              ? 'bg-stone-900/90 border-rose-500/80 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/60'
              : 'bg-stone-900/50 border-stone-800/80'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-medium text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>Why This Ritual Works</span>
            </h2>
            {activeAudioSectionId === 'audio-rationale' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium border border-rose-500/30 animate-pulse">
                <Radio className="w-3 h-3 text-rose-400" />
                <span>Now Narrating</span>
              </span>
            )}
          </div>
          <p className={readerBodyTextClass}>
            {tip.fullDescription}
          </p>
        </section>

        {/* Routine Placement Callout */}
        <section
          id="audio-routine"
          className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
            activeAudioSectionId === 'audio-routine'
              ? 'bg-gradient-to-r from-rose-950/70 via-stone-900/90 to-stone-900/70 border-rose-500/80 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/60'
              : 'bg-gradient-to-r from-rose-950/40 via-stone-900/60 to-stone-900/40 border-rose-900/30'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-stone-200 text-sm">Regimen Placement & Order</h3>
                <p className="text-xs sm:text-sm text-stone-300">{tip.recommendedRoutine}</p>
              </div>
            </div>
            {activeAudioSectionId === 'audio-routine' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium border border-rose-500/30 animate-pulse shrink-0">
                <Radio className="w-3 h-3 text-rose-400" />
                <span>Now Narrating</span>
              </span>
            )}
          </div>
        </section>

        {/* Key Actives & Useful Ingredients */}
        {tip.usefulIngredients && tip.usefulIngredients.length > 0 && (
          <section
            id="audio-ingredients"
            className={`space-y-4 p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
              activeAudioSectionId === 'audio-ingredients'
                ? 'bg-stone-900/80 border-rose-500/80 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/60'
                : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-medium text-stone-100 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-rose-400" />
                <span>Recommended Active Ingredients</span>
              </h2>
              {activeAudioSectionId === 'audio-ingredients' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium border border-rose-500/30 animate-pulse">
                  <Radio className="w-3 h-3 text-rose-400" />
                  <span>Now Narrating</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tip.usefulIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-100">{ing}</h4>
                    <p className="text-xs text-stone-400">Target active molecule for high barrier affinity</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Step-by-Step Instructions (if provided) */}
        {tip.steps && tip.steps.length > 0 && (
          <section
            id="audio-steps"
            className={`space-y-4 p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
              activeAudioSectionId === 'audio-steps'
                ? 'bg-stone-900/80 border-rose-500/80 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/60'
                : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-medium text-stone-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-400" />
                <span>Step-by-Step Application Protocol</span>
              </h2>
              {activeAudioSectionId === 'audio-steps' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium border border-rose-500/30 animate-pulse">
                  <Radio className="w-3 h-3 text-rose-400" />
                  <span>Now Narrating</span>
                </span>
              )}
            </div>
            <div className="space-y-3">
              {tip.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-start gap-4"
                >
                  <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-medium text-stone-100 text-sm sm:text-base">{step.title}</h4>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Side-by-side Dos & Don'ts */}
        <section
          id="audio-dos-donts"
          className={`space-y-3 p-4 sm:p-5 rounded-3xl border transition-all duration-300 ${
            activeAudioSectionId === 'audio-dos-donts'
              ? 'bg-stone-900/80 border-rose-500/80 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/60'
              : 'border-transparent'
          }`}
        >
          {activeAudioSectionId === 'audio-dos-donts' && (
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium border border-rose-500/30 animate-pulse">
                <Radio className="w-3 h-3 text-rose-400" />
                <span>Now Narrating</span>
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Practices */}
            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Best Practices (Do's)</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
                {tip.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Pitfalls */}
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-rose-300 flex items-center gap-2">
                <X className="w-4 h-4 text-rose-400" />
                <span>Common Pitfalls (Don'ts)</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
                {tip.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Abbas's Signature Pro Tip Box */}
        {tip.proTip && (
          <section
            id="audio-protip"
            className={`p-6 sm:p-7 rounded-3xl border relative overflow-hidden transition-all duration-300 ${
              activeAudioSectionId === 'audio-protip'
                ? 'bg-gradient-to-r from-stone-900 via-rose-950/60 to-stone-900 border-rose-500 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/60'
                : 'bg-gradient-to-r from-stone-900 via-rose-950/30 to-stone-900 border-rose-500/30 shadow-lg'
            }`}
          >
            <div className="relative space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Abbas’s Signature Pro Tip</span>
                </div>
                {activeAudioSectionId === 'audio-protip' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium border border-rose-500/30 animate-pulse">
                    <Radio className="w-3 h-3 text-rose-400" />
                    <span>Now Narrating</span>
                  </span>
                )}
              </div>
              <p className="font-serif text-lg sm:text-xl text-stone-100 italic leading-snug">
                “{tip.proTip}”
              </p>
              <p className="text-xs text-stone-400 pt-1">
                — Abbas, Founder & Skincare Educator
              </p>
            </div>
          </section>
        )}

        {/* Clinical Precaution Note */}
        <section className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs text-stone-400 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Safety Precaution & Patch Testing</span>
          </div>
          <p className="leading-relaxed">
            Before incorporating new active concentrations or botanical extracts into your routine, perform a 24-hour patch test on your inner forearm. If you experience stinging, rash, or persistent swelling, rinse immediately with cool water and cease use. Consult a board-certified dermatologist if you suffer from severe chronic inflammatory conditions.
          </p>
        </section>

        {/* Collapsible Article FAQs */}
        {(() => {
          const faqs = getArticleFaqs(tip);
          return (
            <section
              id="audio-faqs"
              className={`p-6 sm:p-8 rounded-3xl border space-y-5 transition-all duration-300 ${
                activeAudioSectionId === 'audio-faqs'
                  ? 'bg-stone-900 border-rose-500/80 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/60'
                  : 'bg-stone-900/90 border-stone-800'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-100">
                      Frequently Asked Questions
                    </h3>
                    <p className="text-xs text-stone-400">
                      Practical guidance, frequency, and compatibility for this ritual.
                    </p>
                  </div>
                </div>
                {activeAudioSectionId === 'audio-faqs' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium border border-rose-500/30 animate-pulse">
                    <Radio className="w-3 h-3 text-rose-400" />
                    <span>Now Narrating</span>
                  </span>
                )}
              </div>

              <div className="space-y-3 pt-1">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-stone-800/80 bg-stone-950/60 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-stone-900/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-stone-200 text-xs sm:text-sm">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-rose-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-stone-800/60 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}
      </div>

      {/* Non-essential elements: Ads, Share Bar, Comments, Related Tips, and Recent History (hidden in Reader Mode) */}
      {!readerMode ? (
        <>
          {/* Adsterra Native In-Article Widget */}
          <div className="pt-4">
            <AdsterraNative />
          </div>

          {/* In-Article Social Share Component */}
          <ArticleShare
            tip={tip}
            articleSlug={articleSlug}
            onShowToast={onShowToast}
            variant="card"
          />

          {/* 4.5 Reader Comments & Community Feedback */}
          <CommentSection
            articleSlug={articleSlug}
            articleTitle={tip.title}
            onShowToast={onShowToast}
          />

          {/* 5. Related Articles Section */}
          {relatedTips.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
                    Continue Reading
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-0.5">
                    Related Beauty Tips
                  </h3>
                </div>
                <Link
                  to="/beauty-tips"
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                >
                  <span>All Tips</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTips.map((relTip) => (
                  <TipCard
                    key={relTip.id}
                    tip={relTip}
                    isFavorite={favorites.includes(relTip.id)}
                    onToggleFavorite={onToggleFavorite}
                    onShowToast={onShowToast}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 5.5 Reader's Recent History Trail */}
          <div id="recent-reading-trail">
            <RecentHistorySection
              history={recentHistory}
              currentTipId={tip.id}
              onRemoveItem={removeRecentHistoryItem}
              onClearAll={clearRecentHistory}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              title="Previously Explored by You"
              subtitle="Quickly return to other beauty articles and rituals you checked during your session."
            />
          </div>

          {/* Back to library navigation */}
          <div className="pt-6 text-center">
            <Link
              to="/beauty-tips"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-rose-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to All Beauty Tips</span>
            </Link>
          </div>
        </>
      ) : (
        /* Focused Reader Mode Completion Footer */
        <div className="pt-8 pb-4 text-center border-t border-stone-850/80 space-y-4 animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Ritual Complete · Finished Reading</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-medium">
              You've completed "{tip.title}"
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
              Non-essential UI was hidden for your focused reading. Exit Reader Mode anytime to browse related recommendations, recent history, or join community reviews.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Share Guide</span>
            </button>
            <button
              onClick={toggleReaderMode}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-600 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit Reader Mode</span>
            </button>
            <button
              onClick={() => onToggleFavorite(tip.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                isFav
                  ? 'bg-rose-950/80 border border-rose-700 text-rose-300'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-400' : ''}`} />
              <span>{isFav ? 'Saved in Vault' : 'Save to Vault'}</span>
            </button>
            <Link
              to="/beauty-tips"
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 text-xs font-medium transition-colors"
            >
              Browse All Tips
            </Link>
          </div>
        </div>
      )}

      {/* Interactive Social Share Modal Dialog */}
      <ArticleShare
        tip={tip}
        articleSlug={articleSlug}
        onShowToast={onShowToast}
        variant="modal"
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </article>
  );
};
