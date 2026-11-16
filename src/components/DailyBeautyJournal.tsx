import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  BookOpen,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Moon,
  Smile,
  ShieldCheck,
  Flame,
  Download,
  Copy,
  PenTool,
  Clock,
  Layers,
  Heart,
} from 'lucide-react';
import {
  SkinMood,
  SKIN_MOODS,
  POPULAR_PRODUCTS_TAGS,
  BeautyJournalEntry,
  getAllJournalEntries,
  getJournalEntryForDate,
  saveJournalEntry,
  deleteJournalEntry,
  calculateMonthlyStats,
  JOURNAL_EVENT,
} from '../utils/beautyJournal';
import { toLocalDateString } from '../utils/streak';
import { SkinMoodTrendChart } from './SkinMoodTrendChart';
import { TrendingUp } from 'lucide-react';

interface DailyBeautyJournalProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  className?: string;
  defaultShowTrends?: boolean;
}

export const DailyBeautyJournal: React.FC<DailyBeautyJournalProps> = ({
  onShowToast,
  className = '',
  defaultShowTrends = true,
}) => {
  const [showTrends, setShowTrends] = useState<boolean>(defaultShowTrends);
  const todayStr = useMemo(() => toLocalDateString(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Calendar month state
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(new Date().getMonth());

  // Entries and stats state
  const [entries, setEntries] = useState<Record<string, BeautyJournalEntry>>(() =>
    getAllJournalEntries()
  );
  const [stats, setStats] = useState(() => calculateMonthlyStats(viewYear, viewMonth));

  // Form State for selectedDate
  const currentEntry = entries[selectedDate];
  const [skinMood, setSkinMood] = useState<SkinMood>('calm');
  const [productsUsed, setProductsUsed] = useState<string[]>(['Ceramide Cream', 'Broad-Spectrum SPF 50']);
  const [customProductInput, setCustomProductInput] = useState('');
  const [observations, setObservations] = useState('');
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [sleepHours, setSleepHours] = useState(8);
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high'>('low');

  // Load selectedDate entry into form
  useEffect(() => {
    if (currentEntry) {
      setSkinMood(currentEntry.skinMood);
      setProductsUsed(currentEntry.productsUsed || []);
      setObservations(currentEntry.observations || '');
      setWaterGlasses(currentEntry.waterGlasses ?? 8);
      setSleepHours(currentEntry.sleepHours ?? 8);
      setStressLevel(currentEntry.stressLevel ?? 'low');
    } else {
      // Defaults for a new entry
      setSkinMood('calm');
      setProductsUsed(['Gentle Low-pH Cleanser', 'Broad-Spectrum SPF 50']);
      setObservations('');
      setWaterGlasses(8);
      setSleepHours(8);
      setStressLevel('low');
    }
  }, [selectedDate, entries]);

  // Sync entries on custom event or storage
  const reloadData = () => {
    const loaded = getAllJournalEntries();
    setEntries(loaded);
    setStats(calculateMonthlyStats(viewYear, viewMonth));
  };

  useEffect(() => {
    window.addEventListener(JOURNAL_EVENT, reloadData);
    window.addEventListener('storage', reloadData);
    return () => {
      window.removeEventListener(JOURNAL_EVENT, reloadData);
      window.removeEventListener('storage', reloadData);
    };
  }, [viewYear, viewMonth]);

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
      setStats(calculateMonthlyStats(viewYear - 1, 11));
    } else {
      setViewMonth((m) => m - 1);
      setStats(calculateMonthlyStats(viewYear, viewMonth - 1));
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
      setStats(calculateMonthlyStats(viewYear + 1, 0));
    } else {
      setViewMonth((m) => m + 1);
      setStats(calculateMonthlyStats(viewYear, viewMonth + 1));
    }
  };

  // Toggle a product tag
  const handleToggleProduct = (product: string) => {
    setProductsUsed((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  // Add custom product
  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customProductInput.trim();
    if (clean && !productsUsed.includes(clean)) {
      setProductsUsed((prev) => [...prev, clean]);
      setCustomProductInput('');
    }
  };

  // Save journal entry
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();

    const entryToSave: BeautyJournalEntry = {
      date: selectedDate,
      updatedAt: Date.now(),
      skinMood,
      productsUsed,
      observations: observations.trim(),
      waterGlasses,
      sleepHours,
      stressLevel,
    };

    saveJournalEntry(entryToSave);
    reloadData();

    const isToday = selectedDate === todayStr;
    onShowToast(
      isToday
        ? 'Today’s Beauty Journal entry saved! Streak updated.'
        : `Journal entry for ${selectedDate} saved successfully!`,
      'success'
    );
  };

  // Delete journal entry
  const handleDeleteEntry = () => {
    if (confirm(`Delete the journal entry for ${selectedDate}?`)) {
      deleteJournalEntry(selectedDate);
      reloadData();
      onShowToast(`Deleted journal entry for ${selectedDate}.`, 'info');
    }
  };

  // Copy monthly overview summary to clipboard
  const handleCopyMonthlySummary = () => {
    let text = `🌸 Beauty Journal Monthly Overview — ${stats.monthName}\n`;
    text += `Days Logged: ${stats.loggedDaysCount} / ${stats.totalDaysInMonth} (${stats.completionRate}%)\n`;
    if (stats.topMood) {
      text += `Dominant Skin State: ${stats.topMood.emoji} ${stats.topMood.label}\n`;
    }
    if (stats.topProducts.length > 0) {
      text += `Most Used Actives & Rituals:\n`;
      stats.topProducts.forEach((p, idx) => {
        text += `  ${idx + 1}. ${p.name} (${p.count}x)\n`;
      });
    }
    text += `\nBeauty Tips by Abbas — Everyday Skincare Wisdom`;

    navigator.clipboard.writeText(text);
    onShowToast('Monthly journal overview copied to clipboard!', 'success');
  };

  // Generate calendar day cells for current viewMonth
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; entry?: BeautyJournalEntry }[] = [];

    // Preceding empty/previous month days
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({
        dateStr: `empty-${i}`,
        dayNum: 0,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dateStr: dStr,
        dayNum: d,
        isCurrentMonth: true,
        entry: entries[dStr],
      });
    }

    return cells;
  }, [viewYear, viewMonth, entries]);

  const selectedDateFormatted = useMemo(() => {
    try {
      const parts = selectedDate.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <section
      aria-label="Daily Beauty Journal and Monthly Overview"
      className={`rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-8 ${className}`}
    >
      {/* Background Subtle Luxury Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1.5 rounded-full">
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span>Daily Skin Diary & Habits</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
            Beauty & Skin Journal
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-light leading-relaxed">
            Quickly log your skin mood, products used, and observations for the day. Stored on-device to build your monthly skincare timeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowTrends(!showTrends)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              showTrends
                ? 'bg-rose-950 border-rose-700 text-rose-300 shadow-sm'
                : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-stone-750'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{showTrends ? 'Hide 30-Day Trends' : '30-Day Trends (Recharts)'}</span>
          </button>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              selectedDate === todayStr
                ? 'bg-rose-950 border-rose-700 text-rose-300'
                : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-stone-750'
            }`}
          >
            <span>Today ({todayStr.slice(5)})</span>
          </button>

          <button
            onClick={handleCopyMonthlySummary}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-750 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Copy monthly summary overview"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recharts 30-Day Skin Mood & Barrier Trends Visualization */}
      {showTrends && (
        <SkinMoodTrendChart
          entries={entries}
          onSelectDate={(d) => setSelectedDate(d)}
          onShowToast={onShowToast}
        />
      )}

      {/* Main Grid: Monthly Overview Calendar (Left) & Daily Log Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (5 Cols): Monthly Calendar & Analytics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Calendar Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-stone-950/80 border border-stone-850 space-y-4">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-rose-400" />
                <h3 className="font-serif text-lg font-medium text-stone-100">
                  {stats.monthName}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Names */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-stone-500 pb-1 border-b border-stone-850">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, idx) => {
                if (!cell.isCurrentMonth) {
                  return <div key={idx} className="aspect-square opacity-0 pointer-events-none" />;
                }

                const isSelected = cell.dateStr === selectedDate;
                const isToday = cell.dateStr === todayStr;
                const entry = cell.entry;
                const moodConfig = entry ? SKIN_MOODS.find((m) => m.id === entry.skinMood) : null;

                return (
                  <button
                    key={cell.dateStr}
                    onClick={() => setSelectedDate(cell.dateStr)}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/90 border-2 border-rose-500 text-rose-100 font-bold shadow-md shadow-rose-950/60'
                        : isToday
                        ? 'bg-stone-900 border border-stone-700 text-stone-100 font-medium'
                        : entry
                        ? 'bg-stone-900/60 hover:bg-stone-850 border border-stone-800/80 text-stone-300'
                        : 'hover:bg-stone-900 text-stone-400 border border-transparent'
                    }`}
                  >
                    <span className="text-xs leading-none">{cell.dayNum}</span>

                    {/* Mood Indicator Dot / Emoji */}
                    {entry && moodConfig && (
                      <span
                        className="text-[10px] leading-none mt-1"
                        title={`${cell.dateStr}: ${moodConfig.label}`}
                      >
                        {moodConfig.emoji}
                      </span>
                    )}

                    {/* Has Entry Indicator Dot if no emoji fits */}
                    {entry && !moodConfig && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="pt-2 border-t border-stone-850/80 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border border-rose-500 bg-rose-950" />
                <span>Selected</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-700" />
                <span>Today</span>
              </span>
              <span className="flex items-center gap-1">
                <span>✨ 🌿 💧 Logged</span>
              </span>
            </div>
          </div>

          {/* Monthly Statistics & Insights Card */}
          <div className="p-5 rounded-3xl bg-stone-950/80 border border-stone-850 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif text-sm font-medium text-stone-200">
                Monthly Skin Analytics
              </span>
              <span className="text-rose-400 font-semibold">
                {stats.loggedDaysCount} of {stats.totalDaysInMonth} Days Logged
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, stats.completionRate)}%` }}
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
              />
            </div>

            {/* Top Mood & Actives breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-2xl bg-stone-900 border border-stone-850 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                  Dominant Skin State
                </span>
                {stats.topMood ? (
                  <span className={`font-semibold flex items-center gap-1 ${stats.topMood.colorClass}`}>
                    <span>{stats.topMood.emoji}</span>
                    <span>{stats.topMood.label}</span>
                  </span>
                ) : (
                  <span className="text-stone-400">None logged yet</span>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-stone-900 border border-stone-850 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                  Top Active Used
                </span>
                {stats.topProducts.length > 0 ? (
                  <span className="font-semibold text-stone-200 truncate block">
                    {stats.topProducts[0].name}
                  </span>
                ) : (
                  <span className="text-stone-400">None logged yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 Cols): Daily Logging Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSaveEntry}
            className="p-6 sm:p-7 rounded-3xl bg-stone-950/80 border border-stone-850 space-y-6"
          >
            {/* Date Header for this Form */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-850 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-400 block">
                  {selectedDate === todayStr ? 'Today’s Log' : 'Archived Log'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-100">
                  {selectedDateFormatted}
                </h3>
              </div>

              {currentEntry && (
                <button
                  type="button"
                  onClick={handleDeleteEntry}
                  className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 cursor-pointer self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Entry</span>
                </button>
              )}
            </div>

            {/* 1. Skin Mood Selector */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                1. How Does Your Skin Feel Today?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SKIN_MOODS.map((mood) => {
                  const isSelected = skinMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSkinMood(mood.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? `${mood.bgClass} ${mood.borderClass} ${mood.colorClass} ring-1 ring-rose-500/40 shadow-sm font-semibold`
                          : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{mood.emoji}</span>
                        <span className="text-xs font-semibold leading-tight">{mood.label}</span>
                      </div>
                      <p className="text-[10px] opacity-70 mt-1 line-clamp-1">{mood.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Products & Actives Used */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                  2. Products & Actives Layered Today
                </label>
                <span className="text-[11px] text-stone-500">
                  {productsUsed.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_PRODUCTS_TAGS.map((prod) => {
                  const isSelected = productsUsed.includes(prod);
                  return (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => handleToggleProduct(prod)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rose-950 border border-rose-700 text-rose-200 font-medium'
                          : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                      }`}
                    >
                      <span>{prod}</span>
                      {isSelected && <Check className="w-3 h-3 text-rose-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Product Add Input */}
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={customProductInput}
                  onChange={(e) => setCustomProductInput(e.target.value)}
                  placeholder="Add custom product name (e.g. Copper Peptides, Azelaic 10%)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomProduct}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold shrink-0 cursor-pointer border border-stone-700"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* 3. Daily Observations & Notes */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 block">
                3. Daily Observations & Barrier Notes
              </label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="How did your skin react to today's active serums? Any flushes, dry patches, or glass skin bounce noticed?"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>

            {/* 4. Lifestyle & Hydration Trackers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-stone-850">
              {/* Water Glasses */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-cyan-400" />
                  <span>Water ({waterGlasses} glasses)</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setWaterGlasses((w) => Math.max(0, w - 1))}
                    className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-mono text-xs text-cyan-300">
                    {waterGlasses}
                  </span>
                  <button
                    type="button"
                    onClick={() => setWaterGlasses((w) => Math.min(16, w + 1))}
                    className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Sleep Hours */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span>Sleep ({sleepHours} hrs)</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSleepHours((s) => Math.max(0, s - 0.5))}
                    className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-mono text-xs text-indigo-300">
                    {sleepHours}h
                  </span>
                  <button
                    type="button"
                    onClick={() => setSleepHours((s) => Math.min(16, s + 0.5))}
                    className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block flex items-center gap-1">
                  <Smile className="w-3 h-3 text-rose-400" />
                  <span>Stress Level</span>
                </label>
                <select
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 capitalize"
                >
                  <option value="low">Low (Peaceful)</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High Stress</option>
                </select>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-stone-400">
                🔒 Saved locally in your browser · Earns daily streak progress
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Entry to Journal</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
