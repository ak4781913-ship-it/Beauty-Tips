import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Check,
  Share2,
  Bot,
  CalendarCheck,
  X,
  FileQuestion,
  UserCheck,
} from 'lucide-react';
import { TreatmentFAQ } from '../data/treatments';

interface TreatmentCommonQuestionsProps {
  treatmentName: string;
  questions: TreatmentFAQ[];
  onAskAI?: (prompt: string) => void;
  onNavigateToView?: (viewId: string) => void;
}

export const TreatmentCommonQuestions: React.FC<TreatmentCommonQuestionsProps> = ({
  treatmentName,
  questions,
  onAskAI,
  onNavigateToView,
}) => {
  // Store expanded question indices - first item expanded by default
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const expandAll = () => {
    setExpandedIndices(questions.map((_, idx) => idx));
  };

  const collapseAll = () => {
    setExpandedIndices([]);
  };

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(questions.map((q) => q.category)))];
  }, [questions]);

  // Filter questions based on category and search query
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [questions, selectedCategory, searchQuery]);

  const handleCopyQuestion = (text: string, index: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedQuestionIndex(index);
    setTimeout(() => {
      setCopiedQuestionIndex(null);
    }, 2000);
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Suitability':
        return 'bg-blue-950/70 text-blue-300 border-blue-800/60';
      case 'Expectations':
        return 'bg-purple-950/70 text-purple-300 border-purple-800/60';
      case 'Comfort & Pain':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/60';
      case 'Safety':
        return 'bg-rose-950/70 text-rose-300 border-rose-800/60';
      case 'Cost & Sessions':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div id="treatment-common-questions" className="mt-8 pt-8 border-t border-stone-800">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-950 to-rose-900 border border-rose-800/60 flex items-center justify-center text-rose-300 shadow-sm">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-lg sm:text-xl font-semibold text-stone-100 flex items-center gap-2">
                <span>Common Questions & Pre-Booking Clarity</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                  {questions.length} FAQs
                </span>
              </h4>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
            Essential clinical answers to clarify candidate suitability, procedure comfort, expected downtime, and realistic results for <strong>{treatmentName}</strong> before you book an appointment.
          </p>
        </div>

        {/* Global Expand / Collapse Action Buttons */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-750 text-stone-300 hover:text-white border border-stone-700/60 transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
          >
            <span>Expand All</span>
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-750 text-stone-400 hover:text-stone-200 border border-stone-700/60 transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
          >
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Pre-Booking Advice Banner */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 via-stone-900/40 to-stone-950 border border-rose-900/30 flex items-start gap-3 text-xs text-stone-300">
        <UserCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-rose-200 block">
            Pre-Booking Recommendation:
          </span>
          <p className="text-stone-400 leading-relaxed">
            Review these key suitability criteria and downtime expectations. If you have questions about personal skin conditions or contraindications, make a note to raise them during your professional practitioner consultation.
          </p>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? questions.length
                : questions.filter((q) => q.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                  selectedCategory === cat
                    ? 'bg-rose-950 text-rose-200 border-rose-700 shadow-sm'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border-stone-800'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat
                      ? 'bg-rose-900/80 text-rose-200'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input Filter */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter questions..."
            className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Accordion Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-2xl bg-stone-950/40 border border-stone-800 text-stone-400 text-xs">
          <FileQuestion className="w-8 h-8 text-stone-600 mx-auto mb-2" />
          <p>No questions matched your filter or search query "{searchQuery}".</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 text-rose-400 hover:text-rose-300 font-medium underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((item) => {
            const actualIndex = questions.findIndex((q) => q.question === item.question);
            const isExpanded = expandedIndices.includes(actualIndex);
            const isCopied = copiedQuestionIndex === actualIndex;

            return (
              <div
                key={actualIndex}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-stone-950/80 border-rose-900/50 shadow-lg shadow-rose-950/20'
                    : 'bg-stone-950/40 border-stone-800/80 hover:border-stone-700/80'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleQuestion(actualIndex)}
                  className="w-full px-4 sm:px-5 py-4 text-left flex items-start justify-between gap-4 cursor-pointer group select-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-rose-400 font-serif font-bold text-sm sm:text-base shrink-0 mt-0.5">
                      Q
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-stone-200 group-hover:text-rose-200 transition-colors leading-snug block">
                        {item.question}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                        {item.category === 'Suitability' && (
                          <span className="text-[10px] text-blue-300/80 flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            Pre-Booking Check
                          </span>
                        )}
                        {item.category === 'Expectations' && (
                          <span className="text-[10px] text-purple-300/80 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Downtime & Results
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg bg-stone-800/60 border border-stone-700/50 flex items-center justify-center shrink-0 mt-0.5 text-stone-400 group-hover:text-stone-200 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-rose-400 bg-rose-950/50 border-rose-800/60' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Collapsible Answer Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-stone-850/80 bg-stone-900/30 animate-in fade-in-50 duration-150">
                    <div className="flex items-start gap-3 pl-1 sm:pl-2">
                      <span className="text-emerald-400 font-serif font-bold text-sm sm:text-base shrink-0 mt-0.5">
                        A
                      </span>
                      <div className="space-y-3 flex-1">
                        <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed font-light">
                          {item.answer}
                        </p>

                        {/* Interactive Action Ribbon inside expanded FAQ */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800/60 text-xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyQuestion(
                                `Question for practitioner regarding ${treatmentName}: "${item.question}"`,
                                actualIndex
                              );
                            }}
                            className="text-stone-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                            title="Copy question to bring to consultation"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied to clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3 h-3 text-stone-400" />
                                <span>Copy for your consultation</span>
                              </>
                            )}
                          </button>

                          {onAskAI && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAskAI(
                                  `Tell me more about this common question regarding ${treatmentName}: "${item.question}"`
                                );
                              }}
                              className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer py-1 font-medium"
                            >
                              <Bot className="w-3 h-3" />
                              <span>Ask Abbas AI about this</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
