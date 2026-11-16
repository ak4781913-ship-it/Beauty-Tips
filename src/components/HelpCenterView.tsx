import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  ShieldAlert,
  Clock,
  Heart,
  Droplets,
  Layers,
  FileQuestion,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface HelpCenterProps {
  onNavigateToView: (viewId: string) => void;
  onOpenAboutContact?: (tab: 'about' | 'contact') => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

interface FaqItem {
  id: string;
  category: 'Skincare Basics' | 'Routine & Timing' | 'Ingredients & Safety' | 'Platform & Tools';
  question: string;
  answer: string;
  relatedView?: string;
  relatedViewLabel?: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Skincare Basics',
    question: 'How do I know my skin type (dry, oily, combination, sensitive)?',
    answer:
      'Perform the bare-face test: Wash your face gently with a mild cleanser and pat dry. Do not apply any products. After 30 minutes, evaluate how your skin feels: tight and flaky indicates dry skin; shiny across forehead and nose indicates combination; shiny all over indicates oily; while itching, stinging, or redness points to reactive/sensitive skin.',
    relatedView: 'analysis',
    relatedViewLabel: 'Run Skin Analysis',
  },
  {
    id: 'faq-2',
    category: 'Skincare Basics',
    question: 'How long does it take to see real results from a new skincare routine?',
    answer:
      'Skin cell turnover takes approximately 28 to 40 days. Hydration and barrier repair improvements can be felt within 1 to 2 weeks. Active ingredients targeting dark spots, fine lines, or stubborn acne (like Retinol, Vitamin C, or Azelaic Acid) require 6 to 12 weeks of consistent daily or weekly application before visible changes occur.',
    relatedView: 'posters',
    relatedViewLabel: 'View Recovery Timelines',
  },
  {
    id: 'faq-3',
    category: 'Routine & Timing',
    question: 'In what exact order should I apply my skincare products?',
    answer:
      'The golden rule is thinnest to thickest consistency: 1) Cleanser, 2) Watery Toner or Essence, 3) Treatment Serums (actives like Vitamin C, Niacinamide, Hyaluronic), 4) Eye Cream, 5) Moisturizer / Cream, 6) Sunscreen (AM only) or Facial Oil (PM only). Always wait 30-60 seconds between layers.',
    relatedView: 'posters',
    relatedViewLabel: 'View Layering Poster',
  },
  {
    id: 'faq-4',
    category: 'Routine & Timing',
    question: 'Should I wash my face with cleanser in the morning?',
    answer:
      'For dry or sensitive skin, a gentle lukewarm water splash in the morning is often sufficient and prevents barrier lipid depletion. For oily, acne-prone skin or after applying heavy PM ointments, a mild gel or foam cleanser in the morning helps remove accumulated overnight sebum.',
    relatedView: 'routines',
    relatedViewLabel: 'Build Morning Routine',
  },
  {
    id: 'faq-5',
    category: 'Ingredients & Safety',
    question: 'Can I use Vitamin C and Retinol together on the same day?',
    answer:
      'It is best to separate them by time of day: apply pure L-Ascorbic Acid (Vitamin C) in the morning for environmental antioxidant photoprotection underneath your sunscreen, and apply Retinol at night when skin repairs itself and is shielded from UV breakdown. If your skin is sensitive, alternate them on different nights.',
    relatedView: 'ingredients',
    relatedViewLabel: 'Check Ingredient Compatibility',
  },
  {
    id: 'faq-6',
    category: 'Ingredients & Safety',
    question: 'What should I do if a new product stings or burns my skin?',
    answer:
      'Immediately rinse thoroughly with cool or lukewarm water. Cease application of all chemical exfoliants (AHAs, BHAs), retinoids, and fragrance. Apply pure squalane, panthenol, or a barrier cream containing ceramides. If blistering, swelling, or hives occur, seek prompt medical attention.',
    relatedView: 'treatments',
    relatedViewLabel: 'Skin Barrier Protocol',
  },
  {
    id: 'faq-7',
    category: 'Platform & Tools',
    question: 'How do the Routine Builder and Daily Tracker work?',
    answer:
      'The Routine Builder allows you to assemble customized AM and PM steps with tailored ingredients. The Daily Tracker gives you an interactive morning and night checklist stored in your local browser so you can stay consistent each day without losing your progress.',
    relatedView: 'routines',
    relatedViewLabel: 'Go to Routine Builder',
  },
  {
    id: 'faq-8',
    category: 'Platform & Tools',
    question: 'How does Abbas AI generate skincare advice?',
    answer:
      'Abbas AI is grounded in clinical dermatological principles, barrier-first formulation science, and our curated beauty knowledge base. It delivers personalized regimen guidance across English, Urdu, Arabic, and Hindi with active safety warnings and cross-ingredient compatibility tips.',
    relatedView: 'ai',
    relatedViewLabel: 'Chat with Abbas AI',
  },
];

