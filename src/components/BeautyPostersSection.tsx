import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  X,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BEAUTY_POSTERS, BeautyPoster } from '../data/posters';

interface BeautyPostersSectionProps {
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const BeautyPostersSection: React.FC<BeautyPostersSectionProps> = ({ onShowToast }) => {
  const [selectedPoster, setSelectedPoster] = useState<BeautyPoster | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCheatsheet = (poster: BeautyPoster) => {
    const text = [
      `=== ${poster.title.toUpperCase()} ===`,
      `Subtitle: ${poster.subtitle}`,
      `Key Rule: ${poster.keyRule}`,
      `----------------------------------------`,
      ...poster.stagesOrSteps.map(
        (s) => `[${s.number}] ${s.title}\n${s.description}\nKey Points: ${s.bulletPoints.join(', ')}\n`
      ),
      `Clinical Advice: ${poster.clinicalAdvice}`,
      `Golden Rule: ${poster.goldenRule}`,
      `Source: Beauty Tips by Abbas (https://beautytipsbyabbas.com)`,
    ].join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(poster.id);
      if (onShowToast) {
        onShowToast(`"${poster.title}" cheatsheet copied to clipboard!`, 'success');
      }
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleDownloadTxt = (poster: BeautyPoster) => {
    const text = [
      `====================================================`,
      `BEAUTY TIPS BY ABBAS - CLINICAL POSTER CHEATSHEET`,
      `Title: ${poster.title}`,
      `Subtitle: ${poster.subtitle}`,
      `====================================================`,
      ``,
      `CORE PRINCIPLE:`,
      `${poster.keyRule}`,
      ``,
      `CHRONOLOGICAL STEPS & PROTOCOL:`,
      ...poster.stagesOrSteps.map(
        (s) =>
          `----------------------------------------------------\n[${s.number}] ${s.title}\n${s.description}\nProtocol Rules:\n${s.bulletPoints.map((b) => `  * ${b}`).join('\n')}`
      ),
      ``,
      `CLINICAL ADVICE:`,
      `${poster.clinicalAdvice}`,
      ``,
      `GOLDEN RULE:`,
      `${poster.goldenRule}`,
      ``,
      `© ${new Date().getFullYear()} Beauty Tips by Abbas. For educational purposes only.`,
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = poster.downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast(`Downloaded "${poster.title}" protocol card!`, 'success');
    }
  };

  return (
    <section id="beauty-posters" className="py-16 bg-stone-900/30 border-t border-stone-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1 rounded-full mb-3">
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Visual Skincare Infographics</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 tracking-tight">
            Educational <span className="italic text-rose-300">Beauty Posters</span>
          </h2>
          <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed">
            High-value visual reference guides distilling complex dermatology science into actionable, memorable infographics you can study, copy, and save.
          </p>
        </div>

        {/* Poster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BEAUTY_POSTERS.map((poster) => (
            <div
              key={poster.id}
              className={`rounded-3xl border bg-gradient-to-b ${poster.bgGradient} p-6 sm:p-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-rose-950/30 ${poster.accentBorder}`}
            >
              <div>
                {/* Header Tag & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-300 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800">
                    {poster.badge}
                  </span>
                  <button
                    onClick={() => setSelectedPoster(poster)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Open Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-100 leading-snug">
                  {poster.title}
                </h3>
                <p className="text-xs text-rose-300/90 font-medium mt-1">
                  {poster.subtitle}
                </p>

                {/* Core Rule Callout */}
                <div className="my-5 p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 text-xs text-stone-300 leading-relaxed">
                  <span className="font-semibold text-rose-400 block mb-1">Key Principle:</span>
                  {poster.keyRule}
                </div>

                {/* Chronological Steps / Highlights Preview */}
                <div className="space-y-2 mb-6">
                  {poster.stagesOrSteps.slice(0, 3).map((st, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/50 flex items-start gap-2.5 text-xs text-stone-300"
                    >
                      <span className="font-mono text-rose-400 font-bold shrink-0">{st.number}</span>
                      <div className="min-w-0">
                        <span className="font-semibold text-stone-200 block truncate">{st.title}</span>
                        <p className="text-[11px] text-stone-400 line-clamp-1">{st.description}</p>
                      </div>
                    </div>
                  ))}
                  {poster.stagesOrSteps.length > 3 && (
                    <p className="text-[11px] text-center text-stone-400 italic pt-1">
                      + {poster.stagesOrSteps.length - 3} more protocol stages...
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedPoster(poster)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>View Poster</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyCheatsheet(poster)}
                    className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer"
                    title="Copy Text Cheatsheet"
                  >
                    {copiedId === poster.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadTxt(poster)}
                    className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer"
                    title="Download Protocol (.txt)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Lightbox Modal for Poster */}
        {selectedPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Top Bar */}
              <div className="p-5 sm:p-6 border-b border-stone-800 flex items-start justify-between gap-4 bg-stone-950/60">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                    {selectedPoster.badge}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100 mt-1">
                    {selectedPoster.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                    {selectedPoster.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPoster(null)}
                  className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Core Rule Callout Banner */}
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/50 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-rose-300 tracking-wider">
                      Fundamental Skincare Rule
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-200 mt-1 leading-relaxed">
                      {selectedPoster.keyRule}
                    </p>
                  </div>
                </div>

                {/* All Detailed Chronological Stages */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Step-by-Step Clinical Protocol
                  </h4>
                  <div className="space-y-3">
                    {selectedPoster.stagesOrSteps.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-900/30 font-bold">
                              {st.number}
                            </span>
                            <span className="font-medium text-sm sm:text-base text-stone-100">
                              {st.title}
                            </span>
                          </div>
                          {st.highlightTag && (
                            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
                              {st.highlightTag}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                          {st.description}
                        </p>

                        <div className="pt-1 flex flex-wrap gap-2">
                          {st.bulletPoints.map((bp, bIdx) => (
                            <span
                              key={bIdx}
                              className="text-[11px] text-stone-400 bg-stone-900/90 px-2.5 py-1 rounded-lg border border-stone-800"
                            >
                              ✓ {bp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Advice & Golden Rule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-950/50 border border-stone-800 text-xs space-y-1.5">
                    <span className="font-semibold text-amber-400 block uppercase tracking-wider">
                      Dermatological Insight
                    </span>
                    <p className="text-stone-300 leading-relaxed">
                      {selectedPoster.clinicalAdvice}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-950/50 border border-stone-800 text-xs space-y-1.5">
                    <span className="font-semibold text-rose-400 block uppercase tracking-wider">
                      Golden Abbas Rule
                    </span>
                    <p className="text-stone-300 leading-relaxed">
                      {selectedPoster.goldenRule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-stone-800 bg-stone-950/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-stone-400">
                  © Beauty Tips by Abbas · Free Educational Infographics
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCheatsheet(selectedPoster)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === selectedPoster.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadTxt(selectedPoster)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download (.txt)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
