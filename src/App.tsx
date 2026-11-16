/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { ScrollToTop } from './components/ScrollToTop';
import { SeoManager } from './components/SeoManager';
import { ScrollProgressIndicator } from './components/ScrollProgressIndicator';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { RecentHistoryDrawer } from './components/RecentHistoryDrawer';
import { useRecentHistory } from './hooks/useRecentHistory';
import { Toast, ToastMessage } from './components/Toast';
import { SmartlinkTopBar } from './components/ads/SmartlinkPromo';
import { AchievementsModal } from './components/AchievementsModal';
import { useBeautyMilestones } from './hooks/useBeautyMilestones';
import { useDailyReminder } from './hooks/useDailyReminder';
import { ReminderPayload } from './utils/dailyReminder';
import { ArrowUp } from 'lucide-react';
import { BEAUTY_TIPS } from './data/tips';
import { BeautyTip } from './types';
import { getTipSlug } from './utils/slug';

// Pages
import { HomePage } from './pages/HomePage';
import { BeautyTipsPage } from './pages/BeautyTipsPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { SkincareCategoryPage } from './pages/SkincareCategoryPage';
import { MakeupPage } from './pages/MakeupPage';
import { AcnePimplesPage } from './pages/AcnePimplesPage';
import { DarkSpotsPage } from './pages/DarkSpotsPage';
import { HairCarePage } from './pages/HairCarePage';
import { BeautyRoutinesPage } from './pages/BeautyRoutinesPage';
import { SavedArticlesPage } from './pages/SavedArticlesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { SkinAnalysisPage } from './pages/SkinAnalysisPage';
import { ProfessionalTreatmentsPage } from './pages/ProfessionalTreatmentsPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { PostersPage } from './pages/PostersPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { ProgressGalleryPage } from './pages/ProgressGalleryPage';
import { BeautyJournalPage } from './pages/BeautyJournalPage';

