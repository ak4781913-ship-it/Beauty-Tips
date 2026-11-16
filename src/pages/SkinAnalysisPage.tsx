import React, { useEffect } from 'react';
import { SmartRoutineGenerator } from '../components/SmartRoutineGenerator';
import { useNavigate } from 'react-router-dom';
import { BeautyConcern } from '../types';

interface SkinAnalysisPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const SkinAnalysisPage: React.FC<SkinAnalysisPageProps> = ({ onShowToast }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Smart Skin Diagnostic & Routine Generator | Beauty Tips by Abbas';
  }, []);

  const handleFilterConcern = (concern: BeautyConcern) => {
    navigate(`/beauty-tips?q=${encodeURIComponent(concern)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      <SmartRoutineGenerator
        onFilterConcern={handleFilterConcern}
        onShowToast={onShowToast}
      />
    </div>
  );
};
