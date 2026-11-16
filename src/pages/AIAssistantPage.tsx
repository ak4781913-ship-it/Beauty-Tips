import React, { useEffect } from 'react';
import { AskAbbasAIChat } from '../components/AskAbbasAIChat';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import { BeautyTip } from '../types';
import { getTipSlug } from '../utils/slug';

interface AIAssistantPageProps {
  onShowToast: (msg: string, type?: 'favorite' | 'success' | 'info') => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onShowToast }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Ask Abbas AI Consultation | Beauty Tips by Abbas';
  }, []);

  const handleOpenDetail = (tip: BeautyTip) => {
    const slug = getTipSlug(tip);
    navigate(`/beauty-tips/${slug}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Ask Abbas AI Consultation', active: true }]} />
      <AskAbbasAIChat
        onOpenDetail={handleOpenDetail}
        onShowToast={onShowToast}
      />
    </div>
  );
};
