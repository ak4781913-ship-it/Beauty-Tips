import React, { useEffect } from 'react';
import { IngredientsGuide } from '../components/IngredientsGuide';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface IngredientsPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const IngredientsPage: React.FC<IngredientsPageProps> = ({ onShowToast }) => {
  useEffect(() => {
    document.title = 'Skincare Ingredients Directory & Clash Checker | Beauty Tips by Abbas';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Ingredients Directory & Clash Checker', active: true }]} />
      <IngredientsGuide onShowToast={onShowToast} />
    </div>
  );
};
