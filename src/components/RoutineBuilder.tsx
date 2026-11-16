import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Printer,
  Bookmark,
  RotateCcw,
  Sliders,
  Check,
  ArrowRight,
  Clock,
  Layers,
  FlaskConical,
  Bot,
  Flame,
  ChevronRight,
  BookOpen,
  Plus,
  Trash2,
  PackageCheck,
  PackageOpen,
  Calendar,
  CalendarDays,
  X,
  Tag,
  AlertCircle,
  HelpCircle,
  Info,
  ExternalLink,
  CheckSquare,
  Square,
  Timer,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import {
  SKIN_TYPES,
  SKIN_CONCERNS,
  RoutineBuilderInputs,
  GeneratedRoutine,
  AvailableProduct,
  DaySchedule,
  CustomRoutineScheduleStep,
  GeneratedCustomSchedule,
  CustomRoutineBuilderInputs,
  POPULAR_SHELF_PRODUCTS,
  STORAGE_AVAILABLE_PRODUCTS,
  requestPersonalizedAiRoutine,
  requestPersonalizedAiCustomSchedule,
  generateCuratedCustomScheduleFallback,
} from '../utils/aiRoutineGenerator';
import { recordDailyActivity, toLocalDateString } from '../utils/streak';

interface RoutineBuilderProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  className?: string;
}

const STORAGE_SAVED_CUSTOM_SCHEDULE = 'beauty_saved_custom_schedule';
const STORAGE_SAVED_ROUTINE = 'beauty_saved_ai_routine';

// Default starter products if user has not yet populated their shelf
const DEFAULT_STARTER_SHELF: AvailableProduct[] = [
  {
    id: 'prod-starter-1',
    name: 'Hydrating Facial Cleanser',
    brand: 'CeraVe',
    category: 'cleanser',
    activeIngredients: 'Ceramides, Hyaluronic Acid',
  },
  {
    id: 'prod-starter-2',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'serum',
    activeIngredients: '10% Niacinamide, Zinc PCA',
  },
  {
    id: 'prod-starter-3',
    name: 'Cicaplast Baume B5+ Soothing Balm',
    brand: 'La Roche-Posay',
    category: 'moisturizer',
    activeIngredients: 'Panthenol 5%, Madecassoside',
  },
  {
    id: 'prod-starter-4',
    name: 'Relief Sun: Rice + Probiotics SPF 50+',
    brand: 'Beauty of Joseon',
    category: 'sunscreen',
    activeIngredients: 'Rice Extract, Probiotics, Broad Spectrum UV Filters',
  },
];

