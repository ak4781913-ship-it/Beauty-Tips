import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  Globe,
  Bot,
  User,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import { BeautyTip, SupportedLanguage } from '../types';
import { BEAUTY_TIPS } from '../data/tips';

interface AskAbbasAIChatProps {
  onOpenDetail: (tip: BeautyTip) => void;
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedTips?: BeautyTip[];
  followUps?: string[];
}

const INITIAL_SUGGESTIONS = [
  'How do I heal and rebuild a damaged skin barrier?',
  'What is the best routine for blackheads and clogged pores?',
  'How do I reduce hair fall and scalp dryness naturally?',
  'Is double cleansing suitable for sensitive dry skin?',
];

const PREDEFINED_KNOWLEDGE: {
  keywords: string[];
  responseEn: string;
  responseUr: string;
  responseAr: string;
  responseHi: string;
  tipIds: string[];
  followUps: string[];
}[] = [
  {
    keywords: ['barrier', 'damage', 'redness', 'stinging', 'ceramide', 'moisture barrier'],
    responseEn:
      'A damaged moisture barrier manifests through stinging, unexpected redness, flaking, or tight shiny skin. The immediate remedy is radical simplicity: eliminate active acids and retinoids for 2 to 3 weeks, switch to a lukewarm rinse, and saturate damp skin with biomimetic ceramides, squalane, and fatty acids. Consistent gentle protection restores the acid mantle quickly.',
    responseUr:
      'خراب اسکن بیریئر کی علامتیں جلن، سرخی اور کھنچاؤ ہیں۔ اس کا علاج سادہ ہے: تیز ایسڈز اور ریٹینول کچھ ہفتوں کے لیے روک دیں، نیم گرم پانی سے چہرہ دھوئیں اور سیرا مائیڈز اور اسکولین والی موئسچرائزر نم جلد پر لگائیں۔',
    responseAr:
      'يتطلب إصلاح حاجز البشرة المتضرر التوقف المؤقت عن المقشرات القوية، واستخدام سيراميد والسكوالين مع ماء فاتر لحماية الطبقة الواقية وترطيبها بعمق.',
    responseHi:
      'डैमेज्ड स्किन बैरियर को ठीक करने के लिए कुछ हफ्तों के लिए हार्श एसिड्स और रेटिनॉल बंद करें। सेरामाइड्स और स्क्वालेन युक्त मॉइस्चराइज़र से नमी लॉक करें।',
    tipIds: ['tip-ceramide-barrier-shield', 'tip-double-cleanse-clarity', 'tip-aloe-soothing-compress'],
    followUps: [
      'What ingredients cause barrier damage?',
      'How to choose the gentlest morning cleanser?',
    ],
  },
  {
    keywords: ['acne', 'pimple', 'breakout', 'salicylic', 'bha', 'blemish'],
    responseEn:
      'For acne-prone complexions, remember: inflammation cannot be scrubbed away. Over-drying skin with harsh astringents causes rebound sebum production. Instead, utilize 2% Salicylic Acid (BHA) to gently dissolve oil within pore linings 2–3 evenings per week, pair with lightweight gel hydration, and never pick or squeeze active blemishes.',
    responseUr:
      'کیل مہاسوں کے لیے جلد کو زیادہ رگڑنا نقصان دہ ہے۔ 2 فیصد سیلیسیلک ایسڈ ہفتے میں 2 سے 3 راتیں استعمال کریں، ہلکا جیل موئسچرائزر لگائیں اور دانوں کو ہاتھ لگانے سے گریز کریں۔',
    responseAr:
      'لعلاج حب الشباب، استخدم حمض الساليسيليك بنسبة 2٪ لتنظيف المسام بلطف مرتين إلى ثلاث مرات أسبوعياً مع تجنب الفرك القاسي.',
    responseHi:
      'मुंहासों के लिए 2% सैलिसिलिक एसिड का इस्तेमाल हफ्ते में 2-3 बार करें। त्वचा को ज्यादा स्क्रब न करें और ऑयल-फ्री मॉइस्चराइज़र लगाएं।',
    tipIds: ['tip-salicylic-pore-clear', 'tip-niacinamide-sebum-balance', 'tip-double-cleanse-clarity'],
    followUps: [
      'Is Azelaic Acid safe for sensitive acne skin?',
      'How does morning sunscreen prevent acne dark spots?',
    ],
  },
  {
    keywords: ['hair', 'scalp', 'fall', 'frizz', 'breakage', 'dandruff', 'rosemary'],
    responseEn:
      'Healthy hair growth begins at the follicular root. Daily microcirculation via 4-minute scalp massages stimulates dormant follicles. Botanical infusions like steamed Rosemary hydrosol or cold-pressed pumpkin seed oil provide antioxidant support without clogging hair shafts. Always sleep on silk or satin to eliminate friction breakage.',
    responseUr:
      'بالوں کی مضبوطی اور گرنے کو روکنے کے لیے روزانہ سر کا ہلکا مساج کریں۔ روزمیری واٹر کا اسپرے جڑوں کے لیے بے حد مفید ہے اور ریشم کا تکیہ بالوں کو ٹوٹنے سے بچاتا ہے۔',
    responseAr:
      'لصحة الشعر والحد من التساقط، دلكي فروة الرأس لتحفيز الدورة الدموية، واستخدمي ماء إكليل الجبل واحمِ شعرك بالنوم على وسادة حريرية.',
    responseHi:
      'बालों के झड़ने को रोकने के लिए स्कैल्प की मालिश करें, रोज़मेरी वॉटर का उपयोग करें और बालों को टूटने से बचाने के लिए साटन या सिल्क पिलो कवर का उपयोग करें।',
    tipIds: ['tip-rosemary-scalp-growth', 'tip-castor-argan-ends', 'tip-scalp-exfoliation-clarity'],
    followUps: [
      'How often should I oil my scalp?',
      'What causes excessive hair frizz in humid weather?',
    ],
  },
  {
    keywords: ['glow', 'dull', 'vitamin c', 'brighten', 'dark spot', 'pigmentation'],
    responseEn:
      'Radiant, glowing skin is the visual reflection of smooth, hydrated stratum corneum cells. Apply a stable Vitamin C antioxidant serum every morning to protect collagen from pollution, follow with broad-spectrum SPF 50+, and incorporate gentle lactic acid or fermented rice water once weekly to buff dullness.',
    responseUr:
      'قدرتی چمک کے لیے صبح کے وقت وٹامن سی سیرم لگائیں اور لازمی سن اسکرین (SPF 50) کا استعمال کریں۔ ہفتے میں ایک بار ہلکا ایکسفولی ایشن جلد کی تازگی بحال کرتا ہے۔',
    responseAr:
      'للحصول على إشراقة طبيعية، استخدمي سيروم فيتامين سي صباحاً متبوعاً بواقي شمس، مع تقشير لطيف مرة أسبوعياً لإزالة الخلايا الباهتة.',
    responseHi:
      'ग्लोइंग स्किन के लिए रोज़ सुबह विटामिन सी सीरम लगाएं और सनस्क्रीन जरूर लगाएं। हफ्ते में एक बार माइल्ड एक्सफोलिएशन से डलनेस दूर होती है।',
    tipIds: ['tip-vitamin-c-glow', 'tip-licorice-root-spots', 'tip-slugging-night-glow'],
    followUps: [
      'What is the best way to fade stubborn dark spots?',
      'Can Vitamin C be mixed with Niacinamide?',
    ],
  },
];

