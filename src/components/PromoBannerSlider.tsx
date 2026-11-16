import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ExternalLink, Pause, Play } from 'lucide-react';
import { HOMEPAGE_PROMO_SLIDES, PromoSlide } from '../data/promotions';

interface PromoBannerSliderProps {
  slides?: PromoSlide[];
  autoPlayInterval?: number; // default 5000ms
}

export const PromoBannerSlider: React.FC<PromoBannerSliderProps> = ({
  slides = HOMEPAGE_PROMO_SLIDES,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const totalSlides = slides.length;

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Automatic slideshow timer
  useEffect(() => {
    if (!isPlaying || isHovered || reducedMotion || totalSlides <= 1) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, reducedMotion, totalSlides, autoPlayInterval, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Keyboard navigation when slider is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 select-none"
      aria-roledescription="carousel"
      aria-label="Beauty Tips by Abbas Featured Promotions"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Outer Banner Card Container with fixed aspect ratio to eliminate layout shift */}
      <div
        className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl shadow-rose-950/20 aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[340px] sm:min-h-[380px] lg:min-h-[420px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide Imagery with smooth crossfade */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.imageUrl}
                alt={slide.imageAlt}
                className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />

              {/* Scrim Gradient Overlays for High-Contrast Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent sm:hidden" />
              <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-transparent w-full lg:w-3/4" />
              <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-stone-950/40 via-transparent to-stone-950/20" />
            </div>
          );
        })}

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end sm:justify-center p-6 sm:p-10 lg:p-14 max-w-2xl pointer-events-none">
          <div className="space-y-3 sm:space-y-4 pointer-events-auto animate-in fade-in duration-300">
            {/* Optional Promotional Badge */}
            {currentSlide.badge && (
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-rose-300 bg-rose-950/80 border border-rose-800/60 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>{currentSlide.badge}</span>
              </div>
            )}

            {/* Headline */}
            {currentSlide.headline && (
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-snug tracking-tight drop-shadow-md">
                {currentSlide.headline}
              </h2>
            )}

            {/* Description */}
            {currentSlide.description && (
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none drop-shadow">
                {currentSlide.description}
              </p>
            )}

            {/* Call To Action Button (Conditional based on ctaText and ctaUrl) */}
            {currentSlide.ctaText && currentSlide.ctaUrl && (
              <div className="pt-2">
                {currentSlide.isExternal ? (
                  <a
                    href={currentSlide.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/60 hover:shadow-rose-900/80 transition-all duration-200 group cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <Link
                    to={currentSlide.ctaUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/60 hover:shadow-rose-900/80 transition-all duration-200 group cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Previous and Next Navigation Arrows */}
        <div className="absolute inset-y-0 right-4 sm:right-6 z-30 flex items-center gap-2 pointer-events-none">
          <button
            onClick={prevSlide}
            aria-label="Previous promotional slide"
            className="pointer-events-auto p-2 sm:p-3 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-800/80 hover:border-rose-500/50 backdrop-blur-md transition-all shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next promotional slide"
            className="pointer-events-auto p-2 sm:p-3 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-800/80 hover:border-rose-500/50 backdrop-blur-md transition-all shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Bottom Pagination Controls & Slide Indicators */}
        <div className="absolute bottom-3 sm:bottom-5 left-6 right-6 sm:left-10 sm:right-10 z-30 flex items-center justify-between pointer-events-none">
          {/* Clickable Pagination Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto" role="tablist" aria-label="Slide controls">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}: ${slide.headline || slide.badge || 'Promotion'}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                    isActive
                      ? 'w-6 sm:w-8 bg-rose-500 shadow-md shadow-rose-950/50'
                      : 'w-2 sm:w-2.5 bg-stone-700/80 hover:bg-stone-500'
                  }`}
                />
              );
            })}
          </div>

          {/* Slide Number Counter & Play/Pause Control */}
          <div className="flex items-center gap-2 pointer-events-auto bg-stone-950/80 backdrop-blur-md border border-stone-800/80 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono text-stone-300">
            <span>
              0{currentIndex + 1} / 0{totalSlides}
            </span>
            <span className="text-stone-600">·</span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause auto-rotation' : 'Play auto-rotation'}
              className="text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-rose-400" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
