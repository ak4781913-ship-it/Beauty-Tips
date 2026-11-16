import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Download,
  Film,
  Sliders,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Clock,
  Tag,
  Calendar,
  ArrowUpDown,
  Check,
  X,
  Share2,
  SlidersHorizontal,
  Wand2,
  Layers,
  ChevronRight,
  ChevronLeft,
  Camera,
} from 'lucide-react';
import {
  SkinProgressPhoto,
  IMAGE_FILTERS,
  getFilterOption,
  getConcernTagColor,
  DEFAULT_CONCERN_TAGS,
} from '../utils/progressGalleryStorage';
import {
  DateRangeFilter,
  DateRangePreset,
  DATE_RANGE_PRESETS,
  calculateRangeForPreset,
  isPhotoInDateRange,
  formatDateRangeSummary,
  formatDisplayDate,
} from '../utils/dateRangeUtils';
import { DateRangeSelector } from './DateRangeSelector';
import { generateSlideshowGif, GifExportResult } from '../utils/gifExport';

interface SlideshowViewProps {
  photos: SkinProgressPhoto[];
  onTakeNewPhoto: () => void;
  onInspectPhoto: (photo: SkinProgressPhoto) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
}

const SPEED_OPTIONS = [
  { label: '0.4s Fast', delay: 400, desc: 'Dynamic transformation' },
  { label: '0.7s Normal', delay: 700, desc: 'Balanced animation' },
  { label: '1.2s Steady', delay: 1200, desc: 'Clinical progression' },
  { label: '2.0s Slow', delay: 2000, desc: 'Detailed inspection' },
];