export const HelpCenterView: React.FC<HelpCenterProps> = ({
  onNavigateToView,
  onOpenAboutContact,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-3']);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = ['all', 'Skincare Basics', 'Routine & Timing', 'Ingredients & Safety', 'Platform & Tools'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery =
      search.trim() === '' ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-8 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Skincare Knowledge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100 tracking-tight">
            Beauty Tips Help Center & Guidance
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed font-light">
            Answers to common skincare questions, product layering hierarchies, routine tracking tutorials, and advice on barrier restoration.
          </p>

          {/* Quick Search */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics, ingredients, routine order..."
              className="w-full pl-11 pr-4 py-3 bg-stone-950/80 border border-stone-700/80 focus:border-rose-400 rounded-xl text-sm text-stone-100 placeholder-stone-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                : 'bg-stone-900/70 text-stone-400 hover:text-stone-200 border border-stone-850 hover:bg-stone-850'
            }`}
          >
            {cat === 'all' ? 'All Knowledge Topics' : cat}
          </button>
        ))}
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-stone-900/40 rounded-2xl border border-stone-850">
            <FileQuestion className="w-10 h-10 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-300 font-medium text-sm">No matching questions found</p>
            <p className="text-stone-500 text-xs mt-1">Try searching another skincare keyword or clear your query.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-stone-900/60 border border-stone-800 hover:border-stone-750 rounded-2xl overflow-hidden transition-all duration-150"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 bg-rose-950/50 border border-rose-900/40 px-2.5 py-0.5 rounded-full shrink-0">
                      {faq.category}
                    </span>
                    <span className="font-medium text-sm sm:text-base text-stone-100">{faq.question}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-800 text-stone-300 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-stone-800/60 bg-stone-950/30 text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                    <p>{faq.answer}</p>
                    {faq.relatedView && (
                      <div className="mt-4 pt-3 border-t border-stone-850 flex items-center justify-between">
                        <span className="text-xs text-stone-500">Related platform feature:</span>
                        <button
                          onClick={() => onNavigateToView(faq.relatedView!)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                        >
                          <span>{faq.relatedViewLabel || 'Explore Tool'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Access Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base text-stone-100 font-normal">Layering Cheat Sheet</h3>
            <p className="mt-1.5 text-xs text-stone-400 leading-relaxed font-light">
              Understand the precise order for essences, acids, peptides, oils, and SPF to avoid pilling and irritation.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('posters')}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-indigo-200 cursor-pointer"
          >
            <span>Open Layering Infographic</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base text-stone-100 font-normal">Active Clash Checker</h3>
            <p className="mt-1.5 text-xs text-stone-400 leading-relaxed font-light">
              Check whether your Vitamin C, Retinol, AHA/BHA, and Niacinamide can be mixed safely in the same regimen.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('ingredients')}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 cursor-pointer"
          >
            <span>Open Compatibility Matrix</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base text-stone-100 font-normal">Direct Inquiries & Feedback</h3>
            <p className="mt-1.5 text-xs text-stone-400 leading-relaxed font-light">
              Have specific questions about beauty routines, suggestions, or brand collaborations? Send us a direct inquiry.
            </p>
          </div>
          <button
            onClick={() => onOpenAboutContact && onOpenAboutContact('contact')}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 cursor-pointer"
          >
            <span>Open Contact Form</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
