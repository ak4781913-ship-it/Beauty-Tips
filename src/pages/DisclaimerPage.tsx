import React, { useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, HeartHandshake, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DisclaimerPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Medical & Educational Disclaimer | Beauty Tips by Abbas';
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-stone-800">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400">
          <Shield className="w-4 h-4 text-rose-400" />
          <span>Health & Clinical Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100">
          Medical & Educational Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Essential health guidelines for all readers of Beauty Tips by Abbas
        </p>
      </div>

      {/* Prominent Callout Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/30 border border-rose-900/50 space-y-4">
        <div className="flex items-center gap-2 text-rose-300 font-serif text-xl font-medium">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>Not a Substitute for Professional Medical Advice</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          The content on <strong>Beauty Tips by Abbas</strong>—including articles, product layering hierarchies, routine builders, diagnostic simulations, and chatbot responses—is created strictly for informational and educational purposes. It does not constitute medical advice, medical diagnosis, or medical treatment plans.
        </p>
      </div>

      {/* Structured Sections */}
      <div className="space-y-8 text-stone-300 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3 bg-stone-900/60 p-6 sm:p-8 rounded-3xl border border-stone-800">
          <h2 className="font-serif text-2xl font-medium text-stone-100 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-rose-400" />
            <span>1. Everyday Skincare vs. Medical Treatment</span>
          </h2>
          <p>
            Cosmetic skincare (over-the-counter cleansers, humectants, moisturizers, non-prescription exfoliants, and botanical oils) is formulated to support cosmetic appearance and general skin hydration. It is distinct from medical dermatology, which treats pathological conditions such as cystic acne vulgaris, rosacea erythematotelangiectatica, psoriasis, severe atopic dermatitis, melanoma, or fungal infections.
          </p>
          <p>
            Never disregard professional medical guidance or delay seeking qualified dermatological attention because of information read on this website.
          </p>
        </section>

        <section className="space-y-4 bg-stone-900/60 p-6 sm:p-8 rounded-3xl border border-stone-800">
          <h2 className="font-serif text-2xl font-medium text-stone-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>2. Mandatory 24-Hour Patch Testing Protocol</span>
          </h2>
          <p>
            Skin bio-chemistry is unique to each individual. Before introducing any new active molecule (such as Salicylic Acid, Vitamin C, Retinoids, Glycolic Acid) or botanical kitchen remedy (such as raw honey, turmeric, or essential oils), always follow this standard patch testing protocol:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-stone-300 pt-1">
            <li>Apply a tiny pea-sized amount onto clean, dry skin on the inner forearm or behind the earlobe.</li>
            <li>Leave undisturbed for 24 hours without washing or layering other products.</li>
            <li>Monitor for itching, erythema (redness), burning, blistering, or swelling.</li>
            <li>If any adverse reaction occurs, wash thoroughly with cool water and discontinue use immediately.</li>
          </ol>
        </section>

        <section className="space-y-3 bg-stone-900/60 p-6 sm:p-8 rounded-3xl border border-stone-800">
          <h2 className="font-serif text-2xl font-medium text-stone-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>3. When to Consult a Board-Certified Dermatologist</span>
          </h2>
          <p>
            We urge readers to immediately book an appointment with a licensed healthcare practitioner or board-certified dermatologist in the presence of:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-stone-300 pt-1">
            <li>Deep, painful cysts, nodules, or widespread inflammatory pustules.</li>
            <li>Sudden, asymmetrical changes in the size, border, color, or diameter of moles.</li>
            <li>Persistent severe burning, hives, severe facial swelling, or peeling after chemical application.</li>
            <li>Chronic weeping eczema, unhealed open sores, or signs of secondary bacterial infection.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-medium text-stone-100">4. No Guaranteed Results</h2>
          <p>
            Because individual biological turnover, genetics, barrier thickness, climate, and lifestyle vary widely, Beauty Tips by Abbas makes no promises or guarantees regarding the specific outcomes of any suggested ritual, tip, or cosmetic ingredient.
          </p>
        </section>

        {/* Back Link */}
        <div className="pt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 text-xs font-semibold transition-colors"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </article>
  );
};