export const SlideshowView: React.FC<SlideshowViewProps> = ({
  photos,
  onTakeNewPhoto,
  onInspectPhoto,
  onShowToast,
}) => {
  // Slideshow playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(700); // ms per slide
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'chronological' | 'reverse'>('chronological'); // default: baseline to recent
  const [activeConcernFilter, setActiveConcernFilter] = useState<string | null>(null);
  const [standardizeFilterId, setStandardizeFilterId] = useState<string>('normal');
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  // Date Range Filtering state for Slideshow Playlist & GIF Export
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>({
    preset: 'all',
    startDate: '',
    endDate: '',
  });

  // Date boundaries across all photos
  const dateSorted = [...photos].sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  const availableDateMin = dateSorted[0]?.dateStr;
  const availableDateMax = dateSorted[dateSorted.length - 1]?.dateStr;

  // GIF Export Modal state
  const [isGifModalOpen, setIsGifModalOpen] = useState<boolean>(false);
  const [gifDelay, setGifDelay] = useState<number>(700);
  const [gifWatermark, setGifWatermark] = useState<boolean>(true);
  const [gifBoomerang, setGifBoomerang] = useState<boolean>(false);
  const [gifFilterId, setGifFilterId] = useState<string>('normal');
  const [gifDimensions, setGifDimensions] = useState<{ width: number; height: number; name: string }>({
    width: 480,
    height: 600,
    name: '4:5 Social Portrait',
  });
  const [isGeneratingGif, setIsGeneratingGif] = useState<boolean>(false);
  const [gifProgress, setGifProgress] = useState<{ current: number; total: number; percent: number }>({
    current: 0,
    total: 0,
    percent: 0,
  });
  const [gifResult, setGifResult] = useState<GifExportResult | null>(null);
  const cancelSignalRef = useRef<{ aborted: boolean }>({ aborted: false });

  // Filter and sort the photo playlist
  const orderedPhotos = React.useMemo(() => {
    let list = [...photos];

    // Filter by Date Range if active
    if (dateRangeFilter.preset !== 'all' || dateRangeFilter.startDate || dateRangeFilter.endDate) {
      list = list.filter((p) => isPhotoInDateRange(p.dateStr, dateRangeFilter));
    }

    // Filter by concern tag if selected
    if (activeConcernFilter && activeConcernFilter !== 'all') {
      list = list.filter((p) =>
        p.concernTags?.some((t) => t.toLowerCase() === activeConcernFilter.toLowerCase())
      );
    }

    // Sort: 'chronological' = oldest first (Baseline -> recovery), 'reverse' = newest first
    list.sort((a, b) => {
      return sortOrder === 'chronological'
        ? a.capturedAt - b.capturedAt
        : b.capturedAt - a.capturedAt;
    });

    return list;
  }, [photos, dateRangeFilter, activeConcernFilter, sortOrder]);

  // Keep currentIndex bounded
  useEffect(() => {
    if (currentIndex >= orderedPhotos.length) {
      setCurrentIndex(Math.max(0, orderedPhotos.length - 1));
    }
  }, [orderedPhotos.length, currentIndex]);

  // Auto-cycle slideshow timer
  useEffect(() => {
    if (!isPlaying || orderedPhotos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= orderedPhotos.length - 1) {
          if (isLooping) {
            return 0;
          } else {
            setIsPlaying(false);
            return prev;
          }
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, orderedPhotos.length, playbackSpeed, isLooping]);

  // Keyboard navigation (Space = play/pause, Left/Right arrow = prev/next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderedPhotos.length]);

  const handleNext = () => {
    if (orderedPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev >= orderedPhotos.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (orderedPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev <= 0 ? orderedPhotos.length - 1 : prev - 1));
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  // Distinct tags present in the user's progress library
  const availableTags = React.useMemo(() => {
    const fromPhotos = photos.flatMap((p) => p.concernTags || []);
    return Array.from(new Set([...DEFAULT_CONCERN_TAGS, ...fromPhotos]));
  }, [photos]);

  const currentPhoto = orderedPhotos[currentIndex];
  const activeStandardizeFilter = getFilterOption(standardizeFilterId);

  // Generate Animated GIF Handler
  const handleExportGif = async () => {
    if (orderedPhotos.length === 0) {
      onShowToast('Need at least 1 photo to create GIF animation', 'info');
      return;
    }

    setIsGeneratingGif(true);
    setGifResult(null);
    cancelSignalRef.current = { aborted: false };
    setGifProgress({ current: 0, total: orderedPhotos.length, percent: 0 });

    try {
      const result = await generateSlideshowGif({
        photos: orderedPhotos,
        delayMs: gifDelay,
        width: gifDimensions.width,
        height: gifDimensions.height,
        includeWatermark: gifWatermark,
        standardizeFilterId: gifFilterId !== 'normal' ? gifFilterId : undefined,
        boomerang: gifBoomerang,
        onProgress: (current, total, percent) => {
          setGifProgress({ current, total, percent });
        },
        signal: cancelSignalRef.current,
      });

      setGifResult(result);
      onShowToast('Animated skin journey GIF generated successfully!', 'success');
    } catch (err: any) {
      if (err.message?.includes('cancelled')) {
        onShowToast('GIF generation cancelled.', 'info');
      } else {
        console.error('GIF generation error:', err);
        onShowToast('Could not generate GIF. Try smaller dimensions.', 'info');
      }
    } finally {
      setIsGeneratingGif(false);
    }
  };

  const handleCancelGif = () => {
    cancelSignalRef.current.aborted = true;
    setIsGeneratingGif(false);
  };

  const handleDownloadGif = () => {
    if (!gifResult) return;
    const link = document.createElement('a');
    link.href = gifResult.url;
    link.download = `skin-journey-slideshow-${Date.now()}.gif`;
    link.click();
    onShowToast('GIF downloaded to your device!', 'success');
  };

  const handleShareGif = async () => {
    if (!gifResult) return;
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([gifResult.blob], 'skin-journey-slideshow.gif', {
          type: 'image/gif',
        });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Skin Journey Slideshow',
            text: 'Visualizing my skin progress over time!',
            files: [file],
          });
          onShowToast('Shared skin journey GIF!', 'success');
          return;
        }
      } catch (err) {
        console.warn('Native share cancelled or failed:', err);
      }
    }

    // Fallback: copy link / download
    handleDownloadGif();
  };

  // If user has zero progress photos
  if (photos.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-950/50 border border-rose-900/50 flex items-center justify-center text-rose-400 mx-auto">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-100">
            Slideshow Requires Progress Photos
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
            Take or upload your progress photos first. Once you have entries in your gallery, you can animate your skin transformation and export it as an animated GIF!
          </p>
        </div>
        <button
          onClick={onTakeNewPhoto}
          className="mt-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Take First Progress Photo</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isTheaterMode ? 'fixed inset-0 z-50 bg-stone-950 p-4 sm:p-8 overflow-y-auto' : ''}`}>
      {/* Slideshow Control Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-950/70 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-normal text-stone-100 flex items-center gap-2">
                <span>Skin Journey Animation Slideshow</span>
                <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {orderedPhotos.length} {orderedPhotos.length === 1 ? 'Frame' : 'Frames'}
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-400">
            Watch skin texture, barrier recovery, and tone evolve chronologically as an animated timeline.
          </p>
        </div>

        {/* Header Actions: GIF Export & Theater Mode */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setGifDelay(playbackSpeed);
              setGifFilterId(standardizeFilterId);
              setIsGifModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-200" />
            <span>Export Animated GIF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-2.5 rounded-2xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer"
            title={isTheaterMode ? 'Exit Theater Mode' : 'Enter Theater Mode'}
          >
            {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slideshow Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Slideshow Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Player Card */}
          <div className="relative aspect-[4/5] max-w-xl mx-auto rounded-3xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl group select-none flex items-center justify-center">
            {currentPhoto ? (
              <>
                {/* Photo Surface with Standardization Filter */}
                <img
                  src={currentPhoto.dataUrl}
                  alt={`Skin Journey Slide ${currentIndex + 1} of ${orderedPhotos.length}`}
                  style={{
                    filter: activeStandardizeFilter.css,
                    transition: 'filter 0.25s ease',
                  }}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/40 pointer-events-none" />

                {/* Overlays: Top Bar with Date & Stage Tag & Caption */}
                {showOverlays && (
                  <div className="absolute top-4 left-4 right-4 space-y-2 pointer-events-none z-10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700 text-rose-300 text-xs font-semibold shadow-lg">
                          {currentPhoto.tag} · {currentPhoto.dateStr}
                        </span>
                        {standardizeFilterId !== 'normal' && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow border border-white/20 ${activeStandardizeFilter.badgeClass}`}
                          >
                            {activeStandardizeFilter.name}
                          </span>
                        )}
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px] font-mono text-stone-300">
                        {currentIndex + 1} / {orderedPhotos.length}
                      </span>
                    </div>

                    {/* Headline Caption / Text Label */}
                    {currentPhoto.caption && (
                      <div className="pt-0.5">
                        <span className="inline-block px-3 py-1 rounded-xl bg-stone-950/90 text-rose-200 font-serif text-xs sm:text-sm border border-rose-500/40 shadow-xl backdrop-blur-md">
                          “{currentPhoto.caption}”
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Overlays: Bottom Metadata Badges */}
                {showOverlays && (
                  <div className="absolute bottom-4 left-4 right-4 space-y-2 pointer-events-none z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {currentPhoto.concernTags && currentPhoto.concernTags.length > 0 ? (
                          currentPhoto.concernTags.map((tag) => {
                            const color = getConcernTagColor(tag);
                            return (
                              <span
                                key={tag}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${color.border} ${color.bg} ${color.text} backdrop-blur-md`}
                              >
                                #{tag}
                              </span>
                            );
                          })
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] bg-stone-900/80 text-stone-400 border border-stone-800">
                            No tags
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-lg text-[10px] bg-stone-900/80 text-stone-300 border border-stone-800 capitalize">
                          {currentPhoto.skinFeeling} feeling
                        </span>
                      </div>

                      {currentPhoto.annotations && currentPhoto.annotations.length > 0 && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800/80 backdrop-blur-md">
                          {currentPhoto.annotations.length} Pins Annotated
                        </span>
                      )}
                    </div>

                    {currentPhoto.notes && (
                      <p className="text-xs text-stone-200 line-clamp-1 italic bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-850 backdrop-blur-md">
                        “{currentPhoto.notes}”
                      </p>
                    )}
                  </div>
                )}

                {/* On-Hover Quick Play/Pause Big Center Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px] cursor-pointer"
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  <div className="w-16 h-16 rounded-full bg-stone-900/90 border border-rose-500/80 text-rose-400 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-7 h-7 fill-rose-400" /> : <Play className="w-7 h-7 fill-rose-400 ml-1" />}
                  </div>
                </button>
              </>
            ) : (
              <div className="text-center p-6 text-stone-500 text-xs">
                No matching photos found in this playlist.
              </div>
            )}
          </div>

          {/* Interactive Scrubber & Timeline Progress Bar */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
            {/* Scrubber slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>
                  Frame <strong>{currentIndex + 1}</strong> of {orderedPhotos.length}
                </span>
                <span className="font-mono text-[11px] text-stone-300">
                  {currentPhoto?.dateStr || ''}
                </span>
              </div>

              <div className="relative flex items-center group">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, orderedPhotos.length - 1)}
                  value={currentIndex}
                  onChange={(e) => {
                    setCurrentIndex(parseInt(e.target.value, 10));
                    setIsPlaying(false);
                  }}
                  className="w-full h-2 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-rose-500 border border-stone-800"
                />
              </div>

              {/* Step indicator ticks */}
              <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400 font-mono">
                <span>{sortOrder === 'chronological' ? 'Baseline Start' : 'Latest Entry'}</span>
                <span>{sortOrder === 'chronological' ? 'Latest Result' : 'Baseline Start'}</span>
              </div>
            </div>

            {/* Playback Transport Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-850">
              {/* Transport controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Return to First Slide"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Previous Frame (Left Arrow)"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/60 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Play / Pause (Spacebar)"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Animation</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Next Frame (Right Arrow)"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Loop and Overlay Toggles */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isLooping
                      ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                  title={isLooping ? 'Continuous loop active' : 'Stop after last slide'}
                >
                  <span>Loop: {isLooping ? 'On' : 'Off'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    showOverlays
                      ? 'bg-stone-800 border-stone-700 text-stone-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                  title={showOverlays ? 'Hide text overlays' : 'Show text overlays'}
                >
                  {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Configurable Speed, Tag Filtering & Standardization (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Configurable Playback Speed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Animation Cycle Speed</span>
              </label>
              <span className="text-[11px] font-mono text-rose-300">
                {(playbackSpeed / 1000).toFixed(1)}s / photo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SPEED_OPTIONS.map((opt) => {
                const isSelected = playbackSpeed === opt.delay;
                return (
                  <button
                    key={opt.delay}
                    type="button"
                    onClick={() => {
                      setPlaybackSpeed(opt.delay);
                      onShowToast(`Speed set to ${opt.label}`, 'info');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-md ring-1 ring-rose-500/70'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                    <span className="text-[9px] text-stone-400 truncate mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chronological Order / Direction */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-rose-400" />
                <span>Journey Timeline Direction</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSortOrder('chronological');
                  setCurrentIndex(0);
                  onShowToast('Slideshow ordered Baseline to Recovery', 'info');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  sortOrder === 'chronological'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-sm'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-semibold text-xs flex items-center justify-between">
                  <span>Baseline → Recent</span>
                  {sortOrder === 'chronological' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">
                  Watch improvements and recovery over time.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSortOrder('reverse');
                  setCurrentIndex(0);
                  onShowToast('Slideshow ordered Recent to Baseline', 'info');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  sortOrder === 'reverse'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-sm'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-semibold text-xs flex items-center justify-between">
                  <span>Recent → Baseline</span>
                  {sortOrder === 'reverse' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">
                  Rewind back to your starting point.
                </p>
              </button>
            </div>
          </div>

          {/* 3. Animation Date Range Filter */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>Animation Date Range</span>
              </label>
              {dateRangeFilter.preset !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    setDateRangeFilter({ preset: 'all', startDate: '', endDate: '' });
                    setCurrentIndex(0);
                    onShowToast('Slideshow reset to all dates', 'info');
                  }}
                  className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  All Time
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-400 leading-tight">
              Animate and export your transformation across specific periods (e.g. 1 month renewal or 6-month progress).
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all' as DateRangePreset, label: 'All Time' },
                { id: '30days' as DateRangePreset, label: 'Last Month' },
                { id: '3months' as DateRangePreset, label: 'Last 3 Mo' },
                { id: '6months' as DateRangePreset, label: 'Last 6 Mo' },
              ].map((p) => {
                const isSel = dateRangeFilter.preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const { startDate, endDate } = calculateRangeForPreset(p.id);
                      setDateRangeFilter({
                        preset: p.id,
                        startDate,
                        endDate,
                      });
                      setCurrentIndex(0);
                      onShowToast(
                        p.id === 'all'
                          ? 'Showing all time progress photos'
                          : `Animation filtered to ${p.label}`,
                        'info'
                      );
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                      isSel
                        ? 'bg-rose-950 text-rose-100 border-rose-600 shadow-sm font-semibold ring-1 ring-rose-500/50'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}

              <DateRangeSelector
                compact
                value={dateRangeFilter}
                onChange={(newFilter) => {
                  setDateRangeFilter(newFilter);
                  setCurrentIndex(0);
                }}
                totalPhotosCount={photos.length}
                filteredPhotosCount={orderedPhotos.length}
                availableDateMin={availableDateMin}
                availableDateMax={availableDateMax}
              />
            </div>
          </div>

          {/* 4. Concern Tag Filter for Targeted Journeys */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-400" />
                <span>Filter Playlist by Concern Tag</span>
              </label>
              {activeConcernFilter && (
                <button
                  type="button"
                  onClick={() => setActiveConcernFilter(null)}
                  className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setActiveConcernFilter(null)}
                className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer border ${
                  activeConcernFilter === null
                    ? 'bg-rose-950 text-rose-100 border-rose-700 shadow-sm font-semibold'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                All Photos ({photos.length})
              </button>

              {availableTags.map((tag) => {
                const count = photos.filter((p) =>
                  p.concernTags?.some((t) => t.toLowerCase() === tag.toLowerCase())
                ).length;
                if (count === 0) return null;
                const isSel = activeConcernFilter?.toLowerCase() === tag.toLowerCase();
                const color = getConcernTagColor(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setActiveConcernFilter(isSel ? null : tag);
                      setCurrentIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium cursor-pointer border flex items-center gap-1.5 ${
                      isSel
                        ? 'bg-rose-600 text-white border-rose-500 shadow-sm font-semibold'
                        : `${color.bg} ${color.text} ${color.border} hover:opacity-90`
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-white' : color.dot}`} />
                    <span>#{tag}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Live Standardization Lighting Filter */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                <span>Standardize Animation View</span>
              </label>
              {standardizeFilterId !== 'normal' && (
                <button
                  type="button"
                  onClick={() => setStandardizeFilterId('normal')}
                  className="text-[10px] text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-400 leading-tight">
              Standardize lighting across frames (e.g. Grayscale reveals texture & bump smoothing without color bias).
            </p>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {IMAGE_FILTERS.map((f) => {
                const isSel = standardizeFilterId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setStandardizeFilterId(f.id);
                      onShowToast(`Animation filter set to ${f.name}`, 'info');
                    }}
                    className={`px-2 py-1.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSel
                        ? 'bg-rose-950/60 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/70'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="text-[11px] font-semibold truncate leading-tight">{f.name}</span>
                    <span className="text-[9px] text-stone-400 truncate">{f.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Frame Inspector Card */}
          {currentPhoto && (
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-300">
                  Current Slide Details
                </span>
                <button
                  type="button"
                  onClick={() => onInspectPhoto(currentPhoto)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Full Resolution</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-stone-400 space-y-1">
                <div>
                  Date: <strong className="text-stone-200">{currentPhoto.dateStr}</strong> at{' '}
                  <strong className="text-stone-200">{currentPhoto.timeStr}</strong>
                </div>
                <div>
                  Stage Tag: <strong className="text-stone-200">{currentPhoto.tag}</strong> · Lighting:{' '}
                  <strong className="text-stone-200 capitalize">{currentPhoto.lighting.replace('-', ' ')}</strong>
                </div>
                {currentPhoto.caption && (
                  <div className="pt-1.5 border-t border-stone-850">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">
                      Skin Concern Label / Caption:
                    </span>
                    <p className="text-xs font-serif text-rose-100 italic">
                      “{currentPhoto.caption}”
                    </p>
                  </div>
                )}
                {currentPhoto.notes && (
                  <p className="text-stone-300 italic pt-1 border-t border-stone-850">
                    “{currentPhoto.notes}”
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. ANIMATED GIF EXPORT MODAL */}
      {isGifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 sm:p-7 flex flex-col space-y-5 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950/70 border border-rose-800/60 flex items-center justify-center text-rose-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-100">
                    Export Skin Journey as Animated GIF
                  </h3>
                  <p className="text-xs text-stone-400">
                    Create a looping social media animation of your {orderedPhotos.length} progress photos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isGeneratingGif) handleCancelGif();
                  setIsGifModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If GIF already generated: Preview & Download Card */}
            {gifResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Animated GIF Ready for Social Sharing!</span>
                  </div>

                  {/* Rendered Animated GIF Preview */}
                  <div className="relative max-w-xs mx-auto aspect-[4/5] rounded-2xl overflow-hidden border border-stone-750 bg-stone-900 shadow-2xl">
                    <img
                      src={gifResult.url}
                      alt="Skin Journey Looping GIF"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs text-stone-400 pt-1">
                    <span>
                      Frames: <strong className="text-stone-200">{gifResult.frameCount}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Duration: <strong className="text-stone-200">{gifResult.durationSeconds.toFixed(1)}s</strong>
                    </span>
                    <span>·</span>
                    <span>
                      File Size: <strong className="text-stone-200">{gifResult.sizeFormatted}</strong>
                    </span>
                  </div>
                </div>

                {/* Download and Share Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGifResult(null)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium cursor-pointer"
                  >
                    Adjust Settings & Re-generate
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleShareGif}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-rose-400" />
                      <span>Share</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadGif}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download GIF</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* GIF Export Configuration Form */
              <div className="space-y-4">
                {/* 1. Aspect Ratio / Resolution Preset */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 block">
                    1. Social Media Size & Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { width: 480, height: 600, name: '4:5 Social Portrait', desc: 'Instagram, TikTok, Pinterest' },
                      { width: 480, height: 480, name: '1:1 Square', desc: 'Feed Grid & Profile' },
                      { width: 405, height: 720, name: '9:16 Vertical Story', desc: 'Stories, Reels & Shorts' },
                    ].map((size) => {
                      const isSel = gifDimensions.width === size.width && gifDimensions.height === size.height;
                      return (
                        <button
                          key={size.name}
                          type="button"
                          onClick={() => setGifDimensions(size)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-rose-950/60 border-rose-500 text-white ring-1 ring-rose-500/70 shadow-sm'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <span className="text-xs font-semibold block leading-tight">{size.name}</span>
                          <span className="text-[9px] text-stone-400 block truncate mt-0.5">{size.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Frame Delay / Speed */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center justify-between">
                    <span>2. Frame Duration (Playback Speed)</span>
                    <span className="font-mono text-[11px] text-rose-300">
                      {(gifDelay / 1000).toFixed(1)}s per photo
                    </span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '0.4s Fast', delay: 400 },
                      { label: '0.7s Normal', delay: 700 },
                      { label: '1.2s Steady', delay: 1200 },
                      { label: '1.8s Slow', delay: 1800 },
                    ].map((s) => (
                      <button
                        key={s.delay}
                        type="button"
                        onClick={() => setGifDelay(s.delay)}
                        className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                          gifDelay === s.delay
                            ? 'bg-rose-950/60 border-rose-500 text-white ring-1 ring-rose-500/70'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Standardization Filter for GIF */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 block">
                    3. Standardize Lighting Profile
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {IMAGE_FILTERS.map((f) => {
                      const isSel = gifFilterId === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setGifFilterId(f.id)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-rose-950/60 border-rose-500 text-white ring-1 ring-rose-500/70'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <span className="text-[11px] font-semibold block leading-tight">{f.name}</span>
                          <span className="text-[9px] text-stone-400 block truncate">{f.subtitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Toggles: Watermark & Boomerang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={gifWatermark}
                      onChange={(e) => setGifWatermark(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-rose-600 bg-stone-900 border-stone-700 focus:ring-rose-500 focus:ring-offset-0"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-stone-200 block">
                        Include Clinical Watermark
                      </span>
                      <p className="text-[10px] text-stone-400 leading-snug">
                        Stamps Date, Stage Tag, and Progress Frame badges directly on each slide for verifiable proof.
                      </p>
                    </div>
                  </label>

                  <label className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={gifBoomerang}
                      onChange={(e) => setGifBoomerang(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-rose-600 bg-stone-900 border-stone-700 focus:ring-rose-500 focus:ring-offset-0"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-stone-200 block">
                        Boomerang Effect
                      </span>
                      <p className="text-[10px] text-stone-400 leading-snug">
                        Loops forward then bounces backwards for a seamless, hypnotic social media loop.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Encoding Progress Card (when active) */}
                {isGeneratingGif && (
                  <div className="p-4 rounded-2xl bg-stone-950 border border-rose-500/40 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-rose-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering GIF: Frame {gifProgress.current} of {gifProgress.total}</span>
                      </span>
                      <span className="font-mono text-stone-300">{gifProgress.percent}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-stone-850 overflow-hidden">
                      <div
                        style={{ width: `${gifProgress.percent}%` }}
                        className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-150"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>Quantizing color palettes and packaging frames...</span>
                      <button
                        type="button"
                        onClick={handleCancelGif}
                        className="text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-400">
                    Will render {gifBoomerang ? orderedPhotos.length * 2 - 2 : orderedPhotos.length} total frames
                    {dateRangeFilter.preset !== 'all' && (
                      <span className="text-rose-300 font-medium ml-1">
                        · {formatDateRangeSummary(dateRangeFilter)}
                      </span>
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsGifModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium cursor-pointer"
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      onClick={handleExportGif}
                      disabled={isGeneratingGif || orderedPhotos.length === 0}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isGeneratingGif ? 'Rendering GIF...' : 'Generate GIF Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
