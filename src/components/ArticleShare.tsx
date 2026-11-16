import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Mail,
  Send,
  Sparkles,
  Quote,
  X,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { BeautyTip } from '../types';

export interface ArticleShareProps {
  tip: BeautyTip;
  articleSlug: string;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  variant?: 'card' | 'compact' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const ArticleShare: React.FC<ArticleShareProps> = ({
  tip,
  articleSlug,
  onShowToast,
  variant = 'card',
  isOpen = false,
  onClose,
  className = '',
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://beautytipsbyabbas.netlify.app';
  const articleUrl = `${origin}/beauty-tips/${articleSlug}`;

  const shareTitle = `Beauty Tips by Abbas: ${tip.title}`;
  const shareDescription = tip.shortExplanation || 'Clinical skincare and everyday beauty rituals curated by Abbas.';
  const proTipText = tip.proTip ? `“${tip.proTip}” — Abbas` : '';

  // Social sharing destinations
  const socialChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      color: 'hover:bg-emerald-950/70 hover:border-emerald-700/60 hover:text-emerald-300 text-emerald-400 border-emerald-900/30 bg-emerald-950/20',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
      getUrl: () =>
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `🌸 *${tip.title}*\n${shareDescription}\n\nRead the full guide by Abbas:\n${articleUrl}`
        )}`,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      color: 'hover:bg-stone-800 hover:border-stone-600 hover:text-white text-stone-300 border-stone-800 bg-stone-900/40',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      getUrl: () =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `Discover this expert beauty ritual: "${tip.title}" on Beauty Tips by Abbas 🌿✨`
        )}&url=${encodeURIComponent(articleUrl)}&hashtags=BeautyTips,Skincare,AbbasBeauty`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'hover:bg-blue-950/70 hover:border-blue-700/60 hover:text-blue-300 text-blue-400 border-blue-900/30 bg-blue-950/20',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      color: 'hover:bg-rose-950/80 hover:border-rose-700/60 hover:text-rose-300 text-rose-400 border-rose-900/30 bg-rose-950/20',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.368-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
        </svg>
      ),
      getUrl: () =>
        `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          articleUrl
        )}&description=${encodeURIComponent(`${shareTitle} — ${shareDescription}`)}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: 'hover:bg-cyan-950/70 hover:border-cyan-700/60 hover:text-cyan-300 text-cyan-400 border-cyan-900/30 bg-cyan-950/20',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      getUrl: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    },
    {
      id: 'email',
      name: 'Email',
      color: 'hover:bg-stone-800 hover:border-stone-600 hover:text-stone-100 text-stone-300 border-stone-800 bg-stone-900/50',
      icon: <Mail className="w-4 h-4 text-stone-300" />,
      getUrl: () =>
        `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(
          `Hi,\n\nI thought you might enjoy reading this beauty guide on Beauty Tips by Abbas:\n\n"${tip.title}"\n${shareDescription}\n\nRead here:\n${articleUrl}\n\n— Shared from Beauty Tips by Abbas`
        )}`,
    },
  ];

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${tip.title} — ${shareDescription}`,
          url: articleUrl,
        });
        onShowToast('Article shared successfully!', 'success');
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Copy Link to clipboard
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(articleUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
      onShowToast('Article link copied to clipboard!', 'success');
    } catch {
      onShowToast('Could not copy link automatically.', 'info');
    }
  };

  // Copy Abbas's Pro Tip quote
  const handleCopyProTip = () => {
    if (!proTipText) return;
    try {
      navigator.clipboard.writeText(`${proTipText}\n\nRead more at: ${articleUrl}`);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2200);
      onShowToast('Abbas Pro Tip copied to clipboard!', 'success');
    } catch {
      onShowToast('Could not copy quote.', 'info');
    }
  };

  // Copy complete summary
  const handleCopySummary = () => {
    const text = `🌸 ${tip.title}\n${shareDescription}\n\nDuration: ${tip.duration || 'Daily ritual'}\nKey Tip: ${proTipText}\n\nFull Guide: ${articleUrl}`;
    try {
      navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
      onShowToast('Article summary copied to clipboard!', 'success');
    } catch {
      onShowToast('Could not copy summary.', 'info');
    }
  };

  // 1. MODAL VARIANT
  if (variant === 'modal') {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-lg rounded-3xl bg-stone-900/98 border border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800/80 hover:bg-stone-750 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close share dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 pr-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Share Beauty Ritual</span>
            </div>
            <h3 id="share-modal-title" className="font-serif text-2xl font-normal text-stone-100">
              Share With Your Friends
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pass along this formulation wisdom or save the reference link for later.
            </p>
          </div>

          {/* Article Mini Preview Card */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold text-rose-300 uppercase tracking-wider">
                {tip.categoryLabel}
              </span>
              <span>By Abbas · Formulation Guide</span>
            </div>
            <h4 className="font-serif text-base text-stone-200 font-medium line-clamp-2 leading-snug">
              {tip.title}
            </h4>
            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
              {shareDescription}
            </p>
          </div>

          {/* Copy Direct Link Input Group */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block">
              Direct Article Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 truncate font-mono select-all">
                {articleUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Icons Grid */}
          <div className="space-y-2 pt-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block">
              Share to Platforms
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {socialChannels.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.getUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${channel.color}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-stone-900/80 flex items-center justify-center">
                    {channel.icon}
                  </div>
                  <span className="text-[11px] font-medium">{channel.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Native Share Trigger (if supported) */}
          <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>Open Device Share Tray</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPACT ACTION BAR VARIANT
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          title="Copy article link to clipboard"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
        </button>

        {socialChannels.slice(0, 3).map((ch) => (
          <a
            key={ch.id}
            href={ch.getUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors"
            title={`Share on ${ch.name}`}
          >
            {ch.icon}
          </a>
        ))}
      </div>
    );
  }

  // 3. FULL IN-PAGE CARD VARIANT (Default)
  return (
    <section
      aria-label="Share this beauty article"
      className={`rounded-3xl bg-gradient-to-br from-stone-900/95 via-stone-850/80 to-stone-900/95 border border-stone-800/90 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Background ambient luxury glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-rose-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400">
            <Share2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Pass Along The Wisdom</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
            Share This Beauty Ritual
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-light leading-relaxed">
            Help friends, skincare enthusiasts, or family members discover Abbas’s clinical formulation and barrier preservation advice.
          </p>
        </div>

        {/* Primary Action Button: Web Share API or Direct Copy */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              title="Share via device apps"
            >
              <Smartphone className="w-4 h-4 text-rose-400" />
              <span>Share Sheet</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              copiedLink
                ? 'bg-emerald-600 text-white shadow-emerald-950/40'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 hover:shadow-rose-900/60'
            }`}
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Link Bar + Instant Quick-Copy Actions */}
      <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 w-full md:w-auto min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 px-2 py-0.5 rounded bg-stone-900 border border-stone-800 shrink-0">
            URL
          </span>
          <span className="text-stone-300 truncate font-mono text-[11px] sm:text-xs">
            {articleUrl}
          </span>
        </div>

        {/* Quick Snippet Copiers */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          {proTipText && (
            <button
              onClick={handleCopyProTip}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-rose-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy only Abbas's signature quote to paste into chats"
            >
              <Quote className="w-3 h-3 text-rose-400" />
              <span>{copiedQuote ? 'Copied Quote!' : 'Copy Quote'}</span>
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-rose-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy formatted summary with bullet points and URL"
          >
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>{copiedSummary ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Social Platforms Row */}
      <div className="pt-2 border-t border-stone-800/70 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-400 font-medium">Quick Share Platforms:</span>
          <span className="text-stone-500 text-[11px]">Instant 1-Click Redirect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {socialChannels.map((channel) => (
            <a
              key={channel.id}
              href={channel.getUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${channel.color}`}
            >
              <div className="w-7 h-7 rounded-lg bg-stone-900/80 flex items-center justify-center shrink-0">
                {channel.icon}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold block truncate leading-tight">
                  {channel.name}
                </span>
                <span className="text-[10px] opacity-70 block">Share</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
