import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Sparkles,
  ShieldCheck,
  Bookmark,
  Bell,
  Globe,
  RotateCcw,
  Check,
  Heart,
} from 'lucide-react';
import { SkinType, BeautyConcern, SupportedLanguage } from '../types';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritesCount: number;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export interface UserPreferences {
  name: string;
  skinType: SkinType;
  primaryConcern: string;
  language: SupportedLanguage;
  notificationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  name: 'Beauty Enthusiast',
  skinType: 'combination',
  primaryConcern: 'Skin Barrier & Hydration',
  language: 'en',
  notificationsEnabled: false,
};

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  favoritesCount,
  onShowToast,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('beauty_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('beauty_user_profile', JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  const handleSave = () => {
    setSavedSuccess(true);
    onShowToast('Personal beauty preferences updated!', 'success');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    onShowToast('Preferences restored to defaults.', 'info');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-100">
                  Your Beauty Profile
                </h3>
                <p className="text-[11px] text-stone-400">Personalized regimen & preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center gap-1.5 text-stone-400 text-[11px] mb-1">
                  <Bookmark className="w-3.5 h-3.5 text-rose-400" />
                  <span>Saved Guides</span>
                </div>
                <p className="text-xl font-serif font-bold text-stone-100">{favoritesCount}</p>
                <p className="text-[10px] text-stone-500 mt-0.5">Stored in your browser vault</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center gap-1.5 text-stone-400 text-[11px] mb-1">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  <span>Account Status</span>
                </div>
                <p className="text-sm font-semibold text-emerald-400 mt-1">Local Guest Mode</p>
                <p className="text-[10px] text-stone-500 mt-0.5">No login required to explore</p>
              </div>
            </div>

            {/* Profile Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-300">
                Display Name / Moniker
              </label>
              <input
                type="text"
                value={preferences.name}
                onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>

            {/* Skin Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-300">
                Target Skin Type
              </label>
              <select
                value={preferences.skinType}
                onChange={(e) => setPreferences({ ...preferences, skinType: e.target.value as SkinType })}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-rose-500 text-xs cursor-pointer"
              >
                <option value="combination">Combination Skin</option>
                <option value="dry">Dry / Dehydrated Skin</option>
                <option value="oily">Oily / Sebum-Prone Skin</option>
                <option value="sensitive">Sensitive / Reactive Skin</option>
                <option value="normal">Balanced / Normal Skin</option>
              </select>
            </div>

            {/* Primary Concern */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-300">
                Primary Aesthetic Concern
              </label>
              <input
                type="text"
                value={preferences.primaryConcern}
                onChange={(e) => setPreferences({ ...preferences, primaryConcern: e.target.value })}
                placeholder="e.g. Hormonal Acne, Hyperpigmentation, Hair Breakage"
                className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-400" />
                <span>Preferred Reading Language</span>
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value as SupportedLanguage })}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-rose-500 text-xs cursor-pointer"
              >
                <option value="en">English</option>
                <option value="ur">اردو (Urdu)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Privacy notice */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/80 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Private Local Storage Architecture</span>
              </div>
              <p>
                Your preferences and saved guides are kept safely in your local browser storage. We never sell your personal beauty data or sync without permission.
              </p>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-5 border-t border-stone-800 bg-stone-900/90 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
