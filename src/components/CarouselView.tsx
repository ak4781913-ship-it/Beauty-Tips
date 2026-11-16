import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  CloudSun,
  Calendar,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Tag,
  Eye,
  EyeOff,
  Maximize2,
  Download,
  Camera,
  Play,
  Pause,
  ArrowUpDown,
  Columns,
  Layers,
  Filter,
  Flame,
  Check,
  RotateCcw,
  Plus,
  ShieldCheck,
  Heart,
  Droplet,
} from 'lucide-react';
import {
  SkinProgressPhoto,
  SkinAnnotation,
  DEFAULT_CONCERN_TAGS,
  getConcernTagColor,
  IMAGE_FILTERS,
  getFilterOption,
} from '../utils/progressGalleryStorage';
import { formatDisplayDate } from '../utils/dateRangeUtils';

export interface CarouselViewProps {
  photos: SkinProgressPhoto[];
  initialCategory?: string | null;
  onTakeNewPhoto: (prefillTag?: string, prefillTimeOfDay?: 'morning' | 'evening' | 'midday') => void;
  onInspectPhoto: (photo: SkinProgressPhoto) => void;
  onEditPhoto?: (photo: SkinProgressPhoto) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  onCompareWithBaseline?: (photoA: SkinProgressPhoto, photoB: SkinProgressPhoto) => void;
}

// Preset Category definitions to support categories like 'Morning', 'Evening', and specific concerns
export interface CategoryDefinition {
  id: string;
  name: string;
  type: 'routine' | 'concern' | 'stage' | 'all';
  icon: string;
  colorClass: string;
  description: string;
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'all',
    name: 'All Journey Photos',
    type: 'all',
    icon: '✨',
    colorClass: 'text-stone-300 border-stone-700 bg-stone-900',
    description: 'All recorded skin progress photos',
  },
  // Routine Time Categories
  {
    id: 'morning',
    name: 'Morning Routine',
    type: 'routine',
    icon: '☀️',
    colorClass: 'text-amber-300 border-amber-600/50 bg-amber-950/40',
    description: 'AM daylight & waking barrier assessments',
  },
  {
    id: 'evening',
    name: 'Evening Routine',
    type: 'routine',
    icon: '🌙',
    colorClass: 'text-indigo-300 border-indigo-600/50 bg-indigo-950/40',
    description: 'PM nighttime repair & wind-down checks',
  },
  {
    id: 'midday',
    name: 'Midday Check',
    type: 'routine',
    icon: '🌤️',
    colorClass: 'text-sky-300 border-sky-600/50 bg-sky-950/40',
    description: 'Sunscreen reapplication & midday shine tests',
  },
  // Specific Concerns
  {
    id: 'hydration',
    name: 'Hydration',
    type: 'concern',
    icon: '💧',
    colorClass: 'text-cyan-300 border-cyan-600/50 bg-cyan-950/40',
    description: 'Moisture retention, plumpness & barrier hydration',
  },
  {
    id: 'acne',
    name: 'Acne & Breakouts',
    type: 'concern',
    icon: '🔴',
    colorClass: 'text-rose-300 border-rose-600/50 bg-rose-950/40',
    description: 'Blemish healing, congestion & flare-up reduction',
  },
  {
    id: 'barrier',
    name: 'Barrier Recovery',
    type: 'concern',
    icon: '🛡️',
    colorClass: 'text-emerald-300 border-emerald-600/50 bg-emerald-950/40',
    description: 'Lipid repair, sensitivity resilience & calmed stinging',
  },
  {
    id: 'glow',
    name: 'Glow & Radiance',
    type: 'concern',
    icon: '✨',
    colorClass: 'text-yellow-300 border-yellow-600/50 bg-yellow-950/40',
    description: 'Skin luminosity, dewy bounce & light reflection',
  },
  {
    id: 'redness',
    name: 'Redness & Rosacea',
    type: 'concern',
    icon: '🌸',
    colorClass: 'text-pink-300 border-pink-600/50 bg-pink-950/40',
    description: 'Erythema soothing & vascular flushing management',
  },
  {
    id: 'texture',
    name: 'Texture & Bumps',
    type: 'concern',
    icon: '🪞',
    colorClass: 'text-purple-300 border-purple-600/50 bg-purple-950/40',
    description: 'Surface smoothing, pore relief & micro-relief',
  },
  {
    id: 'pigmentation',
    name: 'Dark Spots & Pigment',
    type: 'concern',
    icon: '🌘',
    colorClass: 'text-amber-300 border-amber-600/50 bg-amber-950/40',
    description: 'PIH post-acne marks & UV pigmentation fading',
  },
  {
    id: 'anti-aging',
    name: 'Fine Lines & Elasticity',
    type: 'concern',
    icon: '⏳',
    colorClass: 'text-violet-300 border-violet-600/50 bg-violet-950/40',
    description: 'Firmness, collagen support & expression softening',
  },
];

