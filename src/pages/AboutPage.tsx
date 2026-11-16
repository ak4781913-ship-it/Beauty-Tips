import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, BookOpen, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import heroImage from '../assets/images/hero_beauty_skincare_elegance_1791268845073.jpg';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About Abbas & Our Mission | Beauty Tips by Abbas';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'About Abbas & Our Mission', active: true }]} />
      {/* Page Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100">
          About Beauty Tips by Abbas
        </h1>
        <p className="text-base sm:text-lg text-rose-200/90 font-light leading-relaxed">
          Demystifying modern cosmetic marketing, celebrating natural beauty, and nurturing your skin barrier with evidence-based formulation science.
        </p>
      </div>

      {/* Featured Editorial Visual */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-stone-900 border border-stone-800 shadow-xl">
        <img
          src={heroImage}
          alt="Minimalist luxury skincare and beauty essentials"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-5 left-6 right-6 text-stone-200 text-xs sm:text-sm font-serif italic">
          “True skin radiance comes from nurturing health, not chasing overnight miracles.”
        </div>
      </div>

      {/* Origin Story */}
      <section className="space-y-4 bg-stone-900/70 p-6 sm:p-8 rounded-3xl border border-stone-800 leading-relaxed text-stone-300">
        <h2 className="font-serif text-2xl font-medium text-stone-100">
          Why Beauty Tips by Abbas Exists
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          The modern beauty landscape is saturated with sensationalized TikTok hacks, aggressive 10-step multi-acid cocktails, and miracle claims that frequently lead to damaged acid mantles, contact dermatitis, and prolonged frustration.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          <strong>Beauty Tips by Abbas</strong> was founded with a singular purpose: to deliver transparent, scientifically grounded skincare education and gentle self-care rituals that respect the biological physics of human skin. We bridge the gap between time-tested botanical home remedies and modern dermatology principles.
        </p>
      </section>

      {/* Core Educational Pillars */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-medium text-stone-100">
          Our Three Guiding Philosophies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif text-lg text-stone-100 font-medium">Barrier-First Integrity</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We never recommend stripping, overly abrasive scrubs, or combining clashing active ingredients that compromise the stratum corneum.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif text-lg text-stone-100 font-medium">Consistency Over Complexity</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              A gentle 3-to-4 step routine practiced consistently for 60 days produces vastly superior results compared to an irregular 12-step routine.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif text-lg text-stone-100 font-medium">Zero Miracle Claims</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Biological cellular turnover takes 28 to 45 days. We present honest timelines and clear expectations for every recommended ritual.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Boundary Statement */}
      <section className="p-6 sm:p-7 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3">
        <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
          <ShieldCheck className="w-5 h-5 text-rose-400" />
          <span>Our Commitment to Responsible Education</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Beauty Tips by Abbas provides educational and self-care information only. We do not diagnose dermatological medical illnesses, prescribe pharmaceuticals, or replace clinical consultations. Always consult a board-certified dermatologist for medical conditions such as cystic acne, severe eczema, psoriasis, or suspicious melanocytic lesions.
        </p>
      </section>

      {/* CTA to Explore */}
      <div className="text-center pt-4 space-x-4">
        <Link
          to="/beauty-tips"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 transition-colors"
        >
          <span>Explore All Beauty Tips</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 text-xs sm:text-sm font-semibold transition-colors"
        >
          <span>Get in Touch</span>
        </Link>
      </div>
    </div>
  );
};
