import React, { useEffect } from 'react';
import { ProgressGallery } from '../components/ProgressGallery';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ProgressGalleryPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info' | 'streak' | 'reminder') => void;
}

export const ProgressGalleryPage: React.FC<ProgressGalleryPageProps> = ({ onShowToast }) => {
  useEffect(() => {
    document.title = 'Private Skin Progress Gallery & Photo Journal | Beauty Tips by Abbas';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Skin Progress Gallery (Private)', active: true }]} />
      <ProgressGallery onShowToast={onShowToast} />
    </div>
  );
};
