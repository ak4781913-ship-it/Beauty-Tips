import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Check,
  Tag,
  Calendar,
  AlertCircle,
  Droplet,
  Trash2,
  Download,
  Crosshair,
  HelpCircle,
  Eye,
  Edit3,
  SlidersHorizontal,
  Wand2,
} from 'lucide-react';
import {
  SkinAnnotation,
  bakeAnnotationsToImage,
  IMAGE_FILTERS,
  ImageFilterOption,
} from '../utils/progressGalleryStorage';

interface ImageAnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  photoDateStr?: string;
  photoTimeStr?: string;
  photoTag?: string;
  initialAnnotations?: SkinAnnotation[];
  initialFilterId?: string;
  onSave: (finalDataUrl: string, annotations: SkinAnnotation[], filterId?: string) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
}

const PRESET_CONCERNS = [
  'Cheek Redness / Erythema',
  'Breakout / Active Blemish',
  'Dry Patch / Tightness',
  'Dark Spot / Pigmentation',
  'Pores & Congestion',
  'Barrier Irritation / Stinging',
  'Fine Lines / Texture',
];

const PRESET_PRODUCTS = [
  'Retinol 0.2% Night Treatment',
  '10% Niacinamide Serum',
  'Azelaic Acid 10% Suspension',
  'Ceramide Barrier Balm',
  'Salicylic Acid 2% Exfoliant',
  'SPF 50+ Mineral Sunscreen',
  'Centella / Cica Soothing Gel',
  'Vitamin C 15% Serum',
];

