import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Sliders,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  CloudSun,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileImage,
  Layers,
  Heart,
  Plus,
  Edit3,
  Tag,
  Search,
  Hash,
  Filter,
  SlidersHorizontal,
  Wand2,
  Film,
  Columns,
  ArrowLeftRight,
  ArrowRight,
} from 'lucide-react';
import {
  SkinProgressPhoto,
  SkinAnnotation,
  DEFAULT_CONCERN_TAGS,
  getConcernTagColor,
  updatePhotoTags,
  getAllProgressPhotos,
  saveProgressPhoto,
  deleteProgressPhoto,
  clearAllProgressPhotos,
  compressImage,
  PROGRESS_GALLERY_EVENT,
  IMAGE_FILTERS,
  getFilterOption,
  bakeAnnotationsToImage,
} from '../utils/progressGalleryStorage';
import {
  DateRangeFilter,
  DateRangePreset,
  DATE_RANGE_PRESETS,
  isPhotoInDateRange,
  formatDateRangeSummary,
  calculateRangeForPreset,
  formatDisplayDate,
  getTodayDateStr,
} from '../utils/dateRangeUtils';
import { DateRangeSelector } from './DateRangeSelector';
import { ImageAnnotationModal } from './ImageAnnotationModal';
import { SlideshowView } from './SlideshowView';
import { CarouselView } from './CarouselView';

interface ProgressGalleryProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  className?: string;
}

