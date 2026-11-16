export interface SkinAnnotation {
  id: string;
  category: 'date' | 'concern' | 'product' | 'note';
  text: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  timestamp?: number;
}

export const DEFAULT_CONCERN_TAGS = [
  'acne',
  'hydration',
  'glow',
  'redness',
  'barrier',
  'pigmentation',
  'texture',
  'anti-aging',
  'morning',
  'evening',
] as const;

export type ConcernTag = (typeof DEFAULT_CONCERN_TAGS)[number] | string;

export interface SkinProgressPhoto {
  id: string;
  dataUrl: string; // Base64 data URL
  originalDataUrl?: string; // Un-annotated original image dataUrl
  capturedAt: number; // timestamp
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // e.g. "09:30 AM"
  timeOfDay: 'morning' | 'evening' | 'midday';
  tag: 'Baseline' | 'Week 1' | 'Week 2' | 'Week 4' | 'Barrier Restored' | 'Routine Update' | 'Post-Treatment' | 'General';
  skinFeeling: 'calm' | 'hydrated' | 'reactive' | 'dry' | 'breakout';
  notes: string;
  lighting: 'natural-window' | 'bathroom' | 'outdoor' | 'studio';
  annotations?: SkinAnnotation[];
  concernTags?: string[]; // Tags e.g. ['acne', 'hydration', 'glow']
  filterId?: string; // e.g. 'grayscale', 'brighten', 'warm', 'normal'
  filterName?: string; // Display name e.g. 'Grayscale'
  caption?: string; // Custom headline text label/caption tracking specific concerns
}

const DB_NAME = 'beauty_tips_skin_progress_db';
const DB_VERSION = 1;
const STORE_NAME = 'skin_photos';
const FALLBACK_STORAGE_KEY = 'beauty_skin_progress_fallback_photos';

export const PROGRESS_GALLERY_EVENT = 'beauty_progress_gallery_updated';

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('capturedAt', 'capturedAt', { unique: false });
        store.createIndex('dateStr', 'dateStr', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Fetches all saved skin progress photos, sorted chronologically descending
 */
export async function getAllProgressPhotos(): Promise<SkinProgressPhoto[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const rawPhotos: SkinProgressPhoto[] = request.result || [];
        const photos: SkinProgressPhoto[] = rawPhotos.map((p) => ({
          ...p,
          concernTags: Array.isArray(p.concernTags) ? p.concernTags : [],
        }));
        photos.sort((a, b) => b.capturedAt - a.capturedAt);
        resolve(photos);
      };

      request.onerror = () => {
        resolve(getFallbackLocalStoragePhotos());
      };
    });
  } catch {
    return getFallbackLocalStoragePhotos();
  }
}

/**
 * Saves a new photo entry to IndexedDB with localStorage fallback
 */
export async function saveProgressPhoto(photo: SkinProgressPhoto): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(photo);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('Falling back to localStorage for photo save:', e);
    saveToFallbackLocalStorage(photo);
  }

  // Notify listeners across app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROGRESS_GALLERY_EVENT));
  }
}

/**
 * Updates the concern tags on an existing photo
 */
export async function updatePhotoTags(id: string, tags: string[]): Promise<SkinProgressPhoto | null> {
  const all = await getAllProgressPhotos();
  const target = all.find((p) => p.id === id);
  if (!target) return null;

  const updated: SkinProgressPhoto = {
    ...target,
    concernTags: tags,
  };
  await saveProgressPhoto(updated);
  return updated;
}

/**
 * Updates the text label / caption on an existing photo
 */
export async function updatePhotoCaption(id: string, caption: string): Promise<SkinProgressPhoto | null> {
  const all = await getAllProgressPhotos();
  const target = all.find((p) => p.id === id);
  if (!target) return null;

  const updated: SkinProgressPhoto = {
    ...target,
    caption: caption.trim(),
  };
  await saveProgressPhoto(updated);
  return updated;
}

