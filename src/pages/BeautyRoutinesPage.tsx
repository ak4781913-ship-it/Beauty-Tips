import React, { useEffect } from 'react';
import { RoutinesView } from '../components/RoutinesView';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BeautyRoutinesPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
  defaultTab?: 'tracker' | 'builder' | 'scheduler' | 'gallery';
}

export const BeautyRoutinesPage: React.FC<BeautyRoutinesPageProps> = ({
  onShowToast,
  defaultTab = 'tracker',
}) => {
  useEffect(() => {
    if (defaultTab === 'builder') {
      document.title = 'AI Routine Builder | Personalized AM/PM Regimen | Beauty Tips by Abbas';
    } else if (defaultTab === 'gallery') {
      document.title = 'Skin Progress Gallery | Private Photo Journal | Beauty Tips by Abbas';
    } else {
      document.title = 'Beauty Routines & Daily Tracker | Beauty Tips by Abbas';
    }
  }, [defaultTab]);

  const currentLabel =
    defaultTab === 'builder'
      ? 'AI Routine Builder'
      : defaultTab === 'gallery'
      ? 'Skin Progress Gallery'
      : defaultTab === 'scheduler'
      ? 'Weekly Schedule'
      : 'Beauty Routines & Daily Tracker';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 animate-in fade-in duration-200">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: currentLabel, active: true }]} />

      {/* Morning & Evening Golden Hierarchy Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-900/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-serif text-lg font-medium">
            <Sun className="w-5 h-5 text-amber-400" />
            <span>Morning (AM) Routine Hierarchy</span>
          </div>
          <ol className="text-xs sm:text-sm text-stone-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li><strong>Gentle Water Rinse or Low-pH Cleanser:</strong> Wash away nocturnal perspiration.</li>
            <li><strong>Hydrating Humectant:</strong> Pat toner or essence on damp skin.</li>
            <li><strong>Antioxidant Serum:</strong> Vitamin C to defend against environmental pollutants.</li>
            <li><strong>Barrier Moisturizer:</strong> Light ceramide emulsion or gel cream.</li>
            <li><strong>Broad-Spectrum SPF50+:</strong> Essential non-negotiable UV shield.</li>
          </ol>
        </div>

        <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-900/40 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-serif text-lg font-medium">
            <Moon className="w-5 h-5 text-indigo-400" />
            <span>Evening (PM) Routine Hierarchy</span>
          </div>
          <ol className="text-xs sm:text-sm text-stone-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li><strong>Oil Cleanser:</strong> Melt SPF and oxidized sebum without pulling.</li>
            <li><strong>Water-Based Foam:</strong> Sweep away remaining hydrophilic residue.</li>
            <li><strong>Active Treatment:</strong> Retinoids or gentle exfoliating acids (alternate nights).</li>
            <li><strong>Restorative Cream:</strong> Replenish lipids and skin barrier fatty acids.</li>
            <li><strong>Optional Occlusive:</strong> Slugging on parched areas 1-2 times weekly.</li>
          </ol>
        </div>
      </div>

      {/* Embedded Interactive Tracker & Scheduler */}
      <RoutinesView onShowToast={onShowToast} defaultTab={defaultTab} />
    </div>
  );
};
