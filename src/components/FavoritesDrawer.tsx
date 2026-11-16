import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Trash2,
  ArrowRight,
  Download,
  Printer,
  Copy,
  Check,
  FileText,
  Share2,
} from 'lucide-react';
import { BeautyTip } from '../types';
import { AdsterraBanner } from './ads/AdsterraBanner';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteTips: BeautyTip[];
  onRemoveFavorite: (id: string) => void;
  onOpenDetail: (tip: BeautyTip) => void;
  onClearAll: () => void;
  onShowToast?: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoriteTips,
  onRemoveFavorite,
  onOpenDetail,
  onClearAll,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // 1. Export as clean downloadable .txt file for offline reading
  const handleExportTextFile = () => {
    if (favoriteTips.length === 0) return;

    let content = `================================================================================\n`;
    content += `BEAUTY TIPS BY ABBAS — SAVED BEAUTY VAULT\n`;
    content += `Exported on: ${new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}\n`;
    content += `Total Saved Guides: ${favoriteTips.length}\n`;
    content += `Website: https://beautytipsbyabbas.netlify.app/\n`;
    content += `================================================================================\n\n`;

    favoriteTips.forEach((tip, idx) => {
      content += `[${idx + 1}] ${tip.title.toUpperCase()}\n`;
      content += `Category: ${tip.categoryLabel}\n`;
      content += `Recommended Routine: ${tip.recommendedRoutine}\n`;
      if (tip.duration) content += `Duration: ${tip.duration}\n`;
      if (tip.suitableTime) content += `Time of Day: ${tip.suitableTime}\n`;
      content += `Target Skin Types: ${tip.skinTypes.join(', ')}\n`;
      content += `Key Actives: ${tip.usefulIngredients.join(', ')}\n\n`;
      content += `SUMMARY:\n${tip.shortExplanation}\n\n`;
      content += `FULL GUIDANCE:\n${tip.fullDescription}\n\n`;

      if (tip.steps && tip.steps.length > 0) {
        content += `STEP-BY-STEP RITUAL:\n`;
        tip.steps.forEach((s) => {
          content += `  Step ${s.stepNumber}: ${s.title} — ${s.instruction}\n`;
        });
        content += `\n`;
      }

      content += `THE DO'S:\n`;
      tip.dos.forEach((d) => {
        content += `  [✓] ${d}\n`;
      });
      content += `\n`;

      content += `THE DON'TS:\n`;
      tip.donts.forEach((d) => {
        content += `  [✕] ${d}\n`;
      });
      content += `\n`;

      if (tip.proTip) {
        content += `ABBAS'S PRO SECRET:\n"${tip.proTip}"\n\n`;
      }

      content += `--------------------------------------------------------------------------------\n\n`;
    });

    content += `IMPORTANT DISCLAIMER:\n`;
    content += `The information provided is for general beauty and skincare education only and is not medical advice.\n`;
    content += `For persistent, severe, or painful skin conditions, please consult a qualified dermatologist.\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beauty-tips-by-abbas-vault-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('Saved tips exported as text file!', 'success');
    }
  };

  // 2. Export as PDF (via Browser print-to-PDF engine with custom print layout)
  const handleExportPDF = () => {
    if (favoriteTips.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      if (onShowToast) {
        onShowToast('Please allow popups to open the PDF preview.', 'info');
      }
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Beauty Tips by Abbas — Saved Vault</title>
  <style>
    @media print {
      @page { margin: 1.2cm; size: A4; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #292524;
      line-height: 1.6;
      margin: 0;
      padding: 24px;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #e11d48;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-family: Georgia, serif;
      font-size: 28px;
      color: #881337;
      margin: 0;
      font-weight: normal;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #78716c;
      margin-top: 4px;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #a8a29e;
      margin-top: 12px;
    }
    .tip-card {
      border: 1px solid #fecdd3;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      page-break-inside: avoid;
      background: #fff;
    }
    .tip-category {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #be123c;
      font-weight: 600;
    }
    .tip-title {
      font-family: Georgia, serif;
      font-size: 20px;
      color: #1c1917;
      margin: 6px 0 10px 0;
    }
    .tip-desc {
      font-size: 13px;
      color: #44403c;
      margin-bottom: 12px;
    }
    .routine-box {
      background: #fff1f2;
      border-left: 3px solid #f43f5e;
      padding: 8px 12px;
      font-size: 12px;
      color: #881337;
      margin-bottom: 12px;
    }
    .actives-box {
      font-size: 11px;
      color: #57534e;
      margin-bottom: 12px;
    }
    .actives-tag {
      display: inline-block;
      background: #f5f5f4;
      padding: 2px 8px;
      border-radius: 4px;
      margin-right: 4px;
      margin-top: 4px;
      border: 1px solid #e7e5e4;
    }
    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }
    .dos {
      background: #ecfdf5;
      padding: 10px;
      border-radius: 8px;
      font-size: 11px;
      color: #065f46;
    }
    .donts {
      background: #fff1f2;
      padding: 10px;
      border-radius: 8px;
      font-size: 11px;
      color: #9f1239;
    }
    .dos ul, .donts ul {
      margin: 6px 0 0 0;
      padding-left: 16px;
    }
    .pro-tip {
      margin-top: 12px;
      padding: 10px;
      background: #fefce8;
      border: 1px dashed #ca8a04;
      border-radius: 8px;
      font-size: 12px;
      color: #713f12;
      font-style: italic;
    }
    .disclaimer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e7e5e4;
      font-size: 11px;
      color: #78716c;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="brand-title">Beauty Tips by Abbas</h1>
    <div class="brand-subtitle">Your Everyday Beauty & Self-Care Guide — Offline Beauty Vault</div>
    <div class="meta-bar">
      <span>Exported: ${new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
      <span>${favoriteTips.length} Saved Guides</span>
    </div>
  </div>

  ${favoriteTips
    .map(
      (tip, index) => `
    <div class="tip-card">
      <div class="tip-category">${tip.categoryLabel} ${tip.suitableTime ? `· ${tip.suitableTime}` : ''}</div>
      <h2 class="tip-title">${index + 1}. ${tip.title}</h2>
      <div class="tip-desc">${tip.fullDescription || tip.shortExplanation}</div>

      <div class="routine-box">
        <strong>Recommended Routine:</strong> ${tip.recommendedRoutine}
      </div>

      <div class="actives-box">
        <strong>Key Beneficial Ingredients:</strong><br>
        ${tip.usefulIngredients.map((i) => `<span class="actives-tag">${i}</span>`).join(' ')}
      </div>

      <div class="columns">
        <div class="dos">
          <strong>The Do's:</strong>
          <ul>
            ${tip.dos.map((d) => `<li>${d}</li>`).join('')}
          </ul>
        </div>
        <div class="donts">
          <strong>The Don'ts:</strong>
          <ul>
            ${tip.donts.map((d) => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${
        tip.proTip
          ? `
      <div class="pro-tip">
        <strong>Abbas's Pro Secret:</strong> "${tip.proTip}"
      </div>
      `
          : ''
      }
    </div>
  `
    )
    .join('')}

  <div class="disclaimer">
    The information provided is for general beauty and skincare education only and is not medical advice.<br>
    Beauty Tips by Abbas — https://beautytipsbyabbas.netlify.app/
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    if (onShowToast) {
      onShowToast('PDF Print dialog opened! Select "Save as PDF".', 'info');
    }
  };

  // 3. Copy list of tips to clipboard
  const handleCopyAll = () => {
    if (favoriteTips.length === 0) return;

    let text = `BEAUTY TIPS BY ABBAS — SAVED BEAUTY VAULT (${favoriteTips.length} tips)\n\n`;
    favoriteTips.forEach((t, i) => {
      text += `${i + 1}. ${t.title} [${t.categoryLabel}]\n`;
      text += `Routine: ${t.recommendedRoutine}\n`;
      text += `Actives: ${t.usefulIngredients.join(', ')}\n`;
      text += `Overview: ${t.shortExplanation}\n\n`;
    });
    text += `Read full guides online: https://beautytipsbyabbas.netlify.app/`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (onShowToast) {
      onShowToast('Saved tips list copied to clipboard!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl border-l border-rose-100 dark:border-stone-800 flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-rose-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                Saved Beauty Vault
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-semibold tabular-nums">
                {favoriteTips.length}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              Saved locally in this browser · Available offline anytime
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Export Toolbar (When tips are saved) */}
        {favoriteTips.length > 0 && (
          <div className="px-5 py-3 bg-rose-50/40 dark:bg-stone-800/40 border-b border-rose-100 dark:border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-rose-600" />
                <span>Offline Export</span>
              </span>
              <span className="text-[10px] text-stone-400">PDF & Text format</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* PDF Export Button */}
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-700 hover:text-rose-700 dark:hover:text-rose-300 border border-stone-200 dark:border-stone-700 text-xs font-medium transition-colors shadow-xs cursor-pointer"
                title="Export and Save as PDF document"
              >
                <Printer className="w-3.5 h-3.5 text-rose-600" />
                <span>Save PDF</span>
              </button>

              {/* Text File Export Button */}
              <button
                onClick={handleExportTextFile}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-700 hover:text-rose-700 dark:hover:text-rose-300 border border-stone-200 dark:border-stone-700 text-xs font-medium transition-colors shadow-xs cursor-pointer"
                title="Download formatted .txt file"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Text File</span>
              </button>

              {/* Copy All Button */}
              <button
                onClick={handleCopyAll}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-700 hover:text-rose-700 dark:hover:text-rose-300 border border-stone-200 dark:border-stone-700 text-xs font-medium transition-colors shadow-xs cursor-pointer"
                title="Copy all tips to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-600" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Saved Tips List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {favoriteTips.length > 0 ? (
            favoriteTips.map((tip) => (
              <div
                key={tip.id}
                className="group p-4 rounded-2xl border border-rose-100/80 dark:border-stone-800 bg-white dark:bg-stone-800/50 hover:border-rose-300 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                    {tip.categoryLabel}
                  </span>
                  <button
                    onClick={() => onRemoveFavorite(tip.id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100 mt-1 line-clamp-2">
                  {tip.title}
                </h3>

                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {tip.shortExplanation}
                </p>

                <div className="mt-3 pt-2.5 border-t border-rose-50 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">{tip.duration || 'Daily ritual'}</span>
                  <button
                    onClick={() => {
                      onOpenDetail(tip);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 cursor-pointer"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-stone-800 text-rose-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200">
                Your vault is empty
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Click the bookmark icon on any tip card to save it for quick reference or offline export anytime.
              </p>
            </div>
          )}

          {/* Adsterra 300x250 banner inside drawer */}
          <div className="pt-4 pb-2 flex justify-center">
            <AdsterraBanner type="300x250" />
          </div>
        </div>

        {/* Drawer Footer */}
        {favoriteTips.length > 0 && (
          <div className="p-4 border-t border-rose-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear All Saved
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