export function getConcernTagColor(tag: string): { bg: string; text: string; border: string; dot: string } {
  const normalized = tag.toLowerCase().trim();
  switch (normalized) {
    case 'acne':
      return { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' };
    case 'hydration':
      return { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30', dot: 'bg-cyan-400' };
    case 'glow':
      return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' };
    case 'redness':
      return { bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30', dot: 'bg-pink-400' };
    case 'barrier':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' };
    case 'pigmentation':
      return { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400' };
    case 'texture':
      return { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30', dot: 'bg-indigo-400' };
    case 'anti-aging':
      return { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30', dot: 'bg-teal-400' };
    case 'morning':
      return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' };
    case 'evening':
      return { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30', dot: 'bg-indigo-400' };
    case 'midday':
      return { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/30', dot: 'bg-sky-400' };
    default:
      return { bg: 'bg-stone-800', text: 'text-stone-300', border: 'border-stone-700', dot: 'bg-stone-400' };
  }
}

/**
 * Deletes a photo by its ID
 */
export async function deleteProgressPhoto(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Also delete from fallback
    deleteFromFallbackLocalStorage(id);
  }

  deleteFromFallbackLocalStorage(id);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROGRESS_GALLERY_EVENT));
  }
}

/**
 * Clears all progress photos
 */
export async function clearAllProgressPhotos(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(FALLBACK_STORAGE_KEY);
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROGRESS_GALLERY_EVENT));
  }
}

// Fallback localStorage handlers in case IndexedDB is restricted
function getFallbackLocalStoragePhotos(): SkinProgressPhoto[] {
  try {
    const raw = localStorage.getItem(FALLBACK_STORAGE_KEY);
    const photos: SkinProgressPhoto[] = raw ? JSON.parse(raw) : [];
    const normalized = photos.map((p) => ({
      ...p,
      concernTags: Array.isArray(p.concernTags) ? p.concernTags : [],
    }));
    normalized.sort((a, b) => b.capturedAt - a.capturedAt);
    return normalized;
  } catch {
    return [];
  }
}

function saveToFallbackLocalStorage(photo: SkinProgressPhoto) {
  try {
    const list = getFallbackLocalStoragePhotos();
    const updated = [photo, ...list.filter((p) => p.id !== photo.id)].slice(0, 5); // limit to avoid localStorage overflow
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('LocalStorage quota exceeded for photo save:', err);
  }
}

function deleteFromFallbackLocalStorage(id: string) {
  try {
    const list = getFallbackLocalStoragePhotos();
    const updated = list.filter((p) => p.id !== id);
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * Utility to compress and resize an image from file or base64 to ensure smooth storage & fast rendering
 */
export function compressImage(
  dataUrlOrFile: string | File,
  maxWidth = 1080,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const resultDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(resultDataUrl);
    };

    img.onerror = (err) => reject(err);

    if (typeof dataUrlOrFile === 'string') {
      img.src = dataUrlOrFile;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(dataUrlOrFile);
    }
  });
}

export interface ImageFilterOption {
  id: string;
  name: string;
  subtitle: string;
  css: string;
  badgeClass: string;
}

export const IMAGE_FILTERS: ImageFilterOption[] = [
  {
    id: 'normal',
    name: 'Original',
    subtitle: 'Natural unfiltered shot',
    css: 'none',
    badgeClass: 'bg-stone-700 text-stone-200',
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    subtitle: 'Texture & bump clarity',
    css: 'grayscale(100%) contrast(112%)',
    badgeClass: 'bg-stone-500 text-white',
  },
  {
    id: 'brighten',
    name: 'Brighten',
    subtitle: 'Normalizes dim light',
    css: 'brightness(1.18) contrast(1.05)',
    badgeClass: 'bg-amber-400 text-stone-950',
  },
  {
    id: 'warm',
    name: 'Warm Daylight',
    subtitle: 'Golden balance',
    css: 'sepia(0.25) saturate(1.15) brightness(1.05)',
    badgeClass: 'bg-orange-400 text-stone-950',
  },
  {
    id: 'cool',
    name: 'Cool Tone',
    subtitle: 'Redness reduction',
    css: 'saturate(0.85) contrast(1.08) brightness(1.02)',
    badgeClass: 'bg-cyan-400 text-stone-950',
  },
  {
    id: 'clinical-contrast',
    name: 'Clinical Contrast',
    subtitle: 'Pigmentation edges',
    css: 'contrast(1.25) brightness(1.02)',
    badgeClass: 'bg-rose-500 text-white',
  },
];

export function getFilterOption(filterId?: string): ImageFilterOption {
  if (!filterId) return IMAGE_FILTERS[0];
  return IMAGE_FILTERS.find((f) => f.id === filterId) || IMAGE_FILTERS[0];
}

/**
 * Bakes text annotations and optional image standardization filter directly onto an image canvas
 */