export const RoutineBuilder: React.FC<RoutineBuilderProps> = ({
  onShowToast,
  className = '',
}) => {
  // Mode Selection: 'custom-schedule' (Concerns + Available Products) vs 'clinical-ideal' (Fresh Formulation)
  const [builderMode, setBuilderMode] = useState<'custom-schedule' | 'clinical-ideal'>('custom-schedule');

  // Consultation Profile State
  const [skinType, setSkinType] = useState<string>('combination');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([
    'barrier-repair',
    'dark-spots',
    'dehydration',
  ]);
  const [customConcernInput, setCustomConcernInput] = useState<string>('');
  const [sensitivity, setSensitivity] = useState<'low' | 'normal' | 'high'>('normal');
  const [complexity, setComplexity] = useState<'minimalist' | 'balanced' | 'comprehensive'>('balanced');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Available Products On User's Shelf State
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AVAILABLE_PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_STARTER_SHELF;
    } catch {
      return DEFAULT_STARTER_SHELF;
    }
  });

  // New product entry form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<AvailableProduct['category']>('serum');
  const [newProdActives, setNewProdActives] = useState('');

  // Generation status & result state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<GeneratedCustomSchedule | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_CUSTOM_SCHEDULE);
      if (saved) return JSON.parse(saved);
      const fallbackRoutine = localStorage.getItem(STORAGE_SAVED_ROUTINE);
      if (fallbackRoutine) {
        const parsed = JSON.parse(fallbackRoutine);
        if (parsed.weeklySchedule) return parsed;
      }
      // Pre-seed with default clinical custom schedule so checklist and schedule are available immediately
      return generateCuratedCustomScheduleFallback({
        skinType: 'combination',
        primaryConcerns: ['barrier-repair', 'dark-spots', 'dehydration'],
        sensitivity: 'normal',
        complexity: 'balanced',
        availableProducts: DEFAULT_STARTER_SHELF,
      });
    } catch {
      return null;
    }
  });

  // Results View Tab: 'checklist' (Interactive Daily Checklist) | 'schedule' (7-Day Calendar) | 'steps' (AM/PM sequence)
  const [resultsTab, setResultsTab] = useState<'checklist' | 'schedule' | 'steps'>('checklist');
  const [stepDetailFilter, setStepDetailFilter] = useState<'both' | 'morning' | 'evening'>('both');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string>('Monday');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Daily Checklist State (Keyed to today's date YYYY-MM-DD so progress persists through the day)
  const todayDateStr = useMemo(() => toLocalDateString(), []);
  const storageChecklistKey = `beauty_routine_checklist_${todayDateStr}`;

  interface DailyChecklistData {
    completedSteps: { [stepKey: string]: boolean };
    completedTimestamps: { [stepKey: string]: string };
  }

  const [checklistRecord, setChecklistRecord] = useState<DailyChecklistData>(() => {
    try {
      const saved = localStorage.getItem(`beauty_routine_checklist_${toLocalDateString()}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load daily checklist state:', e);
    }
    return { completedSteps: {}, completedTimestamps: {} };
  });

  // Checklist View Filters & Expansions
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'morning' | 'evening'>('all');
  const [expandedRationale, setExpandedRationale] = useState<{ [stepKey: string]: boolean }>({});

  // Active step timer for cleanse or active wait times
  const [activeTimer, setActiveTimer] = useState<{
    stepKey: string;
    stepTitle: string;
    secondsTotal: number;
    secondsRemaining: number;
    isRunning: boolean;
  } | null>(null);

  // Countdown interval for active step timer
  useEffect(() => {
    if (!activeTimer || !activeTimer.isRunning) return;
    if (activeTimer.secondsRemaining <= 0) {
      onShowToast(`⏱️ Timer complete for ${activeTimer.stepTitle}! Ready for the next ritual step.`, 'success');
      setActiveTimer((prev) => (prev ? { ...prev, isRunning: false } : null));
      return;
    }

    const interval = setInterval(() => {
      setActiveTimer((prev) => {
        if (!prev || !prev.isRunning) return prev;
        if (prev.secondsRemaining <= 1) {
          onShowToast(`⏱️ Timer complete for ${prev.stepTitle}! Ready for the next ritual step.`, 'success');
          return { ...prev, secondsRemaining: 0, isRunning: false };
        }
        return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, onShowToast]);

  // Sync available products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AVAILABLE_PRODUCTS, JSON.stringify(availableProducts));
    } catch (e) {
      console.warn('Could not cache available products:', e);
    }
  }, [availableProducts]);

  // Today's Day Name for highlight in calendar
  const todayDayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }, []);

  // Set default selected calendar day to today if generated
  useEffect(() => {
    if (generatedSchedule && !selectedCalendarDay) {
      setSelectedCalendarDay(todayDayName);
    }
  }, [generatedSchedule, todayDayName]);

  // Formatted human-readable date for today's checklist header
  const formattedTodayDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Today's schedule entry from the 7-day plan
  const todayScheduleItem = useMemo(() => {
    if (!generatedSchedule?.weeklySchedule) return null;
    return (
      generatedSchedule.weeklySchedule.find(
        (d) => d.day.toLowerCase() === todayDayName.toLowerCase()
      ) || generatedSchedule.weeklySchedule[0]
    );
  }, [generatedSchedule, todayDayName]);

  // Checklist counts and percentages
  const morningTotal = generatedSchedule?.morningRoutine.length || 0;
  const eveningTotal = generatedSchedule?.eveningRoutine.length || 0;
  const totalDailySteps = morningTotal + eveningTotal;

  const morningCompletedCount = useMemo(() => {
    if (!generatedSchedule) return 0;
    return generatedSchedule.morningRoutine.filter(
      (s) => checklistRecord.completedSteps[`am-${s.stepNumber}`]
    ).length;
  }, [generatedSchedule, checklistRecord]);

  const eveningCompletedCount = useMemo(() => {
    if (!generatedSchedule) return 0;
    return generatedSchedule.eveningRoutine.filter(
      (s) => checklistRecord.completedSteps[`pm-${s.stepNumber}`]
    ).length;
  }, [generatedSchedule, checklistRecord]);

  const totalCompletedCount = morningCompletedCount + eveningCompletedCount;
  const overallPercent = totalDailySteps > 0 ? Math.round((totalCompletedCount / totalDailySteps) * 100) : 0;
  const morningPercent = morningTotal > 0 ? Math.round((morningCompletedCount / morningTotal) * 100) : 0;
  const eveningPercent = eveningTotal > 0 ? Math.round((eveningCompletedCount / eveningTotal) * 100) : 0;
  const isAllDailyStepsCompleted = totalDailySteps > 0 && totalCompletedCount === totalDailySteps;

  // Toggle individual step completed status
  const toggleStepCompletion = (
    stepKey: string,
    stepTitle: string,
    period: 'morning' | 'evening'
  ) => {
    setChecklistRecord((prev) => {
      const isCurrentlyDone = Boolean(prev.completedSteps[stepKey]);
      const nextDone = !isCurrentlyDone;

      const nextSteps = { ...prev.completedSteps, [stepKey]: nextDone };
      const nextTimestamps = { ...prev.completedTimestamps };

      if (nextDone) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        nextTimestamps[stepKey] = timeStr;
        onShowToast(`Completed ${period === 'morning' ? 'Morning' : 'Evening'} step: ${stepTitle}`, 'success');
        recordDailyActivity();

        if (generatedSchedule) {
          if (period === 'morning') {
            const allMorningDone = generatedSchedule.morningRoutine.every(
              (s) => nextSteps[`am-${s.stepNumber}`]
            );
            if (allMorningDone) {
              setTimeout(() => {
                onShowToast('☀️ Morning Ritual Complete! Barrier shielded for the day.', 'success');
              }, 250);
            }
          } else {
            const allEveningDone = generatedSchedule.eveningRoutine.every(
              (s) => nextSteps[`pm-${s.stepNumber}`]
            );
            if (allEveningDone) {
              setTimeout(() => {
                onShowToast('🌙 Evening Ritual Complete! Overnight restoration locked in.', 'success');
              }, 250);
            }
          }
        }
      } else {
        delete nextTimestamps[stepKey];
      }

      const nextData: DailyChecklistData = {
        completedSteps: nextSteps,
        completedTimestamps: nextTimestamps,
      };

      try {
        localStorage.setItem(storageChecklistKey, JSON.stringify(nextData));
      } catch (e) {
        console.warn('Could not cache daily checklist state:', e);
      }

      return nextData;
    });
  };

  // Mark all steps in a period done or reset
  const handleMarkAllPeriod = (period: 'morning' | 'evening', markDone: boolean) => {
    if (!generatedSchedule) return;
    const routine = period === 'morning' ? generatedSchedule.morningRoutine : generatedSchedule.eveningRoutine;
    const prefix = period === 'morning' ? 'am' : 'pm';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChecklistRecord((prev) => {
      const nextSteps = { ...prev.completedSteps };
      const nextTimestamps = { ...prev.completedTimestamps };

      routine.forEach((step) => {
        const key = `${prefix}-${step.stepNumber}`;
        if (markDone) {
          nextSteps[key] = true;
          if (!nextTimestamps[key]) nextTimestamps[key] = timeStr;
        } else {
          delete nextSteps[key];
          delete nextTimestamps[key];
        }
      });

      if (markDone) {
        recordDailyActivity();
        onShowToast(
          period === 'morning'
            ? 'All Morning routine steps marked complete!'
            : 'All Evening routine steps marked complete!',
          'success'
        );
      } else {
        onShowToast(
          period === 'morning'
            ? 'Morning routine checklist reset'
            : 'Evening routine checklist reset',
          'info'
        );
      }

      const nextData: DailyChecklistData = {
        completedSteps: nextSteps,
        completedTimestamps: nextTimestamps,
      };

      try {
        localStorage.setItem(storageChecklistKey, JSON.stringify(nextData));
      } catch (e) {
        console.warn('Could not cache daily checklist state:', e);
      }

      return nextData;
    });
  };

  // Reset entire day's checklist
  const handleResetDailyChecklist = () => {
    setChecklistRecord({ completedSteps: {}, completedTimestamps: {} });
    try {
      localStorage.removeItem(storageChecklistKey);
    } catch (e) {
      console.warn('Could not clear daily checklist state:', e);
    }
    onShowToast("Today's routine checklist reset for a fresh start!", 'info');
  };

  // Toggle clinical rationale expansion
  const toggleExpandRationale = (stepKey: string) => {
    setExpandedRationale((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  // Start step timer
  const handleStartStepTimer = (stepKey: string, stepTitle: string, durationMinutes: number = 1) => {
    const totalSeconds = Math.max(30, durationMinutes * 60);
    setActiveTimer({
      stepKey,
      stepTitle,
      secondsTotal: totalSeconds,
      secondsRemaining: totalSeconds,
      isRunning: true,
    });
    onShowToast(`Started ${totalSeconds}s application timer for "${stepTitle}"`, 'info');
  };

  // Toggle concern selection
  const handleToggleConcern = (concernId: string) => {
    setSelectedConcerns((prev) => {
      if (prev.includes(concernId)) {
        if (prev.length === 1 && !customConcernInput.trim()) {
          onShowToast('Please keep at least one primary concern selected.', 'info');
          return prev;
        }
        return prev.filter((id) => id !== concernId);
      }
      return [...prev, concernId];
    });
  };

  // Add custom concern
  const handleAddCustomConcern = () => {
    const clean = customConcernInput.trim();
    if (!clean) return;
    if (!selectedConcerns.includes(clean)) {
      setSelectedConcerns((prev) => [...prev, clean]);
      onShowToast(`Added custom concern: "${clean}"`, 'info');
    }
    setCustomConcernInput('');
  };

  // Add product to available shelf
  const handleAddProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newProdName.trim()) {
      onShowToast('Please enter a product name.', 'info');
      return;
    }

    const newProd: AvailableProduct = {
      id: `user-prod-${Date.now()}`,
      name: newProdName.trim(),
      brand: newProdBrand.trim() || undefined,
      category: newProdCategory,
      activeIngredients: newProdActives.trim() || undefined,
    };

    setAvailableProducts((prev) => [...prev, newProd]);
    onShowToast(`Added "${newProd.name}" to your vanity shelf!`, 'success');

    // Reset inputs
    setNewProdName('');
    setNewProdBrand('');
    setNewProdActives('');
    setIsAddingProduct(false);
  };

  // Quick-add popular product preset
  const handleQuickAddPopular = (preset: Omit<AvailableProduct, 'id'>) => {
    const exists = availableProducts.some(
      (p) => p.name.toLowerCase() === preset.name.toLowerCase()
    );
    if (exists) {
      onShowToast(`"${preset.name}" is already on your shelf.`, 'info');
      return;
    }

    const newProd: AvailableProduct = {
      ...preset,
      id: `popular-prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setAvailableProducts((prev) => [...prev, newProd]);
    onShowToast(`Added ${preset.brand ? preset.brand + ' ' : ''}${preset.name} to shelf!`, 'success');
  };

  // Remove product from shelf
  const handleRemoveProduct = (prodId: string, name: string) => {
    setAvailableProducts((prev) => prev.filter((p) => p.id !== prodId));
    onShowToast(`Removed "${name}" from vanity shelf`, 'info');
  };

  // Clear shelf
  const handleClearShelf = () => {
    if (window.confirm('Clear all products from your vanity shelf?')) {
      setAvailableProducts([]);
      onShowToast('Vanity shelf cleared', 'info');
    }
  };

  // Reset shelf to default clinical favorites
  const handleResetShelfDefaults = () => {
    setAvailableProducts(DEFAULT_STARTER_SHELF);
    onShowToast('Loaded starter clinical skincare shelf', 'info');
  };

  // Generate Custom Routine via Gemini API
  const handleGenerateCustomRoutine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!skinType) {
      onShowToast('Please select your skin type.', 'info');
      return;
    }

    if (selectedConcerns.length === 0) {
      onShowToast('Please select at least one primary skin concern.', 'info');
      return;
    }

    setIsGenerating(true);
    setIsSaved(false);

    try {
      const inputs: CustomRoutineBuilderInputs = {
        skinType,
        primaryConcerns: selectedConcerns,
        sensitivity,
        complexity,
        availableProducts,
        additionalNotes: additionalNotes.trim(),
      };

      const result = await requestPersonalizedAiCustomSchedule(inputs);
      setGeneratedSchedule(result);

      // Record daily streak activity
      recordDailyActivity();

      // Persist latest generated custom schedule
      try {
        localStorage.setItem(STORAGE_SAVED_CUSTOM_SCHEDULE, JSON.stringify(result));
      } catch (err) {
        console.error('Failed to cache custom schedule:', err);
      }

      onShowToast(
        result.isAiGenerated
          ? 'Personalized schedule generated with Gemini API!'
          : 'Personalized clinical schedule generated successfully!',
        'success'
      );

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById('generated-routine-result');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error in custom routine generation:', error);
      onShowToast('Encountered an issue formulating your schedule. Please try again.', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy full schedule summary to clipboard
  const handleCopySchedule = () => {
    if (!generatedSchedule) return;

    let text = `✨ Bespoke Skincare Schedule by Abbas\n`;
    text += `Skin Type: ${generatedSchedule.skinType.toUpperCase()} | Concerns: ${generatedSchedule.primaryConcerns.join(', ')}\n`;
    text += `Available Products Analyzed: ${generatedSchedule.availableProductsCount || availableProducts.length}\n\n`;

    text += `📋 7-DAY WEEKLY SKIN CYCLING SCHEDULE:\n`;
    generatedSchedule.weeklySchedule.forEach((day) => {
      text += `• ${day.day}: ${day.focus}\n`;
      text += `  AM: ${day.morningNotes}\n`;
      text += `  PM: ${day.eveningNotes}\n\n`;
    });

    text += `☀️ DAILY MORNING (AM) SEQUENCE:\n`;
    generatedSchedule.morningRoutine.forEach((s) => {
      text += `Step ${s.stepNumber}: ${s.title} (${s.productType})\n`;
      if (s.matchedProduct) text += `  Assigned Shelf Product: ${s.matchedProduct}\n`;
      text += `  Action: ${s.action}\n`;
      text += `  Key Actives: ${s.keyIngredients}\n\n`;
    });

    text += `🌙 DAILY EVENING (PM) SEQUENCE:\n`;
    generatedSchedule.eveningRoutine.forEach((s) => {
      text += `Step ${s.stepNumber}: ${s.title} (${s.productType})\n`;
      if (s.matchedProduct) text += `  Assigned Shelf Product: ${s.matchedProduct}\n`;
      text += `  Action: ${s.action}\n`;
      text += `  Key Actives: ${s.keyIngredients}\n\n`;
    });

    if (generatedSchedule.shelfGaps && generatedSchedule.shelfGaps.length > 0) {
      text += `⚠️ SHELF GAPS & RECOMMENDATIONS:\n`;
      generatedSchedule.shelfGaps.forEach((gap) => (text += `• ${gap}\n`));
      text += `\n`;
    }

    text += `💡 Abbas's Formulation Rule:\n"${generatedSchedule.abbasProTip}"\n`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
    onShowToast('Full skincare schedule copied to clipboard!', 'success');
  };

  // Save Schedule to personal vault
  const handleSaveToVault = () => {
    if (!generatedSchedule) return;
    try {
      localStorage.setItem(STORAGE_SAVED_CUSTOM_SCHEDULE, JSON.stringify(generatedSchedule));
      setIsSaved(true);
      onShowToast('Personalized schedule saved to your Regimen Suite!', 'favorite');
    } catch (e) {
      console.error('Failed to save schedule:', e);
    }
  };

  // Print schedule
  const handlePrintSchedule = () => {
    window.print();
  };

  // Find currently active calendar day details
  const activeDayData = useMemo(() => {
    if (!generatedSchedule?.weeklySchedule) return null;
    return (
      generatedSchedule.weeklySchedule.find(
        (d) => d.day.toLowerCase() === selectedCalendarDay.toLowerCase()
      ) || generatedSchedule.weeklySchedule[0]
    );
  }, [generatedSchedule, selectedCalendarDay]);

  return (
    <div className={`space-y-10 ${className}`}>
      {/* 1. Feature Banner & Mode Switcher */}
      <section className="rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Gemini API Skincare Architecture</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
                Generate Custom Skincare Routine & Schedule
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-light">
                Provide your stated skin concerns and current vanity shelf products. Our Gemini-powered clinical formulator maps your products into a safe, optimal AM/PM layering sequence and a 7-day active rotation schedule.
              </p>
            </div>

            {/* Shelf Badge Pill */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-300">
                <PackageCheck className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Vanity Shelf
                </span>
                <span className="text-sm font-semibold text-stone-100">
                  {availableProducts.length} {availableProducts.length === 1 ? 'Product' : 'Products'} Listed
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleGenerateCustomRoutine} className="space-y-8">
            {/* Step 1: Stated Skin Concerns (Multi-Select + Custom Input) */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-[11px] font-bold">
                    1
                  </span>
                  <span>Stated Skin Concerns to Address</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  {selectedConcerns.length} concerns selected
                </span>
              </div>

              {/* Concern buttons grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {SKIN_CONCERNS.map((concern) => {
                  const isSelected = selectedConcerns.includes(concern.id);
                  return (
                    <button
                      key={concern.id}
                      type="button"
                      onClick={() => handleToggleConcern(concern.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500/40 font-medium shadow-sm'
                          : 'bg-stone-950/60 border-stone-850 text-stone-300 hover:border-stone-700 hover:bg-stone-900'
                      }`}
                    >
                      <span className="text-xs leading-snug">{concern.label}</span>
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-rose-600 border-rose-500 text-white'
                            : 'border-stone-700 bg-stone-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom concern input */}
              <div className="flex items-center gap-2 pt-1 max-w-xl">
                <input
                  type="text"
                  value={customConcernInput}
                  onChange={(e) => setCustomConcernInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomConcern())}
                  placeholder="Add specific concern (e.g. hormonal chin breakouts, post-sun peeling, eyelid eczema)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomConcern}
                  disabled={!customConcernInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 disabled:opacity-40 text-stone-200 text-xs font-semibold cursor-pointer shrink-0"
                >
                  + Add Concern
                </button>
              </div>

              {/* Display custom concerns if any */}
              {selectedConcerns.filter((c) => !SKIN_CONCERNS.some((sc) => sc.id === c)).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 self-center">
                    Custom Added:
                  </span>
                  {selectedConcerns
                    .filter((c) => !SKIN_CONCERNS.some((sc) => sc.id === c))
                    .map((customC) => (
                      <span
                        key={customC}
                        className="px-2.5 py-1 rounded-xl bg-rose-950/60 border border-rose-700 text-rose-200 text-xs flex items-center gap-1.5"
                      >
                        <span>{customC}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleConcern(customC)}
                          className="text-stone-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Step 2: Available Products on Your Shelf (CRITICAL NEW SECTION) */}
            <div className="space-y-4 pt-4 border-t border-stone-850">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-[11px] font-bold">
                      2
                    </span>
                    <span>Your Available Vanity Shelf Products</span>
                  </label>
                  <p className="text-xs text-stone-400">
                    What products do you already own? Gemini will slot them into your daily AM/PM steps and 7-day schedule.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct((prev) => !prev)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingProduct ? 'Close Input' : 'Add Product'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetShelfDefaults}
                    className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
                    title="Load starter clinical shelf"
                  >
                    Starter Shelf
                  </button>

                  {availableProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearShelf}
                      className="p-1.5 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Clear shelf"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Add New Product Form Dropdown/Collapse */}
              {isAddingProduct && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-rose-900/60 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-850">
                    <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add a Product to Your Vanity Shelf</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-stone-400 font-medium">Product Name *</label>
                      <input
                        type="text"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. 2% BHA Liquid Exfoliant"
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-stone-400 font-medium">Brand (Optional)</label>
                      <input
                        type="text"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        placeholder="e.g. Paula's Choice"
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-stone-400 font-medium">Category *</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200"
                      >
                        <option value="cleanser">Cleanser (Water or Oil)</option>
                        <option value="toner">Toner / Hydrating Essence</option>
                        <option value="serum">Serum / Antioxidant</option>
                        <option value="exfoliant">Chemical Exfoliant (AHA/BHA)</option>
                        <option value="treatment">Treatment / Retinoid / Active</option>
                        <option value="moisturizer">Moisturizer / Cream</option>
                        <option value="sunscreen">Sunscreen / SPF</option>
                        <option value="oil">Face Oil / Balm</option>
                        <option value="mask">Overnight Mask / Slugging</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-stone-400 font-medium">Key Actives (Optional)</label>
                      <input
                        type="text"
                        value={newProdActives}
                        onChange={(e) => setNewProdActives(e.target.value)}
                        placeholder="e.g. 2% Salicylic Acid, Green Tea"
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleAddProduct()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save to Shelf</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Current Shelf Items Cards */}
              {availableProducts.length === 0 ? (
                <div className="p-6 rounded-2xl bg-stone-950/70 border border-dashed border-stone-800 text-center space-y-2">
                  <PackageOpen className="w-8 h-8 text-stone-600 mx-auto" />
                  <p className="text-xs text-stone-400">
                    Your shelf is currently empty. Add products you own or click one-click popular products below!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {availableProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between group space-y-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-900/50">
                            {prod.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(prod.id, prod.name)}
                            className="text-stone-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity"
                            title="Remove from shelf"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-semibold text-stone-100 truncate pt-0.5">
                          {prod.brand ? `${prod.brand} ` : ''}{prod.name}
                        </div>
                      </div>

                      {prod.activeIngredients && (
                        <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-850 truncate">
                          Actives: <span className="text-stone-300">{prod.activeIngredients}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Quick-Add Popular Skincare Staples Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>Quick-Add Skincare Staples to Your Shelf:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SHELF_PRODUCTS.map((preset) => {
                    const isAdded = availableProducts.some(
                      (p) => p.name.toLowerCase() === preset.name.toLowerCase()
                    );
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleQuickAddPopular(preset)}
                        disabled={isAdded}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                          isAdded
                            ? 'bg-stone-950 text-stone-500 border-stone-850 cursor-default opacity-60'
                            : 'bg-stone-900 hover:bg-stone-850 border-stone-800 hover:border-rose-700/60 text-stone-300 hover:text-white'
                        }`}
                        title={preset.activeIngredients}
                      >
                        <span>{isAdded ? '✓' : '+'}</span>
                        <span>{preset.brand ? `${preset.brand} ` : ''}{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Skin Profile & Sensitivity */}
            <div className="space-y-4 pt-4 border-t border-stone-850">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-[11px] font-bold">
                  3
                </span>
                <span>Skin Type & Sensitivity Profile</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SKIN_TYPES.map((type) => {
                  const isSelected = skinType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSkinType(type.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-950/70 border-rose-500/80 text-rose-100 ring-1 ring-rose-500/40 shadow-md'
                          : 'bg-stone-950/60 border-stone-850 hover:border-stone-700 text-stone-300 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-sm">{type.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                      </div>
                      <p className="text-xs text-stone-400 leading-snug">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Sensitivity & Complexity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                    Skin Sensitivity Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: 'Low', desc: 'Tolerant to actives' },
                      { id: 'normal', label: 'Normal', desc: 'Standard buffer' },
                      { id: 'high', label: 'High', desc: 'Gentle & reactive' },
                    ].map((sens) => {
                      const isSelected = sensitivity === sens.id;
                      return (
                        <button
                          key={sens.id}
                          type="button"
                          onClick={() => setSensitivity(sens.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500/40 font-semibold'
                              : 'bg-stone-950/60 border-stone-850 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <span className="text-xs block">{sens.label}</span>
                          <span className="text-[10px] text-stone-500 block">{sens.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                    Routine Strategy Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'minimalist', label: 'Minimalist', desc: 'Core essentials' },
                      { id: 'balanced', label: 'Skin Cycling', desc: '4-day rotation' },
                      { id: 'comprehensive', label: 'Advanced', desc: 'Active mastery' },
                    ].map((comp) => {
                      const isSelected = complexity === comp.id;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => setComplexity(comp.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500/40 font-semibold'
                              : 'bg-stone-950/60 border-stone-850 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <span className="text-xs block">{comp.label}</span>
                          <span className="text-[10px] text-stone-500 block">{comp.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Special Preferences Notes */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                  Additional Preferences (Optional)
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g., Avoid niacinamide, prefer mineral sunscreen, nursing-friendly active recommendations..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-850">
              <div className="text-xs text-stone-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Uses Gemini API to curate an exact schedule matching your stated concerns & available products.
                </span>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-950 disabled:text-rose-400 text-white font-semibold text-sm shadow-xl shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-rose-300" />
                    <span>Analyzing Products & Formulating Custom Schedule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-rose-200" />
                    <span>Generate Custom Routine & Schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Generated Results Section */}
      {generatedSchedule && (
        <section
          id="generated-routine-result"
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Top Strategy & Results Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Custom Skincare Schedule Strategy</span>
                  {generatedSchedule.isAiGenerated && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      Gemini 3.8
                    </span>
                  )}
                  {generatedSchedule.availableProductsCount !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-950 text-stone-300 border border-stone-700">
                      {generatedSchedule.availableProductsCount} Shelf Products Mapped
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
                  Tailored For {generatedSchedule.skinType.toUpperCase()} Skin
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-light">
                  {generatedSchedule.summary}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={handleSaveToVault}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSaved
                      ? 'bg-rose-950 border-rose-700 text-rose-300'
                      : 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700'
                  }`}
                  title="Save schedule to personal vault"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-rose-400' : ''}`} />
                  <span>{isSaved ? 'Saved in Vault' : 'Save Schedule'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySchedule}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy full schedule to clipboard"
                >
                  {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handlePrintSchedule}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Print or save as PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Shelf Gaps Alert (If any missing essential steps) */}
            {generatedSchedule.shelfGaps && generatedSchedule.shelfGaps.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-semibold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Vanity Shelf Gaps & Recommendations</span>
                </div>
                <ul className="space-y-1 text-stone-300 list-disc list-inside">
                  {generatedSchedule.shelfGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Clash & Conflict Warnings */}
            {generatedSchedule.productClashWarnings && generatedSchedule.productClashWarnings.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-rose-300 font-semibold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Active Layering Safeguards for Your Shelf</span>
                </div>
                <ul className="space-y-1 text-stone-300 list-disc list-inside">
                  {generatedSchedule.productClashWarnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Results Navigation Tabs: Daily Checklist vs 7-Day Schedule vs AM/PM Steps */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex flex-wrap items-center gap-2 bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setResultsTab('checklist')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  resultsTab === 'checklist'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Interactive Daily Checklist</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isAllDailyStepsCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {totalCompletedCount}/{totalDailySteps}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setResultsTab('schedule')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  resultsTab === 'schedule'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>7-Day Skincare Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => setResultsTab('steps')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  resultsTab === 'steps'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>AM & PM Step Protocols</span>
              </button>
            </div>

            {resultsTab === 'checklist' && (
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setChecklistFilter('all')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    checklistFilter === 'all'
                      ? 'bg-stone-800 border-stone-700 text-white font-medium'
                      : 'bg-stone-950 border-stone-850 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All Steps ({totalCompletedCount}/{totalDailySteps})
                </button>
                <button
                  type="button"
                  onClick={() => setChecklistFilter('morning')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
                    checklistFilter === 'morning'
                      ? 'bg-amber-950 border-amber-700 text-amber-200 font-medium'
                      : 'bg-stone-950 border-stone-850 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Morning ({morningCompletedCount}/{morningTotal})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChecklistFilter('evening')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
                    checklistFilter === 'evening'
                      ? 'bg-indigo-950 border-indigo-700 text-indigo-200 font-medium'
                      : 'bg-stone-950 border-stone-850 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span>Evening ({eveningCompletedCount}/{eveningTotal})</span>
                </button>
              </div>
            )}

            {resultsTab === 'steps' && (
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setStepDetailFilter('both')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    stepDetailFilter === 'both'
                      ? 'bg-stone-800 border-stone-700 text-white'
                      : 'bg-stone-950 border-stone-850 text-stone-400'
                  }`}
                >
                  Both Sequences
                </button>
                <button
                  type="button"
                  onClick={() => setStepDetailFilter('morning')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
                    stepDetailFilter === 'morning'
                      ? 'bg-amber-950 border-amber-700 text-amber-200'
                      : 'bg-stone-950 border-stone-850 text-stone-400'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Morning</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStepDetailFilter('evening')}
                  className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
                    stepDetailFilter === 'evening'
                      ? 'bg-indigo-950 border-indigo-700 text-indigo-200'
                      : 'bg-stone-950 border-stone-850 text-stone-400'
                  }`}
                >
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span>Evening</span>
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: INTERACTIVE DAILY CHECKLIST */}
          {resultsTab === 'checklist' && (
            <div className="space-y-6">
              {/* Daily Checklist Dashboard Banner */}
              <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-rose-400" />
                      <span>{formattedTodayDate}</span>
                      {todayScheduleItem && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-850">
                          Focus: {todayScheduleItem.focus}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-2xl font-medium text-stone-100 flex items-center gap-2.5">
                      <span>Daily Ritual Checklist</span>
                      {isAllDailyStepsCompleted && (
                        <span className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-sans">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Complete</span>
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-stone-400">
                      Check off each step as you perform your generated morning & evening routines. Your progress is saved automatically.
                    </p>
                  </div>

                  {/* Quick Reset & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleResetDailyChecklist}
                      className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Reset today's checklist"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Today</span>
                    </button>
                  </div>
                </div>

                {/* Overall Ritual Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span>Daily Completion: {totalCompletedCount} of {totalDailySteps} Steps</span>
                    </span>
                    <span className="font-mono font-bold text-rose-300">
                      {overallPercent}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-950 border border-stone-800 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        overallPercent === 100
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400'
                      }`}
                      style={{ width: `${overallPercent}%` }}
                    />
                  </div>
                </div>

                {/* Split AM vs PM Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Morning Summary Card */}
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                        <Sun className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-amber-200 block">
                          Morning Protocol
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {morningCompletedCount} of {morningTotal} steps done ({morningPercent}%)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAllPeriod('morning', morningCompletedCount < morningTotal)}
                      className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-900 border border-stone-800 text-stone-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {morningCompletedCount < morningTotal ? 'Mark All AM' : 'Reset AM'}
                    </button>
                  </div>

                  {/* Evening Summary Card */}
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                        <Moon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-indigo-200 block">
                          Evening Protocol
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {eveningCompletedCount} of {eveningTotal} steps done ({eveningPercent}%)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAllPeriod('evening', eveningCompletedCount < eveningTotal)}
                      className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-900 border border-stone-800 text-stone-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {eveningCompletedCount < eveningTotal ? 'Mark All PM' : 'Reset PM'}
                    </button>
                  </div>
                </div>

                {/* Active Application Timer Floating Card (if timer is running) */}
                {activeTimer && (
                  <div className="p-4 rounded-2xl bg-stone-950 border border-rose-500/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono font-bold text-sm">
                        <Timer className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-rose-300 block">
                          Step Application Timer: {activeTimer.stepTitle}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Wait for proper absorption or contact time before next layer
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-bold text-rose-200">
                        {Math.floor(activeTimer.secondsRemaining / 60)}:
                        {String(activeTimer.secondsRemaining % 60).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveTimer((prev) => (prev ? { ...prev, isRunning: !prev.isRunning } : null))
                        }
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs cursor-pointer"
                        title={activeTimer.isRunning ? 'Pause' : 'Resume'}
                      >
                        {activeTimer.isRunning ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTimer(null)}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white text-xs cursor-pointer"
                        title="Cancel timer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Masterclass Celebration Card (Shown when all daily steps are completed) */}
              {isAllDailyStepsCompleted && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-stone-900 to-teal-950/60 border border-emerald-500/40 shadow-xl flex items-center gap-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                    <Award className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Daily Ritual Mastered!</span>
                    </div>
                    <h4 className="font-serif text-xl font-medium text-stone-100">
                      Both Morning & Evening Protocols 100% Completed
                    </h4>
                    <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                      Your skin barrier has received full antioxidant photoprotection today and optimal lipid nourishment for overnight cellular renewal. Consistency is the true clinical secret to radiant skin.
                    </p>
                  </div>
                </div>
              )}

              {/* MORNING (AM) CHECKLIST SECTION */}
              {(checklistFilter === 'all' || checklistFilter === 'morning') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-amber-300">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <Sun className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-medium leading-none text-stone-100">
                          Morning (AM) Protocol Checklist
                        </h4>
                        <span className="text-[11px] text-amber-300/80">
                          Photoprotection & Barrier Shielding · {morningCompletedCount}/{morningTotal} Completed
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAllPeriod('morning', morningCompletedCount < morningTotal)}
                      className="text-xs text-amber-400 hover:text-amber-200 underline font-medium cursor-pointer"
                    >
                      {morningCompletedCount < morningTotal ? 'Check all AM' : 'Uncheck all AM'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {generatedSchedule.morningRoutine.map((step) => {
                      const stepKey = `am-${step.stepNumber}`;
                      const isCompleted = Boolean(checklistRecord.completedSteps[stepKey]);
                      const timestamp = checklistRecord.completedTimestamps[stepKey];
                      const isExpanded = Boolean(expandedRationale[stepKey]);

                      return (
                        <div
                          key={stepKey}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isCompleted
                              ? 'bg-stone-900/40 border-emerald-900/50 opacity-90'
                              : 'bg-stone-900/90 border-stone-800 hover:border-amber-500/40'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Interactive Checkbox Button */}
                            <button
                              type="button"
                              onClick={() => toggleStepCompletion(stepKey, step.title, 'morning')}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                                isCompleted
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-900/40 scale-105'
                                  : 'bg-stone-950 border-stone-700 text-transparent hover:border-amber-400 hover:text-amber-400/40'
                              }`}
                              aria-label={`Mark ${step.title} complete`}
                            >
                              <Check className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3] ${isCompleted ? 'text-white' : 'opacity-0'}`} />
                            </button>

                            {/* Step Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                    AM Step {step.stepNumber}
                                  </span>
                                  <h5
                                    className={`font-serif text-base font-medium transition-colors ${
                                      isCompleted ? 'text-stone-400 line-through' : 'text-stone-100'
                                    }`}
                                  >
                                    {step.title}
                                  </h5>
                                  <span className="text-[11px] text-stone-400">
                                    ({step.productType})
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {isCompleted && timestamp && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      <span>Done at {timestamp}</span>
                                    </span>
                                  )}
                                  {step.durationMinutes && (
                                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{step.durationMinutes} min</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Shelf Product Matching Callout */}
                              {step.matchedProduct && (
                                <div className="p-2 rounded-xl bg-stone-950 border border-stone-850 flex items-center gap-2 text-xs">
                                  <PackageCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="text-[10px] font-bold uppercase text-emerald-400 shrink-0">
                                    From Your Shelf:
                                  </span>
                                  <span className="font-medium text-stone-200 truncate">
                                    {step.matchedProduct}
                                  </span>
                                </div>
                              )}

                              {/* Application Action */}
                              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                                {step.action}
                              </p>

                              {/* Bottom Details Row */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-850/60 text-xs">
                                <div className="text-stone-400">
                                  <span className="text-stone-500">Key Actives:</span>{' '}
                                  <span className="text-rose-300 font-medium">{step.keyIngredients}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Step Timer Trigger */}
                                  <button
                                    type="button"
                                    onClick={() => handleStartStepTimer(stepKey, step.title, step.durationMinutes || 1)}
                                    className="px-2 py-0.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Timer className="w-3 h-3 text-rose-400" />
                                    <span>{step.durationMinutes || 1}m Timer</span>
                                  </button>

                                  {/* Rationale Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandRationale(stepKey)}
                                    className="px-2 py-0.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Info className="w-3 h-3" />
                                    <span>{isExpanded ? 'Hide Info' : 'Why it Works'}</span>
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Rationale Drawer */}
                              {isExpanded && (
                                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1 text-stone-300 animate-in fade-in duration-150">
                                  <div className="font-semibold text-rose-300">
                                    Clinical Formulation Rationale:
                                  </div>
                                  <p className="leading-relaxed italic text-stone-300">
                                    {step.whyItWorks}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EVENING (PM) CHECKLIST SECTION */}
              {(checklistFilter === 'all' || checklistFilter === 'evening') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-indigo-300">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-medium leading-none text-stone-100">
                          Evening (PM) Protocol Checklist
                        </h4>
                        <span className="text-[11px] text-indigo-300/80">
                          Cellular Renewal & Lipid Replenishment · {eveningCompletedCount}/{eveningTotal} Completed
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkAllPeriod('evening', eveningCompletedCount < eveningTotal)}
                      className="text-xs text-indigo-400 hover:text-indigo-200 underline font-medium cursor-pointer"
                    >
                      {eveningCompletedCount < eveningTotal ? 'Check all PM' : 'Uncheck all PM'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {generatedSchedule.eveningRoutine.map((step) => {
                      const stepKey = `pm-${step.stepNumber}`;
                      const isCompleted = Boolean(checklistRecord.completedSteps[stepKey]);
                      const timestamp = checklistRecord.completedTimestamps[stepKey];
                      const isExpanded = Boolean(expandedRationale[stepKey]);

                      return (
                        <div
                          key={stepKey}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isCompleted
                              ? 'bg-stone-900/40 border-emerald-900/50 opacity-90'
                              : 'bg-stone-900/90 border-stone-800 hover:border-indigo-500/40'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Interactive Checkbox Button */}
                            <button
                              type="button"
                              onClick={() => toggleStepCompletion(stepKey, step.title, 'evening')}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                                isCompleted
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-900/40 scale-105'
                                  : 'bg-stone-950 border-stone-700 text-transparent hover:border-indigo-400 hover:text-indigo-400/40'
                              }`}
                              aria-label={`Mark ${step.title} complete`}
                            >
                              <Check className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3] ${isCompleted ? 'text-white' : 'opacity-0'}`} />
                            </button>

                            {/* Step Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                    PM Step {step.stepNumber}
                                  </span>
                                  <h5
                                    className={`font-serif text-base font-medium transition-colors ${
                                      isCompleted ? 'text-stone-400 line-through' : 'text-stone-100'
                                    }`}
                                  >
                                    {step.title}
                                  </h5>
                                  <span className="text-[11px] text-stone-400">
                                    ({step.productType})
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {isCompleted && timestamp && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      <span>Done at {timestamp}</span>
                                    </span>
                                  )}
                                  {step.durationMinutes && (
                                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{step.durationMinutes} min</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Shelf Product Matching Callout */}
                              {step.matchedProduct && (
                                <div className="p-2 rounded-xl bg-stone-950 border border-stone-850 flex items-center gap-2 text-xs">
                                  <PackageCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="text-[10px] font-bold uppercase text-emerald-400 shrink-0">
                                    From Your Shelf:
                                  </span>
                                  <span className="font-medium text-stone-200 truncate">
                                    {step.matchedProduct}
                                  </span>
                                </div>
                              )}

                              {/* Application Action */}
                              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                                {step.action}
                              </p>

                              {/* Bottom Details Row */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-850/60 text-xs">
                                <div className="text-stone-400">
                                  <span className="text-stone-500">Key Actives:</span>{' '}
                                  <span className="text-rose-300 font-medium">{step.keyIngredients}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Step Timer Trigger */}
                                  <button
                                    type="button"
                                    onClick={() => handleStartStepTimer(stepKey, step.title, step.durationMinutes || 2)}
                                    className="px-2 py-0.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Timer className="w-3 h-3 text-indigo-400" />
                                    <span>{step.durationMinutes || 2}m Timer</span>
                                  </button>

                                  {/* Rationale Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandRationale(stepKey)}
                                    className="px-2 py-0.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Info className="w-3 h-3" />
                                    <span>{isExpanded ? 'Hide Info' : 'Why it Works'}</span>
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Rationale Drawer */}
                              {isExpanded && (
                                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1 text-stone-300 animate-in fade-in duration-150">
                                  <div className="font-semibold text-rose-300">
                                    Clinical Formulation Rationale:
                                  </div>
                                  <p className="leading-relaxed italic text-stone-300">
                                    {step.whyItWorks}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 7-DAY WEEKLY SKINCARE SCHEDULE */}
          {resultsTab === 'schedule' && generatedSchedule.weeklySchedule && (
            <div className="space-y-6">
              {/* Day selection calendar row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {generatedSchedule.weeklySchedule.map((day) => {
                  const isSelected = selectedCalendarDay.toLowerCase() === day.day.toLowerCase();
                  const isToday = day.day.toLowerCase() === todayDayName.toLowerCase();

                  return (
                    <button
                      key={day.day}
                      type="button"
                      onClick={() => setSelectedCalendarDay(day.day)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-rose-950/80 border-rose-500 text-white ring-1 ring-rose-500/50 shadow-lg scale-[1.02]'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs">{day.day.slice(0, 3)}</span>
                        {isToday && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold uppercase tracking-wider">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium leading-tight line-clamp-2 text-rose-300">
                        {day.focus}
                      </div>
                      <div className="text-[9px] text-stone-400 truncate">
                        {day.activeUsed || 'Barrier Rest'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Day Detail Card */}
              {activeDayData && (
                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-300 font-bold">
                        <Calendar className="w-6 h-6 text-rose-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-2xl font-medium text-stone-100">
                            {activeDayData.day}
                          </h4>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                            {activeDayData.focus}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Primary Active: <strong className="text-stone-200">{activeDayData.activeUsed || 'None (Barrier Rest)'}</strong>
                        </p>
                      </div>
                    </div>

                    {activeDayData.productsToUse && activeDayData.productsToUse.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-[10px] uppercase font-bold text-stone-400">Products for this day:</span>
                        {activeDayData.productsToUse.map((p, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-stone-950 text-stone-300 border border-stone-800 text-[11px]">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Day Plan: Morning vs Evening */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Morning Plan */}
                    <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2.5">
                      <div className="flex items-center gap-2 text-amber-300 font-semibold">
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-serif">Morning Protocol</span>
                      </div>
                      <p className="text-stone-300 leading-relaxed text-xs">
                        {activeDayData.morningNotes}
                      </p>
                    </div>

                    {/* Evening Plan */}
                    <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 space-y-2.5">
                      <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                        <Moon className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-serif">Evening Protocol</span>
                      </div>
                      <p className="text-stone-300 leading-relaxed text-xs">
                        {activeDayData.eveningNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP AM & PM SEQUENCES */}
          {resultsTab === 'steps' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Morning (AM) Sequence */}
              {(stepDetailFilter === 'both' || stepDetailFilter === 'morning') && (
                <div className={`space-y-4 ${stepDetailFilter === 'morning' ? 'lg:col-span-2' : ''}`}>
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-amber-300">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <Sun className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-medium leading-none">Morning (AM) Protocol</h4>
                        <span className="text-[11px] text-amber-400/80">Photoprotection & Barrier Shielding</span>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">
                      ~{generatedSchedule.morningRoutine.reduce((a, b) => a + (b.durationMinutes || 1), 0)} mins
                    </span>
                  </div>

                  <div className="space-y-3">
                    {generatedSchedule.morningRoutine.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800/80 hover:border-amber-500/40 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {step.stepNumber}
                            </span>
                            <div>
                              <h5 className="font-serif text-base text-stone-100 font-medium">
                                {step.title}
                              </h5>
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <span className="text-[11px] uppercase tracking-wider text-amber-400/90 font-semibold">
                                  {step.productType}
                                </span>
                                {step.frequency && (
                                  <span className="text-[10px] text-stone-400">· {step.frequency}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {step.durationMinutes && (
                              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-stone-500" />
                                <span>{step.durationMinutes} min</span>
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleStepCompletion(`am-${step.stepNumber}`, step.title, 'morning')}
                              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                checklistRecord.completedSteps[`am-${step.stepNumber}`]
                                  ? 'bg-emerald-950/80 border border-emerald-600/80 text-emerald-300'
                                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-amber-500/40'
                              }`}
                            >
                              {checklistRecord.completedSteps[`am-${step.stepNumber}`] ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Done</span>
                                </>
                              ) : (
                                <>
                                  <Square className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Check Off</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Mapped Available Product Callout */}
                        {step.matchedProduct && (
                          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850 flex items-center gap-2 text-xs">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/80">
                              From Your Shelf
                            </span>
                            <span className="font-medium text-stone-200 truncate">
                              {step.matchedProduct}
                            </span>
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                          {step.action}
                        </p>

                        <div className="pt-2 border-t border-stone-850/80 space-y-1 text-xs">
                          <div className="text-stone-400">
                            <strong className="text-stone-300 font-medium">Key Actives:</strong>{' '}
                            <span className="text-rose-200">{step.keyIngredients}</span>
                          </div>
                          <div className="text-stone-400 italic">
                            <strong className="text-stone-300 font-medium not-italic">Clinical Rationale:</strong>{' '}
                            {step.whyItWorks}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evening (PM) Sequence */}
              {(stepDetailFilter === 'both' || stepDetailFilter === 'evening') && (
                <div className={`space-y-4 ${stepDetailFilter === 'evening' ? 'lg:col-span-2' : ''}`}>
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-indigo-300">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-medium leading-none">Evening (PM) Protocol</h4>
                        <span className="text-[11px] text-indigo-400/80">Cellular Renewal & Lipid Replenishment</span>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">
                      ~{generatedSchedule.eveningRoutine.reduce((a, b) => a + (b.durationMinutes || 1), 0)} mins
                    </span>
                  </div>

                  <div className="space-y-3">
                    {generatedSchedule.eveningRoutine.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800/80 hover:border-indigo-500/40 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {step.stepNumber}
                            </span>
                            <div>
                              <h5 className="font-serif text-base text-stone-100 font-medium">
                                {step.title}
                              </h5>
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <span className="text-[11px] uppercase tracking-wider text-indigo-400/90 font-semibold">
                                  {step.productType}
                                </span>
                                {step.frequency && (
                                  <span className="text-[10px] text-stone-400">· {step.frequency}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {step.durationMinutes && (
                              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-stone-500" />
                                <span>{step.durationMinutes} min</span>
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleStepCompletion(`pm-${step.stepNumber}`, step.title, 'evening')}
                              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                checklistRecord.completedSteps[`pm-${step.stepNumber}`]
                                  ? 'bg-emerald-950/80 border border-emerald-600/80 text-emerald-300'
                                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-indigo-500/40'
                              }`}
                            >
                              {checklistRecord.completedSteps[`pm-${step.stepNumber}`] ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Done</span>
                                </>
                              ) : (
                                <>
                                  <Square className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Check Off</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Mapped Available Product Callout */}
                        {step.matchedProduct && (
                          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850 flex items-center gap-2 text-xs">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/80">
                              From Your Shelf
                            </span>
                            <span className="font-medium text-stone-200 truncate">
                              {step.matchedProduct}
                            </span>
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                          {step.action}
                        </p>

                        <div className="pt-2 border-t border-stone-850/80 space-y-1 text-xs">
                          <div className="text-stone-400">
                            <strong className="text-stone-300 font-medium">Key Actives:</strong>{' '}
                            <span className="text-rose-200">{step.keyIngredients}</span>
                          </div>
                          <div className="text-stone-400 italic">
                            <strong className="text-stone-300 font-medium not-italic">Clinical Rationale:</strong>{' '}
                            {step.whyItWorks}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Abbas's Signature Pro-Tip Card tailored to their shelf */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-stone-900 via-rose-950/40 to-stone-900 border border-rose-800/40 shadow-lg relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Abbas’s Masterclass Formulation Rule For Your Shelf</span>
              </div>
              <p className="font-serif text-lg sm:text-xl text-stone-100 italic leading-snug">
                “{generatedSchedule.abbasProTip}”
              </p>
              <p className="text-xs text-stone-400 pt-1">
                — Abbas, Founder & Clinical Skincare Educator
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
