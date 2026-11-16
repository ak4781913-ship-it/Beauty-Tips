import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Beauty Tips by Abbas';
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-stone-800">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400">
          <Shield className="w-4 h-4 text-rose-400" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Last Updated: October 2026 · Effective for all visitors of Beauty Tips by Abbas
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-stone-300 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-medium text-stone-100">1. Overview & Commitment</h2>
          <p>
            At <strong>Beauty Tips by Abbas</strong>, we value your privacy as much as your skin barrier. This Privacy Policy details how we collect, store, and process data when you interact with our educational website, applications, and self-care tools.
          </p>
        </section>

        <section className="space-y-3 bg-stone-900/60 p-6 rounded-3xl border border-stone-800">
          <h2 className="font-serif text-xl font-medium text-stone-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>2. Local Storage & Client Data</span>
          </h2>
          <p>
            We prioritize client-side data privacy. Your bookmarked articles (saved vault), dark mode preference, daily routine checklist progress, and questionnaire diagnostic answers are stored exclusively in your browser’s local storage (<strong>localStorage</strong>). This data is never sent to or monetized on external profiling databases.
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-400 pt-1">
            <li><strong>beauty_favorites_abbas:</strong> Stores your saved article identifiers locally.</li>
            <li><strong>beauty_dark_mode:</strong> Stores your chosen appearance theme.</li>
            <li><strong>beauty_routines_state:</strong> Stores your daily checklist progress on your device.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-medium text-stone-100">3. Advertising Partners & Cookies</h2>
          <p>
            To keep all educational skincare guides and tools 100% free for everyone worldwide, Beauty Tips by Abbas collaborates with third-party advertising networks (including Adsterra). These partners may use cookies, web beacons, or unique device identifiers to deliver relevant contextual banner and popunder advertisements.
          </p>
          <p>
            You may disable cookies or opt-out of interest-based advertising anytime by configuring your web browser settings or utilizing privacy-focused browser extensions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-medium text-stone-100">4. Third-Party Links & Resources</h2>
          <p>
            Our articles may reference scholarly dermatological studies, cosmetic ingredient research databases, or partner product links. We are not responsible for the privacy practices, content, or cookie policies of external third-party websites. We encourage you to review the privacy policies of any site you visit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-medium text-stone-100">5. Children's Privacy</h2>
          <p>
            Our website is designed for individuals seeking general beauty, skincare, and grooming self-care advice. We do not knowingly collect personal identifiable information from children under the age of 13.
          </p>
        </section>

        <section className="space-y-3 p-6 rounded-3xl bg-stone-900 border border-stone-800">
          <h2 className="font-serif text-xl font-medium text-stone-100">6. Contact for Privacy Inquiries</h2>
          <p>
            If you have questions about our data practices or wish to submit feedback regarding this policy, please reach out via our{' '}
            <Link to="/contact" className="text-rose-400 underline hover:text-rose-300">
              Contact Page
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
};