export const CarouselView: React.FC<CarouselViewProps> = ({
  photos,
  initialCategory,
  onTakeNewPhoto,
  onInspectPhoto,
  onEditPhoto,
  onShowToast,
  onCompareWithBaseline,
}) => {
  // Category selection state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [categoryFilterType, setCategoryFilterType] = useState<'all' | 'routine' | 'concern' | 'stage'>('all');

  // Chronological sorting: 'asc' = Oldest to Newest (timeline progression), 'desc' = Newest to Oldest
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Active photo index within the filtered category
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Swipe animation directional state
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);

  // Touch & Drag Gesture state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeDelta = touchStartX !== null && touchCurrentX !== null ? touchCurrentX - touchStartX : 0;

  // Standardization filter preview in carousel
  const [activeFilterId, setActiveFilterId] = useState<string>('normal');

  // Overlay toggles
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);

  // Auto-play state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3000); // 3s
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scrubber container ref for smooth auto-scrolling
  const filmstripRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Extract all custom concern tags that users might have created beyond defaults
  const customTags = useMemo(() => {
    const existing = new Set(CATEGORY_DEFINITIONS.map((c) => c.id.toLowerCase()));
    const discovered = new Set<string>();
    photos.forEach((p) => {
      p.concernTags?.forEach((t) => {
        const clean = t.toLowerCase().trim();
        if (!existing.has(clean)) {
          discovered.add(clean);
        }
      });
    });
    return Array.from(discovered);
  }, [photos]);

  // Combined full list of categories
  const allCategories = useMemo(() => {
    const list: CategoryDefinition[] = [...CATEGORY_DEFINITIONS];
    customTags.forEach((tag) => {
      list.push({
        id: tag,
        name: `#${tag}`,
        type: 'concern',
        icon: '🏷️',
        colorClass: 'text-stone-300 border-stone-700 bg-stone-900',
        description: `Custom tagged concern: #${tag}`,
      });
    });
    return list;
  }, [customTags]);

  // Helper to determine if a photo matches a given category
  const photoMatchesCategory = useCallback((photo: SkinProgressPhoto, catId: string): boolean => {
    if (catId === 'all') return true;

    const lowerCat = catId.toLowerCase();

    // 1. Time of day routine matching
    if (lowerCat === 'morning' && (photo.timeOfDay === 'morning' || photo.concernTags?.includes('morning'))) {
      return true;
    }
    if (lowerCat === 'evening' && (photo.timeOfDay === 'evening' || photo.concernTags?.includes('evening'))) {
      return true;
    }
    if (lowerCat === 'midday' && (photo.timeOfDay === 'midday' || photo.concernTags?.includes('midday'))) {
      return true;
    }

    // 2. Concern tag matching
    if (photo.concernTags?.some((t) => t.toLowerCase() === lowerCat)) {
      return true;
    }

    // 3. Stage tag matching
    if (photo.tag.toLowerCase() === lowerCat) {
      return true;
    }

    return false;
  }, []);

  // Compute photo count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allCategories.forEach((cat) => {
      counts[cat.id] = photos.filter((p) => photoMatchesCategory(p, cat.id)).length;
    });
    return counts;
  }, [allCategories, photos, photoMatchesCategory]);

  // Filtered & Chronologically Sorted Photos for current category
  const categoryPhotos = useMemo(() => {
    const filtered = photos.filter((p) => photoMatchesCategory(p, selectedCategory));

    // Sort chronologically
    return [...filtered].sort((a, b) => {
      const timeA = a.capturedAt || new Date(a.dateStr).getTime();
      const timeB = b.capturedAt || new Date(b.dateStr).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }, [photos, selectedCategory, sortOrder, photoMatchesCategory]);

  // Keep index within bounds whenever category or sort order changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, sortOrder]);

  const currentPhoto: SkinProgressPhoto | undefined = categoryPhotos[currentIndex];
  const baselinePhoto: SkinProgressPhoto | undefined = categoryPhotos[0];
  const previousPhoto: SkinProgressPhoto | undefined = currentIndex > 0 ? categoryPhotos[currentIndex - 1] : undefined;

  // Auto-scroll the thumbnail filmstrip so active item is centered
  useEffect(() => {
    if (!filmstripRef.current) return;
    const activeThumb = filmstripRef.current.children[currentIndex] as HTMLElement | undefined;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying && categoryPhotos.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext(true);
      }, playbackSpeed);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, currentIndex, categoryPhotos.length, playbackSpeed]);

  // Navigation handlers
  const handlePrev = (wrap = false) => {
    if (categoryPhotos.length === 0) return;
    setSlideDirection('prev');
    setCurrentIndex((prev) => {
      if (prev > 0) return prev - 1;
      return wrap ? categoryPhotos.length - 1 : 0;
    });
  };

  const handleNext = (wrap = false) => {
    if (categoryPhotos.length === 0) return;
    setSlideDirection('next');
    setCurrentIndex((prev) => {
      if (prev < categoryPhotos.length - 1) return prev + 1;
      return wrap ? 0 : prev;
    });
  };

  // Keyboard Navigation: Left / Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentIndex(categoryPhotos.length - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categoryPhotos.length]);

  // Touch and Mouse Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStartX(clientX);
    setTouchCurrentX(clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSwiping || touchStartX === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchCurrentX(clientX);
  };

  const handleTouchEnd = () => {
    if (!isSwiping || touchStartX === null || touchCurrentX === null) {
      setIsSwiping(false);
      setTouchStartX(null);
      setTouchCurrentX(null);
      return;
    }

    const diff = touchCurrentX - touchStartX;
    const threshold = 45; // min px to trigger swipe

    if (diff < -threshold) {
      // Swiped Left -> Advance to next photo
      handleNext();
    } else if (diff > threshold) {
      // Swiped Right -> Go to previous photo
      handlePrev();
    }

    setIsSwiping(false);
    setTouchStartX(null);
    setTouchCurrentX(null);
  };

  // Days elapsed calculation
  const getDaysDiff = (dateEarlier?: string, dateLater?: string): number => {
    if (!dateEarlier || !dateLater) return 0;
    const d1 = new Date(dateEarlier + 'T00:00:00');
    const d2 = new Date(dateLater + 'T00:00:00');
    return Math.max(0, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const daysSinceBaseline =
    currentPhoto && baselinePhoto ? getDaysDiff(baselinePhoto.dateStr, currentPhoto.dateStr) : 0;
  const daysSincePrevious =
    currentPhoto && previousPhoto ? getDaysDiff(previousPhoto.dateStr, currentPhoto.dateStr) : 0;

  // Active Category Meta
  const activeCategoryDef = allCategories.find((c) => c.id === selectedCategory) || {
    id: selectedCategory,
    name: `#${selectedCategory}`,
    type: 'concern' as const,
    icon: '🏷️',
    colorClass: 'text-rose-300 border-rose-700 bg-rose-950/40',
    description: `Photos tagged with #${selectedCategory}`,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP CATEGORY SELECTION HEADER & NAV */}
      <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="category icon">
                {activeCategoryDef.icon}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-100 flex items-center gap-2">
                <span>{activeCategoryDef.name}</span>
                <span className="text-xs font-mono font-normal text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800">
                  {categoryPhotos.length} {categoryPhotos.length === 1 ? 'Entry' : 'Entries'}
                </span>
              </h2>
            </div>
            <p className="text-xs text-stone-300 font-light">
              {activeCategoryDef.description} · Swipe left/right or use keyboard arrows (← / →) to navigate your skin evolution chronologically.
            </p>
          </div>

          {/* Quick Category Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs">
            {/* Chronological Sort Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                setSortOrder(nextOrder);
                onShowToast(
                  nextOrder === 'asc'
                    ? 'Chronological Order: Oldest to Newest'
                    : 'Reverse Chronological: Newest to Oldest',
                  'info'
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Chronological Direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-rose-400" />
              <span>{sortOrder === 'asc' ? 'Oldest ➔ Newest' : 'Newest ➔ Oldest'}</span>
            </button>

            {/* Auto-Play Toggle */}
            {categoryPhotos.length > 1 && (
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isPlaying
                    ? 'bg-rose-950 text-rose-100 border-rose-600 shadow-md animate-pulse'
                    : 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-300 hover:text-white'
                }`}
                title={isPlaying ? 'Pause Auto-Swipe' : 'Start Auto-Swipe'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                    <span>Auto-Swiping ({playbackSpeed / 1000}s)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>Auto-Play</span>
                  </>
                )}
              </button>
            )}

            {/* Take Photo in this category */}
            <button
              type="button"
              onClick={() => {
                const isTime = ['morning', 'evening', 'midday'].includes(selectedCategory);
                onTakeNewPhoto(
                  isTime ? undefined : selectedCategory !== 'all' ? selectedCategory : undefined,
                  isTime ? (selectedCategory as any) : undefined
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-rose-950/40"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Snap for #{selectedCategory === 'all' ? 'gallery' : selectedCategory}</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar: Morning, Evening, Hydration, Acne, etc. */}
        <div className="pt-2 border-t border-stone-800/80">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-rose-400" />
              <span>Category:</span>
            </span>

            {allCategories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    onShowToast(`Switched to "${cat.name}" category (${count} photos)`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md font-bold scale-[1.02]'
                      : count > 0
                        ? 'bg-stone-950 hover:bg-stone-800 text-stone-300 border-stone-800 hover:text-white'
                        : 'bg-stone-950/40 text-stone-500 border-stone-850 hover:text-stone-400'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-rose-700 text-rose-100 font-bold'
                        : 'bg-stone-900 text-stone-400 border border-stone-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN CAROUSEL STAGE & EMPTY STATE */}
      {categoryPhotos.length === 0 ? (
        <div className="p-12 rounded-3xl bg-stone-900 border border-stone-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-stone-950 border border-stone-800 flex items-center justify-center mx-auto text-3xl">
            {activeCategoryDef.icon}
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-serif text-lg text-stone-200">
              No photos recorded for {activeCategoryDef.name} yet
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Start your chronologically tracked journey for this category by snapping a photo or tagging your existing timeline snapshots with{' '}
              <strong className="text-rose-300 font-medium">#{selectedCategory}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const isTime = ['morning', 'evening', 'midday'].includes(selectedCategory);
                onTakeNewPhoto(
                  isTime ? undefined : selectedCategory !== 'all' ? selectedCategory : undefined,
                  isTime ? (selectedCategory as any) : undefined
                );
              }}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950/40"
            >
              <Camera className="w-4 h-4" />
              <span>Capture First Photo in #{selectedCategory}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium cursor-pointer border border-stone-700"
            >
              View All Photos ({photos.length})
            </button>
          </div>
        </div>
      ) : (
        currentPhoto && (
          <div className="space-y-5">
            {/* Viewport Card with Floating Navigation & Swipe Handlers */}
            <div className="relative rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden shadow-2xl">
              {/* Top Viewport Toolbar */}
              <div className="p-4 sm:px-6 bg-stone-950/80 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Step indicator */}
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-rose-300 bg-rose-950/90 px-3 py-1 rounded-xl border border-rose-800/70 shadow-inner">
                    Photo {currentIndex + 1} of {categoryPhotos.length}
                  </span>

                  {/* Day milestone label */}
                  {sortOrder === 'asc' && (
                    <span className="text-xs text-stone-300 font-medium hidden sm:inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {daysSinceBaseline === 0
                          ? 'Baseline (Day 0)'
                          : `+${daysSinceBaseline} Days Elapsed (+${(daysSinceBaseline / 7).toFixed(1)} wks)`}
                      </span>
                    </span>
                  )}
                </div>

                {/* Filter and Overlay toggles */}
                <div className="flex items-center gap-2">
                  {/* Standardization filter switcher */}
                  <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-400 font-semibold px-1.5 uppercase tracking-wider hidden md:inline">
                      Filter:
                    </span>
                    {IMAGE_FILTERS.map((f) => {
                      const isSel = activeFilterId === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setActiveFilterId(f.id)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            isSel
                              ? 'bg-rose-950 text-rose-100 border border-rose-700 shadow-sm font-semibold'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                          title={f.subtitle}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Toggle Pins */}
                  {currentPhoto.annotations && currentPhoto.annotations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAnnotations((prev) => !prev)}
                      className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                        showAnnotations
                          ? 'bg-rose-950/70 border-rose-800 text-rose-200'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                      title={showAnnotations ? 'Hide Pinpoint Annotations' : 'Show Pinpoint Annotations'}
                    >
                      {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">
                        {currentPhoto.annotations.length} Pins
                      </span>
                    </button>
                  )}

                  {/* Toggle Details Panel */}
                  <button
                    type="button"
                    onClick={() => setShowDetailsPanel((prev) => !prev)}
                    className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                      showDetailsPanel
                        ? 'bg-rose-950/70 border-rose-800 text-rose-200'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                    title={showDetailsPanel ? 'Collapse Info Panel' : 'Expand Info Panel'}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Details</span>
                  </button>

                  {/* Fullscreen Inspector */}
                  <button
                    type="button"
                    onClick={() => onInspectPhoto(currentPhoto)}
                    className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Inspect Photo Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Central Viewport & Interactive Image Swiper */}
              <div
                ref={viewportRef}
                className="relative aspect-[4/5] sm:aspect-[16/10] max-h-[680px] bg-stone-950 flex items-center justify-center overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
              >
                {/* Active Image with smooth swipe drag transform */}
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
                  style={{
                    transform: isSwiping ? `translateX(${swipeDelta}px)` : 'translateX(0)',
                  }}
                >
                  <img
                    key={currentPhoto.id}
                    src={currentPhoto.dataUrl}
                    alt={`Skin Progress on ${currentPhoto.dateStr}`}
                    style={{
                      filter: getFilterOption(activeFilterId).css,
                      transition: 'filter 0.25s ease',
                    }}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />

                  {/* Interactive Annotation Pins on top of image */}
                  {showAnnotations &&
                    currentPhoto.annotations &&
                    currentPhoto.annotations.map((ann, idx) => (
                      <div
                        key={ann.id || idx}
                        style={{
                          left: `${ann.x}%`,
                          top: `${ann.y}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                      >
                        <div className="relative">
                          {/* Pulsing Pin Ring */}
                          <div className="w-6 h-6 rounded-full bg-rose-500/30 animate-ping absolute inset-0" />
                          <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                            {idx + 1}
                          </div>
                        </div>

                        {/* Hover Tooltip Card */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-30 min-w-[160px] p-2.5 rounded-xl bg-stone-950/95 border border-stone-700 text-stone-200 text-xs shadow-2xl backdrop-blur-md pointer-events-none">
                          <span className="text-[10px] uppercase font-bold text-rose-400 block pb-0.5">
                            {ann.category} Pin
                          </span>
                          <p className="font-medium leading-snug">{ann.text}</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Prominent Floating Previous Chevron Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  disabled={currentIndex === 0}
                  className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md border transition-all cursor-pointer z-30 shadow-2xl ${
                    currentIndex === 0
                      ? 'bg-stone-950/40 border-stone-850 text-stone-600 cursor-not-allowed'
                      : 'bg-stone-950/80 hover:bg-stone-900 border-stone-700 hover:border-rose-500/60 text-white hover:scale-105 active:scale-95'
                  }`}
                  aria-label="Previous chronological photo"
                  title="Previous Photo (Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Prominent Floating Next Chevron Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={currentIndex === categoryPhotos.length - 1}
                  className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md border transition-all cursor-pointer z-30 shadow-2xl ${
                    currentIndex === categoryPhotos.length - 1
                      ? 'bg-stone-950/40 border-stone-850 text-stone-600 cursor-not-allowed'
                      : 'bg-stone-950/80 hover:bg-stone-900 border-stone-700 hover:border-rose-500/60 text-white hover:scale-105 active:scale-95'
                  }`}
                  aria-label="Next chronological photo"
                  title="Next Photo (Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Top Badges overlay on image */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
                  {/* Stage Tag */}
                  <span className="px-3 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700 text-rose-300 font-semibold text-xs tracking-wide shadow-md">
                    {currentPhoto.tag}
                  </span>

                  {/* Routine Time badge */}
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-800 text-stone-300 text-[11px] font-medium flex items-center gap-1 shadow-md">
                    {currentPhoto.timeOfDay === 'morning' ? (
                      <Sun className="w-3 h-3 text-amber-400" />
                    ) : currentPhoto.timeOfDay === 'evening' ? (
                      <Moon className="w-3 h-3 text-indigo-400" />
                    ) : (
                      <CloudSun className="w-3 h-3 text-sky-400" />
                    )}
                    <span className="capitalize">{currentPhoto.timeOfDay}</span>
                  </span>
                </div>

                {/* Caption callout if present */}
                {currentPhoto.caption && (
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
                    <span className="px-4 py-2 rounded-2xl bg-stone-950/90 backdrop-blur-md border border-rose-500/50 text-rose-100 font-serif text-xs sm:text-sm text-center shadow-2xl max-w-lg leading-relaxed">
                      “{currentPhoto.caption}”
                    </span>
                  </div>
                )}
              </div>

              {/* 3. DETAILS & METADATA ACCORDION */}
              {showDetailsPanel && (
                <div className="p-5 sm:p-6 bg-stone-900 border-t border-stone-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Column 1: Date & Time Info */}
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-rose-400" />
                          <span>Timeline Stamp</span>
                        </span>
                        <span className="font-mono text-[11px] text-stone-400">
                          {currentPhoto.timeStr}
                        </span>
                      </div>
                      <div className="font-serif text-base text-stone-100 font-medium">
                        {formatDisplayDate(currentPhoto.dateStr, true)}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-2 pt-1 border-t border-stone-850">
                        <span>Lighting:</span>
                        <strong className="text-stone-200 capitalize">
                          {currentPhoto.lighting.replace('-', ' ')}
                        </strong>
                      </div>
                    </div>

                    {/* Column 2: Skin State & Progress Delta */}
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>Skin State & Delta</span>
                        </span>
                        <span className="text-[10px] text-emerald-300 font-semibold uppercase bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                          {currentPhoto.skinFeeling}
                        </span>
                      </div>

                      {/* Delta since baseline or previous photo */}
                      <div className="space-y-1 pt-0.5">
                        <div className="text-stone-200 text-xs">
                          {daysSinceBaseline === 0 ? (
                            <span className="text-rose-300 font-medium">
                              Initial Journey Consultation / Baseline
                            </span>
                          ) : (
                            <span>
                              <strong className="text-rose-300 font-bold">+{daysSinceBaseline} days</strong>{' '}
                              since baseline photo
                            </span>
                          )}
                        </div>
                        {previousPhoto && daysSincePrevious > 0 && (
                          <div className="text-[11px] text-stone-400">
                            +{daysSincePrevious} days since previous check-in (
                            {previousPhoto.tag})
                          </div>
                        )}
                      </div>

                      {/* Compare with Baseline button */}
                      {baselinePhoto && currentPhoto.id !== baselinePhoto.id && onCompareWithBaseline && (
                        <button
                          type="button"
                          onClick={() => onCompareWithBaseline(baselinePhoto, currentPhoto)}
                          className="mt-2 w-full px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-rose-950 border border-stone-800 hover:border-rose-700 text-stone-200 hover:text-rose-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Columns className="w-3 h-3 text-rose-400" />
                          <span>Compare vs Baseline in Split-Screen</span>
                        </button>
                      )}
                    </div>

                    {/* Column 3: Category & Concern Tags */}
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-rose-400" />
                        <span>Tagged Categories</span>
                      </span>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {currentPhoto.concernTags && currentPhoto.concernTags.length > 0 ? (
                          currentPhoto.concernTags.map((tag) => {
                            const color = getConcernTagColor(tag);
                            const isCurrentCategory = selectedCategory.toLowerCase() === tag.toLowerCase();

                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(tag);
                                  onShowToast(`Filtered carousel to #${tag}`, 'info');
                                }}
                                className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                                  isCurrentCategory
                                    ? 'bg-rose-600 text-white border-rose-500 font-bold'
                                    : `${color.bg} ${color.text} ${color.border} hover:opacity-90`
                                }`}
                                title={`Filter carousel to #${tag}`}
                              >
                                <span>#{tag}</span>
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-stone-500 italic text-[11px]">
                            No specific concern tags added
                          </span>
                        )}
                      </div>

                      {/* Routine time tag */}
                      <div className="pt-1 text-[11px] text-stone-400">
                        Routine Category:{' '}
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(currentPhoto.timeOfDay)}
                          className="text-stone-200 hover:text-rose-300 underline underline-offset-2 capitalize"
                        >
                          {currentPhoto.timeOfDay} Routine
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes observation quote if provided */}
                  {currentPhoto.notes && (
                    <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 text-stone-300 text-xs italic leading-relaxed">
                      “{currentPhoto.notes}”
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. CHRONOLOGICAL THUMBNAIL FILMSTRIP SCRUBBER */}
            <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Chronological Timeline Filmstrip ({categoryPhotos.length} entries)</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  Click any thumbnail to jump directly
                </span>
              </div>

              {/* Horizontal Scrollable Thumbnails */}
              <div
                ref={filmstripRef}
                className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
              >
                {categoryPhotos.map((photo, idx) => {
                  const isActive = idx === currentIndex;
                  const dayNum = baselinePhoto ? getDaysDiff(baselinePhoto.dateStr, photo.dateStr) : idx;

                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => {
                        setSlideDirection(idx > currentIndex ? 'next' : 'prev');
                        setCurrentIndex(idx);
                      }}
                      className={`relative shrink-0 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer text-left group ${
                        isActive
                          ? 'ring-2 ring-rose-500 scale-105 shadow-xl shadow-rose-950/50'
                          : 'opacity-70 hover:opacity-100 border border-stone-800 hover:border-stone-700'
                      }`}
                      style={{ width: '92px' }}
                      title={`Jump to ${photo.dateStr} (${photo.tag})`}
                    >
                      {/* Thumbnail Image */}
                      <div className="aspect-[4/5] bg-stone-950 relative overflow-hidden">
                        <img
                          src={photo.dataUrl}
                          alt={photo.dateStr}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                        {/* Active check indicator */}
                        {isActive && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold shadow-md">
                            ✓
                          </div>
                        )}

                        {/* Routine icon */}
                        <div className="absolute top-1.5 left-1.5 text-[10px]">
                          {photo.timeOfDay === 'morning' ? '☀️' : photo.timeOfDay === 'evening' ? '🌙' : '🌤️'}
                        </div>

                        {/* Bottom date and day offset */}
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] leading-tight">
                          <span className="font-mono text-stone-200 block text-[9px] truncate">
                            {photo.dateStr.slice(5)}
                          </span>
                          <span className="text-rose-300 font-semibold block text-[9px]">
                            {dayNum === 0 ? 'Day 0' : `+${dayNum}d`}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
