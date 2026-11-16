import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Check,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { getDailyQuizQuestions, QuizQuestion } from '../data/beautyQuizData';
import { toLocalDateString, recordDailyActivity } from '../utils/streak';
import { evaluateMilestones } from '../utils/milestones';

interface DailyBeautyQuizProps {
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  onOpenAchievements?: () => void;
  className?: string;
}

const STORAGE_PREFIX = 'beauty_daily_quiz_score_';
const QUIZ_MASTER_STORAGE_KEY = 'beauty_quiz_master_unlocked';

export const DailyBeautyQuiz: React.FC<DailyBeautyQuizProps> = ({
  onShowToast,
  onOpenAchievements,
  className = '',
}) => {
  const todayStr = toLocalDateString();
  const [practiceSetOffset, setPracticeSetOffset] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    getDailyQuizQuestions(new Date(), 0)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Check if Quiz Master badge is already unlocked
  const [isQuizMasterUnlocked, setIsQuizMasterUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(QUIZ_MASTER_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Check if today's official quiz was already taken
  const [todayCompletedData, setTodayCompletedData] = useState<{
    score: number;
    total: number;
  } | null>(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${todayStr}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // When practice offset changes, refresh questions
  useEffect(() => {
    setQuestions(getDailyQuizQuestions(new Date(), practiceSetOffset));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnswersHistory([]);
    setIsQuizFinished(false);
  }, [practiceSetOffset]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: index,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);

    // Calculate final score
    const finalScore = score + (selectedAnswer === currentQuestion.correctAnswerIndex ? 1 : 0);

    // 1. Record daily reading activity/streak for engaging with the quiz
    recordDailyActivity();

    // 2. Persist today's quiz result if official daily quiz
    if (practiceSetOffset === 0) {
      const completionPayload = { score: finalScore, total: questions.length };
      try {
        localStorage.setItem(
          `${STORAGE_PREFIX}${todayStr}`,
          JSON.stringify(completionPayload)
        );
        setTodayCompletedData(completionPayload);
      } catch (e) {
        console.error('Failed to save daily quiz completion:', e);
      }
    }

    // 3. Unlock Quiz Master badge if perfect score achieved
    if (finalScore === questions.length) {
      try {
        localStorage.setItem(QUIZ_MASTER_STORAGE_KEY, 'true');
        setIsQuizMasterUnlocked(true);

        const check = evaluateMilestones();
        if (onShowToast) {
          onShowToast('🏆 Milestone Unlocked: "Quiz Master" Digital Badge!', 'favorite');
        }
      } catch (e) {
        console.error('Failed to save quiz master milestone:', e);
      }
    } else if (onShowToast) {
      onShowToast(`Daily Quiz completed: ${finalScore} of ${questions.length} correct!`, 'success');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnswersHistory([]);
    setIsQuizFinished(false);
  };

  const handlePracticeAnotherSet = () => {
    setPracticeSetOffset((prev) => prev + 1);
  };

  return (
    <section
      aria-label="Daily Beauty Quiz"
      className={`rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <Brain className="w-4 h-4 text-rose-400" />
              <span>Daily Beauty Trivia Challenge</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              The Skincare & Formulation Quiz
            </h2>
            {/* Clean unboxed metadata */}
            <p className="text-xs text-stone-400 flex flex-wrap items-center gap-2 pt-0.5">
              <span>3 Clinical Questions</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Updated Daily</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Earn the <strong className="text-amber-300 font-semibold">Quiz Master</strong> Badge</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Quiz Master Badge status preview button */}
            <button
              onClick={onOpenAchievements}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isQuizMasterUnlocked
                  ? 'bg-amber-950/70 border-amber-600/50 text-amber-300 shadow-sm ring-1 ring-amber-500/30'
                  : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
              title={
                isQuizMasterUnlocked
                  ? 'Quiz Master badge unlocked! View in Achievements.'
                  : 'Score 3/3 on today’s quiz to unlock the Quiz Master badge.'
              }
            >
              <Trophy className={`w-3.5 h-3.5 ${isQuizMasterUnlocked ? 'text-amber-400 fill-amber-500/30' : 'text-stone-500'}`} />
              <span>{isQuizMasterUnlocked ? 'Quiz Master Unlocked' : 'Unlock Badge'}</span>
            </button>

            {todayCompletedData && !isQuizFinished && (
              <span className="text-xs text-stone-400 px-2.5 py-1 rounded-xl bg-stone-950/60 border border-stone-850">
                Today's Best: <strong className="text-stone-200">{todayCompletedData.score}/{todayCompletedData.total}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Quiz Flow: Question vs Completion */}
        {!isQuizFinished ? (
          <div className="space-y-6">
            {/* Step Progress Dots & Category */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="text-stone-200 font-semibold">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="text-rose-400 font-medium">
                  {currentQuestion.category}
                </span>
              </div>

              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-rose-500'
                        : idx < currentIndex
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-stone-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/60 border border-stone-850">
              <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-100 leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* 4 Options Grid */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;

                let cardStyle = 'bg-stone-900 border-stone-800 text-stone-200 hover:border-stone-700 hover:bg-stone-850';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/40 font-medium';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-950/70 border-rose-600/80 text-rose-200 ring-1 ring-rose-600/40';
                  } else {
                    cardStyle = 'bg-stone-950/40 border-stone-850 text-stone-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer disabled:cursor-default ${cardStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border mt-0.5 ${
                        isAnswerSubmitted && isCorrect
                          ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                          : isAnswerSubmitted && isSelected
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-stone-800 border-stone-700 text-stone-300'
                      }`}
                    >
                      {isAnswerSubmitted && isCorrect ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isAnswerSubmitted && isSelected ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>

                    <span className="text-xs sm:text-sm leading-relaxed flex-1">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Question Banner (revealed after selection) */}
            {isAnswerSubmitted && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  {selectedAnswer === currentQuestion.correctAnswerIndex ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Spot on! Correct answer.
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      Not quite. Review the clinical reason below.
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-850">
                  <Link
                    to={`/beauty-tips/${currentQuestion.sourceTipSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Study Guide: {currentQuestion.sourceTipTitle}</span>
                  </Link>

                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completion & Score Summary Screen */
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-950/80 border border-stone-800 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="space-y-3">
              <div
                className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border shadow-xl ${
                  score === questions.length
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-amber-950/60'
                    : 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                }`}
              >
                {score === questions.length ? (
                  <Trophy className="w-8 h-8 text-amber-400" />
                ) : (
                  <Award className="w-8 h-8 text-rose-400" />
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">
                  Daily Challenge Completed
                </span>
                <h3 className="font-serif text-3xl font-medium text-stone-100">
                  You Scored {score} out of {questions.length}
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                  {score === questions.length
                    ? "Flawless performance! You've officially proven your mastery of skincare science and formulation principles."
                    : score >= 2
                    ? "Great knowledge! You have a solid grasp of beauty principles. Review the explanations to master the rest."
                    : "Good effort! Skincare is a continuous practice. Review Abbas's masterclass guides to level up your wisdom."}
                </p>
              </div>
            </div>

            {/* Quiz Master Badge celebration card if 3/3 */}
            {score === questions.length && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-rose-950/40 to-amber-950/50 border border-amber-500/40 flex items-center justify-between gap-4 text-left max-w-md mx-auto shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                      Badge Unlocked
                    </span>
                    <span className="font-serif text-base font-semibold text-stone-100">
                      Quiz Master
                    </span>
                  </div>
                </div>

                {onOpenAchievements && (
                  <button
                    onClick={onOpenAchievements}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    View Badges
                  </button>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-750 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake This Quiz</span>
              </button>

              <button
                onClick={handlePracticeAnotherSet}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Practice Another 3 Questions</span>
              </button>

              <Link
                to="/beauty-tips"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 text-xs font-medium transition-colors"
              >
                <span>Browse All Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