function AppContent() {
  const navigate = useNavigate();

  // Dark luxury theme default state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('beauty_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return true; // Default to dark luxury theme as requested
  });

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('beauty_favorites_abbas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['tip-double-cleanse-clarity', 'tip-ceramide-barrier-shield'];
      }
    }
    return ['tip-double-cleanse-clarity', 'tip-ceramide-barrier-shield'];
  });

  // Recent History state persisted in localStorage & reactive across tabs
  const {
    history: recentHistory,
    removeItem: removeRecentHistoryItem,
    clearAll: clearRecentHistory,
  } = useRecentHistory();

  // Modals & Floating controls
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState<boolean>(false);
  const [achievementsOpen, setAchievementsOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Daily Streak & Beauty Milestones reactive hook
  const { streak } = useBeautyMilestones(favorites);

  // Sync dark mode class on root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('beauty_dark_mode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('beauty_favorites_abbas', JSON.stringify(favorites));
  }, [favorites]);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (
    message: string,
    type: 'favorite' | 'success' | 'info' | 'streak' | 'reminder' = 'info',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message, actionLabel, onAction }]);
    const duration = type === 'reminder' || type === 'streak' ? 8500 : 3500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  // 8 PM Daily Reading Streak Reminder Hook
  const handleReminderTrigger = (payload: ReminderPayload) => {
    showToast(
      payload.message,
      'reminder',
      'Read Daily Tip',
      () => {
        navigate('/beauty-tips');
      }
    );
  };

  useDailyReminder(handleReminderTrigger);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleFavorite = (tipId: string) => {
    setFavorites((prev) => {
      if (prev.includes(tipId)) {
        showToast('Tip removed from your saved vault', 'info');
        return prev.filter((id) => id !== tipId);
      } else {
        showToast('Tip saved to your beauty vault!', 'favorite');
        return [...prev, tipId];
      }
    });
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
    showToast('All saved tips have been cleared', 'info');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticleFromSearch = (tip: BeautyTip) => {
    setSearchModalOpen(false);
    const slug = getTipSlug(tip);
    navigate(`/beauty-tips/${slug}`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans transition-colors duration-300 antialiased selection:bg-rose-500/30 selection:text-rose-200 flex flex-col">
      {/* Scroll restoration helper & Dynamic SEO Manager */}
      <ScrollToTop />
      <SeoManager />

      {/* Subtle Editorial Article Reading Progress Indicator */}
      <ScrollProgressIndicator />

      {/* Editorial Partner Notification Ribbon */}
      <SmartlinkTopBar />

      {/* Consistent Sticky Navigation Header */}
      <SiteHeader
        favoritesCount={favorites.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setSearchModalOpen(true)}
        historyCount={recentHistory.length}
        onOpenHistory={() => setHistoryDrawerOpen(true)}
        recentHistory={recentHistory}
        onClearHistory={clearRecentHistory}
        streakCount={streak.currentStreak}
        streakHasReadToday={streak.hasReadToday}
        onOpenAchievements={() => setAchievementsOpen(true)}
      />

      {/* Main Multi-Page Route Workspace */}
      <main className="flex-1 w-full">
        <Routes>
          {/* 1. Home Page */}
          <Route
            path="/"
            element={
              <HomePage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
                onOpenAchievements={() => setAchievementsOpen(true)}
              />
            }
          />

          {/* 2. All Beauty Tips Page */}
          <Route
            path="/beauty-tips"
            element={
              <BeautyTipsPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 3. Individual Article Page with Descriptive Slug */}
          <Route
            path="/beauty-tips/:slug"
            element={
              <ArticleDetailPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 4. Skincare Landing Page (Supports /skin-care and /skincare) */}
          <Route
            path="/skin-care"
            element={
              <SkincareCategoryPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/skincare"
            element={
              <SkincareCategoryPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 4b. Skincare Sub-Article Dedicated Route (/skin-care/:slug) */}
          <Route
            path="/skin-care/:slug"
            element={
              <ArticleDetailPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 5. Makeup Landing Page & Sub-Articles */}
          <Route
            path="/makeup"
            element={
              <MakeupPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/makeup/:slug"
            element={
              <ArticleDetailPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 6. Acne & Pimples Dedicated Page */}
          <Route
            path="/acne-pimples"
            element={
              <AcnePimplesPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 7. Dark Spots Dedicated Page */}
          <Route
            path="/dark-spots"
            element={
              <DarkSpotsPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 8. Hair Care Page & Sub-Articles (Supports /hair-care and /haircare) */}
          <Route
            path="/hair-care"
            element={
              <HairCarePage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/haircare"
            element={
              <HairCarePage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/hair-care/:slug"
            element={
              <ArticleDetailPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />

          {/* 9. Beauty Routines Page (Supports /routines, /beauty-routines, /routine-builder) */}
          <Route
            path="/routines"
            element={<BeautyRoutinesPage onShowToast={showToast} />}
          />
          <Route
            path="/beauty-routines"
            element={<BeautyRoutinesPage onShowToast={showToast} />}
          />
          <Route
            path="/routine-builder"
            element={<BeautyRoutinesPage defaultTab="builder" onShowToast={showToast} />}
          />
          <Route
            path="/skincare-routine-builder"
            element={<BeautyRoutinesPage defaultTab="builder" onShowToast={showToast} />}
          />

          {/* 9. Saved Articles Page */}
          <Route
            path="/saved"
            element={
              <SavedArticlesPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onClearAllFavorites={handleClearAllFavorites}
                onShowToast={showToast}
                defaultTab="saved"
              />
            }
          />
          <Route
            path="/history"
            element={
              <SavedArticlesPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onClearAllFavorites={handleClearAllFavorites}
                onShowToast={showToast}
                defaultTab="history"
              />
            }
          />

          {/* 10. About Abbas Page */}
          <Route path="/about" element={<AboutPage />} />

          {/* 11. Contact Page */}
          <Route path="/contact" element={<ContactPage onShowToast={showToast} />} />

          {/* 12. Privacy Policy Page */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* 13. Medical Disclaimer Page */}
          <Route path="/disclaimer" element={<DisclaimerPage />} />

          {/* Preserved Specialized Feature Hubs */}
          <Route
            path="/skin-analysis"
            element={<SkinAnalysisPage onShowToast={showToast} />}
          />
          <Route
            path="/treatments"
            element={<ProfessionalTreatmentsPage onShowToast={showToast} />}
          />
          <Route
            path="/ingredients"
            element={<IngredientsPage onShowToast={showToast} />}
          />
          <Route
            path="/posters"
            element={<PostersPage onShowToast={showToast} />}
          />
          <Route
            path="/ai"
            element={<AIAssistantPage onShowToast={showToast} />}
          />
          <Route
            path="/help"
            element={<HelpCenterPage onShowToast={showToast} />}
          />
          <Route
            path="/progress-gallery"
            element={<ProgressGalleryPage onShowToast={showToast} />}
          />
          <Route
            path="/skin-journal"
            element={<BeautyJournalPage onShowToast={showToast} />}
          />
          <Route
            path="/beauty-journal"
            element={<BeautyJournalPage onShowToast={showToast} />}
          />
          <Route
            path="/journal"
            element={<BeautyJournalPage onShowToast={showToast} />}
          />

          {/* Fallback Catch-all: Redirects to Home */}
          <Route
            path="*"
            element={
              <HomePage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
              />
            }
          />
        </Routes>
      </main>

      {/* Consistent Multi-Page Application Footer */}
      <SiteFooter />

      {/* Global Interactive Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        tips={BEAUTY_TIPS}
        favorites={favorites}
        onOpenDetail={handleOpenArticleFromSearch}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Global Recent Reading History Slide-over Drawer */}
      <RecentHistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        history={recentHistory}
        onRemoveItem={removeRecentHistoryItem}
        onClearAll={clearRecentHistory}
      />

      {/* Beauty Milestones & Digital Badges Modal */}
      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        favoritesList={favorites}
      />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-stone-900 text-stone-200 shadow-xl border border-stone-800 hover:border-rose-500/50 hover:bg-stone-850 hover:text-white transition-all duration-200 cursor-pointer animate-in fade-in"
        >
          <ArrowUp className="w-5 h-5 text-rose-400" />
        </button>
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