export const ProgressGallery: React.FC<ProgressGalleryProps> = ({
  onShowToast,
  className = '',
}) => {
  const [photos, setPhotos] = useState<SkinProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active view tab: 'timeline' | 'compare' | 'carousel' | 'slideshow'
  const [activeTab, setActiveTab] = useState<'timeline' | 'compare' | 'carousel' | 'slideshow'>('timeline');
  const [carouselCategory, setCarouselCategory] = useState<string>('all');

  // Camera Capture modal
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Form fields for new photo
  const [selectedTag, setSelectedTag] = useState<SkinProgressPhoto['tag']>('Baseline');
  const [selectedFeeling, setSelectedFeeling] = useState<SkinProgressPhoto['skinFeeling']>('calm');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<SkinProgressPhoto['timeOfDay']>('morning');
  const [selectedLighting, setSelectedLighting] = useState<SkinProgressPhoto['lighting']>('natural-window');
  const [photoNotes, setPhotoNotes] = useState('');

  // Concern Tagging & Search state
  const [selectedConcernTags, setSelectedConcernTags] = useState<string[]>(['acne']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);
  const [modalNewTagInput, setModalNewTagInput] = useState('');
  const [compareTagFilter, setCompareTagFilter] = useState<string | null>(null);

  // Date Range Filtering state
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>({
    preset: 'all',
    startDate: '',
    endDate: '',
  });

  // Image Annotations & Standardization Filters state
  const [annotationModalOpen, setAnnotationModalOpen] = useState(false);
  const [annotationTarget, setAnnotationTarget] = useState<{
    type: 'captured' | 'existing';
    photo?: SkinProgressPhoto;
    imageSrc: string;
    initialAnnotations: SkinAnnotation[];
    initialFilterId?: string;
  } | null>(null);
  const [capturedAnnotations, setCapturedAnnotations] = useState<SkinAnnotation[]>([]);
  const [selectedCaptureFilterId, setSelectedCaptureFilterId] = useState<string>('normal');
  const [compareStandardizeFilterId, setCompareStandardizeFilterId] = useState<string>('normal');
  const [showAnnotationsInCompare, setShowAnnotationsInCompare] = useState(true);
  const [showAnnotationsInView, setShowAnnotationsInView] = useState(true);

  // Before & After comparison selection
  const [comparePhotoAId, setComparePhotoAId] = useState<string | null>(null);
  const [comparePhotoBId, setComparePhotoBId] = useState<string | null>(null);
  const [compareViewMode, setCompareViewMode] = useState<'split-screen' | 'slider'>('split-screen');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Fullscreen photo modal
  const [viewPhoto, setViewPhoto] = useState<SkinProgressPhoto | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);

  // Load photos from storage
  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      const stored = await getAllProgressPhotos();
      setPhotos(stored);

      // Default compare selection if at least 2 photos exist
      if (stored.length >= 2) {
        if (!comparePhotoAId) setComparePhotoAId(stored[stored.length - 1].id); // oldest as Before
        if (!comparePhotoBId) setComparePhotoBId(stored[0].id); // newest as After
      }
    } catch (e) {
      console.error('Failed to load photos:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();

    const handleUpdate = () => loadPhotos();
    window.addEventListener(PROGRESS_GALLERY_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(PROGRESS_GALLERY_EVENT, handleUpdate);
      stopCameraStream();
    };
  }, []);

  // Camera Management
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    stopCameraStream();
    setCameraError(null);
    setIsCameraActive(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      let errorMsg = 'Could not access device camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. You can still upload photos from your device below.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera device found on this system. You can upload photos directly.';
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleToggleCameraFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Open modal and start camera with optional prefill category
  const handleOpenCaptureModal = (prefillTag?: string, prefillTimeOfDay?: 'morning' | 'evening' | 'midday') => {
    setCapturedPreview(null);
    setCapturedAnnotations([]);
    setSelectedCaptureFilterId('normal');
    if (prefillTag) {
      const clean = prefillTag.toLowerCase().trim();
      setSelectedConcernTags([clean]);
    } else {
      setSelectedConcernTags(['acne']);
    }
    if (prefillTimeOfDay) {
      setSelectedTimeOfDay(prefillTimeOfDay);
    }
    setCustomTagInput('');
    setPhotoNotes('');
    setCameraModalOpen(true);
    startCamera(facingMode);
  };

  const handleCloseCaptureModal = () => {
    stopCameraStream();
    setCameraModalOpen(false);
    setCapturedPreview(null);
    setCapturedAnnotations([]);
    setSelectedCaptureFilterId('normal');
    setSelectedConcernTags(['acne']);
    setCustomTagInput('');
    setCountdown(null);
  };

  // Save annotations & filter from ImageAnnotationModal
  const handleSaveAnnotations = async (
    finalDataUrl: string,
    annotations: SkinAnnotation[],
    filterId?: string
  ) => {
    if (!annotationTarget) return;

    if (annotationTarget.type === 'captured') {
      setCapturedPreview(finalDataUrl);
      setCapturedAnnotations(annotations);
      if (filterId) {
        setSelectedCaptureFilterId(filterId);
      }
    } else if (annotationTarget.type === 'existing' && annotationTarget.photo) {
      const filterOpt = filterId ? getFilterOption(filterId) : undefined;
      const updated: SkinProgressPhoto = {
        ...annotationTarget.photo,
        dataUrl: finalDataUrl,
        originalDataUrl: annotationTarget.photo.originalDataUrl || annotationTarget.photo.dataUrl,
        annotations,
        filterId: filterId || annotationTarget.photo.filterId,
        filterName: filterOpt ? filterOpt.name : annotationTarget.photo.filterName,
      };
      await saveProgressPhoto(updated);
      if (viewPhoto?.id === updated.id) {
        setViewPhoto(updated);
      }
      loadPhotos();
    }
  };

  // Take Snapshot with optional 3-second timer
  const triggerCapture = (withTimer = false) => {
    if (withTimer) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            captureImmediateSnapshot();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      captureImmediateSnapshot();
    }
  };

  const captureImmediateSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front-facing camera for natural mirror reflection
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

    compressImage(dataUrl, 1080, 0.85).then((compressed) => {
      setCapturedPreview(compressed);
      stopCameraStream();
    });
  };

  // File Upload fallback / alternative
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        try {
          const compressed = await compressImage(result, 1080, 0.85);
          setCapturedPreview(compressed);
          stopCameraStream();
        } catch {
          setCapturedPreview(result);
          stopCameraStream();
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Save captured photo to storage
  const handleSavePhotoEntry = async () => {
    if (!capturedPreview) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const filterOpt = getFilterOption(selectedCaptureFilterId);

    let finalDataUrl = capturedPreview;
    if (selectedCaptureFilterId !== 'normal' || (capturedAnnotations && capturedAnnotations.length > 0)) {
      try {
        finalDataUrl = await bakeAnnotationsToImage(
          capturedPreview,
          capturedAnnotations,
          filterOpt.css
        );
      } catch (err) {
        console.warn('Could not bake filter/annotations onto image:', err);
      }
    }

    const newPhoto: SkinProgressPhoto = {
      id: `skin-photo-${Date.now()}`,
      dataUrl: finalDataUrl,
      originalDataUrl: capturedPreview,
      capturedAt: Date.now(),
      dateStr,
      timeStr,
      timeOfDay: selectedTimeOfDay,
      tag: selectedTag,
      skinFeeling: selectedFeeling,
      notes: photoNotes.trim(),
      lighting: selectedLighting,
      annotations: capturedAnnotations,
      concernTags: selectedConcernTags.length > 0 ? selectedConcernTags : ['acne'],
      filterId: selectedCaptureFilterId,
      filterName: selectedCaptureFilterId !== 'normal' ? filterOpt.name : undefined,
    };

    try {
      await saveProgressPhoto(newPhoto);
      onShowToast(
        selectedCaptureFilterId !== 'normal'
          ? `Skin progress photo saved with "${filterOpt.name}" filter & concern tags!`
          : 'Skin progress photo safely saved with concern tags!',
        'success'
      );
      handleCloseCaptureModal();
      loadPhotos();
    } catch (err) {
      console.error('Error saving photo entry:', err);
      onShowToast('Could not save photo. Local storage may be full.', 'info');
    }
  };

  // Concern Tag management helpers
  const handleToggleCaptureTag = (tag: string) => {
    const clean = tag.toLowerCase().trim();
    setSelectedConcernTags((prev) =>
      prev.includes(clean) ? prev.filter((t) => t !== clean) : [...prev, clean]
    );
  };

  const handleAddCustomTag = () => {
    const clean = customTagInput.toLowerCase().trim().replace(/^#/, '');
    if (!clean) return;
    if (!selectedConcernTags.includes(clean)) {
      setSelectedConcernTags((prev) => [...prev, clean]);
      onShowToast(`Added #${clean} tag`, 'info');
    }
    setCustomTagInput('');
  };

  const handleAddTagToExisting = async (photoId: string, tagToAdd: string) => {
    const clean = tagToAdd.toLowerCase().trim().replace(/^#/, '');
    if (!clean) return;

    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    const current = photo.concernTags || [];
    if (current.includes(clean)) return;

    const updated = await updatePhotoTags(photoId, [...current, clean]);
    if (updated) {
      if (viewPhoto?.id === photoId) setViewPhoto(updated);
      loadPhotos();
      onShowToast(`Added #${clean} tag to photo`, 'success');
    }
  };

  const handleRemoveTagFromExisting = async (photoId: string, tagToRemove: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    const current = photo.concernTags || [];
    const updated = await updatePhotoTags(
      photoId,
      current.filter((t) => t !== tagToRemove)
    );
    if (updated) {
      if (viewPhoto?.id === photoId) setViewPhoto(updated);
      loadPhotos();
      onShowToast(`Removed #${tagToRemove} tag`, 'info');
    }
  };

  // Delete photo
  const handleDeletePhoto = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Delete this progress photo from your local gallery?')) {
      await deleteProgressPhoto(id);
      if (viewPhoto?.id === id) setViewPhoto(null);
      if (comparePhotoAId === id) setComparePhotoAId(null);
      if (comparePhotoBId === id) setComparePhotoBId(null);
      onShowToast('Progress photo deleted.', 'info');
      loadPhotos();
    }
  };

  // Clear all
  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete ALL skin progress photos? This action cannot be undone.')) {
      await clearAllProgressPhotos();
      setPhotos([]);
      setViewPhoto(null);
      setComparePhotoAId(null);
      setComparePhotoBId(null);
      onShowToast('Progress gallery cleared.', 'info');
    }
  };

  // Download photo
  const handleDownloadPhoto = (photo: SkinProgressPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `skin-progress-${photo.dateStr}-${photo.tag.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.click();
    onShowToast('Photo downloaded!', 'success');
  };

  // Seed sample mock baseline entry if gallery is empty
  const handleSeedExample = async () => {
    const createSampleCanvas = (title: string, subtitle: string, color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 750;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, 600, 750);
        ctx.fillStyle = color;
        ctx.font = 'bold 24px serif';
        ctx.fillText(title, 40, 80);
        ctx.fillStyle = '#a8a29e';
        ctx.font = '15px sans-serif';
        ctx.fillText(subtitle, 40, 120);
      }
      return canvas.toDataURL();
    };

    const date60DaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const date21DaysAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);
    const date35DaysAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000);
    const date10DaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const dateToday = new Date();

    const sampleA: SkinProgressPhoto = {
      id: `sample-baseline-${Date.now()}`,
      dataUrl: createSampleCanvas('Skin Journey Baseline Demo', 'Day 0: Initial Consultation & Barrier Assessment', '#f43f5e'),
      capturedAt: date60DaysAgo.getTime(),
      dateStr: date60DaysAgo.toISOString().split('T')[0],
      timeStr: '09:00 AM',
      timeOfDay: 'morning',
      tag: 'Baseline',
      skinFeeling: 'dry',
      notes: 'Initial baseline: mild tightness on cheekbones, minor redness & uneven texture.',
      lighting: 'natural-window',
      concernTags: ['barrier', 'hydration', 'morning'],
      caption: 'Baseline Consultation: Day 0',
    };

    const sampleB: SkinProgressPhoto = {
      id: `sample-week4-${Date.now() + 1}`,
      dataUrl: createSampleCanvas('Week 4 Progress Check', 'Day 25: Hydration Serum & Barrier Recovery', '#38bdf8'),
      capturedAt: date35DaysAgo.getTime(),
      dateStr: date35DaysAgo.toISOString().split('T')[0],
      timeStr: '08:30 AM',
      timeOfDay: 'morning',
      tag: 'Week 4',
      skinFeeling: 'hydrated',
      notes: 'Skin elasticity and moisture levels noticeably improved. Barrier sensitivity calming.',
      lighting: 'natural-window',
      concernTags: ['hydration', 'texture', 'morning'],
      caption: 'Week 4: Noticeable barrier relief',
    };

    const sampleD: SkinProgressPhoto = {
      id: `sample-evening-${Date.now() + 2}`,
      dataUrl: createSampleCanvas('Evening Repair Routine', 'Day 50: PM Barrier Balm & Ceramide Hydration', '#818cf8'),
      capturedAt: date10DaysAgo.getTime(),
      dateStr: date10DaysAgo.toISOString().split('T')[0],
      timeStr: '09:45 PM',
      timeOfDay: 'evening',
      tag: 'Routine Update',
      skinFeeling: 'calm',
      notes: 'PM nighttime assessment: calmed surface after double-cleansing, optimal lipid replenishment.',
      lighting: 'bathroom',
      concernTags: ['hydration', 'evening', 'barrier'],
      caption: 'Evening Routine: Deep Overnight Moisture',
    };

    const sampleC: SkinProgressPhoto = {
      id: `sample-current-${Date.now() + 3}`,
      dataUrl: createSampleCanvas('Barrier Restored Checkpoint', 'Day 60: Calmed Texture & Healthy Glow', '#34d399'),
      capturedAt: dateToday.getTime(),
      dateStr: dateToday.toISOString().split('T')[0],
      timeStr: '09:15 AM',
      timeOfDay: 'morning',
      tag: 'Barrier Restored',
      skinFeeling: 'calm',
      notes: 'Consistent routine results: smooth texture, balanced sebum, and healthy skin barrier glow.',
      lighting: 'natural-window',
      concernTags: ['barrier', 'glow', 'hydration', 'morning'],
      caption: 'Barrier Restored: Radiant Transformation',
    };

    await saveProgressPhoto(sampleA);
    await saveProgressPhoto(sampleB);
    await saveProgressPhoto(sampleD);
    await saveProgressPhoto(sampleC);
    loadPhotos();
    onShowToast('Sample journey added across Morning, Evening, and Hydration categories!', 'success');
  };

  // Date boundaries across all photos
  const dateSorted = [...photos].sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  const availableDateMin = dateSorted[0]?.dateStr;
  const availableDateMax = dateSorted[dateSorted.length - 1]?.dateStr;

  // Filtered photos based on date range, active concern tag, and search query
  const filteredPhotos = photos.filter((photo) => {
    // 1. Date Range Filter
    if (!isPhotoInDateRange(photo.dateStr, dateRangeFilter)) {
      return false;
    }

    // 2. Concern Tag filter
    if (activeFilterTag && activeFilterTag !== 'all') {
      const hasTag = photo.concernTags?.some(
        (t) => t.toLowerCase() === activeFilterTag.toLowerCase()
      );
      if (!hasTag) return false;
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inTags = photo.concernTags?.some((t) => t.toLowerCase().includes(q));
      const inNotes = photo.notes?.toLowerCase().includes(q);
      const inStageTag = photo.tag.toLowerCase().includes(q);
      const inDate = photo.dateStr.includes(q);
      const inFeeling = photo.skinFeeling.toLowerCase().includes(q);
      const inCaption = photo.caption?.toLowerCase().includes(q);
      const inAnnotations = photo.annotations?.some((a) =>
        a.text.toLowerCase().includes(q)
      );
      if (!inTags && !inNotes && !inStageTag && !inDate && !inFeeling && !inCaption && !inAnnotations) {
        return false;
      }
    }

    return true;
  });

  // Calculate distinct tags present across all user photos + standard presets
  const userPhotoTags = Array.from(new Set(photos.flatMap((p) => p.concernTags || [])));
  const allAvailableTags = Array.from(new Set([...DEFAULT_CONCERN_TAGS, ...userPhotoTags]));

  const getCountForTag = (tag: string) => {
    return photos.filter((p) =>
      p.concernTags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    ).length;
  };

  // Compare mode filtered photo lists if compareTagFilter or dateRangeFilter is active
  const compareEligiblePhotos =
    compareTagFilter && compareTagFilter !== 'all'
      ? photos.filter((p) =>
          p.concernTags?.some((t) => t.toLowerCase() === compareTagFilter.toLowerCase())
        )
      : photos;

  // Compare photo objects with resilient fallbacks
  const photoA =
    photos.find((p) => p.id === comparePhotoAId) ||
    (photos.length >= 2 ? photos[photos.length - 1] : photos[0]);
  const photoB =
    photos.find((p) => p.id === comparePhotoBId) ||
    (photos.length >= 2 ? photos[0] : photos[0]);

  // Unique recorded photo dates (sorted chronologically)
  const availableCompareDates = Array.from(new Set(photos.map((p) => p.dateStr))).sort();

  // Helper to compute days between dates
  const getDaysBetween = (dateA?: string, dateB?: string): number => {
    if (!dateA || !dateB) return 0;
    const d1 = new Date(dateA + 'T00:00:00');
    const d2 = new Date(dateB + 'T00:00:00');
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysApart = photoA && photoB ? getDaysBetween(photoA.dateStr, photoB.dateStr) : 0;

  // Handlers for setting dates directly
  const handleSelectDateForA = (selectedDate: string) => {
    const match = photos.find((p) => p.dateStr === selectedDate);
    if (match) {
      setComparePhotoAId(match.id);
      onShowToast(`Before date set to ${formatDisplayDate(selectedDate)}`, 'info');
    } else {
      const targetTime = new Date(selectedDate).getTime();
      const closest = [...photos].sort((a, b) => {
        const diffA = Math.abs(new Date(a.dateStr).getTime() - targetTime);
        const diffB = Math.abs(new Date(b.dateStr).getTime() - targetTime);
        return diffA - diffB;
      })[0];
      if (closest) {
        setComparePhotoAId(closest.id);
        onShowToast(`Matched closest entry on ${formatDisplayDate(closest.dateStr)}`, 'info');
      }
    }
  };

  const handleSelectDateForB = (selectedDate: string) => {
    const match = photos.find((p) => p.dateStr === selectedDate);
    if (match) {
      setComparePhotoBId(match.id);
      onShowToast(`After date set to ${formatDisplayDate(selectedDate)}`, 'info');
    } else {
      const targetTime = new Date(selectedDate).getTime();
      const closest = [...photos].sort((a, b) => {
        const diffA = Math.abs(new Date(a.dateStr).getTime() - targetTime);
        const diffB = Math.abs(new Date(b.dateStr).getTime() - targetTime);
        return diffA - diffB;
      })[0];
      if (closest) {
        setComparePhotoBId(closest.id);
        onShowToast(`Matched closest entry on ${formatDisplayDate(closest.dateStr)}`, 'info');
      }
    }
  };

  // Swap dates
  const handleSwapCompareDates = () => {
    if (!photoA || !photoB) return;
    const tempId = photoA.id;
    setComparePhotoAId(photoB.id);
    setComparePhotoBId(tempId);
    onShowToast('Swapped Before & After dates', 'info');
  };

  // Download Side-by-Side comparison collage image
  const handleDownloadSideBySide = async () => {
    if (!photoA || !photoB) return;
    try {
      const canvas = document.createElement('canvas');
      const width = 1400;
      const height = 900;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark canvas background
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, width, height);

      // Top title bar
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, width, 110);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 28px serif';
      ctx.fillText('Skin Routine Transformation · Side-by-Side Comparison', 40, 52);

      const daysDiff = getDaysBetween(photoA.dateStr, photoB.dateStr);
      const diffText =
        daysDiff > 0
          ? `${daysDiff} Days Elapsed (${(daysDiff / 7).toFixed(1)} Weeks) · ${photoA.tag} ➔ ${photoB.tag}`
          : `Same Day Progression (${photoA.timeOfDay} ➔ ${photoB.timeOfDay})`;

      ctx.fillStyle = '#d6d3d1';
      ctx.font = '16px sans-serif';
      ctx.fillText(diffText, 40, 85);

      // Load images
      const imgA = new Image();
      const imgB = new Image();
      imgA.crossOrigin = 'anonymous';
      imgB.crossOrigin = 'anonymous';

      const loadImg = (img: HTMLImageElement, src: string) =>
        new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        });

      await Promise.all([loadImg(imgA, photoA.dataUrl), loadImg(imgB, photoB.dataUrl)]);

      const margin = 30;
      const gap = 20;
      const imgWidth = (width - margin * 2 - gap) / 2;
      const imgY = 135;
      const imgHeight = 700;

      // Left pane
      ctx.fillStyle = '#171412';
      ctx.fillRect(margin, imgY, imgWidth, imgHeight);
      if (imgA.width > 0) {
        ctx.drawImage(imgA, margin, imgY, imgWidth, imgHeight);
      }
      ctx.fillStyle = 'rgba(12, 10, 9, 0.85)';
      ctx.fillRect(margin + 15, imgY + 15, 270, 42);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`BEFORE · ${photoA.dateStr}`, margin + 30, imgY + 42);

      ctx.fillStyle = 'rgba(12, 10, 9, 0.85)';
      ctx.fillRect(margin + 15, imgY + imgHeight - 55, imgWidth - 30, 42);
      ctx.fillStyle = '#fecdd3';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        `${photoA.tag} · ${photoA.timeOfDay} · ${photoA.skinFeeling} feeling`,
        margin + 30,
        imgY + imgHeight - 28
      );

      // Right pane
      const rightX = margin + imgWidth + gap;
      ctx.fillStyle = '#171412';
      ctx.fillRect(rightX, imgY, imgWidth, imgHeight);
      if (imgB.width > 0) {
        ctx.drawImage(imgB, rightX, imgY, imgWidth, imgHeight);
      }
      ctx.fillStyle = 'rgba(12, 10, 9, 0.85)';
      ctx.fillRect(rightX + 15, imgY + 15, 270, 42);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`AFTER · ${photoB.dateStr}`, rightX + 30, imgY + 42);

      ctx.fillStyle = 'rgba(12, 10, 9, 0.85)';
      ctx.fillRect(rightX + 15, imgY + imgHeight - 55, imgWidth - 30, 42);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        `${photoB.tag} · ${photoB.timeOfDay} · ${photoB.skinFeeling} feeling`,
        rightX + 30,
        imgY + imgHeight - 28
      );

      // Watermark
      ctx.fillStyle = '#78716c';
      ctx.font = '13px sans-serif';
      ctx.fillText('Skin Routine Transformation Tracker · 100% Private Browser Vault', 40, height - 25);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `skin-before-after-${photoA.dateStr}-vs-${photoB.dateStr}.jpg`;
      link.click();
      onShowToast('Side-by-side comparison downloaded!', 'success');
    } catch (err) {
      console.error('Error generating side-by-side image:', err);
      onShowToast('Could not download image', 'info');
    }
  };

  // Slider dragging handlers
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 1. Header Banner & Privacy Shield */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Private & Browser-Stored</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-100">
              Skin Journey Progress Gallery
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-light leading-relaxed">
              Capture consistent camera snapshots to track your skin texture, barrier recovery, and radiance over time. Your photos stay strictly inside your device's browser sandbox and are never uploaded to any remote server.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenCaptureModal()}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-rose-200" />
              <span>Take Progress Photo</span>
            </button>

            <label className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 hover:text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-stone-400" />
              <span>Upload Photo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {photos.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('carousel')}
                  className="px-4 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 hover:text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4 text-rose-400" />
                  <span>Swipe Carousel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('slideshow')}
                  className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 hover:text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Film className="w-4 h-4 text-stone-400" />
                  <span>Play Slideshow</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 pt-5 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-stone-950/80 p-1 rounded-2xl border border-stone-800 text-xs">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'timeline'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Timeline Gallery ({photos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('carousel')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'carousel'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Carousel View</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'compare'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Before & After</span>
            </button>

            <button
              onClick={() => setActiveTab('slideshow')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'slideshow'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Slideshow & GIF</span>
            </button>
          </div>

          {photos.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-stone-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Gallery</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TIMELINE GALLERY VIEW */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {photos.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-950/50 border border-rose-900/50 flex items-center justify-center text-rose-400 mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-100">
                  Your Skin Journal is Empty
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                  Start documenting your journey today. Take a baseline photo before beginning a new routine to see noticeable improvements in texture, clarity, and barrier strength.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleOpenCaptureModal()}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take First Snapshot</span>
                </button>
                <button
                  onClick={handleSeedExample}
                  className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  Explore Sample Entry
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search & Concern Tag Filter Bar */}
              <div className="space-y-3.5 p-4 sm:p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-md">
                {/* Search Input & Date Range Filter Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search progress by tag (e.g. acne, hydration, glow), notes, or date..."
                      className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Date Range Selector Dropdown & Match Counter */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
                    <DateRangeSelector
                      value={dateRangeFilter}
                      onChange={(newFilter) => setDateRangeFilter(newFilter)}
                      totalPhotosCount={photos.length}
                      filteredPhotosCount={filteredPhotos.length}
                      availableDateMin={availableDateMin}
                      availableDateMax={availableDateMax}
                    />

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400 text-[11px] whitespace-nowrap">
                        Showing <strong className="text-stone-200">{filteredPhotos.length}</strong> of{' '}
                        <strong className="text-stone-200">{photos.length}</strong> photos
                      </span>
                      {(searchQuery || activeFilterTag || dateRangeFilter.preset !== 'all') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setActiveFilterTag(null);
                            setDateRangeFilter({ preset: 'all', startDate: '', endDate: '' });
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 underline underline-offset-2 cursor-pointer ml-1 whitespace-nowrap"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Date Range Time Frame Shortcuts Row */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar border-t border-stone-850/80 pt-2.5">
                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-stone-400 pr-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Time Frame:</span>
                  </div>

                  {/* Preset Quick Buttons */}
                  {[
                    { id: 'all' as DateRangePreset, label: 'All Time' },
                    { id: '30days' as DateRangePreset, label: 'Last Month (30d)' },
                    { id: '3months' as DateRangePreset, label: 'Last 3 Months' },
                    { id: '6months' as DateRangePreset, label: 'Last 6 Months' },
                    { id: '1year' as DateRangePreset, label: 'Past Year' },
                  ].map((presetItem) => {
                    const isSel = dateRangeFilter.preset === presetItem.id;
                    return (
                      <button
                        key={presetItem.id}
                        type="button"
                        onClick={() => {
                          const { startDate, endDate } = calculateRangeForPreset(presetItem.id);
                          setDateRangeFilter({
                            preset: presetItem.id,
                            startDate,
                            endDate,
                          });
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                          isSel
                            ? 'bg-rose-950 text-rose-200 border-rose-600 shadow-sm font-semibold ring-1 ring-rose-500/50'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {presetItem.label}
                      </button>
                    );
                  })}

                  {/* Custom Range button if custom is selected */}
                  {dateRangeFilter.preset === 'custom' && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-950 text-rose-200 border border-rose-600 text-xs font-semibold shrink-0 ring-1 ring-rose-500/50">
                      <span>Custom: {formatDisplayDate(dateRangeFilter.startDate, false)} – {formatDisplayDate(dateRangeFilter.endDate, false)}</span>
                      <button
                        type="button"
                        onClick={() => setDateRangeFilter({ preset: 'all', startDate: '', endDate: '' })}
                        className="hover:text-white p-0.5 rounded cursor-pointer"
                        title="Clear custom range"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Reset Date Shortcut if filtered */}
                  {dateRangeFilter.preset !== 'all' && dateRangeFilter.preset !== 'custom' && (
                    <span className="text-[10px] text-stone-400 shrink-0 italic pl-1">
                      ({formatDisplayDate(dateRangeFilter.startDate, false)} – {formatDisplayDate(dateRangeFilter.endDate, false)})
                    </span>
                  )}
                </div>

                {/* Tag Filter Chips Row */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar border-t border-stone-850/80 pt-2.5">
                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-stone-400 pr-1">
                    <Filter className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Concerns:</span>
                  </div>

                  {/* All Tag */}
                  <button
                    type="button"
                    onClick={() => setActiveFilterTag(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                      activeFilterTag === null
                        ? 'bg-rose-950 text-rose-200 border-rose-700 shadow-sm'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] opacity-75 font-mono">({photos.length})</span>
                  </button>

                  {/* Preset and user concern tags */}
                  {allAvailableTags.map((tag) => {
                    const count = getCountForTag(tag);
                    const isSelected = activeFilterTag?.toLowerCase() === tag.toLowerCase();
                    const color = getConcernTagColor(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setActiveFilterTag(isSelected ? null : tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md font-bold'
                            : `${color.bg} ${color.text} ${color.border} hover:opacity-90`
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : color.dot}`}
                        />
                        <span>#{tag}</span>
                        <span className="text-[10px] opacity-80 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Cards Grid OR Empty Filter State */}
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-900/40 flex items-center justify-center text-rose-400 mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg text-stone-200">No Matching Progress Photos</h4>
                  <div className="text-xs text-stone-400 max-w-sm mx-auto space-y-1">
                    {dateRangeFilter.preset !== 'all' && (
                      <p className="text-rose-300 font-medium">
                        Active Time Window: {formatDateRangeSummary(dateRangeFilter)}
                      </p>
                    )}
                    <p>
                      {activeFilterTag
                        ? `No entries found tagged with #${activeFilterTag}.`
                        : searchQuery
                        ? `No entries matching "${searchQuery}".`
                        : 'No photos were taken within the selected date range.'}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    {dateRangeFilter.preset !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setDateRangeFilter({ preset: 'all', startDate: '', endDate: '' })}
                        className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-semibold cursor-pointer"
                      >
                        Show All Dates
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilterTag(null);
                        setDateRangeFilter({ preset: 'all', startDate: '', endDate: '' });
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setViewPhoto(photo)}
                      className="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-rose-500/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Photo Container */}
                        <div className="relative aspect-[4/5] bg-stone-950 overflow-hidden">
                          <img
                            src={photo.dataUrl}
                            alt={`Skin progress on ${photo.dateStr}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

                          {/* Tag Badge, Filter Badge & Annotation Badge */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                            <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-rose-300 font-semibold text-[10px] uppercase tracking-wider">
                              {photo.tag}
                            </span>
                            {photo.filterId && photo.filterId !== 'normal' && (
                              <span
                                className={`px-2 py-0.5 rounded-full font-semibold text-[9px] uppercase tracking-wider backdrop-blur-md border border-white/20 flex items-center gap-1 ${getFilterOption(photo.filterId).badgeClass}`}
                              >
                                <SlidersHorizontal className="w-2.5 h-2.5" />
                                <span>{photo.filterName || getFilterOption(photo.filterId).name}</span>
                              </span>
                            )}
                            {photo.annotations && photo.annotations.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-950/90 backdrop-blur-md border border-rose-600/60 text-rose-200 font-semibold text-[9px] flex items-center gap-1">
                                <Tag className="w-2.5 h-2.5 text-rose-400" />
                                <span>{photo.annotations.length} {photo.annotations.length === 1 ? 'Pin' : 'Pins'}</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Action Overlay */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const primaryCategory = photo.concernTags?.[0] || photo.timeOfDay || 'all';
                                setCarouselCategory(primaryCategory);
                                setActiveTab('carousel');
                                onShowToast(`Opened Carousel View for #${primaryCategory}`, 'info');
                              }}
                              className="p-1.5 rounded-lg bg-stone-950/80 hover:bg-rose-950 border border-stone-700 hover:border-rose-700 text-stone-300 hover:text-rose-300 transition-colors"
                              title="Swipe chronologically in Carousel View"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnnotationTarget({
                                  type: 'existing',
                                  photo: photo,
                                  imageSrc: photo.originalDataUrl || photo.dataUrl,
                                  initialAnnotations: photo.annotations || [],
                                  initialFilterId: photo.filterId || 'normal',
                                });
                                setAnnotationModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-950/80 hover:bg-rose-950 border border-stone-700 hover:border-rose-700 text-stone-300 hover:text-rose-300 transition-colors"
                              title="Add / Edit Annotations on Image"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDownloadPhoto(photo, e)}
                              className="p-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-900 border border-stone-700 text-stone-300 hover:text-white transition-colors"
                              title="Download photo"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDeletePhoto(photo.id, e)}
                              className="p-1.5 rounded-lg bg-stone-950/80 hover:bg-rose-950 border border-stone-700 hover:border-rose-700 text-stone-300 hover:text-rose-300 transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Bottom Info inside image */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300">
                            <div className="flex items-center gap-1 text-[11px] font-mono">
                              <Calendar className="w-3 h-3 text-rose-400" />
                              <span>{photo.dateStr}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                              {photo.timeOfDay}
                            </span>
                          </div>
                        </div>

                        {/* Metadata, Notes & Concern Tags */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] text-stone-400">
                            <span className="capitalize">
                              Skin: <strong className="text-stone-200">{photo.skinFeeling}</strong>
                            </span>
                            <span className="capitalize text-stone-500">
                              {photo.lighting.replace('-', ' ')}
                            </span>
                          </div>

                          {photo.notes ? (
                            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed italic">
                              “{photo.notes}”
                            </p>
                          ) : (
                            <p className="text-xs text-stone-500 italic">No notes recorded.</p>
                          )}

                          {/* Concern Tags */}
                          {photo.concernTags && photo.concernTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-850/80">
                              {photo.concernTags.map((tag) => {
                                const color = getConcernTagColor(tag);
                                return (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveFilterTag(tag);
                                      onShowToast(`Filtered by #${tag}`, 'info');
                                    }}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${color.border} ${color.bg} ${color.text} hover:opacity-85 transition-opacity flex items-center gap-1 cursor-pointer`}
                                    title={`Filter by #${tag}`}
                                  >
                                    <span className={`w-1 h-1 rounded-full ${color.dot}`} />
                                    <span>#{tag}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-850/80 text-xs text-rose-400 group-hover:text-rose-300">
                        <span className="font-semibold text-[11px]">Inspect Details</span>
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. BEFORE & AFTER SPLIT COMPARISON SLIDER */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          {photos.length < 2 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-3">
              <Sliders className="w-10 h-10 text-rose-400/80 mx-auto" />
              <h3 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
                Comparison Requires at Least 2 Photos
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
                Take a baseline photo today, then add follow-up photos as your skin adapts to compare progress side-by-side.
              </p>
              <button
                onClick={() => handleOpenCaptureModal()}
                className="mt-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
              >
                Take Photo
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Concern Tag & Date Range Filter for Comparison */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 text-xs">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 shrink-0 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-rose-400" />
                    <span>Filter By:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCompareTagFilter(null)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 cursor-pointer border ${
                      compareTagFilter === null
                        ? 'bg-rose-950 text-rose-200 border-rose-700'
                        : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    All Tags ({photos.length})
                  </button>
                  {allAvailableTags.map((tag) => {
                    const count = getCountForTag(tag);
                    if (count === 0) return null;
                    const isSel = compareTagFilter?.toLowerCase() === tag.toLowerCase();
                    const color = getConcernTagColor(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCompareTagFilter(isSel ? null : tag)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                          isSel
                            ? 'bg-rose-600 text-white border-rose-500 shadow-sm font-bold'
                            : `${color.bg} ${color.text} ${color.border}`
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-white' : color.dot}`} />
                        <span>#{tag}</span>
                        <span className="text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <DateRangeSelector
                    compact
                    value={dateRangeFilter}
                    onChange={(newFilter) => setDateRangeFilter(newFilter)}
                    totalPhotosCount={photos.length}
                    filteredPhotosCount={compareEligiblePhotos.length}
                    availableDateMin={availableDateMin}
                    availableDateMax={availableDateMax}
                  />
                </div>
              </div>

              {/* Top View Mode & Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs shadow-md">
                {/* Segmented View Mode Toggle: Split-Screen Side-by-Side vs. Interactive Slider */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-950 border border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCompareViewMode('split-screen');
                      onShowToast('Side-by-side split screen active', 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      compareViewMode === 'split-screen'
                        ? 'bg-rose-950 text-rose-100 border border-rose-700 shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Split-Screen Side-by-Side</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCompareViewMode('slider');
                      onShowToast('Interactive wipe slider active', 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      compareViewMode === 'slider'
                        ? 'bg-rose-950 text-rose-100 border border-rose-700 shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Interactive Wipe Slider</span>
                  </button>
                </div>

                {/* Right Actions: Download Side-by-Side Collage & Annotations Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAnnotationsInCompare(!showAnnotationsInCompare)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      showAnnotationsInCompare
                        ? 'bg-stone-800 border-stone-700 text-stone-200'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                    title={showAnnotationsInCompare ? 'Hide annotation pins' : 'Show annotation pins'}
                  >
                    {showAnnotationsInCompare ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{showAnnotationsInCompare ? 'Pins Shown' : 'Pins Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSideBySide}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export high-resolution side-by-side comparison collage"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Side-by-Side</span>
                  </button>
                </div>
              </div>

              {/* Specific Date Selectors Panel */}
              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="space-y-0.5">
                    <h4 className="font-serif text-base text-stone-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-rose-400" />
                      <span>Select Two Specific Dates to Compare</span>
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Choose an earlier baseline date and a follow-up date to inspect skin improvements side-by-side.
                    </p>
                  </div>

                  {photoA && photoB && (
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        <span>
                          {daysApart === 0
                            ? 'Same Day Comparison'
                            : `${daysApart} Days Apart (${(daysApart / 7).toFixed(1)} Wks)`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleSwapCompareDates}
                        className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Swap Before and After dates"
                      >
                        <ArrowLeftRight className="w-3 h-3 text-rose-400" />
                        <span>Swap</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Dual Date Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Before Date Selection */}
                  <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
                        <span>1. Before Date (Baseline / Initial)</span>
                      </label>
                      {photoA && (
                        <span className="text-[11px] text-stone-400 font-mono">
                          {photoA.timeStr} · {photoA.tag}
                        </span>
                      )}
                    </div>

                    {/* Date Picker Input */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-400 block font-medium">Select Specific Calendar Date:</span>
                      <input
                        type="date"
                        value={photoA?.dateStr || ''}
                        max={photoB?.dateStr || getTodayDateStr()}
                        onChange={(e) => handleSelectDateForA(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-750 text-xs text-stone-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                      />
                    </div>

                    {/* Quick Date Pills from recorded sessions */}
                    {availableCompareDates.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-400 block font-medium">Or Pick From Recorded Dates:</span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                          {availableCompareDates.map((dateStr) => {
                            const isSel = photoA?.dateStr === dateStr;
                            return (
                              <button
                                key={`date-a-${dateStr}`}
                                type="button"
                                onClick={() => handleSelectDateForA(dateStr)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                                  isSel
                                    ? 'bg-rose-950 text-rose-100 border-rose-500 font-bold shadow-sm'
                                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                                }`}
                              >
                                {dateStr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Multiple Sessions on Date Dropdown */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-stone-400 block font-medium">Photo Session on This Date:</span>
                      <select
                        value={comparePhotoAId || photoA?.id || ''}
                        onChange={(e) => setComparePhotoAId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                      >
                        {compareEligiblePhotos.map((p) => (
                          <option key={`opt-a-${p.id}`} value={p.id}>
                            {p.dateStr} · {p.tag} ({p.timeOfDay}) - {p.skinFeeling} feeling
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column: After Date Selection */}
                  <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
                        <span>2. After Date (Follow-up / Target)</span>
                      </label>
                      {photoB && (
                        <span className="text-[11px] text-stone-400 font-mono">
                          {photoB.timeStr} · {photoB.tag}
                        </span>
                      )}
                    </div>

                    {/* Date Picker Input */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-400 block font-medium">Select Specific Calendar Date:</span>
                      <input
                        type="date"
                        value={photoB?.dateStr || ''}
                        min={photoA?.dateStr || undefined}
                        max={getTodayDateStr()}
                        onChange={(e) => handleSelectDateForB(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-750 text-xs text-stone-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                      />
                    </div>

                    {/* Quick Date Pills from recorded sessions */}
                    {availableCompareDates.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-400 block font-medium">Or Pick From Recorded Dates:</span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                          {availableCompareDates.map((dateStr) => {
                            const isSel = photoB?.dateStr === dateStr;
                            return (
                              <button
                                key={`date-b-${dateStr}`}
                                type="button"
                                onClick={() => handleSelectDateForB(dateStr)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                                  isSel
                                    ? 'bg-emerald-950 text-emerald-100 border-emerald-500 font-bold shadow-sm'
                                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                                }`}
                              >
                                {dateStr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Multiple Sessions on Date Dropdown */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-stone-400 block font-medium">Photo Session on This Date:</span>
                      <select
                        value={comparePhotoBId || photoB?.id || ''}
                        onChange={(e) => setComparePhotoBId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                      >
                        {compareEligiblePhotos.map((p) => (
                          <option key={`opt-b-${p.id}`} value={p.id}>
                            {p.dateStr} · {p.tag} ({p.timeOfDay}) - {p.skinFeeling} feeling
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Standardization Filter Toolbar */}
              {photoA && photoB && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-semibold text-stone-200">
                      Standardize View Lighting:
                    </span>
                    <span className="text-[11px] text-stone-400 hidden sm:inline">
                      (Applies standardized exposure/grayscale to both dates to reveal texture objectively)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {IMAGE_FILTERS.map((f) => {
                      const isSel = compareStandardizeFilterId === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setCompareStandardizeFilterId(f.id);
                            onShowToast(
                              f.id === 'normal'
                                ? 'Comparison view showing natural photo colors'
                                : `Both photos standardized in ${f.name} mode`,
                              'info'
                            );
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer border ${
                            isSel
                              ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-sm'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                          }`}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIEW 1: Split-Screen Side-by-Side Mode */}
              {photoA && photoB && compareViewMode === 'split-screen' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    {/* Left Pane: BEFORE Photo */}
                    <div className="rounded-3xl bg-stone-900/90 border border-rose-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl">
                      {/* Pane Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold uppercase tracking-wider">
                            Before
                          </span>
                          <span className="font-serif text-sm sm:text-base font-medium text-stone-100">
                            {formatDisplayDate(photoA.dateStr)}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded-md border border-stone-800">
                          {photoA.timeStr} ({photoA.timeOfDay})
                        </span>
                      </div>

                      {/* Photo Container */}
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center group">
                        <img
                          src={photoA.dataUrl}
                          alt={`Before ${photoA.dateStr}`}
                          style={{
                            filter: getFilterOption(compareStandardizeFilterId).css,
                            transition: 'filter 0.25s ease',
                          }}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-rose-300 font-semibold text-[10px] uppercase tracking-wider">
                            {photoA.tag}
                          </span>
                          {photoA.filterId && photoA.filterId !== 'normal' && (
                            <span
                              className={`px-2 py-0.5 rounded-full font-semibold text-[9px] uppercase tracking-wider backdrop-blur-md border border-white/20 ${getFilterOption(photoA.filterId).badgeClass}`}
                            >
                              {photoA.filterName}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewPhoto(photoA)}
                          className="absolute top-3 right-3 p-1.5 rounded-xl bg-stone-950/80 hover:bg-stone-900 backdrop-blur-md border border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                          title="Inspect Photo Fullscreen"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Caption if present */}
                        {photoA.caption && (
                          <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                            <span className="inline-block px-2.5 py-1 rounded-xl bg-stone-950/90 text-rose-200 font-serif text-xs border border-rose-500/40 shadow-lg backdrop-blur-md">
                              “{photoA.caption}”
                            </span>
                          </div>
                        )}

                        {/* Annotation Pins (if enabled) */}
                        {showAnnotationsInCompare &&
                          photoA.annotations &&
                          photoA.annotations.map((ann) => (
                            <div
                              key={ann.id}
                              style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                            >
                              <div className="relative flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-rose-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white" />
                              </div>
                              <div className="absolute left-3 -top-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-stone-950/90 text-rose-200 border border-rose-500 shadow-md whitespace-nowrap">
                                {ann.text}
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Observations & Tags */}
                      <div className="space-y-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2 text-stone-400">
                          <span className="px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-850 text-stone-300">
                            Feeling: <strong className="text-stone-100 capitalize">{photoA.skinFeeling}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-850 text-stone-300">
                            Lighting: <strong className="text-stone-100 capitalize">{photoA.lighting.replace('-', ' ')}</strong>
                          </span>
                          {photoA.annotations && photoA.annotations.length > 0 && (
                            <span className="px-2 py-0.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 font-medium">
                              {photoA.annotations.length} Pins
                            </span>
                          )}
                        </div>

                        {photoA.notes && (
                          <p className="p-3 rounded-xl bg-stone-950/70 border border-stone-850 text-stone-300 italic text-[11px] leading-relaxed">
                            “{photoA.notes}”
                          </p>
                        )}

                        {photoA.concernTags && photoA.concernTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {photoA.concernTags.map((tag) => {
                              const color = getConcernTagColor(tag);
                              return (
                                <span
                                  key={tag}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${color.border} ${color.bg} ${color.text}`}
                                >
                                  #{tag}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Pane: AFTER Photo */}
                    <div className="rounded-3xl bg-stone-900/90 border border-emerald-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl">
                      {/* Pane Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider">
                            After
                          </span>
                          <span className="font-serif text-sm sm:text-base font-medium text-stone-100">
                            {formatDisplayDate(photoB.dateStr)}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded-md border border-stone-800">
                          {photoB.timeStr} ({photoB.timeOfDay})
                        </span>
                      </div>

                      {/* Photo Container */}
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center group">
                        <img
                          src={photoB.dataUrl}
                          alt={`After ${photoB.dateStr}`}
                          style={{
                            filter: getFilterOption(compareStandardizeFilterId).css,
                            transition: 'filter 0.25s ease',
                          }}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-emerald-300 font-semibold text-[10px] uppercase tracking-wider">
                            {photoB.tag}
                          </span>
                          {photoB.filterId && photoB.filterId !== 'normal' && (
                            <span
                              className={`px-2 py-0.5 rounded-full font-semibold text-[9px] uppercase tracking-wider backdrop-blur-md border border-white/20 ${getFilterOption(photoB.filterId).badgeClass}`}
                            >
                              {photoB.filterName}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewPhoto(photoB)}
                          className="absolute top-3 right-3 p-1.5 rounded-xl bg-stone-950/80 hover:bg-stone-900 backdrop-blur-md border border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                          title="Inspect Photo Fullscreen"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Caption if present */}
                        {photoB.caption && (
                          <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                            <span className="inline-block px-2.5 py-1 rounded-xl bg-stone-950/90 text-emerald-200 font-serif text-xs border border-emerald-500/40 shadow-lg backdrop-blur-md">
                              “{photoB.caption}”
                            </span>
                          </div>
                        )}

                        {/* Annotation Pins (if enabled) */}
                        {showAnnotationsInCompare &&
                          photoB.annotations &&
                          photoB.annotations.map((ann) => (
                            <div
                              key={ann.id}
                              style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                            >
                              <div className="relative flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
                              </div>
                              <div className="absolute left-3 -top-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-stone-950/90 text-emerald-200 border border-emerald-500 shadow-md whitespace-nowrap">
                                {ann.text}
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Observations & Tags */}
                      <div className="space-y-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2 text-stone-400">
                          <span className="px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-850 text-stone-300">
                            Feeling: <strong className="text-stone-100 capitalize">{photoB.skinFeeling}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-850 text-stone-300">
                            Lighting: <strong className="text-stone-100 capitalize">{photoB.lighting.replace('-', ' ')}</strong>
                          </span>
                          {photoB.annotations && photoB.annotations.length > 0 && (
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 font-medium">
                              {photoB.annotations.length} Pins
                            </span>
                          )}
                        </div>

                        {photoB.notes && (
                          <p className="p-3 rounded-xl bg-stone-950/70 border border-stone-850 text-stone-300 italic text-[11px] leading-relaxed">
                            “{photoB.notes}”
                          </p>
                        )}

                        {photoB.concernTags && photoB.concernTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {photoB.concernTags.map((tag) => {
                              const color = getConcernTagColor(tag);
                              return (
                                <span
                                  key={tag}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${color.border} ${color.bg} ${color.text}`}
                                >
                                  #{tag}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Transformation Milestones & Metrics Summary */}
                  <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        <span className="font-semibold text-stone-200">
                          Side-by-Side Transformation Analysis
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadSideBySide}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Side-by-Side Image</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Journey Span
                        </span>
                        <span className="font-semibold text-stone-200 text-sm">
                          {daysApart === 0 ? 'Same Day' : `${daysApart} Days`}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          {formatDisplayDate(photoA.dateStr, false)} ➔ {formatDisplayDate(photoB.dateStr, false)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Progress Stage
                        </span>
                        <div className="flex items-center gap-1 font-semibold text-stone-200 text-sm">
                          <span>{photoA.tag}</span>
                          <ArrowRight className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="text-emerald-300">{photoB.tag}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block">
                          Documented evolution
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Skin Sensation
                        </span>
                        <div className="flex items-center gap-1 font-semibold text-stone-200 text-sm capitalize">
                          <span>{photoA.skinFeeling}</span>
                          <ArrowRight className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="text-emerald-300">{photoB.skinFeeling}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block">
                          Comfort & barrier response
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: Interactive Wipe Slider Mode */}
              {photoA && photoB && compareViewMode === 'slider' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div
                    ref={sliderContainerRef}
                    onMouseDown={() => setIsDraggingSlider(true)}
                    onMouseUp={() => setIsDraggingSlider(false)}
                    onMouseMove={(e) => isDraggingSlider && handleSliderMove(e.clientX)}
                    onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                    className="relative w-full max-w-2xl mx-auto aspect-[4/5] rounded-3xl overflow-hidden border border-stone-750 bg-stone-950 select-none shadow-2xl cursor-ew-resize"
                  >
                    {/* Layer 2: After Image (Background) */}
                    <img
                      src={photoB.dataUrl}
                      alt="After"
                      style={{
                        filter: getFilterOption(compareStandardizeFilterId).css,
                        transition: 'filter 0.25s ease',
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Layer 1: Before Image (Clipped by slider position) */}
                    <div
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={photoA.dataUrl}
                        alt="Before"
                        style={{
                          filter: getFilterOption(compareStandardizeFilterId).css,
                          transition: 'filter 0.25s ease',
                        }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    {/* Slider Dividing Line & Knob */}
                    <div
                      style={{ left: `${sliderPosition}%` }}
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] pointer-events-none transform -translate-x-1/2"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900 border-2 border-white flex items-center justify-center text-white shadow-xl">
                        <Sliders className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                      <span>Before ({photoA.dateStr})</span>
                      {photoA.filterId && photoA.filterId !== 'normal' && (
                        <span className="text-[10px] text-stone-400">· {photoA.filterName}</span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                      <span>After ({photoB.dateStr})</span>
                      {photoB.filterId && photoB.filterId !== 'normal' && (
                        <span className="text-[10px] text-stone-400">· {photoB.filterName}</span>
                      )}
                    </div>
                  </div>

                  <p className="text-center text-xs text-stone-400">
                    ↔ Drag the divider left or right to reveal skin transformation nuances across the two dates.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. CAROUSEL CHRONOLOGICAL SWIPE VIEW */}
      {activeTab === 'carousel' && (
        <CarouselView
          photos={photos}
          initialCategory={carouselCategory}
          onTakeNewPhoto={handleOpenCaptureModal}
          onInspectPhoto={(photo) => setViewPhoto(photo)}
          onEditPhoto={(photo) => {
            setAnnotationTarget({
              type: 'existing',
              photo: photo,
              imageSrc: photo.originalDataUrl || photo.dataUrl,
              initialAnnotations: photo.annotations || [],
              initialFilterId: photo.filterId || 'normal',
            });
            setAnnotationModalOpen(true);
          }}
          onShowToast={onShowToast}
          onCompareWithBaseline={(photoA, photoB) => {
            setComparePhotoAId(photoA.id);
            setComparePhotoBId(photoB.id);
            setActiveTab('compare');
            onShowToast(`Comparing Before (${photoA.dateStr}) and After (${photoB.dateStr})`, 'info');
          }}
        />
      )}

      {/* 4. SLIDESHOW ANIMATION & GIF EXPORT VIEW */}
      {activeTab === 'slideshow' && (
        <SlideshowView
          photos={photos}
          onTakeNewPhoto={handleOpenCaptureModal}
          onInspectPhoto={(photo) => setViewPhoto(photo)}
          onShowToast={onShowToast}
        />
      )}

      {/* 4. CAMERA SNAPSHOT MODAL */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-400" />
                <h3 className="font-serif text-xl font-medium text-stone-100">
                  {capturedPreview ? 'Review & Save Skin Entry' : 'Take Skin Progress Photo'}
                </h3>
              </div>
              <button
                onClick={handleCloseCaptureModal}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewport OR Captured Image Preview */}
            <div className="relative aspect-[4/5] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center">
              {capturedPreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={capturedPreview}
                    alt="Captured snapshot preview"
                    style={{
                      filter: getFilterOption(selectedCaptureFilterId).css,
                      transition: 'filter 0.25s ease',
                    }}
                    className="w-full h-full object-cover"
                  />
                  {selectedCaptureFilterId !== 'normal' && (
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow border border-white/20 ${
                          getFilterOption(selectedCaptureFilterId).badgeClass
                        }`}
                      >
                        {getFilterOption(selectedCaptureFilterId).name} Filter
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Oval Face Alignment Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-[65%] h-[75%] border-2 border-dashed border-rose-400/40 rounded-[50%] shadow-[0_0_20px_rgba(244,63,94,0.15)] flex flex-col items-center justify-between py-6">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-rose-300/80 bg-stone-950/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Align Face In Oval
                      </span>
                      <span className="text-[10px] text-stone-400 bg-stone-950/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Chin Here
                      </span>
                    </div>
                  </div>

                  {/* 3-Second Countdown Overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-in zoom-in-50 duration-150">
                      <span className="text-7xl font-serif text-white font-bold animate-pulse">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {/* Camera Error Fallback Message */}
                  {cameraError && (
                    <div className="absolute inset-0 p-6 bg-stone-950/95 flex flex-col items-center justify-center text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-amber-400" />
                      <p className="text-xs text-stone-300 max-w-sm">{cameraError}</p>
                      <label className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer">
                        <span>Select Photo from Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="user"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Camera Controls (if not yet captured) */}
            {!capturedPreview && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleToggleCameraFacing}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Switch front/back camera"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Flip</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerCapture(true)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Take photo with 3-second delay"
                  >
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>3s Timer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerCapture(false)}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture</span>
                  </button>
                </div>
              </div>
            )}

            {/* Entry Form (if snapshot captured) */}
            {capturedPreview && (
              <div className="space-y-4 pt-2">
                {/* Standardization Filter Selector */}
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                      <span>Standardization Filter</span>
                    </label>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {selectedCaptureFilterId === 'normal'
                        ? 'Natural shot'
                        : `${getFilterOption(selectedCaptureFilterId).name} active`}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-400 leading-tight">
                    Standardize room lighting & skin texture for clinical accuracy.
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    {IMAGE_FILTERS.map((f) => {
                      const isSel = selectedCaptureFilterId === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setSelectedCaptureFilterId(f.id);
                            onShowToast(`Filter set to ${f.name}`, 'info');
                          }}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            isSel
                              ? 'bg-rose-950/60 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/70'
                              : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
                          }`}
                        >
                          <span className="text-[11px] font-semibold truncate leading-tight">
                            {f.name}
                          </span>
                          <span className="text-[9px] text-stone-400 truncate">
                            {f.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Annotate Image Directly Callout */}
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3 shadow-inner">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-xs font-semibold text-stone-100">
                        Annotate Photo
                      </span>
                      {capturedAnnotations.length > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {capturedAnnotations.length} {capturedAnnotations.length === 1 ? 'Pin' : 'Pins'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400">
                      {capturedAnnotations.length > 0
                        ? `Annotations: ${capturedAnnotations.map((a) => a.text).slice(0, 2).join(', ')}${capturedAnnotations.length > 2 ? '...' : ''}`
                        : 'Pinpoint concerns (redness, blemish) or stamp products & date directly onto image'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAnnotationTarget({
                        type: 'captured',
                        imageSrc: capturedPreview,
                        initialAnnotations: capturedAnnotations,
                        initialFilterId: selectedCaptureFilterId,
                      });
                      setAnnotationModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                    <span>{capturedAnnotations.length > 0 ? 'Edit Pins' : 'Add Pins'}</span>
                  </button>
                </div>

                {/* Tag Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                    Progress Stage Tag
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Baseline',
                      'Week 1',
                      'Week 2',
                      'Week 4',
                      'Barrier Restored',
                      'Routine Update',
                      'Post-Treatment',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag as any)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          selectedTag === tag
                            ? 'bg-rose-950 text-rose-200 border border-rose-700'
                            : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Concern Tags (e.g. acne, hydration, glow) */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-rose-400" />
                      <span>Categorize by Concern Tags</span>
                    </label>
                    <span className="text-[10px] text-stone-400">
                      Multi-select concerns
                    </span>
                  </div>

                  {/* Preset tag buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_CONCERN_TAGS.map((tag) => {
                      const isSelected = selectedConcernTags.includes(tag);
                      const color = getConcernTagColor(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleCaptureTag(tag)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-rose-950 text-rose-100 border-rose-600 shadow-sm'
                              : `${color.bg} ${color.text} ${color.border} hover:opacity-90`
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-rose-400' : color.dot
                            }`}
                          />
                          <span>#{tag}</span>
                          {isSelected && <Check className="w-3 h-3 text-rose-300 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom tag input */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">#</span>
                      <input
                        type="text"
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                        placeholder="Add custom concern tag (e.g. pores, sensitivity)..."
                        className="w-full pl-6 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      disabled={!customTagInput.trim()}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 disabled:opacity-40 text-stone-200 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Custom tags entered */}
                  {selectedConcernTags.filter((t) => !DEFAULT_CONCERN_TAGS.includes(t as any)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold self-center">
                        Custom:
                      </span>
                      {selectedConcernTags
                        .filter((t) => !DEFAULT_CONCERN_TAGS.includes(t as any))
                        .map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-lg bg-stone-800 text-rose-300 border border-stone-700 text-xs flex items-center gap-1"
                          >
                            <span>#{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleCaptureTag(tag)}
                              className="text-stone-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Routine Time Category: Morning / Midday / Evening */}
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Routine Time Category</span>
                    </label>
                    <span className="text-[10px] text-stone-400">AM / Midday / PM</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTimeOfDay('morning')}
                      className={`p-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        selectedTimeOfDay === 'morning'
                          ? 'bg-amber-950/60 border-amber-600 text-amber-200 shadow-sm font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Morning</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTimeOfDay('midday')}
                      className={`p-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        selectedTimeOfDay === 'midday'
                          ? 'bg-sky-950/60 border-sky-600 text-sky-200 shadow-sm font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <CloudSun className="w-3.5 h-3.5 text-sky-400" />
                      <span>Midday</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTimeOfDay('evening')}
                      className={`p-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        selectedTimeOfDay === 'evening'
                          ? 'bg-indigo-950/60 border-indigo-600 text-indigo-200 shadow-sm font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Evening</span>
                    </button>
                  </div>
                </div>

                {/* Skin Feeling & Lighting */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                      Skin State Today
                    </label>
                    <select
                      value={selectedFeeling}
                      onChange={(e) => setSelectedFeeling(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200"
                    >
                      <option value="calm">Calm & Plump</option>
                      <option value="hydrated">Comfortably Hydrated</option>
                      <option value="reactive">Mild Stinging / Reactive</option>
                      <option value="dry">Dry / Flaky</option>
                      <option value="breakout">Active Breakout / Congestion</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                      Lighting Condition
                    </label>
                    <select
                      value={selectedLighting}
                      onChange={(e) => setSelectedLighting(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200"
                    >
                      <option value="natural-window">Natural Window Daylight</option>
                      <option value="bathroom">Bathroom Overhead Light</option>
                      <option value="outdoor">Outdoor Daylight</option>
                      <option value="studio">Studio Ring Light</option>
                    </select>
                  </div>
                </div>

                {/* Journal Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                    Observations & Active Ingredients Used
                  </label>
                  <textarea
                    rows={2}
                    value={photoNotes}
                    onChange={(e) => setPhotoNotes(e.target.value)}
                    placeholder="e.g. Started 5% azelaic acid today; cheeks look less flushed after double cleansing..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Final Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedPreview(null);
                      startCamera(facingMode);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium cursor-pointer"
                  >
                    Retake Photo
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePhotoEntry}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save to Private Gallery</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. FULLSCREEN INSPECT PHOTO MODAL */}
      {viewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 sm:p-7 flex flex-col space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400">
                    {viewPhoto.tag} Entry
                  </span>
                  {viewPhoto.filterId && viewPhoto.filterId !== 'normal' && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 flex items-center gap-1 ${
                        getFilterOption(viewPhoto.filterId).badgeClass
                      }`}
                    >
                      <SlidersHorizontal className="w-2.5 h-2.5" />
                      <span>{viewPhoto.filterName || getFilterOption(viewPhoto.filterId).name}</span>
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-medium text-stone-100">
                  {viewPhoto.dateStr} at {viewPhoto.timeStr}
                </h3>
              </div>
              <button
                onClick={() => setViewPhoto(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-res image with optional annotation markers */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 aspect-[4/5] border border-stone-800 max-h-[55vh] flex items-center justify-center">
              <img
                src={viewPhoto.dataUrl}
                alt="Enlarged skin progress"
                className="w-full h-full object-contain"
              />

              {/* Overlay annotation pins if present and enabled */}
              {showAnnotationsInView &&
                viewPhoto.annotations &&
                viewPhoto.annotations.map((ann) => {
                  let dotBg = 'bg-rose-500';
                  let badgeBorder = 'border-rose-500';
                  let badgeBg = 'bg-rose-950/90 text-rose-200';
                  if (ann.category === 'product') {
                    dotBg = 'bg-emerald-500';
                    badgeBorder = 'border-emerald-500';
                    badgeBg = 'bg-emerald-950/90 text-emerald-200';
                  } else if (ann.category === 'date') {
                    dotBg = 'bg-sky-500';
                    badgeBorder = 'border-sky-500';
                    badgeBg = 'bg-sky-950/90 text-sky-200';
                  } else if (ann.category === 'note') {
                    dotBg = 'bg-amber-500';
                    badgeBorder = 'border-amber-500';
                    badgeBg = 'bg-amber-950/90 text-amber-200';
                  }

                  return (
                    <div
                      key={ann.id}
                      style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                    >
                      <div className="relative flex items-center justify-center">
                        <span className={`animate-ping absolute inline-flex h-4 w-4 rounded-full opacity-60 ${dotBg}`} />
                        <span className={`relative inline-flex rounded-full h-3 w-3 border border-white ${dotBg}`} />
                      </div>
                      <div
                        className={`absolute left-3.5 -top-2.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${badgeBorder} ${badgeBg} shadow-lg whitespace-nowrap backdrop-blur-md`}
                      >
                        {ann.text}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Annotations Tags Section */}
            {viewPhoto.annotations && viewPhoto.annotations.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Image Annotations ({viewPhoto.annotations.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAnnotationsInView(!showAnnotationsInView)}
                    className="text-[10px] text-stone-400 hover:text-stone-200 underline cursor-pointer"
                  >
                    {showAnnotationsInView ? 'Hide Pins' : 'Show Pins on Photo'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {viewPhoto.annotations.map((ann) => (
                    <span
                      key={ann.id}
                      className="px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 flex items-center gap-1.5"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ann.category === 'concern'
                            ? 'bg-rose-400'
                            : ann.category === 'product'
                            ? 'bg-emerald-400'
                            : ann.category === 'date'
                            ? 'bg-sky-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <strong className="text-[10px] uppercase text-stone-400">{ann.category}:</strong>
                      <span>{ann.text}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categorized Concern Tags Section */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Concern Tags ({viewPhoto.concernTags?.length || 0})</span>
                </span>
                <span className="text-[10px] text-stone-400">
                  Categorized for journey search
                </span>
              </div>

              {/* Tag pills with remove option */}
              <div className="flex flex-wrap items-center gap-1.5">
                {viewPhoto.concernTags && viewPhoto.concernTags.length > 0 ? (
                  viewPhoto.concernTags.map((tag) => {
                    const color = getConcernTagColor(tag);
                    return (
                      <span
                        key={tag}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${color.border} ${color.bg} ${color.text} flex items-center gap-1.5`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTagFromExisting(viewPhoto.id, tag)}
                          className="hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                          title={`Remove #${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-stone-500 italic">No concern tags assigned to this photo.</span>
                )}
              </div>

              {/* Inline Quick Add Tag */}
              <div className="pt-2 border-t border-stone-850/80 flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">
                  + Add Tag:
                </span>
                <div className="flex flex-wrap gap-1">
                  {DEFAULT_CONCERN_TAGS.filter(
                    (t) => !viewPhoto.concernTags?.includes(t)
                  ).map((tag) => {
                    const color = getConcernTagColor(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTagToExisting(viewPhoto.id, tag)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border ${color.border} ${color.bg} ${color.text} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        +{tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="text"
                    value={modalNewTagInput}
                    onChange={(e) => setModalNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (modalNewTagInput.trim()) {
                          handleAddTagToExisting(viewPhoto.id, modalNewTagInput);
                          setModalNewTagInput('');
                        }
                      }
                    }}
                    placeholder="Custom tag..."
                    className="w-24 px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (modalNewTagInput.trim()) {
                        handleAddTagToExisting(viewPhoto.id, modalNewTagInput);
                        setModalNewTagInput('');
                      }
                    }}
                    disabled={!modalNewTagInput.trim()}
                    className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 disabled:opacity-40 text-stone-300 text-[10px] font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata & Journal Note */}
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-3 text-stone-400">
                <span>
                  Feeling: <strong className="text-stone-200 capitalize">{viewPhoto.skinFeeling}</strong>
                </span>
                <span>·</span>
                <span>
                  Lighting: <strong className="text-stone-200 capitalize">{viewPhoto.lighting.replace('-', ' ')}</strong>
                </span>
                <span>·</span>
                <span>
                  Time: <strong className="text-stone-200 capitalize">{viewPhoto.timeOfDay}</strong>
                </span>
              </div>

              {viewPhoto.notes && (
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-850 text-stone-300 leading-relaxed italic">
                  “{viewPhoto.notes}”
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleDeletePhoto(viewPhoto.id)}
                className="px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAnnotationTarget({
                      type: 'existing',
                      photo: viewPhoto,
                      imageSrc: viewPhoto.originalDataUrl || viewPhoto.dataUrl,
                      initialAnnotations: viewPhoto.annotations || [],
                      initialFilterId: viewPhoto.filterId || 'normal',
                    });
                    setAnnotationModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{viewPhoto.annotations?.length ? 'Edit Annotations & Filters' : 'Add Annotations & Filters'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const primaryCat = viewPhoto.concernTags?.[0] || viewPhoto.timeOfDay || 'all';
                    setCarouselCategory(primaryCat);
                    setViewPhoto(null);
                    setActiveTab('carousel');
                    onShowToast(`Opened Carousel View for #${primaryCat}`, 'info');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-750 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-rose-400" />
                  <span>View in Carousel</span>
                </button>

                <button
                  onClick={() => handleDownloadPhoto(viewPhoto)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. IMAGE ANNOTATION & FILTER STUDIO MODAL */}
      {annotationModalOpen && annotationTarget && (
        <ImageAnnotationModal
          isOpen={annotationModalOpen}
          onClose={() => {
            setAnnotationModalOpen(false);
            setAnnotationTarget(null);
          }}
          imageSrc={annotationTarget.imageSrc}
          photoDateStr={annotationTarget.photo?.dateStr}
          photoTimeStr={annotationTarget.photo?.timeStr}
          photoTag={annotationTarget.photo?.tag}
          initialAnnotations={annotationTarget.initialAnnotations}
          initialFilterId={annotationTarget.initialFilterId || 'normal'}
          onSave={handleSaveAnnotations}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
