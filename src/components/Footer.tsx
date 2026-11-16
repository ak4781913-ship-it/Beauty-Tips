import React from 'react';
import { Sparkles, ArrowUp, Heart, Shield, Droplets, Info, Mail } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface FooterProps {
  onSelectCategory: (catId: string) => void;
  onScrollToTop: () => void;
  onOpenAboutContact?: (defaultTab?: 'about' | 'contact') => void;
  onNavigate?: (viewId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onScrollToTop,
  onOpenAboutContact,
  onNavigate,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-semibold tracking-wide text-white">
                Beauty Tips by Abbas
              </span>
            </div>
            <p className="text-sm font-medium text-rose-300">
              Your Personal Guide to Better Skin, Beauty & Self-Care.
            </p>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Dedicated to demystifying modern skincare, celebrating natural radiance, and nurturing the skin barrier with science-backed principles and gentle home rituals.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-400">
              <span>✦ Barrier-first philosophy</span>
              <span>✦ Active formulation physics</span>
              <span>✦ Zero gimmicks</span>
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Popular Beauty Hubs
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {CATEGORIES.slice(0, 10).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="text-left text-stone-400 hover:text-rose-300 transition-colors cursor-pointer py-1 truncate"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Core Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Navigation & Clinical Hubs
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('dashboard') : onScrollToTop()}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  Dashboard & Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('skincare') : undefined}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  10 Core Skin Concerns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('ingredients') : undefined}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  Skincare Ingredients Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('posters') : undefined}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  Educational Beauty Posters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('treatments') : undefined}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  Professional Skin Treatments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('routines') : undefined}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  Routine Builder & Checklists
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('ai') : undefined}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  Ask Abbas AI Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate ? onNavigate('help') : undefined}
                  className="hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  Help Center & FAQs
                </button>
              </li>
              {onOpenAboutContact && (
                <li className="pt-1 flex items-center gap-3">
                  <button
                    onClick={() => onOpenAboutContact('about')}
                    className="hover:text-rose-300 transition-colors cursor-pointer font-medium text-stone-300"
                  >
                    About Us
                  </button>
                  <span className="text-stone-600">·</span>
                  <button
                    onClick={() => onOpenAboutContact('contact')}
                    className="hover:text-rose-300 transition-colors cursor-pointer font-medium text-rose-300"
                  >
                    Contact
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Box */}
        <div className="my-8 p-4.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-300 mb-0.5">Medical & Educational Disclaimer</p>
              <p className="text-stone-400">
                The information provided on Beauty Tips by Abbas is for general beauty, skincare education, and personal self-care guidance only, and is not medical advice. Always perform a 24-hour patch test before introducing new skincare active ingredients or botanical home remedies. If you experience severe, persistent, painful, or worsening skin conditions, consult a licensed board-certified dermatologist or qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 pt-4">
          <p>© {new Date().getFullYear()} Beauty Tips by Abbas. All rights reserved.</p>
          <button
            onClick={onScrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
