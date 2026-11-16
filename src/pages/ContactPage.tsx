import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Link } from 'react-router-dom';

interface ContactPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Skincare Question');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us & Beauty Inquiries | Beauty Tips by Abbas';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      onShowToast('Please fill out all required fields', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onShowToast('Message received! Abbas will review your note.', 'success');
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Contact Us & Reader Inquiries', active: true }]} />

      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/40 px-3.5 py-1 rounded-full">
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          <span>Connect with Abbas</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100">
          Contact & Reader Inquiries
        </h1>
        <p className="text-sm sm:text-base text-rose-200/90 font-light leading-relaxed">
          Have a question about a particular beauty tip, ingredient pairing, or editorial topic? Send a message below and we will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Inquiries & FAQ */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="font-serif text-xl font-medium text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Editorial Office</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We review reader suggestions, formulation queries, and topic proposals regularly.
            </p>
            <div className="space-y-2 pt-2 text-xs text-stone-300">
              <p>✦ Response time: within 24 to 48 hours</p>
              <p>✦ Language support: English, Urdu, Arabic</p>
              <p>✦ General inquiries: contact@beautytipsbyabbas.netlify.app</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3 text-xs text-stone-300">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>Quick Answers</span>
            </div>
            <p className="leading-relaxed">
              Looking for answers right away? Check our{' '}
              <Link to="/help" className="text-rose-400 underline font-medium hover:text-rose-300">
                Help Center & FAQs
              </Link>{' '}
              for instant guidance on product layering, patch testing, and regimen schedules.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-stone-100 font-medium">Thank You!</h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto leading-relaxed">
                Your message has been received. Abbas and the team will review your inquiry and follow up shortly.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold cursor-pointer transition-colors mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Your Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sophia Anderson"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm placeholder:text-stone-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sophia@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm placeholder:text-stone-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="Skincare Question">Skincare Question or Concern</option>
                  <option value="Ingredient Compatibility">Ingredient Clash & Pairing</option>
                  <option value="Routine Consultation">Regimen & Schedule Inquiry</option>
                  <option value="Editorial Feedback">Editorial Suggestion</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Your Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your skin type, current routine, or question..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm placeholder:text-stone-500 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Abbas</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
