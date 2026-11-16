import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Vote,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Users,
  Flame,
} from 'lucide-react';
import { getDailyPoll, BeautyPoll, BEAUTY_POLLS } from '../data/dailyPollsData';
import { recordDailyActivity } from '../utils/streak';

interface DailyBeautyPollProps {
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  className?: string;
}

const STORAGE_VOTE_PREFIX = 'beauty_poll_user_vote_';
const STORAGE_COUNTS_PREFIX = 'beauty_poll_counts_';

export const DailyBeautyPoll: React.FC<DailyBeautyPollProps> = ({
  onShowToast,
  className = '',
}) => {
  const [pollOffset, setPollOffset] = useState(0);
  const poll = useMemo(() => getDailyPoll(new Date(), pollOffset), [pollOffset]);

  // User's selected option id for this specific poll
  const [userVote, setUserVote] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_VOTE_PREFIX}${poll.id}`);
      return saved ? JSON.parse(saved).optionId : null;
    } catch {
      return null;
    }
  });

  // Vote counts mapped by option id
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_COUNTS_PREFIX}${poll.id}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    const initial: Record<string, number> = {};
    poll.options.forEach((opt) => {
      initial[opt.id] = opt.initialVotes;
    });
    return initial;
  });

  // Re-sync when poll changes (e.g. when browsing another poll)
  useEffect(() => {
    try {
      const savedVote = localStorage.getItem(`${STORAGE_VOTE_PREFIX}${poll.id}`);
      setUserVote(savedVote ? JSON.parse(savedVote).optionId : null);

      const savedCounts = localStorage.getItem(`${STORAGE_COUNTS_PREFIX}${poll.id}`);
      if (savedCounts) {
        setVoteCounts(JSON.parse(savedCounts));
      } else {
        const initial: Record<string, number> = {};
        poll.options.forEach((opt) => {
          initial[opt.id] = opt.initialVotes;
        });
        setVoteCounts(initial);
      }
    } catch {
      setUserVote(null);
    }
  }, [poll]);

  // Total votes calculation
  const totalVotes = useMemo(() => {
    return Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  }, [voteCounts]);

  const handleCastVote = (optionId: string) => {
    if (userVote === optionId) return;

    const previousVote = userVote;
    const updatedCounts = { ...voteCounts };

    // If changing vote from a previous option, decrement previous
    if (previousVote && updatedCounts[previousVote]) {
      updatedCounts[previousVote] = Math.max(0, updatedCounts[previousVote] - 1);
    }

    // Increment newly chosen option
    updatedCounts[optionId] = (updatedCounts[optionId] || 0) + 1;

    setUserVote(optionId);
    setVoteCounts(updatedCounts);

    // Persist user vote and updated counts
    try {
      localStorage.setItem(
        `${STORAGE_VOTE_PREFIX}${poll.id}`,
        JSON.stringify({ optionId, votedAt: Date.now() })
      );
      localStorage.setItem(
        `${STORAGE_COUNTS_PREFIX}${poll.id}`,
        JSON.stringify(updatedCounts)
      );
    } catch (e) {
      console.error('Failed to save poll vote to localStorage:', e);
    }

    // Count towards daily reading activity / streak
    recordDailyActivity();

    if (onShowToast) {
      onShowToast('Your vote has been counted in the community poll! 🔥', 'success');
    }
  };

  const handleResetVote = () => {
    if (!userVote) return;
    const updatedCounts = { ...voteCounts };
    if (updatedCounts[userVote]) {
      updatedCounts[userVote] = Math.max(0, updatedCounts[userVote] - 1);
    }
    setUserVote(null);
    setVoteCounts(updatedCounts);

    try {
      localStorage.removeItem(`${STORAGE_VOTE_PREFIX}${poll.id}`);
      localStorage.setItem(
        `${STORAGE_COUNTS_PREFIX}${poll.id}`,
        JSON.stringify(updatedCounts)
      );
    } catch (e) {
      console.error('Failed to reset poll vote:', e);
    }

    if (onShowToast) {
      onShowToast('Vote cleared. You can select another response.', 'info');
    }
  };

  // Find the user's chosen option object to recommend relevant guide
  const selectedOptionObj = poll.options.find((opt) => opt.id === userVote);

  // Highest voted option for community highlight
  const leadingOptionId = useMemo(() => {
    let highest = -1;
    let leadingId = '';
    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > highest) {
        highest = count;
        leadingId = id;
      }
    });
    return leadingId;
  }, [voteCounts]);

  const hasVoted = Boolean(userVote);

  return (
    <section
      aria-label="Daily Beauty Poll"
      className={`rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Strip with Question Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <Vote className="w-4 h-4 text-rose-400" />
              <span>Daily Beauty Community Poll</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              {poll.question}
            </h2>
            {/* Clean unboxed metadata with typographic separators */}
            <p className="text-xs text-stone-400 flex flex-wrap items-center gap-2 pt-0.5">
              <span>{poll.subtitle}</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="flex items-center gap-1 text-stone-300">
                <Users className="w-3.5 h-3.5 text-rose-400" />
                <strong>{totalVotes.toLocaleString()}</strong> votes cast
              </span>
            </p>
          </div>

          {/* Navigation between topics */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="flex items-center bg-stone-950 rounded-xl p-1 border border-stone-800">
              <button
                onClick={() => setPollOffset((prev) => (prev - 1 + BEAUTY_POLLS.length) % BEAUTY_POLLS.length)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-850 transition-colors cursor-pointer"
                title="Previous Poll Topic"
                aria-label="Previous Poll Topic"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-stone-400 px-2 font-medium">
                {((pollOffset % BEAUTY_POLLS.length) + BEAUTY_POLLS.length) % BEAUTY_POLLS.length + 1} / {BEAUTY_POLLS.length}
              </span>
              <button
                onClick={() => setPollOffset((prev) => (prev + 1) % BEAUTY_POLLS.length)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-850 transition-colors cursor-pointer"
                title="Next Poll Topic"
                aria-label="Next Poll Topic"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {hasVoted && (
              <button
                onClick={handleResetVote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-750 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
                title="Change or reset your vote"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Change Vote</span>
              </button>
            )}
          </div>
        </div>

        {/* Options List / Results Bars */}
        <div className="space-y-3">
          {poll.options.map((option) => {
            const count = voteCounts[option.id] || 0;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isSelected = userVote === option.id;
            const isLeading = option.id === leadingOptionId && hasVoted;

            return (
              <button
                key={option.id}
                onClick={() => handleCastVote(option.id)}
                className={`w-full p-4 rounded-2xl border text-left relative overflow-hidden transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? 'bg-rose-950/50 border-rose-500/80 ring-1 ring-rose-500/40 shadow-md shadow-rose-950/40'
                    : hasVoted
                    ? 'bg-stone-950/60 border-stone-850 hover:border-stone-700'
                    : 'bg-stone-900 border-stone-800 hover:border-rose-500/40 hover:bg-stone-850'
                }`}
              >
                {/* Visual Progress Bar Fill (visible once user votes) */}
                {hasVoted && (
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out opacity-25 pointer-events-none ${
                      isSelected
                        ? 'bg-rose-500'
                        : isLeading
                        ? 'bg-amber-500'
                        : 'bg-stone-700'
                    }`}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                          : 'bg-stone-800 border-stone-700 text-stone-400 group-hover:border-stone-600 group-hover:text-stone-200'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-4 h-4" /> : '•'}
                    </span>

                    <span
                      className={`text-xs sm:text-sm font-medium leading-relaxed truncate ${
                        isSelected ? 'text-rose-100 font-semibold' : 'text-stone-200'
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>

                  {/* Percentage & Vote Count */}
                  {hasVoted ? (
                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      {isSelected && (
                        <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider hidden sm:inline">
                          Your Vote
                        </span>
                      )}
                      <span className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                        {percentage}%
                      </span>
                      <span className="text-[11px] text-stone-500 hidden md:inline">
                        ({count.toLocaleString()})
                      </span>
                    </div>
                  ) : (
                    <div className="shrink-0 text-xs font-semibold text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>Vote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Post-Vote Editorial Insight & Guide Recommendation */}
        {hasVoted && selectedOptionObj && (
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/80 border border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Abbas's Curated Recommendation</span>
              </div>
              <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                {poll.editorialInsight}
              </p>
            </div>

            <Link
              to={`/beauty-tips/${selectedOptionObj.guideSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all shrink-0 group self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read: {selectedOptionObj.guideTitle}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* Footer info strip */}
        {!hasVoted && (
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Casting your vote counts toward your daily reading streak!</span>
            </span>
            <span className="text-stone-500 hidden sm:inline">
              Select an option above to view real-time community results
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
