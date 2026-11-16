import React, { useState } from 'react';
import {
  LayoutDashboard,
  Zap,
  Sparkles,
  BookOpen,
  Stethoscope,
  ShoppingBag,
  FileText,
  CalendarCheck,
  FlaskConical,
  Library,
  Bot,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Leaf,
  Moon,
  Sun,
  Search,
  Bookmark,
  ExternalLink,
  History,
  Flame,
  Trophy,
} from 'lucide-react';
import { CategoryId } from '../types';

export type AppViewId =
  | 'dashboard'
  | 'analysis'
  | 'skincare'
  | 'treatments'
  | 'products'
  | 'posters'
  | 'routines'
  | 'ingredients'
  | 'articles'
  | 'ai'
  | 'help'
  | 'settings';

interface AppSidebarProps {
  currentView: AppViewId;
  onNavigate: (viewId: AppViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSelectCategory?: (catId: CategoryId) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  historyCount?: number;
  onOpenHistory?: () => void;
  streakCount?: number;
  onOpenAchievements?: () => void;
}

interface NavItem {
  id: AppViewId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; action: () => void }[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onSelectCategory,
  favoritesCount,
  onOpenFavorites,
  historyCount = 0,
  onOpenHistory,
  streakCount = 0,
  onOpenAchievements,
}) => {
  // Dropdown expand states
  const [skincareExpanded, setSkincareExpanded] = useState(false);
  const [articlesExpanded, setArticlesExpanded] = useState(false);

  const handleNavClick = (viewId: AppViewId) => {
    onNavigate(viewId);
    onCloseMobile();
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'analysis',
      label: 'Skin Analysis',
      icon: Zap,
      badge: 'AI Smart',
    },
    {
      id: 'skincare',
      label: 'Skincare',
      icon: BookOpen,
      hasDropdown: true,
      dropdownItems: [
        {
          label: '10 Core Concerns',
          action: () => handleNavClick('treatments'),
        },
        {
          label: 'Natural Remedies',
          action: () => {
            if (onSelectCategory) onSelectCategory('natural-remedies');
            handleNavClick('articles');
          },
        },
        {
          label: 'Face Care & Glow',
          action: () => {
            if (onSelectCategory) onSelectCategory('face-glow');
            handleNavClick('articles');
          },
        },
      ],
    },
    {
      id: 'treatments',
      label: 'Beauty Treatments',
      icon: Stethoscope,
      badge: 'Clinical',
    },
    {
      id: 'products',
      label: 'Recommended Products',
      icon: ShoppingBag,
    },
    {
      id: 'posters',
      label: 'Beauty Posters',
      icon: FileText,
      badge: 'Visuals',
    },
    {
      id: 'routines',
      label: 'Skincare Routines',
      icon: CalendarCheck,
    },
    {
      id: 'ingredients',
      label: 'Ingredients Guide',
      icon: FlaskConical,
      badge: 'Matrix',
    },
    {
      id: 'articles',
      label: 'Beauty Articles',
      icon: Library,
      hasDropdown: true,
      dropdownItems: [
        {
          label: 'Hair Care Tips',
          action: () => {
            if (onSelectCategory) onSelectCategory('hair-care');
            handleNavClick('articles');
          },
        },
        {
          label: 'Makeup & Beauty',
          action: () => {
            if (onSelectCategory) onSelectCategory('makeup-tips');
            handleNavClick('articles');
          },
        },
        {
          label: 'Body & Nail Care',
          action: () => {
            if (onSelectCategory) onSelectCategory('body-care');
            handleNavClick('articles');
          },
        },
        {
          label: "Men's Grooming",
          action: () => {
            if (onSelectCategory) onSelectCategory('mens-grooming');
            handleNavClick('articles');
          },
        },
      ],
    },
    {
      id: 'ai',
      label: 'Abbas AI',
      icon: Bot,
      badge: 'Assistant',
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: HelpCircle,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-stone-950 border-r border-stone-850/80 transition-all duration-300">
      {/* Top: Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-850/60">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left overflow-hidden cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500/30 to-amber-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-serif text-base font-semibold tracking-wide text-stone-100 block truncate group-hover:text-rose-200 transition-colors">
                  Beauty Tips
                </span>
                <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase block -mt-0.5">
                  by Abbas
                </span>
              </div>
            )}
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const IconComponent = item.icon;
            const isDropdownOpen =
              item.id === 'skincare' ? skincareExpanded : item.id === 'articles' ? articlesExpanded : false;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (item.hasDropdown && !collapsed) {
                      if (item.id === 'skincare') setSkincareExpanded(!skincareExpanded);
                      if (item.id === 'articles') setArticlesExpanded(!articlesExpanded);
                    }
                    handleNavClick(item.id);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer group ${
                    isActive
                      ? 'bg-rose-950/80 text-rose-200 border border-rose-800/80 shadow-sm shadow-rose-950/50'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComponent
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-rose-400' : 'text-stone-400 group-hover:text-rose-300'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold uppercase tracking-wider ${
                            isActive
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-stone-850 text-stone-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.hasDropdown && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.id === 'skincare') setSkincareExpanded(!skincareExpanded);
                            if (item.id === 'articles') setArticlesExpanded(!articlesExpanded);
                          }}
                          className="p-0.5 rounded text-stone-400 hover:text-stone-200"
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isDropdownOpen ? 'rotate-180 text-rose-400' : ''
                            }`}
                          />
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu if expanded & not collapsed */}
                {!collapsed && item.hasDropdown && isDropdownOpen && item.dropdownItems && (
                  <div className="pl-9 pr-2 py-1 space-y-1 border-l border-stone-850 ml-5 animate-in fade-in duration-150">
                    {item.dropdownItems.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={sub.action}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-stone-400 hover:text-rose-300 hover:bg-stone-900/60 transition-colors cursor-pointer truncate block"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom User / Quick Action Area */}
      <div className="p-3 border-t border-stone-850/80">
        <button
          onClick={onOpenFavorites}
          title={collapsed ? `Saved Vault (${favoritesCount})` : undefined}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-stone-900/60 hover:bg-stone-900 border border-stone-850 transition-all cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-rose-400 fill-rose-500/20" />
            {!collapsed && <span>Saved Vault</span>}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
              {favoritesCount}
            </span>
          )}
        </button>

        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            title={collapsed ? `Recent History (${historyCount})` : undefined}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-stone-900/40 hover:bg-stone-900 border border-stone-850/80 transition-all cursor-pointer mt-1.5 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-rose-400" />
              {!collapsed && <span>Recent History</span>}
            </div>
            {!collapsed && historyCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                {historyCount}
              </span>
            )}
          </button>
        )}

        {onOpenAchievements && (
          <button
            onClick={onOpenAchievements}
            title={collapsed ? `Beauty Milestones (Streak: ${streakCount}d)` : undefined}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-stone-900/40 hover:bg-stone-900 border border-stone-850/80 transition-all cursor-pointer mt-1.5 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Flame className={`w-4 h-4 ${streakCount > 0 ? 'text-orange-400 fill-orange-500/30' : 'text-stone-400'}`} />
              {!collapsed && <span>Milestones</span>}
            </div>
            {!collapsed && streakCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-950/70 border border-orange-800 text-orange-300">
                {streakCount}d 🔥
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
