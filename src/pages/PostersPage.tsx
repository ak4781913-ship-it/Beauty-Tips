import React, { useEffect } from 'react';
import { BeautyPostersSection } from '../components/BeautyPostersSection';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface PostersPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const PostersPage: React.FC<PostersPageProps> = ({ onShowToast }) => {
  useEffect(() => {
    document.title = 'Educational Beauty Posters & Visual Cheatsheets | Beauty Tips by Abbas';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Beauty Posters & Visual Inspiration', active: true }]} />
      <BeautyPostersSection onShowToast={onShowToast} />
    </div>
  );
};
