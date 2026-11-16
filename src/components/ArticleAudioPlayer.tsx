import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Headphones,
  Sparkles,
  ChevronDown,
  Settings2,
  Check,
  Radio,
  Sliders,
  SkipBack,
  SkipForward,
  Info
} from 'lucide-react';
import { BeautyTip } from '../types';

export interface AudioSection {
  id: string;
  title: string;
  text: string;
  estimatedSeconds: number;
}

interface ArticleAudioPlayerProps {
  tip: BeautyTip;
  faqs?: { q: string; a: string }[];
  activeSectionId?: string | null;
  onActiveSectionChange?: (sectionId: string | null) => void;
  className?: string;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export const ArticleAudioPlayer: React.FC<ArticleAudioPlayerProps> = ({
  tip,
  faqs,
  activeSectionId,
  onActiveSectionChange,
  className = '',
}) => {
  // Speech synthesis capability check
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // UI states
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [isFloatingVisible, setIsFloatingVisible] = useState<boolean>(false);
  const playerRef = useRef<HTMLDivElement>(null);
  
  // References to manage speech queue and timing
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;
  const currentSectionIndexRef = useRef<number>(0);
  currentSectionIndexRef.current = currentSectionIndex;
  const playbackRateRef = useRef<number>(1);
  playbackRateRef.current = playbackRate;
  const isMutedRef = useRef<boolean>(false);
  isMutedRef.current = isMuted;

  // 1. Prepare structured audio sections from the article data
  const audioSections: AudioSection[] = useMemo(() => {
    const sections: AudioSection[] = [];

    // Introduction
    const introText = `Beauty Tips by Abbas presents: ${tip.title}. Categorized under ${tip.categoryLabel}. ${tip.shortExplanation}`;
    sections.push({
      id: 'audio-intro',
      title: 'Introduction & Overview',
      text: introText,
      estimatedSeconds: Math.ceil((introText.split(/\s+/).length / 180) * 60),
    });

    // Why This Ritual Works
    if (tip.fullDescription) {
      const rationaleText = `Why this ritual works: ${tip.fullDescription}`;
      sections.push({
        id: 'audio-rationale',
        title: 'Why This Ritual Works',
        text: rationaleText,
        estimatedSeconds: Math.ceil((rationaleText.split(/\s+/).length / 180) * 60),
      });
    }

    // Regimen Placement
    if (tip.recommendedRoutine) {
      const routineText = `Regimen Placement and Order: ${tip.recommendedRoutine}`;
      sections.push({
        id: 'audio-routine',
        title: 'Regimen Placement & Order',
        text: routineText,
        estimatedSeconds: Math.ceil((routineText.split(/\s+/).length / 180) * 60),
      });
    }

    // Ingredients
    if (tip.usefulIngredients && tip.usefulIngredients.length > 0) {
      const ingredientsText = `Recommended active ingredients: ${tip.usefulIngredients.join(', ')}. These target active molecules provide high barrier affinity.`;
      sections.push({
        id: 'audio-ingredients',
        title: 'Recommended Active Ingredients',
        text: ingredientsText,
        estimatedSeconds: Math.ceil((ingredientsText.split(/\s+/).length / 180) * 60),
      });
    }

    // Steps
    if (tip.steps && tip.steps.length > 0) {
      const stepsNarrative = tip.steps
        .map((s) => `Step ${s.stepNumber}: ${s.title}. ${s.instruction}`)
        .join(' ');
      const stepsText = `Step-by-step application protocol: ${stepsNarrative}`;
      sections.push({
        id: 'audio-steps',
        title: 'Step-by-Step Protocol',
        text: stepsText,
        estimatedSeconds: Math.ceil((stepsText.split(/\s+/).length / 180) * 60),
      });
    }

    // Dos and Don'ts
    if ((tip.dos && tip.dos.length > 0) || (tip.donts && tip.donts.length > 0)) {
      const dosText = tip.dos && tip.dos.length > 0 ? `Best practices to follow: ${tip.dos.join('. ')}.` : '';
      const dontsText = tip.donts && tip.donts.length > 0 ? `Common pitfalls to avoid: ${tip.donts.join('. ')}.` : '';
      const bestPracticesText = `${dosText} ${dontsText}`.trim();
      sections.push({
        id: 'audio-dos-donts',
        title: "Best Practices & Pitfalls",
        text: bestPracticesText,
        estimatedSeconds: Math.ceil((bestPracticesText.split(/\s+/).length / 180) * 60),
      });
    }

    // Pro Tip
    if (tip.proTip) {
      const proTipText = `Abbas's signature pro tip: ${tip.proTip}. Curated by Abbas, skincare and formulation educator.`;
      sections.push({
        id: 'audio-protip',
        title: "Abbas's Signature Pro Tip",
        text: proTipText,
        estimatedSeconds: Math.ceil((proTipText.split(/\s+/).length / 180) * 60),
      });
    }

    // FAQs
    if (faqs && faqs.length > 0) {
      const faqsNarrative = faqs
        .map((f, i) => `Question ${i + 1}: ${f.q}. Answer: ${f.a}`)
        .join(' ');
      const faqsText = `Frequently asked questions from our readers: ${faqsNarrative}`;
      sections.push({
        id: 'audio-faqs',
        title: 'Frequently Asked Questions',
        text: faqsText,
        estimatedSeconds: Math.ceil((faqsText.split(/\s+/).length / 180) * 60),
      });
    }

    return sections;
  }, [tip, faqs]);

  // Total calculated duration in seconds taking current speed into account
  const totalBaseSeconds = useMemo(() => {
    return audioSections.reduce((acc, curr) => acc + curr.estimatedSeconds, 0);
  }, [audioSections]);

  const effectiveDuration = Math.round(totalBaseSeconds / playbackRate);

  // Calculate elapsed seconds based on current section progress
  const elapsedSeconds = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
      if (audioSections[i]) {
        sum += audioSections[i].estimatedSeconds;
      }
    }
    return Math.round(sum / playbackRate);
  }, [currentSectionIndex, audioSections, playbackRate]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 2. Initialize and load available speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        // Filter primarily English voices first, plus all voices
        const enVoices = availableVoices.filter((v) => v.lang.startsWith('en'));
        const displayVoices = enVoices.length > 0 ? enVoices : availableVoices;
        setVoices(displayVoices);

        // Pick best natural voice candidate
        const preferred = displayVoices.find(
          (v) =>
            v.name.includes('Natural') ||
            v.name.includes('Online') ||
            v.name.includes('Google UK English Female') ||
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Serena') ||
            v.name.includes('Victoria') ||
            v.name.includes('Google US English')
        );

        if (preferred) {
          setSelectedVoiceURI(preferred.voiceURI);
        } else if (displayVoices[0]) {
          setSelectedVoiceURI(displayVoices[0].voiceURI);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 3. Keep speech synthesis alive and handle browser scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!playerRef.current) return;
      const rect = playerRef.current.getBoundingClientRect();
      // If user scrolled past the main player, show floating controller
      if (rect.bottom < 0) {
        setIsFloatingVisible(true);
      } else {
        setIsFloatingVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Speak a specific section
  const speakSection = useCallback(
    (index: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (index < 0 || index >= audioSections.length) {
        // Finished all sections
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSectionIndex(0);
        onActiveSectionChange?.(null);
        return;
      }

      window.speechSynthesis.cancel();

      const section = audioSections[index];
      setCurrentSectionIndex(index);
      onActiveSectionChange?.(section.id);

      // Auto-scroll to current section if enabled
      if (autoScroll) {
        const targetEl = document.getElementById(section.id);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      const utterance = new SpeechSynthesisUtterance(section.text);
      utteranceRef.current = utterance;

      // Assign voice
      if (selectedVoiceURI) {
        const voice = voices.find((v) => v.voiceURI === selectedVoiceURI);
        if (voice) utterance.voice = voice;
      }

      utterance.rate = playbackRateRef.current;
      utterance.volume = isMutedRef.current ? 0 : 1;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        // If still active, proceed to next section
        if (isPlayingRef.current) {
          const nextIndex = currentSectionIndexRef.current + 1;
          if (nextIndex < audioSections.length) {
            speakSection(nextIndex);
          } else {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSectionIndex(0);
            onActiveSectionChange?.(null);
          }
        }
      };

      utterance.onerror = (e) => {
        // Ignore interrupted errors triggered by user canceling/skipping
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis notification:', e.error);
        }
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    },
    [audioSections, autoScroll, onActiveSectionChange, selectedVoiceURI, voices]
  );

  // 5. Play / Pause toggle
  const togglePlayPause = () => {
    if (!isSupported) return;

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      speakSection(currentSectionIndex);
    }
  };

  // 6. Stop / Reset
  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSectionIndex(0);
    onActiveSectionChange?.(null);
  };

  // 7. Navigation controls
  const handlePrevSection = () => {
    const prev = Math.max(0, currentSectionIndex - 1);
    if (isPlaying) {
      speakSection(prev);
    } else {
      setCurrentSectionIndex(prev);
      onActiveSectionChange?.(audioSections[prev]?.id || null);
    }
  };

  const handleNextSection = () => {
    const next = Math.min(audioSections.length - 1, currentSectionIndex + 1);
    if (isPlaying) {
      speakSection(next);
    } else {
      setCurrentSectionIndex(next);
      onActiveSectionChange?.(audioSections[next]?.id || null);
    }
  };

  // 8. Speed change handler
  const handleRateChange = (newRate: number) => {
    setPlaybackRate(newRate);
    playbackRateRef.current = newRate;
    // If currently speaking, restart current section with the new speed seamlessly
    if (isPlaying && !isPaused) {
      speakSection(currentSectionIndex);
    }
  };

  // 9. Voice change handler
  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    if (isPlaying && !isPaused) {
      setTimeout(() => {
        speakSection(currentSectionIndex);
      }, 50);
    }
  };

  // 10. Mute toggle
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    isMutedRef.current = nextMute;
    if (utteranceRef.current) {
      utteranceRef.current.volume = nextMute ? 0 : 1;
    }
    if (isPlaying && !isPaused) {
      speakSection(currentSectionIndex);
    }
  };

  // Fallback for browsers without Web Speech
  if (!isSupported) {
    return (
      <div className={`p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-stone-400 text-xs flex items-center gap-3 ${className}`}>
        <Info className="w-5 h-5 text-rose-400 shrink-0" />
        <p>Text-to-speech narration is not supported by your current browser environment. Please update or switch to a modern browser like Chrome, Safari, or Edge for hands-free audio.</p>
      </div>
    );
  }

  const currentSection = audioSections[currentSectionIndex] || audioSections[0];
  const progressPercent = audioSections.length > 0 ? ((currentSectionIndex + 1) / audioSections.length) * 100 : 0;

  return (
    <>
      {/* Main Luxury Audio Player Card */}
      <section
        ref={playerRef}
        aria-label="Article Audio Narration Player"
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/95 to-rose-950/25 border border-rose-900/30 p-5 sm:p-7 shadow-2xl transition-all duration-300 ${className}`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-5">
          {/* Top Label & Mode Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-stone-950 shadow-md shadow-rose-950/40">
                <Headphones className="w-4 h-4 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-stone-100 tracking-wide">
                    Listen to This Article
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-medium text-rose-300 uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5" /> Hands-Free
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Audio guide for your morning skincare ritual
                </p>
              </div>
            </div>

            {/* Quick Speed & Settings Toggle */}
            <div className="flex items-center gap-2">
              {/* Playback Speed Pill */}
              <div className="flex items-center bg-stone-950/80 rounded-xl border border-stone-800 p-0.5">
                {SPEED_OPTIONS.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleRateChange(rate)}
                    className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                      playbackRate === rate
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title={`Set narration speed to ${rate}x`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Advanced Settings Button */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  showSettings
                    ? 'bg-rose-950/70 border-rose-700 text-rose-300'
                    : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title="Narration Voice & Follow-Along Settings"
                aria-label="Narration settings"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Track / Section Details */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium flex items-center gap-1.5">
                {isPlaying && !isPaused && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
                Section {currentSectionIndex + 1} of {audioSections.length}
              </span>
              <span className="text-stone-400 font-mono text-[11px]">
                {formatTime(elapsedSeconds)} / ~{formatTime(effectiveDuration)}
              </span>
            </div>

            <div className="font-medium text-stone-200 text-sm truncate">
              {currentSection.title}
            </div>

            {/* Segmented Scrub Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${audioSections.length}, minmax(0, 1fr))` }}>
                {audioSections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      if (isPlaying) {
                        speakSection(idx);
                      } else {
                        setCurrentSectionIndex(idx);
                        onActiveSectionChange?.(sec.id);
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx < currentSectionIndex
                        ? 'bg-rose-500'
                        : idx === currentSectionIndex
                        ? isPlaying
                          ? 'bg-rose-400 shadow-sm shadow-rose-500/50'
                          : 'bg-rose-700'
                        : 'bg-stone-800 hover:bg-stone-700'
                    }`}
                    title={`Jump to ${sec.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {/* Audio Section Jump Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevSection}
                disabled={currentSectionIndex === 0}
                className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Previous section"
                aria-label="Previous section"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Main Play / Pause Hero Button */}
              <button
                type="button"
                onClick={togglePlayPause}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-950/40 hover:shadow-rose-600/25 active:scale-95 cursor-pointer"
                title={isPlaying ? (isPaused ? 'Resume narration' : 'Pause narration') : 'Start audio narration'}
                aria-label={isPlaying ? (isPaused ? 'Resume narration' : 'Pause narration') : 'Start audio narration'}
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>{isPlaying && isPaused ? 'Resume' : 'Play Narration'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNextSection}
                disabled={currentSectionIndex >= audioSections.length - 1}
                className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Next section"
                aria-label="Next section"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Stop & Reset Button */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={handleStop}
                  className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-stone-400 hover:text-rose-300 hover:border-rose-900 transition-all cursor-pointer"
                  title="Stop and reset"
                  aria-label="Stop audio narration"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right side accessories: Mute & Follow Along indicator */}
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-3.5 h-3.5 accent-rose-600 rounded bg-stone-900 border-stone-700"
                />
                <span className="hidden sm:inline">Follow along with speech</span>
                <span className="sm:hidden">Follow</span>
              </label>

              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute narration'}
                aria-label={isMuted ? 'Unmute narration' : 'Mute narration'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expandable Voice & Customization Panel */}
          {showSettings && (
            <div className="pt-4 border-t border-stone-800/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-rose-400" />
                  Voice Customization
                </h4>
                <span className="text-[11px] text-stone-400">
                  {voices.length} voices detected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Voice Selection */}
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium block">
                    Narrator Voice:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVoiceURI}
                      onChange={(e) => handleVoiceChange(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 text-xs appearance-none focus:outline-none focus:border-rose-600 pr-8 cursor-pointer"
                    >
                      {voices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Section Quick Jump Selector */}
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium block">
                    Jump to Section:
                  </label>
                  <div className="relative">
                    <select
                      value={currentSectionIndex}
                      onChange={(e) => {
                        const idx = parseInt(e.target.value, 10);
                        if (isPlaying) {
                          speakSection(idx);
                        } else {
                          setCurrentSectionIndex(idx);
                          onActiveSectionChange?.(audioSections[idx]?.id || null);
                        }
                      }}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 text-xs appearance-none focus:outline-none focus:border-rose-600 pr-8 cursor-pointer"
                    >
                      {audioSections.map((sec, idx) => (
                        <option key={sec.id} value={idx}>
                          {idx + 1}. {sec.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Floating Mini Bar Controller when scrolled down */}
      {isFloatingVisible && isPlaying && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-stone-950/95 backdrop-blur-md border border-rose-900/50 shadow-2xl space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
                  title={isPaused ? 'Resume' : 'Pause'}
                  aria-label={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-current ml-0.5" /> : <Pause className="w-4 h-4 fill-current" />}
                </button>
                <div className="min-w-0">
                  <p className="text-[11px] text-rose-300 font-medium truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Now Narrating (Section {currentSectionIndex + 1}/{audioSections.length})
                  </p>
                  <p className="text-xs font-semibold text-stone-100 truncate">
                    {currentSection.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleRateChange(playbackRate === 1.5 ? 1 : playbackRate === 1 ? 1.25 : 1.5)}
                  className="px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-mono font-medium text-stone-300 hover:text-white cursor-pointer"
                  title="Cycle playback speed"
                >
                  {playbackRate}x
                </button>
                <button
                  type="button"
                  onClick={handleStop}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Stop audio"
                  aria-label="Stop audio"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mini Progress Line */}
            <div className="w-full bg-stone-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