export const ImageAnnotationModal: React.FC<ImageAnnotationModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  photoDateStr,
  photoTimeStr,
  photoTag = 'Baseline',
  initialAnnotations = [],
  initialFilterId = 'normal',
  onSave,
  onShowToast,
}) => {
  const [annotations, setAnnotations] = useState<SkinAnnotation[]>(initialAnnotations);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

  // Standardization Filter state
  const [selectedFilterId, setSelectedFilterId] = useState<string>(initialFilterId || 'normal');
  const [isHoldingOriginal, setIsHoldingOriginal] = useState(false);
  const activeFilter = IMAGE_FILTERS.find((f) => f.id === selectedFilterId) || IMAGE_FILTERS[0];

  // New annotation drafting state
  const [category, setCategory] = useState<'concern' | 'product' | 'date' | 'note'>('concern');
  const [annotationText, setAnnotationText] = useState('');
  const [pinLocation, setPinLocation] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [bakeOption, setBakeOption] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewBurnedUrl, setPreviewBurnedUrl] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAnnotations(initialAnnotations || []);
      setAnnotationText('');
      setSelectedAnnotationId(null);
      setPreviewBurnedUrl(null);
      setShowLivePreview(false);
      setSelectedFilterId(initialFilterId || 'normal');
      setIsHoldingOriginal(false);
    }
  }, [isOpen, initialAnnotations, initialFilterId]);

  if (!isOpen) return null;

  // Handle clicking on the image preview to place/move pin
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.max(5, Math.min(95, Math.round((clickX / rect.width) * 100)));
    const yPercent = Math.max(5, Math.min(95, Math.round((clickY / rect.height) * 100)));

    if (selectedAnnotationId) {
      // Reposition currently selected annotation
      setAnnotations((prev) =>
        prev.map((ann) =>
          ann.id === selectedAnnotationId ? { ...ann, x: xPercent, y: yPercent } : ann
        )
      );
      onShowToast('Annotation marker moved to new position!', 'info');
    } else {
      // Set location for new annotation
      setPinLocation({ x: xPercent, y: yPercent });
      onShowToast(`Pin spot set (${xPercent}%, ${yPercent}%)`, 'info');
    }
  };

  // Add new annotation
  const handleAddAnnotation = () => {
    const textToAdd = annotationText.trim();
    if (!textToAdd) {
      onShowToast('Please enter annotation text or pick a preset.', 'info');
      return;
    }

    const newAnnotation: SkinAnnotation = {
      id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category,
      text: textToAdd,
      x: pinLocation.x,
      y: pinLocation.y,
      timestamp: Date.now(),
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    setAnnotationText('');
    // Auto shift next pin default location slightly so they don't overlap
    setPinLocation((prev) => ({
      x: (prev.x + 12) % 85 + 8,
      y: (prev.y + 14) % 80 + 10,
    }));
    onShowToast(`Added "${category.toUpperCase()}" annotation!`, 'success');
  };

  // Quick Add Date Stamp
  const handleAddDateStamp = () => {
    const now = new Date();
    const dateFormatted = photoDateStr || now.toISOString().split('T')[0];
    const timeFormatted = photoTimeStr || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = `📅 ${dateFormatted} · ${timeFormatted} (${photoTag})`;

    const newAnnotation: SkinAnnotation = {
      id: `ann-date-${Date.now()}`,
      category: 'date',
      text,
      x: 20,
      y: 12,
      timestamp: Date.now(),
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    onShowToast('Added Date & Stage stamp to image!', 'success');
  };

  // Delete an annotation
  const handleDeleteAnnotation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (selectedAnnotationId === id) setSelectedAnnotationId(null);
    onShowToast('Annotation removed.', 'info');
  };

  // Clear all
  const handleClearAll = () => {
    if (annotations.length === 0) return;
    if (confirm('Remove all annotations from this image?')) {
      setAnnotations([]);
      setSelectedAnnotationId(null);
      setPreviewBurnedUrl(null);
      onShowToast('All annotations cleared.', 'info');
    }
  };

  // Generate preview of baked image
  const handleGeneratePreview = async () => {
    setIsProcessing(true);
    try {
      const baked = await bakeAnnotationsToImage(imageSrc, annotations, activeFilter.css);
      setPreviewBurnedUrl(baked);
      setShowLivePreview(true);
    } catch (err) {
      console.error(err);
      onShowToast('Could not generate preview', 'info');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download directly
  const handleDownloadAnnotated = async () => {
    setIsProcessing(true);
    try {
      const baked = await bakeAnnotationsToImage(imageSrc, annotations, activeFilter.css);
      const link = document.createElement('a');
      link.href = baked;
      link.download = `skin-standardized-${activeFilter.id}-${photoDateStr || 'photo'}-${Date.now()}.jpg`;
      link.click();
      onShowToast('Standardized annotated image downloaded!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Download failed', 'info');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save changes and return to parent
  const handleSaveAndApply = async () => {
    setIsProcessing(true);
    try {
      let finalDataUrl = imageSrc;
      const hasFilter = activeFilter && activeFilter.id !== 'normal';
      if (bakeOption || hasFilter || annotations.length > 0) {
        finalDataUrl = await bakeAnnotationsToImage(imageSrc, annotations, activeFilter.css);
      }
      onSave(finalDataUrl, annotations, activeFilter.id);
      onShowToast(
        activeFilter.id !== 'normal'
          ? `Standardized with "${activeFilter.name}" and saved!`
          : bakeOption
          ? 'Annotations permanently baked onto your progress photo!'
          : 'Annotations saved to photo metadata!',
        'success'
      );
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      onShowToast('Error saving photo edits', 'info');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryTheme = (cat: SkinAnnotation['category']) => {
    switch (cat) {
      case 'concern':
        return {
          border: 'border-rose-500',
          bg: 'bg-rose-500/20 text-rose-300',
          dot: 'bg-rose-500 ring-rose-400',
          label: 'Concern',
        };
      case 'product':
        return {
          border: 'border-emerald-500',
          bg: 'bg-emerald-500/20 text-emerald-300',
          dot: 'bg-emerald-500 ring-emerald-400',
          label: 'Product',
        };
      case 'date':
        return {
          border: 'border-sky-500',
          bg: 'bg-sky-500/20 text-sky-300',
          dot: 'bg-sky-500 ring-sky-400',
          label: 'Date',
        };
      case 'note':
      default:
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-500/20 text-amber-300',
          dot: 'bg-amber-500 ring-amber-400',
          label: 'Note',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-100 flex items-center gap-2">
                <span>Annotate Skin Progress Image</span>
                <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                  {annotations.length} {annotations.length === 1 ? 'Pin' : 'Pins'}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Pinpoint skin concerns, log active products used, and stamp your consultation date directly onto the image.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2-Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
          {/* Left Column: Interactive Image Surface (7 Cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col items-center justify-center bg-stone-950/60 overflow-y-auto">
            {/* Action Bar Above Canvas */}
            <div className="w-full max-w-md flex items-center justify-between gap-2 mb-3 text-xs">
              <div className="flex items-center gap-1.5 text-stone-400">
                <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                <span>
                  {selectedAnnotationId
                    ? 'Click image to reposition selected pin'
                    : 'Click anywhere on image to place pin'}
                </span>
              </div>

              {previewBurnedUrl ? (
                <button
                  type="button"
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showLivePreview ? 'Edit Pins' : 'View Baked'}</span>
                </button>
              ) : null}
            </div>

            {/* Interactive Image Display */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 select-none shadow-2xl">
              {showLivePreview && previewBurnedUrl ? (
                <img
                  src={previewBurnedUrl}
                  alt="Baked Annotation Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  ref={imageContainerRef}
                  onClick={handleImageClick}
                  className="relative w-full h-full cursor-crosshair group"
                >
                  <img
                    src={imageSrc}
                    alt="Skin Target"
                    style={{
                      filter: isHoldingOriginal ? 'none' : activeFilter.css,
                      transition: 'filter 0.25s ease',
                    }}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Filter Indicator Badge & Hold-to-Compare on Canvas */}
                  {activeFilter.id !== 'normal' && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/20 ${activeFilter.badgeClass}`}
                      >
                        {activeFilter.name}
                      </span>
                      <button
                        type="button"
                        onMouseDown={() => setIsHoldingOriginal(true)}
                        onMouseUp={() => setIsHoldingOriginal(false)}
                        onTouchStart={() => setIsHoldingOriginal(true)}
                        onTouchEnd={() => setIsHoldingOriginal(false)}
                        className="px-2 py-0.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-stone-200 text-[10px] font-semibold border border-stone-700 backdrop-blur-md transition-colors cursor-pointer select-none shadow"
                        title="Hold down to preview unfiltered original"
                      >
                        {isHoldingOriginal ? 'Showing Raw Original' : 'Hold for Original'}
                      </button>
                    </div>
                  )}

                  {/* Render Annotations as Pins and Badges */}
                  {annotations.map((ann) => {
                    const theme = getCategoryTheme(ann.category);
                    const isSelected = selectedAnnotationId === ann.id;

                    return (
                      <div
                        key={ann.id}
                        style={{
                          left: `${ann.x}%`,
                          top: `${ann.y}%`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAnnotationId(isSelected ? null : ann.id);
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform z-20 group/pin ${
                          isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                        }`}
                      >
                        {/* Target Circle with Pulsing Glow */}
                        <div className="relative flex items-center justify-center">
                          <span
                            className={`animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-60 ${theme.dot}`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow-lg ${theme.dot}`}
                          />
                        </div>

                        {/* Callout Card Attached */}
                        <div
                          className={`absolute left-5 -top-3.5 min-w-[130px] max-w-[210px] p-2 rounded-xl bg-stone-900/95 backdrop-blur-md border ${
                            theme.border
                          } shadow-2xl pointer-events-auto transition-all ${
                            isSelected ? 'ring-2 ring-white/50 shadow-rose-950/80' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5 pb-1">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${theme.bg}`}
                            >
                              {theme.label}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAnnotation(ann.id, e)}
                              className="text-stone-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                              title="Delete annotation"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[11px] font-medium text-stone-100 leading-tight break-words">
                            {ann.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pending New Pin Indicator */}
                  {!selectedAnnotationId && (
                    <div
                      style={{
                        left: `${pinLocation.x}%`,
                        top: `${pinLocation.y}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-dashed border-rose-400 bg-rose-500/20 animate-pulse flex items-center justify-center text-[9px] text-white font-bold">
                        +
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Instruction footnote */}
            <div className="w-full max-w-md mt-3 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                <span>Tip: Click on any pin to select or reposition</span>
              </span>
              <span>Coordinates: {pinLocation.x}%, {pinLocation.y}%</span>
            </div>
          </div>

          {/* Right Column: Controls, Presets & Annotation Manager (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col space-y-5 overflow-y-auto">
            {/* 1. Skin Standardization Filter Section */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    1. Standardization Filter
                  </span>
                </div>
                {selectedFilterId !== 'normal' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFilterId('normal');
                      onShowToast('Filter reset to Original', 'info');
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    Reset to Original
                  </button>
                )}
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed">
                Standardize lighting & color casts (Grayscale, Brighten, Warm, etc.) to evaluate skin progress objectively regardless of room lighting.
              </p>

              {/* Filter grid options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-0.5">
                {IMAGE_FILTERS.map((f) => {
                  const isSelected = selectedFilterId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSelectedFilterId(f.id);
                        onShowToast(`Applied ${f.name} standardization filter`, 'info');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative overflow-hidden group ${
                        isSelected
                          ? 'bg-rose-950/50 border-rose-500 ring-1 ring-rose-500/80 text-white shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold">{f.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 line-clamp-1 leading-tight">
                        {f.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick toggle to inspect without filter */}
              {selectedFilterId !== 'normal' && (
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-stone-850 text-stone-400">
                  <span className="flex items-center gap-1">
                    <Wand2 className="w-3 h-3 text-rose-400" />
                    <span>Active: <strong className="text-stone-200">{activeFilter.name}</strong></span>
                  </span>
                  <button
                    type="button"
                    onMouseDown={() => setIsHoldingOriginal(true)}
                    onMouseUp={() => setIsHoldingOriginal(false)}
                    onTouchStart={() => setIsHoldingOriginal(true)}
                    onTouchEnd={() => setIsHoldingOriginal(false)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer select-none font-medium"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{isHoldingOriginal ? 'Viewing Original' : 'Hold to View Original'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Presets Section */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                2. Quick Add Presets
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleAddDateStamp}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-sky-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>+ Date & Stage Stamp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategory('concern');
                    setAnnotationText('Cheek Redness / Erythema');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>+ Redness</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategory('concern');
                    setAnnotationText('Breakout / Active Blemish');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>+ Breakout</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategory('product');
                    setAnnotationText('Retinol 0.2% Night Treatment');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Retinol</span>
                </button>
              </div>
            </div>

            {/* Custom Annotation Form */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                  3. Create Custom Annotation
                </span>
                <span className="text-[10px] text-stone-400">Position: {pinLocation.x}%, {pinLocation.y}%</span>
              </div>

              {/* Category Pill Buttons */}
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setCategory('concern')}
                  className={`py-1.5 px-2 rounded-xl font-semibold transition-colors cursor-pointer text-center ${
                    category === 'concern'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Concern
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('product')}
                  className={`py-1.5 px-2 rounded-xl font-semibold transition-colors cursor-pointer text-center ${
                    category === 'product'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Product
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('date')}
                  className={`py-1.5 px-2 rounded-xl font-semibold transition-colors cursor-pointer text-center ${
                    category === 'date'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Date
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('note')}
                  className={`py-1.5 px-2 rounded-xl font-semibold transition-colors cursor-pointer text-center ${
                    category === 'note'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Note
                </button>
              </div>

              {/* Category-specific suggestions chips */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  {category === 'concern'
                    ? 'Frequent Concerns:'
                    : category === 'product'
                    ? 'Common Products & Actives:'
                    : 'Suggestions:'}
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {(category === 'concern'
                    ? PRESET_CONCERNS
                    : category === 'product'
                    ? PRESET_PRODUCTS
                    : [
                        'Started new barrier moisturizer',
                        'Slight dryness around jawline',
                        'Skin looking plump and calm',
                        'Hydration level high',
                      ]
                  ).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setAnnotationText(item)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-colors cursor-pointer truncate max-w-[190px] ${
                        annotationText === item
                          ? 'bg-rose-900/60 border-rose-600 text-rose-100'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAnnotation()}
                  placeholder={
                    category === 'concern'
                      ? 'e.g. Flared cheek redness'
                      : category === 'product'
                      ? 'e.g. 5% Azelaic Acid'
                      : 'Type text annotation...'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-750 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddAnnotation}
                disabled={!annotationText.trim()}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Place Pin onto Photo</span>
              </button>
            </div>

            {/* List of Placed Annotations */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  4. Active Annotations ({annotations.length})
                </span>
                {annotations.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] text-stone-400 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {annotations.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-stone-800 text-center text-xs text-stone-400">
                  No annotations added yet. Click on the photo or pick a preset above to begin.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {annotations.map((ann) => {
                    const theme = getCategoryTheme(ann.category);
                    const isSelected = selectedAnnotationId === ann.id;

                    return (
                      <div
                        key={ann.id}
                        onClick={() => setSelectedAnnotationId(isSelected ? null : ann.id)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-stone-850 border-rose-500 ring-1 ring-rose-500'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${theme.dot}`}
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">
                              {ann.category} ({ann.x}%, {ann.y}%)
                            </span>
                            <p className="text-xs text-stone-200 truncate">{ann.text}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteAnnotation(ann.id, e)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={bakeOption}
                onChange={(e) => setBakeOption(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 bg-stone-950 border-stone-750 focus:ring-rose-500 focus:ring-offset-0"
              />
              <span>Bake annotations permanently onto image data</span>
            </label>

            {annotations.length > 0 && (
              <button
                type="button"
                onClick={handleGeneratePreview}
                className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-4 cursor-pointer"
              >
                Preview Baked Image
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={handleDownloadAnnotated}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>Download Image</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndApply}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Save Annotated Image'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