export function bakeAnnotationsToImage(
  imageDataUrl: string,
  annotations: SkinAnnotation[] = [],
  filterCss?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const hasAnnotations = annotations && annotations.length > 0;
    const hasFilter = filterCss && filterCss !== 'none';

    if (!hasAnnotations && !hasFilter) {
      resolve(imageDataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      // Apply image filter to standardize lighting if provided
      if (hasFilter) {
        ctx.filter = filterCss;
      }

      // Draw the base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Reset filter before rendering crisp annotation vector badges and text
      ctx.filter = 'none';

      // Scale factors for crisp resolution rendering
      const scale = Math.max(canvas.width / 800, 1);
      const fontSize = Math.round(14 * scale);
      const badgeFontSize = Math.round(10 * scale);
      const padding = Math.round(10 * scale);
      const radius = Math.round(8 * scale);
      const pinRadius = Math.round(7 * scale);

      annotations.forEach((ann) => {
        const x = (ann.x / 100) * canvas.width;
        const y = (ann.y / 100) * canvas.height;

        let primaryColor = '#f43f5e'; // rose for concern
        let badgeBg = 'rgba(244, 63, 94, 0.25)';
        let categoryLabel = 'CONCERN';

        if (ann.category === 'product') {
          primaryColor = '#10b981'; // emerald
          badgeBg = 'rgba(16, 185, 129, 0.25)';
          categoryLabel = 'PRODUCT NOTE';
        } else if (ann.category === 'date') {
          primaryColor = '#38bdf8'; // sky
          badgeBg = 'rgba(56, 189, 248, 0.25)';
          categoryLabel = 'LOGGED DATE';
        } else if (ann.category === 'note') {
          primaryColor = '#fbbf24'; // amber
          badgeBg = 'rgba(251, 191, 36, 0.25)';
          categoryLabel = 'OBSERVATION';
        }

        // Draw Target Pin Ring
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8 * scale;

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(x, y, pinRadius * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor + '44'; // 25% opacity
        ctx.fill();

        // Main pin ring
        ctx.beginPath();
        ctx.arc(x, y, pinRadius, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();
        ctx.lineWidth = 2 * scale;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Center white dot
        ctx.beginPath();
        ctx.arc(x, y, pinRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // Prepare Text & Card dimensions
        ctx.save();
        ctx.font = `600 ${fontSize}px sans-serif`;
        const textMetrics = ctx.measureText(ann.text);
        const textWidth = textMetrics.width;

        ctx.font = `700 ${badgeFontSize}px sans-serif`;
        const categoryMetrics = ctx.measureText(categoryLabel);
        const categoryWidth = categoryMetrics.width;

        const boxWidth = Math.max(textWidth, categoryWidth) + padding * 2.5;
        const boxHeight = fontSize + badgeFontSize + padding * 2.4;

        // Position card offset from pin, ensuring it doesn't clip outside canvas
        let cardX = x + pinRadius * 1.5;
        let cardY = y - boxHeight / 2;

        if (cardX + boxWidth > canvas.width - 15) {
          cardX = x - boxWidth - pinRadius * 1.5;
        }
        if (cardX < 15) {
          cardX = 15;
        }
        if (cardY + boxHeight > canvas.height - 15) {
          cardY = canvas.height - boxHeight - 15;
        }
        if (cardY < 15) {
          cardY = 15;
        }

        // Draw pointer connecting line
        ctx.beginPath();
        ctx.moveTo(x, y);
        const lineTargetX = cardX < x ? cardX + boxWidth : cardX;
        const lineTargetY = cardY + boxHeight / 2;
        ctx.lineTo(lineTargetX, lineTargetY);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        // Draw card background
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4 * scale;

        ctx.fillStyle = 'rgba(24, 24, 27, 0.94)'; // Zinc-900 high contrast dark
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5 * scale;

        // Rounded box path
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(cardX, cardY, boxWidth, boxHeight, radius)
          : ctx.rect(cardX, cardY, boxWidth, boxHeight);
        ctx.fill();
        ctx.stroke();

        // Draw Category Tag background & text
        const tagX = cardX + padding;
        const tagY = cardY + padding * 0.7;
        const tagHeight = badgeFontSize + 6 * scale;
        const tagBoxWidth = categoryWidth + 8 * scale;

        ctx.fillStyle = badgeBg;
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(tagX, tagY, tagBoxWidth, tagHeight, 4 * scale)
          : ctx.rect(tagX, tagY, tagBoxWidth, tagHeight);
        ctx.fill();

        ctx.fillStyle = primaryColor;
        ctx.font = `700 ${badgeFontSize}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(categoryLabel, tagX + 4 * scale, tagY + tagHeight / 2);

        // Draw Annotation Text
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${fontSize}px sans-serif`;
        ctx.textBaseline = 'top';
        ctx.fillText(ann.text, cardX + padding, cardY + padding * 1.1 + tagHeight);

        ctx.restore();
      });

      try {
        const finalDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        resolve(finalDataUrl);
      } catch (err) {
        console.error('Failed to export canvas with annotations:', err);
        resolve(imageDataUrl);
      }
    };

    img.onerror = (err) => {
      console.error('Image load failed for baking annotations:', err);
      resolve(imageDataUrl);
    };

    img.src = imageDataUrl;
  });
}

