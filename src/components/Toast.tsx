import React from 'react';
import { CheckCircle2, Heart, Info, X, Flame, Bell, ArrowRight } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'favorite' | 'success' | 'info' | 'streak' | 'reminder';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        const isReminderOrStreak = toast.type === 'streak' || toast.type === 'reminder';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
              isReminderOrStreak
                ? 'bg-stone-900/98 border border-orange-500/50 shadow-orange-950/60 ring-1 ring-orange-500/20'
                : 'bg-stone-900/95 border border-stone-800'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {toast.type === 'favorite' ? (
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : isReminderOrStreak ? (
                <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Flame className="w-4 h-4 fill-orange-500/30" />
                </div>
              ) : (
                <Info className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-stone-100 leading-snug">
                  {toast.message}
                </p>

                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      onDismiss(toast.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-stone-400 hover:text-white transition-colors rounded-lg cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
