import React, { useState } from 'react';
import {
  ShieldAlert,
  Stethoscope,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Info,
  Sun,
  ShieldCheck,
  Eye,
  FileText,
  UserCheck,
  X,
  AlertOctagon,
} from 'lucide-react';
import { PROFESSIONAL_TREATMENTS, ProfessionalTreatment } from '../data/treatments';
import { TreatmentCommonQuestions } from './TreatmentCommonQuestions';

interface ProfessionalTreatmentsSectionProps {
  onShowToast?: (message: string, type: 'favorite' | 'success' | 'info') => void;
  onNavigateToView?: (viewId: string) => void;
}

export const ProfessionalTreatmentsSection: React.FC<ProfessionalTreatmentsSectionProps> = ({
  onShowToast,
  onNavigateToView,
}) => {
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(
    PROFESSIONAL_TREATMENTS[0].id
  );
  const [modalTreatment, setModalTreatment] = useState<ProfessionalTreatment | null>(null);

  const activeTreatment =
    PROFESSIONAL_TREATMENTS.find((t) => t.id === selectedTreatmentId) ||
    PROFESSIONAL_TREATMENTS[0];

  return (
    <section
      id="professional-treatments"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-stone-950 via-zinc-950 to-stone-950 border-t border-b border-rose-950/40"
    >
      {/* Background Clinical Grid Pattern & Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.06),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Distinct Clinical Header with Clear Separation from Everyday Care */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-700/50 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm backdrop-blur-sm">
            <Stethoscope className="w-4 h-4 text-rose-400" />
            <span>Clinical & Dermatology Science</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100 tracking-tight">
            Professional Skin Treatments
          </h2>

          <p className="mt-4 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Educational clinical overviews of advanced in-clinic procedures. Understanding
            procedural mechanisms, clinical downtime, evidence-based aftercare, and vital safety
            precautions.
          </p>

          {/* Prominent Medical Advisory Disclaimer */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-600/40 text-left flex items-start gap-3.5 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-300 space-y-1">
              <span className="font-semibold text-amber-300 block">
                Educational Information — Not Medical Advice or DIY Instruction
              </span>
              <p className="text-stone-300 leading-relaxed">
                Chemical peels, microneedling, medical lasers, and prescription therapeutics require
                comprehensive diagnosis and execution by licensed dermatologists or credentialed
                practitioners. <strong>Never attempt motorized microneedling or unbuffered medical acid peels at home.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Treatment Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-none mb-8 sm:mb-12">
          {PROFESSIONAL_TREATMENTS.map((treatment) => {
            const isSelected = treatment.id === selectedTreatmentId;
            return (
              <button
                key={treatment.id}
                onClick={() => setSelectedTreatmentId(treatment.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-rose-900/40 text-rose-200 border-rose-500/60 shadow-lg shadow-rose-950/50'
                    : 'bg-stone-900/70 text-stone-400 border-stone-800 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <span>{treatment.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Treatment In-Depth Clinical Showcase */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800/90 shadow-2xl p-6 sm:p-8 lg:p-10 backdrop-blur-md transition-all">
          {/* Top Metadata Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/60">
                  {activeTreatment.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                  Depth: {activeTreatment.depthLevel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Downtime: {activeTreatment.downtime}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-100">
                {activeTreatment.name}
              </h3>
              <p className="text-sm text-stone-400 mt-1 max-w-2xl">{activeTreatment.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  const elem = document.getElementById('treatment-common-questions');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-rose-300 hover:text-rose-200 border border-stone-750 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-rose-400" />
                <span>Common Questions ({activeTreatment.commonQuestions.length})</span>
              </button>
              <button
                onClick={() => setModalTreatment(activeTreatment)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-950/50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Full Clinical Dossier</span>
              </button>
            </div>
          </div>

          {/* Grid of Clinical Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-8">
            {/* Left Column: What It Is & How It Works */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-rose-400 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-400" />
                  What It Is
                </h4>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
                  {activeTreatment.whatItIs}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-rose-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  Mechanism of Action
                </h4>
                <p className="text-sm text-stone-300/90 leading-relaxed bg-stone-950/50 p-4 rounded-2xl border border-stone-800/80">
                  {activeTreatment.howItWorks}
                </p>
              </div>

              {/* Target Concerns & Clinical Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-950/40 border border-stone-800/80">
                  <h5 className="text-xs uppercase tracking-wider font-semibold text-stone-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Primary Indications
                  </h5>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {activeTreatment.targetConcerns.map((concern, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 mt-0.5">•</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950/40 border border-stone-800/80">
                  <h5 className="text-xs uppercase tracking-wider font-semibold text-stone-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    Documented Benefits
                  </h5>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {activeTreatment.potentialBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Professional Aftercare Protocol Snapshot */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-950 via-zinc-950 to-stone-950 border border-rose-950/60">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs uppercase tracking-wider font-semibold text-rose-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    Essential Post-Treatment Recovery Rules
                  </h5>
                  <span className="text-xs text-stone-400">Strict Compliance Required</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
                  {activeTreatment.postTreatmentAftercare.first48Hours.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {activeTreatment.postTreatmentAftercare.sunProtectionRules.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60">
                      <Sun className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Safety, Risks, & Practitioner Verification */}
            <div className="space-y-6">
              {/* Potential Risks & Adverse Reactions */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40">
                <h5 className="text-xs uppercase tracking-wider font-semibold text-rose-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Potential Risks & Complications
                </h5>
                <ul className="space-y-2 text-xs text-stone-300">
                  {activeTreatment.potentialRisksAndSideEffects.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Absolute Contraindications */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40">
                <h5 className="text-xs uppercase tracking-wider font-semibold text-amber-300 mb-3 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  Contraindications (When to Avoid)
                </h5>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {activeTreatment.contraindications.map((contra, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">✕</span>
                      <span>{contra}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practitioner Verification */}
              <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800">
                <h5 className="text-xs uppercase tracking-wider font-semibold text-stone-200 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Who Is Qualified to Perform This?
                </h5>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {activeTreatment.qualifiedPractitioners}
                </p>
                <div className="mt-4 pt-3 border-t border-stone-800">
                  <button
                    onClick={() => setModalTreatment(activeTreatment)}
                    className="text-xs text-rose-300 hover:text-rose-200 font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View recommended questions for your consultation</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Common Questions & Suitability FAQs Component */}
          <TreatmentCommonQuestions
            treatmentName={activeTreatment.name}
            questions={activeTreatment.commonQuestions}
            onAskAI={(prompt) => {
              if (onNavigateToView) onNavigateToView('ai');
              if (onShowToast) onShowToast('Consultation topic transferred to Abbas AI', 'info');
            }}
            onNavigateToView={onNavigateToView}
          />
        </div>
      </div>

      {/* Comprehensive Clinical Dossier Modal */}
      {modalTreatment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-stone-900 border border-stone-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-100">
                    Clinical Dossier: {modalTreatment.name}
                  </h3>
                  <p className="text-xs text-stone-400">{modalTreatment.badge}</p>
                </div>
              </div>
              <button
                onClick={() => setModalTreatment(null)}
                aria-label="Close modal"
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-300">
              {/* Scientific Mechanism */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-rose-400 mb-2">
                  Scientific Summary & Mechanism
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                  {modalTreatment.scientificSummary}
                </p>
              </div>

              {/* Pre-Treatment Preparation Rules */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 mb-2.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Pre-Treatment Preparation (Crucial for Preventing Complications)
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm bg-amber-950/20 border border-amber-900/30 p-4 rounded-2xl">
                  {modalTreatment.preTreatmentPrep.map((prep, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold shrink-0">#{i + 1}</span>
                      <span>{prep}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Post-Procedure Recovery Protocol */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-rose-400 mb-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Professional Post-Procedure Recovery Protocol
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {/* First 48 Hours */}
                  <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                    <span className="font-semibold text-rose-300 block mb-2">First 48 Hours:</span>
                    <ul className="space-y-2 text-stone-300">
                      {modalTreatment.postTreatmentAftercare.first48Hours.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-400 mt-0.5">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Days 3 to 7 */}
                  <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                    <span className="font-semibold text-emerald-300 block mb-2">Days 3 to 7:</span>
                    <ul className="space-y-2 text-stone-300">
                      {modalTreatment.postTreatmentAftercare.days3to7.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Banned Actives Box */}
                <div className="mt-4 p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40">
                  <span className="font-semibold text-rose-300 text-xs uppercase tracking-wider block mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Temporarily Banned Actives (Do NOT Apply Until Fully Re-Epithelialized)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {modalTreatment.postTreatmentAftercare.bannedActivesUntilHealed.map((act, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-stone-900 border border-stone-800 text-stone-300"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Questions to Ask Practitioner */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  Crucial Questions to Ask at Your Consultation
                </h4>
                <div className="space-y-2 bg-blue-950/20 border border-blue-900/30 p-4 rounded-2xl text-xs sm:text-sm">
                  {modalTreatment.questionsToAskPractitioner.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-stone-300">
                      <span className="text-blue-400 font-bold shrink-0">?</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapsible Common Questions in Modal */}
              <TreatmentCommonQuestions
                treatmentName={modalTreatment.name}
                questions={modalTreatment.commonQuestions}
                onAskAI={(prompt) => {
                  setModalTreatment(null);
                  if (onNavigateToView) onNavigateToView('ai');
                  if (onShowToast) onShowToast('Consultation topic transferred to Abbas AI', 'info');
                }}
                onNavigateToView={onNavigateToView}
              />

              {/* Red Flag Symptoms: When to Call Clinic */}
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-700/50">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-red-300 mb-2 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  Urgent Warning Signs — Call Your Clinic Immediately If:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-stone-300">
                  {modalTreatment.whenToCallClinicUrgent.map((warning, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">⚠</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Peer-reviewed clinical aesthetic guidelines
              </span>
              <button
                onClick={() => setModalTreatment(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
