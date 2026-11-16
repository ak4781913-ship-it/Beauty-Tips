import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Send,
  HelpCircle,
  Award,
} from 'lucide-react';

export interface CommentItem {
  id: string;
  authorName: string;
  skinType?: string;
  rating: number; // 1 to 5
  content: string;
  createdAt: string; // ISO string or timestamp
  likes: number;
  isVerifiedReader?: boolean;
  isUserCreated?: boolean;
  ritualExperience?: string;
  abbasReply?: {
    author: string;
    role: string;
    text: string;
    date: string;
  };
}

interface CommentSectionProps {
  articleSlug: string;
  articleTitle?: string;
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

const STORAGE_PREFIX = 'beauty_tips_comments_';
const LIKES_STORAGE_PREFIX = 'beauty_tips_liked_comments_';
const USERNAME_STORAGE_KEY = 'beauty_tips_user_name';
const SKINTYPE_STORAGE_KEY = 'beauty_tips_user_skintype';

const SKIN_TYPE_OPTIONS = [
  'All Skin Types',
  'Sensitive Skin',
  'Dry & Dehydrated',
  'Oily & Acne-Prone',
  'Combination',
  'Mature Skin',
  'Normal Skin',
];

const EXPERIENCE_OPTIONS = [
  'Daily Morning Ritual',
  'Evening Ritual',
  'Followed for 2+ Weeks',
  'First Impression',
  'Clinical / Sensitive Test',
];

// Curated seed comments tailored for initial rich editorial atmosphere if empty
const getInitialSeedComments = (slug: string, title?: string): CommentItem[] => {
  const currentTitle = title || 'this beauty ritual';
  const now = Date.now();
  const dayAgo = new Date(now - 86400000 * 1.5).toISOString();
  const threeDaysAgo = new Date(now - 86400000 * 3.5).toISOString();
  const fiveDaysAgo = new Date(now - 86400000 * 5).toISOString();

  // Pick realistic feedback tailored to skincare & beauty
  return [
    {
      id: `seed-1-${slug}`,
      authorName: 'Camilla Vance',
      skinType: 'Combination',
      rating: 5,
      content: `I’ve been practicing ${currentTitle} for ten days straight. The technique explained here made such a noticeable difference in preventing irritation. My skin feels thoroughly balanced and supple without feeling stripped!`,
      createdAt: dayAgo,
      likes: 14,
      isVerifiedReader: true,
      ritualExperience: 'Followed for 2+ Weeks',
      abbasReply: {
        author: 'Abbas',
        role: 'Founder & Skincare Educator',
        text: 'So delighted to hear this Camilla! Remember to maintain adequate hydration underneath so the barrier stays resilient year-round.',
        date: '1 day ago',
      },
    },
    {
      id: `seed-2-${slug}`,
      authorName: 'Dr. Tariq M.',
      skinType: 'Sensitive Skin',
      rating: 5,
      content: `As someone who often cautions patients against over-exfoliation and erratic product layering, I appreciate the measured rationale outlined in this guide. The dosage discipline and patch testing reminder are spot on.`,
      createdAt: threeDaysAgo,
      likes: 29,
      isVerifiedReader: true,
      ritualExperience: 'Clinical / Sensitive Test',
    },
    {
      id: `seed-3-${slug}`,
      authorName: 'Elena Rostova',
      skinType: 'Dry & Dehydrated',
      rating: 4,
      content: `Game changer for morning prep! Took me a couple of days to get the sequence and timing right, but following the exact steps here prevented all pilling. Highly recommend giving it at least a week to adjust.`,
      createdAt: fiveDaysAgo,
      likes: 9,
      isVerifiedReader: false,
      ritualExperience: 'Daily Morning Ritual',
    },
  ];
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  articleSlug,
  articleTitle = 'this beauty ritual',
  onShowToast,
}) => {
  const storageKey = `${STORAGE_PREFIX}${articleSlug}`;
  const likesKey = `${LIKES_STORAGE_PREFIX}${articleSlug}`;

  // State
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');
  const [selectedSkinFilter, setSelectedSkinFilter] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState(() => {
    try {
      return localStorage.getItem(USERNAME_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [userSkinType, setUserSkinType] = useState(() => {
    try {
      return localStorage.getItem(SKINTYPE_STORAGE_KEY) || 'Combination';
    } catch {
      return 'Combination';
    }
  });
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ritualExperience, setRitualExperience] = useState<string>('Followed for 2+ Weeks');
  const [commentText, setCommentText] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ name?: string; comment?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load comments from localStorage
  useEffect(() => {
    try {
      const rawStored = localStorage.getItem(storageKey);
      if (rawStored) {
        const parsed = JSON.parse(rawStored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setComments(parsed);
        } else {
          const seeds = getInitialSeedComments(articleSlug, articleTitle);
          setComments(seeds);
          localStorage.setItem(storageKey, JSON.stringify(seeds));
        }
      } else {
        const seeds = getInitialSeedComments(articleSlug, articleTitle);
        setComments(seeds);
        localStorage.setItem(storageKey, JSON.stringify(seeds));
      }

      // Load liked comment IDs
      const rawLikes = localStorage.getItem(likesKey);
      if (rawLikes) {
        setLikedCommentIds(JSON.parse(rawLikes));
      } else {
        setLikedCommentIds({});
      }
    } catch (e) {
      console.error('Error loading comments from localStorage:', e);
      setComments(getInitialSeedComments(articleSlug, articleTitle));
    }
  }, [articleSlug, articleTitle, storageKey, likesKey]);

  // Save comments helper
  const persistComments = (updated: CommentItem[]) => {
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write comments to localStorage:', e);
    }
  };

  // 2. Handle Upvoting
  const handleToggleLike = (commentId: string) => {
    const isCurrentlyLiked = !!likedCommentIds[commentId];
    const newLikedState = !isCurrentlyLiked;

    const nextLikedMap = {
      ...likedCommentIds,
      [commentId]: newLikedState,
    };
    setLikedCommentIds(nextLikedMap);
    try {
      localStorage.setItem(likesKey, JSON.stringify(nextLikedMap));
    } catch (err) {
      console.error(err);
    }

    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: Math.max(0, c.likes + (newLikedState ? 1 : -1)),
        };
      }
      return c;
    });

    persistComments(updated);

    if (newLikedState && onShowToast) {
      onShowToast('Marked as helpful feedback', 'info');
    }
  };

  // 3. Handle Deleting user's own comment
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to remove your feedback for this article?')) {
      const updated = comments.filter((c) => c.id !== commentId);
      persistComments(updated);
      if (onShowToast) {
        onShowToast('Your comment was removed.', 'info');
      }
    }
  };

  // 4. Handle Submitting Form
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; comment?: string } = {};

    if (!authorName.trim()) {
      errors.name = 'Please enter your name or moniker.';
    }
    if (!commentText.trim()) {
      errors.comment = 'Please provide your honest feedback or ritual experience.';
    } else if (commentText.trim().length < 10) {
      errors.comment = 'Feedback must be at least 10 characters long.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      // Remember user details in localStorage
      localStorage.setItem(USERNAME_STORAGE_KEY, authorName.trim());
      localStorage.setItem(SKINTYPE_STORAGE_KEY, userSkinType);

      const newComment: CommentItem = {
        id: `user-comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        authorName: authorName.trim(),
        skinType: userSkinType,
        rating,
        content: commentText.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        isVerifiedReader: true,
        isUserCreated: true,
        ritualExperience,
      };

      const updated = [newComment, ...comments];
      persistComments(updated);

      // Reset form
      setCommentText('');
      setIsSubmitting(false);
      setIsFormOpen(false);

      if (onShowToast) {
        onShowToast('Thank you! Your beauty feedback has been published.', 'success');
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  // 5. Calculations for Summary
  const { avgRating, totalReviews, ratingCounts, recommendationPercent } = useMemo(() => {
    if (comments.length === 0) {
      return {
        avgRating: 5.0,
        totalReviews: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendationPercent: 100,
      };
    }

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let positive = 0;

    comments.forEach((c) => {
      const r = Math.min(5, Math.max(1, Math.round(c.rating)));
      counts[r] = (counts[r] || 0) + 1;
      sum += c.rating;
      if (c.rating >= 4) positive += 1;
    });

    const avg = sum / comments.length;
    const rec = Math.round((positive / comments.length) * 100);

    return {
      avgRating: Number(avg.toFixed(1)),
      totalReviews: comments.length,
      ratingCounts: counts,
      recommendationPercent: rec,
    };
  }, [comments]);

  // 6. Filter & Sort comments
  const filteredComments = useMemo(() => {
    let result = [...comments];

    // Skin filter
    if (selectedSkinFilter !== 'All') {
      result = result.filter((c) => c.skinType?.toLowerCase().includes(selectedSkinFilter.toLowerCase()));
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [comments, selectedSkinFilter, sortBy]);

  // Format date helper
  const formatCommentDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 14) return `${diffDays} days ago`;

      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return 'Holy Grail Ritual (5/5)';
      case 4:
        return 'Very Effective (4/5)';
      case 3:
        return 'Balanced & Good (3/5)';
      case 2:
        return 'Needs Fine-Tuning (2/5)';
      case 1:
        return 'Did Not Suit My Skin (1/5)';
      default:
        return `${val} Stars`;
    }
  };

  return (
    <section
      id="community-feedback"
      className="p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-8 scroll-mt-24 shadow-xl transition-all"
    >
      {/* Header & Community Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Community Editorial Feedback</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
            Reader Reviews & Ritual Experiences
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            Real feedback from beauty enthusiasts testing {articleTitle}. Share how your skin
            responded or offer advice to the community.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-950/50 hover:shadow-rose-900/40 transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-rose-200" />
          <span>{isFormOpen ? 'Close Form' : 'Leave Feedback'}</span>
        </button>
      </div>

      {/* Ratings & Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-950/60 p-5 sm:p-6 rounded-2xl border border-stone-800/80">
        {/* Score Column */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-800/80 space-y-2">
          <div className="font-serif text-5xl font-bold text-stone-100 tracking-tight">
            {avgRating}
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(avgRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-stone-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-stone-400">
            Based on {totalReviews} reader review{totalReviews !== 1 ? 's' : ''}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 text-emerald-300 text-[11px] font-medium border border-emerald-800/40 mt-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{recommendationPercent}% recommendation rate</span>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = ratingCounts[score] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={score} className="flex items-center gap-3 text-xs text-stone-300">
                <span className="w-12 text-stone-400 font-medium flex items-center gap-1">
                  {score} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-stone-800 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-stone-400 font-mono text-[11px]">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Feedback Collapsible Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitComment}
          className="p-6 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border border-rose-900/40 space-y-5 animate-in fade-in duration-300 shadow-xl shadow-rose-950/20"
        >
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
            <h4 className="font-serif text-lg font-medium text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Share Your Ritual Experience</span>
            </h4>
            <span className="text-[11px] text-stone-400 font-medium">
              Saved locally to your device
            </span>
          </div>

          {/* Star Rating Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Overall Rating
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => {
                  const active = (hoverRating || rating) >= val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(val)}
                      className="p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                      title={getRatingLabel(val)}
                      aria-label={`${val} star`}
                    >
                      <Star
                        className={`w-6 h-6 transition-all ${
                          active
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-stone-600 hover:text-stone-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-medium text-rose-300">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="comment-author"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-300"
              >
                Your Name / Moniker *
              </label>
              <input
                id="comment-author"
                type="text"
                placeholder="e.g., Nadia Rose"
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`w-full px-4 py-2.5 rounded-xl bg-stone-900 border text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                  formErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-800'
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-rose-400 font-medium">{formErrors.name}</p>
              )}
            </div>

            {/* Skin Profile */}
            <div className="space-y-1.5">
              <label
                htmlFor="comment-skintype"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-300"
              >
                Your Skin Profile
              </label>
              <select
                id="comment-skintype"
                value={userSkinType}
                onChange={(e) => setUserSkinType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all cursor-pointer"
              >
                {SKIN_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-stone-900 text-stone-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience duration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Ritual Experience Context
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setRitualExperience(exp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    ritualExperience === exp
                      ? 'bg-rose-950/80 border-rose-600 text-rose-200 ring-1 ring-rose-500'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="comment-text"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-300"
              >
                Feedback & Results *
              </label>
              <span className="text-[11px] text-stone-500">
                {commentText.length} / 600 characters
              </span>
            </div>
            <textarea
              id="comment-text"
              rows={4}
              maxLength={600}
              placeholder="How did your skin react? What was your application technique or advice for someone with similar concerns?"
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (formErrors.comment) setFormErrors((prev) => ({ ...prev, comment: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-xl bg-stone-900 border text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all leading-relaxed ${
                formErrors.comment ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-800'
              }`}
            />
            {formErrors.comment && (
              <p className="text-xs text-rose-400 font-medium">{formErrors.comment}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-rose-950/60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Feedback'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Skin Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-stone-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'Sensitive', 'Dry', 'Oily', 'Combination'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedSkinFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedSkinFilter === f
                  ? 'bg-rose-950/80 border border-rose-600 text-rose-300'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs text-stone-500">Sort:</span>
          <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sortBy === 'newest' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-300'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('highest')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sortBy === 'highest' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-300'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setSortBy('helpful')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sortBy === 'helpful' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-300'
              }`}
            >
              Most Helpful
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-stone-950/40 border border-stone-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-rose-400 mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-stone-300">
              No reviews matching &ldquo;{selectedSkinFilter}&rdquo; yet.
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first reader with {selectedSkinFilter} skin to leave feedback on this ritual!
            </p>
            <button
              onClick={() => {
                setSelectedSkinFilter('All');
                setIsFormOpen(true);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-rose-300 text-xs font-semibold transition-colors cursor-pointer border border-stone-700"
            >
              Share First Review
            </button>
          </div>
        ) : (
          filteredComments.map((item) => {
            const hasLiked = !!likedCommentIds[item.id];
            const isUserOwn = item.isUserCreated;

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-3 hover:border-stone-700/80 transition-colors"
              >
                {/* Top row: Author, Skin type, verified badge, rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Moniker Avatar / Name */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-700 to-amber-600 text-white text-xs font-serif font-bold flex items-center justify-center shrink-0">
                      {item.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-serif font-medium text-stone-100 text-sm sm:text-base">
                      {item.authorName}
                    </span>

                    {item.isVerifiedReader && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 text-[10px] font-semibold border border-emerald-800/40">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Reader</span>
                      </span>
                    )}

                    {isUserOwn && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 text-[10px] font-semibold border border-rose-800/40">
                        <span>Your Review</span>
                      </span>
                    )}

                    {item.skinType && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-900 text-stone-400 text-[11px] border border-stone-800">
                        {item.skinType}
                      </span>
                    )}

                    {item.ritualExperience && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900 text-stone-400 text-[11px] border border-stone-800">
                        <Clock className="w-3 h-3 text-rose-400" />
                        <span>{item.ritualExperience}</span>
                      </span>
                    )}
                  </div>

                  {/* Rating Stars & Relative Date */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= item.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {formatCommentDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal whitespace-pre-line pt-1">
                  {item.content}
                </p>

                {/* Abbas Editorial Response if present */}
                {item.abbasReply && (
                  <div className="mt-3 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-rose-300">
                        <Award className="w-3.5 h-3.5 text-rose-400" />
                        <span>{item.abbasReply.author}</span>
                        <span className="text-[10px] font-normal text-rose-400/80">
                          ({item.abbasReply.role})
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500">{item.abbasReply.date}</span>
                    </div>
                    <p className="text-xs text-stone-300 italic leading-relaxed">
                      &ldquo;{item.abbasReply.text}&rdquo;
                    </p>
                  </div>
                )}

                {/* Footer bar: Helpful like button, Delete if own */}
                <div className="flex items-center justify-between pt-2 text-xs border-t border-stone-900">
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                        : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                    title={hasLiked ? 'You found this helpful' : 'Mark this review as helpful'}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-400' : ''}`}
                    />
                    <span>
                      Helpful {item.likes > 0 ? `(${item.likes})` : ''}
                    </span>
                  </button>

                  {isUserOwn && (
                    <button
                      onClick={() => handleDeleteComment(item.id)}
                      className="inline-flex items-center gap-1 text-stone-500 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Guidance footnote */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-stone-500">
          Comments and feedback are stored securely in your browser&apos;s local storage for this
          ritual article.
        </p>
      </div>
    </section>
  );
};

export default CommentSection;
