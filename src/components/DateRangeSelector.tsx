import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  X,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  DateRangeFilter,
  DateRangePreset,
  DATE_RANGE_PRESETS,
  calculateRangeForPreset,
  formatDisplayDate,
  formatDateRangeSummary,
  getTodayDateStr,
} from '../utils/dateRangeUtils';

interface DateRangeSelectorProps {
  value: DateRangeFilter;
  onChange: (filter: DateRangeFilter) => void;
  totalPhotosCount: number;
  filteredPhotosCount: number;
  availableDateMin?: string;
  availableDateMax?: string;
  compact?: boolean;
  className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  value,
  onChange,
  totalPhotosCount,
  filteredPhotosCount,
  availableDateMin,
  availableDateMax,
  compact = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom date range input state
  const [customStart, setCustomStart] = useState(value.startDate || '');
  const [customEnd, setCustomEnd] = useState(value.endDate || getTodayDateStr());
  const [customError, setCustomError] = useState<string | null>(null);

  // Sync custom inputs when value changes externally
  useEffect(() => {
    if (value.preset === 'custom') {
      setCustomStart(value.startDate || '');
      setCustomEnd(value.endDate || getTodayDateStr());
    }
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectPreset = (preset: DateRangePreset) => {
    setCustomError(null);
    if (preset === 'custom') {
      const today = getTodayDateStr();
      const start = customStart || value.startDate || availableDateMin || today;
      const end = customEnd || value.endDate || today;
      onChange({
        preset: 'custom',
        startDate: start,
        endDate: end,
      });
      return;
    }

    const { startDate, endDate } = calculateRangeForPreset(preset);
    onChange({
      preset,
      startDate,
      endDate,
    });
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (!customStart && !customEnd) {
      setCustomError('Please choose at least a start or end date.');
      return;
    }
    if (customStart && customEnd && customStart > customEnd) {
      setCustomError('Start date cannot be after end date.');
      return;
    }

    setCustomError(null);
    onChange({
      preset: 'custom',
      startDate: customStart,
      endDate: customEnd || getTodayDateStr(),
    });
    setIsOpen(false);
  };

  const handleResetToAll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomError(null);
    onChange({
      preset: 'all',
      startDate: '',
      endDate: '',
    });
    setIsOpen(false);
  };

  const isFiltered = value.preset !== 'all' && (Boolean(value.startDate) || Boolean(value.endDate));
  const activeLabel = formatDateRangeSummary(value);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 rounded-2xl transition-all cursor-pointer border ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-xs sm:text-xs'
          } ${
            isFiltered
              ? 'bg-rose-950/80 text-rose-200 border-rose-600/80 shadow-md ring-1 ring-rose-500/30'
              : 'bg-stone-950 text-stone-300 border-stone-800 hover:text-white hover:border-stone-700'
          }`}
          title="Filter skin progress photos by time range"
        >
          <Calendar
            className={`shrink-0 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
              isFiltered ? 'text-rose-400' : 'text-stone-400'
            }`}
          />
          <span className="font-medium truncate max-w-[170px] sm:max-w-[240px]">
            {activeLabel}
          </span>

          {isFiltered && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
              {filteredPhotosCount}
            </span>
          )}

          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetToAll}
            className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="Clear date range filter (Show All Time)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto mt-2 w-[340px] sm:w-[380px] max-w-[95vw] rounded-3xl bg-stone-900 border border-stone-750 shadow-2xl p-4 sm:p-5 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              <h4 className="font-serif text-sm font-medium text-stone-100">
                Filter by Date Range
              </h4>
            </div>
            <span className="text-[11px] text-stone-400">
              {filteredPhotosCount} of {totalPhotosCount} photos match
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Quick Time Frames
            </span>

            <div className="grid grid-cols-2 gap-2">
              {DATE_RANGE_PRESETS.filter((p) => p.id !== 'custom').map((p) => {
                const isSelected = value.preset === p.id;
                const range = calculateRangeForPreset(p.id);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-950/70 border-rose-500 text-rose-100 ring-1 ring-rose-500/50 shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold">{p.shortLabel}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                    {p.id !== 'all' && range.startDate && (
                      <span className="text-[10px] text-stone-400 truncate mt-0.5">
                        {formatDisplayDate(range.startDate, false)} – {formatDisplayDate(range.endDate, false)}
                      </span>
                    )}
                    {p.id === 'all' && (
                      <span className="text-[10px] text-stone-500 mt-0.5">
                        Full skin archive
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Range Section */}
          <div className="pt-2 border-t border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Custom Range
              </span>
              {value.preset === 'custom' && (
                <span className="text-[10px] text-rose-400 font-semibold">Active</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-stone-400 block">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  max={customEnd || getTodayDateStr()}
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    setCustomError(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-stone-400 block">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  min={customStart}
                  max={getTodayDateStr()}
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    setCustomError(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            {customError && (
              <p className="text-[11px] text-rose-400 font-medium">{customError}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleApplyCustom}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Apply Custom Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {availableDateMin && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStart(availableDateMin);
                    setCustomEnd(getTodayDateStr());
                  }}
                  className="py-2 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-[11px] font-medium transition-colors cursor-pointer"
                  title="Set start date to oldest photo in gallery"
                >
                  Earliest
                </button>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleResetToAll}
              className="text-stone-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to All Time</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