export const AskAbbasAIChat: React.FC<AskAbbasAIChatProps> = ({
  onOpenDetail,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        'Peace and welcome. I am Abbas’s AI Beauty Advisor. I provide evidence-informed skincare guidance, trichology hair rituals, and barrier-safe ingredient wisdom. How may I assist your beauty routine today?',
      timestamp: 'Just now',
      followUps: INITIAL_SUGGESTIONS,
      relatedTips: BEAUTY_TIPS.slice(0, 2),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Try real server-side Gemini API consultation
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: selectedLanguage,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          // Find matching related tips based on returned keywords or user text
          const searchTokens = (data.recommendedKeywords || []).concat(userText.toLowerCase().split(' '));
          const matchedTips = BEAUTY_TIPS.filter((tip) =>
            searchTokens.some(
              (token: string) =>
                token.length > 3 &&
                (tip.title.toLowerCase().includes(token) ||
                  tip.shortExplanation.toLowerCase().includes(token) ||
                  tip.category.toLowerCase().includes(token))
            )
          ).slice(0, 3);

          const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            relatedTips: matchedTips.length > 0 ? matchedTips : BEAUTY_TIPS.slice(0, 2),
            followUps: data.followUps && data.followUps.length > 0 ? data.followUps : INITIAL_SUGGESTIONS.slice(0, 2),
          };

          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch (networkErr) {
      console.warn('Network call to /api/chat failed, falling back to local clinical knowledge:', networkErr);
    }

    // 2. Seamless local fallback if network or API key is unavailable
    const lower = userText.toLowerCase();
    const matched = PREDEFINED_KNOWLEDGE.find((k) =>
      k.keywords.some((kw) => lower.includes(kw))
    );

    let replyText = '';
    let matchedTipIds: string[] = [];
    let followUps: string[] = [];

    if (matched) {
      if (selectedLanguage === 'ur') replyText = matched.responseUr;
      else if (selectedLanguage === 'ar') replyText = matched.responseAr;
      else if (selectedLanguage === 'hi') replyText = matched.responseHi;
      else replyText = matched.responseEn;

      matchedTipIds = matched.tipIds;
      followUps = matched.followUps;
    } else {
      replyText =
        `Regarding your inquiry on "${userText.slice(0, 50)}...": In the Abbas beauty philosophy, we prioritize skin barrier harmony over aggressive stripping. Start with a non-stripping pH 5.5 cleanser, lock in moisture with multi-weight humectants, and avoid introducing more than one new active ingredient at a time. Always allow 4 to 6 weeks of consistent use before evaluating skin response.`;
      matchedTipIds = ['tip-double-cleanse-clarity', 'tip-ceramide-barrier-shield'];
      followUps = [
        'How do I tell if my skin is purging or reacting?',
        'What is the correct sequence to apply skincare layers?',
      ];
    }

    const relatedTips = BEAUTY_TIPS.filter((t) => matchedTipIds.includes(t.id));

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relatedTips,
      followUps,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text:
          'Conversation refreshed. Ask me anything about skincare formulations, active ingredients, hair wellness, or daily beauty rituals.',
        timestamp: 'Just now',
        followUps: INITIAL_SUGGESTIONS,
      },
    ]);
    onShowToast('Chat conversation cleared', 'info');
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Advice copied to clipboard', 'success');
  };

  return (
    <section id="ask-abbas" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-rose-400 mb-3 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/40">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Beauty Architect</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 tracking-tight">
            Ask Abbas <span className="italic font-light text-rose-300">Beauty AI</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            Real-time aesthetic guidance, ingredient compatibility analysis, and trichology advice grounded directly in our verified beauty archives.
          </p>

          {/* Language Selector & Controls Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950 border border-stone-800 text-xs text-stone-300">
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-rose-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-stone-900 text-stone-100">English</option>
                <option value="ur" className="bg-stone-900 text-stone-100">اردو (Urdu)</option>
                <option value="ar" className="bg-stone-900 text-stone-100">العربية (Arabic)</option>
                <option value="hi" className="bg-stone-900 text-stone-100">हिन्दी (Hindi)</option>
              </select>
            </div>

            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-3xl mx-auto bg-stone-950/80 rounded-2xl border border-stone-800 flex flex-col h-[520px] shadow-inner relative z-10 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none'
                      : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Related Article Cards from Website */}
                  {msg.relatedTips && msg.relatedTips.length > 0 && (
                    <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-rose-300 font-semibold block">
                        Verified Library References:
                      </span>
                      <div className="space-y-1">
                        {msg.relatedTips.map((tip) => (
                          <div
                            key={tip.id}
                            onClick={() => onOpenDetail(tip)}
                            className="p-2 rounded-xl bg-stone-950/90 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-500/50 flex items-center justify-between gap-2 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <BookOpen className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span className="text-xs text-stone-200 group-hover:text-rose-300 truncate font-medium">
                                {tip.title}
                              </span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-rose-300 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow up suggestions */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="pt-2 border-t border-stone-800/80">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
                        Follow-Up Explorations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(chip)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-rose-900/40 border border-stone-700/80 text-stone-300 hover:text-rose-200 transition-colors cursor-pointer text-left"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message footer */}
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleCopyMessage(msg.text)}
                        className="hover:text-stone-200 transition-colors p-1"
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-stone-400 text-xs py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-4 py-2.5 rounded-2xl">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                  <span>Abbas AI is consulting beauty archives...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 sm:p-4 border-t border-stone-800 bg-stone-900/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'How do I layer Retinol and Ceramides safely?')"
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Safety Disclaimer */}
        <div className="max-w-3xl mx-auto mt-4 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Safety Commitment:</strong> General aesthetic and cosmetic education only. Abbas AI never diagnoses dermatological conditions or prescribes pharmaceuticals. For persistent severe symptoms, consult a certified dermatologist.
          </span>
        </div>
      </div>
    </section>
  );
};
