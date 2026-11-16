import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUp, Shield } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-semibold tracking-wide text-white group-hover:text-rose-200 transition-colors">
                Beauty Tips by Abbas
              </span>
            </Link>
            <p className="text-sm font-medium text-rose-300">
              Your Personal Guide to Better Skin, Beauty & Self-Care.
            </p>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Dedicated to demystifying modern skincare, celebrating natural radiance, and nurturing the skin barrier with science-backed principles, step-by-step routines, and gentle home rituals.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <span className="px-2.5 py-1 rounded-md bg-stone-950 border border-stone-800 text-stone-300">✦ Barrier-First Philosophy</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-950 border border-stone-800 text-stone-300">✦ Active Molecule Physics</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-950 border border-stone-800 text-stone-300">✦ Zero Gimmicks</span>
            </div>
          </div>

          {/* Category Landing Pages (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Category Hubs
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/skin-care" className="hover:text-rose-300 transition-colors block py-0.5">
                  Skin Care Hub
                </Link>
              </li>
              <li>
                <Link to="/makeup" className="hover:text-rose-300 transition-colors block py-0.5">
                  Makeup Artistry Hub
                </Link>
              </li>
              <li>
                <Link to="/hair-care" className="hover:text-rose-300 transition-colors block py-0.5">
                  Hair Care & Scalp Hub
                </Link>
              </li>
              <li>
                <Link to="/routines" className="hover:text-rose-300 transition-colors block py-0.5">
                  Beauty Routines Hub
                </Link>
              </li>
              <li>
                <Link to="/beauty-journal" className="hover:text-rose-300 transition-colors block py-0.5">
                  Beauty & Skin Journal (30-Day Trends)
                </Link>
              </li>
              <li>
                <Link to="/progress-gallery" className="hover:text-rose-300 transition-colors block py-0.5">
                  Skin Progress Gallery (Private)
                </Link>
              </li>
              <li>
                <Link to="/beauty-tips" className="hover:text-rose-300 transition-colors block py-0.5">
                  All Beauty Tips Archive
                </Link>
              </li>
              <li>
                <Link to="/acne-pimples" className="hover:text-rose-300 transition-colors block py-0.5">
                  Acne & Pimples Deep-Dive
                </Link>
              </li>
              <li>
                <Link to="/dark-spots" className="hover:text-rose-300 transition-colors block py-0.5">
                  Dark Spots & Hyperpigmentation
                </Link>
              </li>
              <li>
                <Link to="/treatments" className="hover:text-rose-300 transition-colors block py-0.5">
                  Clinical Treatments Matrix
                </Link>
              </li>
              <li>
                <Link to="/ingredients" className="hover:text-rose-300 transition-colors block py-0.5">
                  Skincare Ingredients Guide
                </Link>
              </li>
              <li>
                <Link to="/posters" className="hover:text-rose-300 transition-colors block py-0.5">
                  Educational Beauty Posters
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Topic Guides (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Editorial Guides
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/skin-care/daily-routine" className="hover:text-rose-300 transition-colors block py-0.5">
                  Daily Skincare Routine Guide
                </Link>
              </li>
              <li>
                <Link to="/skin-care/sunscreen" className="hover:text-rose-300 transition-colors block py-0.5">
                  Two-Finger Sunscreen Rule
                </Link>
              </li>
              <li>
                <Link to="/skin-care/acne-treatment" className="hover:text-rose-300 transition-colors block py-0.5">
                  Salicylic Acid & Blemish Care
                </Link>
              </li>
              <li>
                <Link to="/skin-care/moisturizing" className="hover:text-rose-300 transition-colors block py-0.5">
                  Hydration vs. Moisture Explained
                </Link>
              </li>
              <li>
                <Link to="/skin-care/slugging" className="hover:text-rose-300 transition-colors block py-0.5">
                  Skin Barrier Slugging Protocol
                </Link>
              </li>
              <li>
                <Link to="/makeup/everyday-makeup" className="hover:text-rose-300 transition-colors block py-0.5">
                  5-Minute Minimalist Everyday Makeup
                </Link>
              </li>
              <li>
                <Link to="/makeup/eye-makeup" className="hover:text-rose-300 transition-colors block py-0.5">
                  Velvet Smoky Eye Definition
                </Link>
              </li>
              <li>
                <Link to="/hair-care/hair-growth" className="hover:text-rose-300 transition-colors block py-0.5">
                  Rosemary Scalp Growth Ritual
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-rose-300 transition-colors block py-0.5">
                  Saved Articles Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Company Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Company & Trust
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/about" className="hover:text-rose-300 transition-colors block py-0.5">
                  About Abbas & Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-300 transition-colors block py-0.5">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/skin-analysis" className="hover:text-rose-300 transition-colors block py-0.5">
                  Smart Skin Diagnostic
                </Link>
              </li>
              <li>
                <Link to="/ai" className="hover:text-rose-300 transition-colors block py-0.5">
                  Ask Abbas AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-rose-300 transition-colors block py-0.5">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-rose-300 transition-colors block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-rose-300 transition-colors block py-0.5 text-rose-300/90 font-medium">
                  Medical Disclaimer
                </Link>
              </li>
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
              <div className="mt-2.5 flex flex-wrap gap-4 text-[11px]">
                <Link to="/disclaimer" className="text-rose-400 hover:underline">
                  Read Full Clinical Disclaimer →
                </Link>
                <Link to="/privacy-policy" className="text-stone-400 hover:underline">
                  Privacy & Cookie Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500 pt-4">
          <p>© {new Date().getFullYear()} Beauty Tips by Abbas. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400 text-xs">
            <Link to="/" className="hover:text-rose-300 transition-colors">
              Home
            </Link>
            <span className="text-stone-700">·</span>
            <Link to="/skin-care" className="hover:text-rose-300 transition-colors">
              Skin Care
            </Link>
            <span className="text-stone-700">·</span>
            <Link to="/makeup" className="hover:text-rose-300 transition-colors">
              Makeup
            </Link>
            <span className="text-stone-700">·</span>
            <Link to="/hair-care" className="hover:text-rose-300 transition-colors">
              Hair Care
            </Link>
            <span className="text-stone-700">·</span>
            <Link to="/about" className="hover:text-rose-300 transition-colors">
              About
            </Link>
            <span className="text-stone-700">·</span>
            <Link to="/contact" className="hover:text-rose-300 transition-colors">
              Contact
            </Link>
            <span className="text-stone-700">·</span>
            <Link to="/privacy-policy" className="hover:text-rose-300 transition-colors">
              Privacy
            </Link>
            <span className="text-stone-700">·</span>
            <Link to="/disclaimer" className="hover:text-rose-300 transition-colors">
              Disclaimer
            </Link>
          </div>

          <button
            onClick={scrollToTop}
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
