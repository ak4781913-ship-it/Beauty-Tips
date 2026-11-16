import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { SkinProgressPhoto, getFilterOption } from './progressGalleryStorage';

export interface GifExportOptions {
  photos: SkinProgressPhoto[];
  delayMs?: number; // Duration each photo is shown (default 750ms)
  width?: number; // Target width (default 480)
  height?: number; // Target height (default 600 - 4:5 social ratio)
  includeWatermark?: boolean; // Render clinical date & stage watermark overlay
  standardizeFilterId?: string; // Optional filter override (e.g. 'grayscale', 'brighten')
  boomerang?: boolean; // Forward then reverse loop
  repeat?: number; // 0 for infinite loop (standard GIF)
  onProgress?: (current: number, total: number, percent: number) => void;
  signal?: { aborted: boolean };
}

export interface GifExportResult {
  blob: Blob;
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
  frameCount: number;
  durationSeconds: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image for GIF: ' + err));
    img.src = src;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Renders a single photo with optional standardized lighting filter and clinical watermark overlay
 */
function renderPhotoToCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  photo: SkinProgressPhoto,
  frameIdx: number,
  totalFrames: number,
  options: {
    width: number;
    height: number;
    includeWatermark: boolean;
    filterCss: string;
  }
) {
  const { width, height, includeWatermark, filterCss } = options;
  canvas.width = width;
  canvas.height = height;

  // Clear canvas
  ctx.fillStyle = '#0c0a09'; // stone-950 dark background
  ctx.fillRect(0, 0, width, height);

  // Apply filter if specified
  if (filterCss && filterCss !== 'none') {
    ctx.filter = filterCss;
  } else {
    ctx.filter = 'none';
  }

  // Draw image with object-fit: cover aspect ratio
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;

  let drawW = width;
  let drawH = height;
  let drawX = 0;
  let drawY = 0;

  if (imgAspect > canvasAspect) {
    // Image is wider than canvas
    drawW = height * imgAspect;
    drawX = (width - drawW) / 2;
  } else {
    // Image is taller than canvas
    drawH = width / imgAspect;
    drawY = (height - drawH) / 2;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // Reset filter for vector overlay rendering
  ctx.filter = 'none';

  // Render clinical watermark overlays if requested
  if (includeWatermark) {
    const scale = width / 480;

    // Top subtle gradient
    const topGrad = ctx.createLinearGradient(0, 0, 0, 75 * scale);
    topGrad.addColorStop(0, 'rgba(12, 10, 9, 0.7)');
    topGrad.addColorStop(1, 'rgba(12, 10, 9, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, 75 * scale);

    // Bottom subtle gradient
    const botGrad = ctx.createLinearGradient(0, height - 75 * scale, 0, height);
    botGrad.addColorStop(0, 'rgba(12, 10, 9, 0)');
    botGrad.addColorStop(1, 'rgba(12, 10, 9, 0.85)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, height - 75 * scale, width, 75 * scale);

    // 1. Stage Tag & Date Badge (Top-left pill)
    const badgeText = `${photo.tag || 'Progress'} · ${photo.dateStr}`;
    ctx.font = `bold ${Math.round(11 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const textWidth = ctx.measureText(badgeText).width;
    const badgePadX = 10 * scale;
    const badgeH = 24 * scale;
    const badgeW = textWidth + badgePadX * 2;
    const badgeX = 14 * scale;
    const badgeY = 14 * scale;

    // Badge background
    ctx.save();
    ctx.fillStyle = 'rgba(12, 10, 9, 0.82)';
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)'; // Rose border
    ctx.lineWidth = 1.2 * scale;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6 * scale)
      : ctx.rect(badgeX, badgeY, badgeW, badgeH);
    ctx.fill();
    ctx.stroke();

    // Badge text
    ctx.fillStyle = '#f43f5e'; // Rose text
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, badgeX + badgePadX, badgeY + badgeH / 2);
    ctx.restore();

    // 1b. Caption / Text Label Banner (if photo has a custom caption tracking skin concern)
    if (photo.caption) {
      ctx.save();
      const capText = `“${photo.caption}”`;
      ctx.font = `italic 600 ${Math.round(12 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const maxCapW = width - 28 * scale;
      const capW = Math.min(maxCapW, ctx.measureText(capText).width + 16 * scale);
      const capH = 24 * scale;
      const capX = 14 * scale;
      const capY = badgeY + badgeH + 6 * scale;

      ctx.fillStyle = 'rgba(12, 10, 9, 0.88)';
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(capX, capY, capW, capH, 5 * scale)
        : ctx.rect(capX, capY, capW, capH);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fecdd3'; // Rose-200
      ctx.textBaseline = 'middle';
      ctx.fillText(capText, capX + 8 * scale, capY + capH / 2, capW - 16 * scale);
      ctx.restore();
    }

    // 2. Frame Indicator (Top-right)
    const frameText = `${frameIdx + 1} / ${totalFrames}`;
    ctx.save();
    ctx.font = `600 ${Math.round(10 * scale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
    const frameW = ctx.measureText(frameText).width + 12 * scale;
    const frameX = width - frameW - 14 * scale;
    ctx.fillStyle = 'rgba(28, 25, 23, 0.82)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(frameX, badgeY, frameW, badgeH, 6 * scale)
      : ctx.rect(frameX, badgeY, frameW, badgeH);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e7e5e4';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText, frameX + 6 * scale, badgeY + badgeH / 2);
    ctx.restore();

    // 3. Bottom Tags & Brand Stamp
    ctx.save();
    const botY = height - 16 * scale;
    // Brand stamp on left
    ctx.font = `600 ${Math.round(11 * scale)}px -apple-system, BlinkMacSystemFont, serif`;
    ctx.fillStyle = '#fda4af'; // light rose
    ctx.textBaseline = 'bottom';
    ctx.fillText('Skin Journey Animation', 14 * scale, botY);

    // Tags on right (if any)
    if (photo.concernTags && photo.concernTags.length > 0) {
      const tagsText = photo.concernTags.slice(0, 3).map((t) => `#${t}`).join(' ');
      ctx.font = `500 ${Math.round(10 * scale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = '#a8a29e';
      const tagsW = ctx.measureText(tagsText).width;
      ctx.fillText(tagsText, width - tagsW - 14 * scale, botY);
    }
    ctx.restore();
  }
}

/**
 * Generates an animated GIF from skin progress photos with configurable frame rate and options
 */
export async function generateSlideshowGif(
  options: GifExportOptions
): Promise<GifExportResult> {
  const {
    photos,
    delayMs = 750,
    width = 480,
    height = 600,
    includeWatermark = true,
    standardizeFilterId,
    boomerang = false,
    repeat = 0, // 0 = infinite loop
    onProgress,
    signal,
  } = options;

  if (!photos || photos.length === 0) {
    throw new Error('No photos provided for GIF generation.');
  }

  // Pre-filter option if requested
  const filterOpt = standardizeFilterId ? getFilterOption(standardizeFilterId) : null;
  const filterCss = filterOpt ? filterOpt.css : 'none';

  // Determine frame sequence (support boomerang bounce effect)
  let framePhotos = [...photos];
  if (boomerang && photos.length > 2) {
    const reversedMiddle = photos.slice(1, photos.length - 1).reverse();
    framePhotos = [...photos, ...reversedMiddle];
  }

  const totalFrames = framePhotos.length;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context could not be created.');
  }

  // Pre-load all photo images
  const loadedImages: HTMLImageElement[] = [];
  for (let i = 0; i < framePhotos.length; i++) {
    if (signal?.aborted) {
      throw new Error('GIF generation cancelled.');
    }
    const img = await loadImage(framePhotos[i].dataUrl);
    loadedImages.push(img);
  }

  // Initialize GIFEncoder
  const gif = GIFEncoder();

  // Encode each frame
  for (let i = 0; i < loadedImages.length; i++) {
    if (signal?.aborted) {
      throw new Error('GIF generation cancelled.');
    }

    const img = loadedImages[i];
    const photo = framePhotos[i];

    // Render frame to canvas
    renderPhotoToCanvas(canvas, ctx, img, photo, i, framePhotos.length, {
      width,
      height,
      includeWatermark,
      filterCss,
    });

    // Extract raw RGBA image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const rgba = imageData.data;

    // Quantize 256 color palette for this frame
    const palette = quantize(rgba, 256);

    // Apply color palette to indexed pixels
    const index = applyPalette(rgba, palette);

    // Write frame to GIF encoder with frame-specific delay and repeat
    gif.writeFrame(index, width, height, {
      palette,
      delay: delayMs,
      repeat: i === 0 ? repeat : undefined,
    });

    // Notify progress
    const percent = Math.round(((i + 1) / totalFrames) * 100);
    if (onProgress) {
      onProgress(i + 1, totalFrames, percent);
    }

    // Yield to event loop to keep UI smooth and responsive
    await new Promise((r) => setTimeout(r, 12));
  }

  // Finalize GIF stream
  gif.finish();

  const bytes = gif.bytes();
  const bufferSlice = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([bufferSlice], { type: 'image/gif' });
  const url = URL.createObjectURL(blob);
  const sizeBytes = blob.size;
  const sizeFormatted = formatBytes(sizeBytes);
  const durationSeconds = (totalFrames * delayMs) / 1000;

  return {
    blob,
    url,
    sizeBytes,
    sizeFormatted,
    frameCount: totalFrames,
    durationSeconds,
  };
}
