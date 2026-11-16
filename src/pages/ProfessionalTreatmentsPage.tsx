import React, { useEffect } from 'react';
import { ProfessionalTreatmentsSection } from '../components/ProfessionalTreatmentsSection';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useNavigate } from 'react-router-dom';

interface ProfessionalTreatmentsPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const ProfessionalTreatmentsPage: React.FC<ProfessionalTreatmentsPageProps> = ({ onShowToast }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Professional Skin Treatments & FAQs | Beauty Tips by Abbas';
  }, []);

  const handleNavigate = (viewId: string) => {
    if (viewId === 'ai') navigate('/ai');
    else if (viewId === 'routines') navigate('/beauty-routines');
    else if (viewId === 'skincare') navigate('/skincare');
    else navigate('/beauty-tips');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'In-Clinic Professional Treatments', active: true }]} />
      <ProfessionalTreatmentsSection
        onShowToast={onShowToast}
        onNavigateToView={handleNavigate}
      />
    </div>
  );
};
