import React, { useEffect } from 'react';
import { HelpCenterView } from '../components/HelpCenterView';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useNavigate } from 'react-router-dom';

interface HelpCenterPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onShowToast }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Help Center & Frequently Asked Questions | Beauty Tips by Abbas';
  }, []);

  const handleNavigate = (viewId: string) => {
    if (viewId === 'routines') navigate('/beauty-routines');
    else if (viewId === 'skincare') navigate('/skincare');
    else if (viewId === 'treatments') navigate('/treatments');
    else if (viewId === 'ai') navigate('/ai');
    else navigate('/beauty-tips');
  };

  const handleOpenAboutContact = (tab: 'about' | 'contact') => {
    if (tab === 'contact') navigate('/contact');
    else navigate('/about');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Help Center & FAQs', active: true }]} />
      <HelpCenterView
        onNavigateToView={handleNavigate}
        onOpenAboutContact={handleOpenAboutContact}
        onShowToast={onShowToast}
      />
    </div>
  );
};
