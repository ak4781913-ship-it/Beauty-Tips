import React from 'react';
import { ExternalLink, Sparkles, Tag, Gift } from 'lucide-react';

export const SMARTLINK_URL = 'https://arwf.org/4/eccd80231d38dcd138ab15392982c219';

export const SmartlinkTopBar: React.FC = () => {
  return (
    <aside aria-label="Curated Recommendations" className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-rose-900/40 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="font-semibold text-rose-300 tracking-wide">Discover Your Next Beauty Essential:</span>
          <span className="opacity-90 truncate text-stone-300">
            Curated skincare formulations, trusted ingredients, and partner recommendations.
          </span>
        </div>
        <a
          href={SMARTLINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 font-semibold text-rose-300 hover:text-rose-100 underline underline-offset-2 transition-colors cursor-pointer"
        >
          <span>Explore Partner Offers</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};

interface SmartlinkCardProps {
  className?: string;
}

export const SmartlinkCard: React.FC<SmartlinkCardProps> = ({ className = '' }) => {
  return (
    <a
      href={SMARTLINK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden bg-stone-900/90 rounded-3xl p-6 sm:p-7 border border-stone-800 hover:border-rose-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
          <span className="font-semibold text-rose-400 flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5" />
            <span>Curated Partner Recommendation</span>
          </span>
          <span className="text-[10px] text-stone-500 uppercase tracking-wider px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
            Sponsored Partner
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-100 group-hover:text-rose-300 transition-colors leading-snug">
          Discover Your Next Beauty Essential
        </h3>

        <p className="mt-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
          Access curated formulation specials, clean cosmetic options, and seasonal partner opportunities verified for barrier harmony.
        </p>
      </div>

      <div className="pt-5 mt-5 border-t border-stone-800 flex items-center justify-between">
        <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
          <Tag className="w-3 h-3 text-rose-400" />
          <span>Curated Partner Link</span>
        </span>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-rose-600 group-hover:bg-rose-500 px-3.5 py-1.5 rounded-xl transition-colors shadow-sm">
          <span>Explore Specials</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </a>
  );
};
