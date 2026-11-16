import React, { useState, useEffect } from 'react';
import { Sun, Moon, Check, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { DEFAULT_MORNING_STEPS, DEFAULT_NIGHT_STEPS } from '../data/routines';
import { DailyRoutineStep } from '../types';
import routineImage from '../assets/images/routine_skincare_ritual_1791268873835.jpg';

interface DailyRoutineTrackerProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const DailyRoutineTracker: React.FC<DailyRoutineTrackerProps> = ({
  onShowToast,
}) => {
  const [morningSteps, setMorningSteps] = useState<DailyRoutineStep[]>(() => {
    const saved = localStorage.getItem('beauty_routine_morning');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_MORNING_STEPS;
      }
    }
    return DEFAULT_MORNING_STEPS;
  });

  const [nightSteps, setNightSteps] = useState<DailyRoutineStep[]>(() => {
    const saved = localStorage.getItem('beauty_routine_night');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_NIGHT_STEPS;
      }
    }
    return DEFAULT_NIGHT_STEPS;
  });

  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');

  useEffect(() => {
    localStorage.setItem('beauty_routine_morning', JSON.stringify(morningSteps));
  }, [morningSteps]);

  useEffect(() => {
    localStorage.setItem('beauty_routine_night', JSON.stringify(nightSteps));
  }, [nightSteps]);

  const toggleStep = (time: 'morning' | 'night', id: string) => {
    if (time === 'morning') {
      setMorningSteps((prev) =>
        prev.map((step) => {
          if (step.id === id) {
            const nextVal = !step.completed;
            if (nextVal) {
              onShowToast(`Completed morning step: ${step.title}`, 'success');
            }
            return { ...step, completed: nextVal };
          }
          return step;
        })
      );
    } else {
      setNightSteps((prev) =>
        prev.map((step) => {
          if (step.id === id) {
            const nextVal = !step.completed;
            if (nextVal) {
              onShowToast(`Completed night step: ${step.title}`, 'success');
            }
            return { ...step, completed: nextVal };
          }
          return step;
        })
      );
    }
  };

  const resetRoutines = () => {
    setMorningSteps(DEFAULT_MORNING_STEPS);
    setNightSteps(DEFAULT_NIGHT_STEPS);
    onShowToast('Daily routines reset for a fresh start!', 'info');
  };

  const morningCompletedCount = morningSteps.filter((s) => s.completed).length;
  const nightCompletedCount = nightSteps.filter((s) => s.completed).length;

  const morningPercent = Math.round((morningCompletedCount / morningSteps.length) * 100);
  const nightPercent = Math.round((nightCompletedCount / nightSteps.length) * 100);

  return (
    <section id="daily-routine" className="py-16 bg-rose-50/30 dark:bg-stone-900/40 border-y border-rose-100 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-700 dark:text-rose-400 mb-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Interactive Self-Care Ritual Tracker</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 dark:text-rose-50 font-normal">
              Daily Beauty Routine
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl">
              Track your morning protection and nighttime restorative skincare habits. Mark each step as you complete it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetRoutines}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-rose-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Daily Checklists</span>
            </button>
          </div>
        </div>

        {/* Routine Banner with editorial visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual card */}
          <div className="lg:col-span-4 rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 shadow-sm p-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800">
              <img
                src={routineImage}
                alt="Aesthetic skincare vanity tray and morning ritual items"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-200">Consistency Habit</span>
                <p className="font-serif text-sm font-medium mt-0.5">
                  Great skin is built 10 minutes at dawn, and 10 minutes before rest.
                </p>
              </div>
            </div>

            {/* Quick Summary Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-stone-800/80 border border-amber-100/60 dark:border-stone-700">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Morning
                </p>
                <p className="text-xl font-bold text-amber-950 dark:text-amber-100 tabular-nums mt-0.5">
                  {morningCompletedCount} / {morningSteps.length}
                </p>
                <div className="w-full bg-amber-200/50 dark:bg-stone-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${morningPercent}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-stone-800/80 border border-indigo-100/60 dark:border-stone-700">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                  Night
                </p>
                <p className="text-xl font-bold text-indigo-950 dark:text-indigo-100 tabular-nums mt-0.5">
                  {nightCompletedCount} / {nightSteps.length}
                </p>
                <div className="w-full bg-indigo-200/50 dark:bg-stone-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${nightPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Routine Checklist */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-rose-100 dark:border-stone-800 shadow-sm">
            {/* Tab selector */}
            <div className="flex items-center gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl max-w-sm mb-6">
              <button
                onClick={() => setActiveTab('morning')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  activeTab === 'morning'
                    ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-200 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Morning Routine</span>
                <span className="text-xs opacity-75 tabular-nums">({morningCompletedCount}/{morningSteps.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('night')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  activeTab === 'night'
                    ? 'bg-white dark:bg-stone-900 text-indigo-900 dark:text-indigo-200 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Night Routine</span>
                <span className="text-xs opacity-75 tabular-nums">({nightCompletedCount}/{nightSteps.length})</span>
              </button>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {(activeTab === 'morning' ? morningSteps : nightSteps).map((step) => {
                const isCompleted = step.completed;
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(activeTab, step.id)}
                    className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isCompleted
                        ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40 opacity-80'
                        : 'bg-stone-50/50 dark:bg-stone-800/50 border-stone-200/60 dark:border-stone-800 hover:border-rose-300 dark:hover:border-stone-700'
                    }`}
                  >
                    {/* Checkbox circle */}
                    <button
                      type="button"
                      aria-label={`Toggle step: ${step.title}`}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isCompleted
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 group-hover:border-rose-400'
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-400">Step {step.stepNumber}</span>
                          <h4
                            className={`text-sm sm:text-base font-semibold transition-colors ${
                              isCompleted
                                ? 'line-through text-stone-400 dark:text-stone-500'
                                : 'text-stone-900 dark:text-stone-100'
                            }`}
                          >
                            {step.title}
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {step.category}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                          isCompleted
                            ? 'text-stone-400 dark:text-stone-500 line-through'
                            : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {step.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="font-medium">{step.keyBenefit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
