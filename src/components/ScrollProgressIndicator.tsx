import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, Check } from 'lucide-react';

interface ScrollProgressIndicatorProps {
  /**
   * Optional custom container selector to measure.
   * Defaults to 'article, [data-reading-container="true"]'.
   */
  containerSelector?: string;
  /**
   * Whether to display the 'Time remaining' label next to the progress bar.
   * Defaults to true.
   */
  showTimeRemaining?: boolean;
  /**
   * Whether to display the percentage readout alongside the progress indicator.
   * Defaults to true.
   */
  showPercentageBadge?: boolean;
}

export const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  containerSelector = 'article, [data-reading-container="true"]',
  showTimeRemaining = true,
  showPercentageBadge = true,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [totalMinutes, setTotalMinutes] = useState<number>(3);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(3);
  const [remainingText, setRemainingText] = useState<string>('3 mins');
  const location = useLocation();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset progress on route navigation
    setProgress(0);
    setIsVisible(false);

    // Determine if the current route or page contains an article/reading context
    const checkIsArticleContext = () => {
      const path = location.pathname;
      const isKnownArticleRoute =
        path.startsWith('/beauty-tips/') ||
        path.startsWith('/skin-care/') ||
        path.startsWith('/skincare/') ||
        path.startsWith('/makeup/') ||
        path.startsWith('/hair-care/') ||
        path.startsWith('/haircare/') ||
        path === '/acne-pimples' ||
        path === '/dark-spots' ||
        path === '/privacy-policy' ||
        path === '/disclaimer' ||
        path === '/ingredients' ||
        path === '/treatments';

      const hasArticleElement = Boolean(document.querySelector(containerSelector));
      return isKnownArticleRoute || hasArticleElement;
    };

    const isArticle = checkIsArticleContext();
    if (!isArticle) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const updateScrollProgress = () => {
      const targetElement = document.querySelector(containerSelector) as HTMLElement | null;

      // 1. Calculate / Read Total Estimated Reading Minutes for current article
      let estimatedTotal = 3;
      if (targetElement) {
        const attrMinutes = targetElement.getAttribute('data-total-minutes');
        if (attrMinutes) {
          const parsed = parseInt(attrMinutes, 10);
          if (!isNaN(parsed) && parsed > 0) {
            estimatedTotal = parsed;
          }
        } else {
          // Check if any element in the active reading scope provides data-total-minutes
          const globalAttr = document.querySelector('[data-total-minutes]')?.getAttribute('data-total-minutes');
          if (globalAttr) {
            const parsed = parseInt(globalAttr, 10);
            if (!isNaN(parsed) && parsed > 0) {
              estimatedTotal = parsed;
            }
          } else {
            // Compute from text word count at standard 200 words-per-minute rate
            const text = targetElement.innerText || targetElement.textContent || '';
            const words = text.trim().split(/\s+/).filter(Boolean).length;
            if (words > 0) {
              estimatedTotal = Math.max(1, Math.ceil(words / 200));
            }
          }
        }
      }
      setTotalMinutes(estimatedTotal);

      // 2. Measure scroll progress through the article
      let currentProgress = 0;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Reading start offset: when the user scrolls past the top of the article
        const startY = Math.max(0, elementTop - 80);
        // Reading finish offset: when the bottom of the article meets the bottom of the viewport
        const endY = elementTop + elementHeight - windowHeight;

        if (endY <= startY) {
          // Fallback if article is shorter than the viewport
          const docHeight = document.documentElement.scrollHeight - windowHeight;
          const current = docHeight > 0 ? (scrollTop / docHeight) * 100 : 100;
          currentProgress = Math.min(100, Math.max(0, current));
        } else {
          const current = ((scrollTop - startY) / (endY - startY)) * 100;
          currentProgress = Math.min(100, Math.max(0, current));
        }
      } else {
        // Fallback for long document reading
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const current = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        currentProgress = Math.min(100, Math.max(0, current));
      }

      setProgress(currentProgress);

      // 3. Compute remaining minutes based on unread ratio
      const unreadFraction = Math.max(0, (100 - currentProgress) / 100);
      const rawMinutesLeft = estimatedTotal * unreadFraction;

      let calcRemainingMins: number;
      let label: string;

      if (currentProgress >= 98 || unreadFraction <= 0.02) {
        calcRemainingMins = 0;
        label = '0 min (Complete)';
      } else if (rawMinutesLeft < 0.8) {
        calcRemainingMins = 1;
        label = '< 1 min';
      } else {
        calcRemainingMins = Math.max(1, Math.round(rawMinutesLeft));
        label = `${calcRemainingMins} ${calcRemainingMins === 1 ? 'min' : 'mins'}`;
      }

      setMinutesRemaining(calcRemainingMins);
      setRemainingText(label);
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        updateScrollProgress();

        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 1200);
      });
    };

    // Initial calculation after microtask to allow DOM hydration
    const timer = setTimeout(() => {
      updateScrollProgress();
    }, 150);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Optional observer if images or async widgets load inside article
    const targetElement = document.querySelector(containerSelector);
    let resizeObserver: ResizeObserver | null = null;
    if (targetElement && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        updateScrollProgress();
      });
      resizeObserver.observe(targetElement);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [location.pathname, containerSelector, showPercentageBadge, showTimeRemaining]);

  if (!isVisible) {
    return null;
  }

  const roundedProgress = Math.round(progress);
  const isCompleted = progress >= 98 || minutesRemaining === 0;

  return (
    <aside
      className="fixed top-0 left-0 right-0 z-[70] pointer-events-none select-none"
      role="progressbar"
      aria-label={`Article reading progress: ${roundedProgress}% complete. Time remaining: ${remainingText}`}
      aria-valuenow={roundedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* 1. Subtle full-width progress track & animated gradient fill line */}
      <div className="w-full h-[3px] bg-stone-900/80 backdrop-blur-[2px] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 relative transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Subtle luminous tip glow at leading edge */}
          {progress > 0 && progress < 100 && (
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/70 blur-[1px] shadow-[0_0_8px_rgba(251,113,133,0.9)]" />
          )}
        </div>
      </div>

      {/* 2. 'Time remaining' text label positioned next to the progress bar */}
      {showTimeRemaining && (
        <div
          className={`absolute top-2 sm:top-2.5 right-3 sm:right-6 md:right-8 transition-all duration-300 pointer-events-auto ${
            isScrolling
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-90 hover:opacity-100 translate-y-0'
          }`}
        >
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs shadow-xl transition-all ${
              isCompleted
                ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200 shadow-emerald-950/40'
                : 'bg-stone-950/95 border-stone-800/90 text-stone-200 shadow-black/60 hover:border-rose-500/40'
            }`}
            title={`Reading progress: ${roundedProgress}% complete · Time remaining: ${remainingText} (total length: ~${totalMinutes} min)`}
          >
            {isCompleted ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
            )}

            {/* Explicit 'Time remaining' text label */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 font-medium text-[11px] sm:text-xs">Time remaining:</span>
              <span
                className={`font-semibold font-mono tracking-tight text-[11px] sm:text-xs ${
                  isCompleted ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {remainingText}
              </span>
            </div>

            {/* Visual mini progress track & percentage readout */}
            {showPercentageBadge && (
              <>
                <span className="text-stone-700 hidden sm:inline">|</span>
                <div className="hidden sm:flex items-center gap-1.5 text-stone-400 text-[11px]">
                  <div className="w-10 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-[width] duration-100 ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-rose-500 to-amber-300'
                      }`}
                      style={{ width: `${roundedProgress}%` }}
                    />
                  </div>
                  <span className="font-mono text-stone-300 text-[10px]">{roundedProgress}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
