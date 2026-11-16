import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Heart,
  ShieldCheck,
  Send,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  Info,
  BookOpen,
} from 'lucide-react';

interface AboutContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'about' | 'contact';
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'about',
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>(defaultTab);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Skincare Question');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      if (onShowToast) onShowToast('Please fill out all required fields', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onShowToast) {
        onShowToast('Message sent! Abbas will review your inquiry.', 'success');
      }
    }, 700);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between gap-4 bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-100">
                Beauty Tips by Abbas
              </h3>
              <p className="text-[11px] text-rose-300 font-medium">
                Your Personal Guide to Better Skin, Beauty & Self-Care.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>About Our Platform</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'contact'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact & Inquiries</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'about' ? (
            <div className="space-y-6 text-xs sm:text-sm text-stone-300 leading-relaxed">
              {/* Mission Statement */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-stone-950 border border-rose-500/30 space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-400">
                  Our Mission
                </span>
                <p className="font-serif text-lg sm:text-xl text-stone-100 font-normal">
                  "Empowering every individual with transparent, science-backed skincare wisdom, botanical harmony, and sustainable self-care rituals."
                </p>
              </div>

              {/* Pillars */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                  Our Core Editorial Pillars
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-850 space-y-1.5">
                    <span className="font-semibold text-rose-300 block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      Barrier-First Science
                    </span>
                    <p className="text-xs text-stone-400">
                      We prioritize the stratum corneum lipid matrix above all else. Aggressive stripping and over-exfoliation have no place here.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-850 space-y-1.5">
                    <span className="font-semibold text-rose-300 block flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      Zero Gimmicks & Hype
                    </span>
                    <p className="text-xs text-stone-400">
                      Every recommendation is grounded in documented cosmetic chemistry: optimal concentrations, bio-available pH, and molecular compatibility.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-850 space-y-1.5">
                    <span className="font-semibold text-rose-300 block flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-400" />
                      Kitchen & Botanical Wisdom
                    </span>
                    <p className="text-xs text-stone-400">
                      We celebrate time-tested, gentle botanical compresses (colloidal oats, green tea, raw honey) balanced with modern actives.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-850 space-y-1.5">
                    <span className="font-semibold text-rose-300 block flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-rose-400" />
                      Responsible Education
                    </span>
                    <p className="text-xs text-stone-400">
                      We never diagnose medical conditions or promise overnight miracles. We always advocate professional dermatological consultation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tagline footer */}
              <div className="pt-2 text-center text-xs text-stone-400 border-t border-stone-800">
                <p>
                  Created with care by <span className="text-stone-200 font-semibold">Abbas</span> for beauty enthusiasts, skincare beginners, and self-care lovers worldwide.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {submitted ? (
                <div className="p-8 text-center space-y-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-medium text-stone-100">
                    Thank You for Reaching Out
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been received. Our team reviews all reader questions and educational suggestions promptly.
                  </p>
                  <button
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs sm:text-sm text-stone-300">
                    Have a question regarding an ingredient, routine step, or feedback on Beauty Tips by Abbas? Send us a note below.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Your Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@example.com"
                          className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="Skincare Question">Skincare Question</option>
                      <option value="Routine Builder Advice">Routine Builder Advice</option>
                      <option value="Ingredient Compatibility">Ingredient Compatibility</option>
                      <option value="Editorial Feedback">Editorial Feedback & Suggestion</option>
                      <option value="General Self-Care">General Self-Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your beauty concern, question, or suggestions with Abbas..."
                      className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      * Strictly educational inquiries. Never send urgent medical questions.
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
