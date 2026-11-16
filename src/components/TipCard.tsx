import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  Clock,
  ArrowRight,
  Check,
  X,
  BookOpen,
  Share2,
  MessageCircle,
  Send,
  Link2,
} from 'lucide-react';
import { BeautyTip } from '../types';
import { calculateReadTime } from '../utils/readTime';
import { getTipSlug } from '../utils/slug';
import { SITE_CONFIG } from '../config/site';
import { Link } from 'react-router-dom';

interface TipCardProps {
  tip: BeautyTip;
  isFavorite: boolean;
  onToggleFavorite: (tipId: string) => void;
  onOpenDetail?: (tip: BeautyTip) => void;
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const TipCard: React.FC<TipCardProps> = ({
  tip,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onShowToast,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const readTime = calculateReadTime(tip);
  const tipSlug = getTipSlug(tip);

  const siteOrigin = SITE_CONFIG.getBaseUrl();
  const shareUrl = `${siteOrigin}/beauty-tips/${tipSlug}`;
  const shareText = `Discover this skincare ritual: "${tip.title}" on Beauty Tips by Abbas!`;

  // Close share popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isShareOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (onShowToast) {
      onShowToast('Tip link copied to clipboard!', 'success');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tip.title,
          text: shareText,
          url: shareUrl,
        });
        setIsShareOpen(false);
        return;
      } catch (err) {
        // User dismissed native share sheet, ignore
      }
    }
    setIsShareOpen((prev) => !prev);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n${shareUrl}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  return (
    <article className="group relative bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-rose-100/90 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-stone-700 transition-all duration-300 flex flex-col justify-between">
      {/* Top zone: unboxed metadata & favorite/share actions */}
      <div>
        <div className="flex items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400 mb-3">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-rose-700 dark:text-rose-400">{tip.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-600 dark:text-stone-300 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{readTime}</span>
            </span>
            {tip.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{tip.duration}</span>
                </span>
              </>
            )}
            {tip.suitableTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{tip.suitableTime}</span>
              </>
            )}
          </div>

          {/* Action buttons (Share & Bookmark) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Share Popover */}
            <div className="relative" ref={shareMenuRef}>
              <button
                type="button"
                onClick={handleNativeShare}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  isShareOpen
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800'
                }`}
                title="Share this tip"
                aria-label="Share this beauty tip"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Social Share Menu Dropdown */}
              {isShareOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-30 w-52 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-rose-100 dark:border-stone-800 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-rose-50 dark:border-stone-800 mb-1">
                    Share with Friends
                  </div>

                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsShareOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsShareOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    <span>X (Twitter)</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsShareOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>Facebook</span>
                  </a>

                  {/* Copy Direct Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Link2 className="w-4 h-4 text-rose-600" />
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                    </div>
                    {copiedLink && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Favorite Bookmark Button */}
            <button
              onClick={() => onToggleFavorite(tip.id)}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800'
              }`}
              title={isFavorite ? 'Remove from saved' : 'Save to favorites'}
              aria-label={isFavorite ? 'Remove from saved' : 'Save to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tip Title (Link) */}
        <Link to={`/beauty-tips/${tipSlug}`} className="block focus:outline-none">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900 dark:text-stone-100 group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors leading-snug">
            {tip.title}
          </h3>
        </Link>

        {/* Short explanation */}
        <p className="mt-2.5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
          {tip.shortExplanation}
        </p>

        {/* Recommended Routine callout */}
        <div className="mt-4 p-3 rounded-xl bg-rose-50/50 dark:bg-stone-800/50 border border-rose-100/60 dark:border-stone-800 text-xs">
          <span className="font-semibold text-stone-900 dark:text-stone-200">Recommended Routine: </span>
          <span className="text-stone-600 dark:text-stone-300">{tip.recommendedRoutine}</span>
        </div>

        {/* Useful Ingredients list */}
        <div className="mt-3.5">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
            Key Actives
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tip.usefulIngredients.slice(0, 3).map((ing, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
              >
                {ing}
              </span>
            ))}
            {tip.usefulIngredients.length > 3 && (
              <span className="text-xs text-stone-400 self-center">
                +{tip.usefulIngredients.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Quick Do and Don't preview */}
        <div className="mt-4 space-y-1.5 text-xs">
          {tip.dos[0] && (
            <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{tip.dos[0]}</span>
            </div>
          )}
          {tip.donts[0] && (
            <div className="flex items-start gap-2 text-rose-700 dark:text-rose-400">
              <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{tip.donts[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action: Skin type info & Read More Link */}
      <div className="pt-6 mt-6 border-t border-rose-100/70 dark:border-stone-800 flex items-center justify-between">
        <span className="text-xs text-stone-400 capitalize">
          {tip.skinTypes.includes('all') ? 'All skin types' : tip.skinTypes.join(', ')}
        </span>
        <Link
          to={`/beauty-tips/${tipSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 transition-colors cursor-pointer group-hover:translate-x-0.5 duration-200"
        >
          <span>Read More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
