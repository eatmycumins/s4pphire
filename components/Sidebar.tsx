import React from 'react';
import { AppPage } from '../types';
import {
  LayoutDashboard,
  Plus,
  RefreshCw,
  BookOpen,
  Globe,
  Users,
  BarChart3,
  Sparkles,
  X,
} from './Icon';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { page: AppPage; label: string; icon: React.FC<any>; section?: string }[] = [
  { page: AppPage.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
  { page: AppPage.GENERATE, label: 'New Lead Magnet', icon: Plus, section: 'Create' },
  { page: AppPage.REPURPOSE, label: 'Repurpose Asset', icon: RefreshCw },
  { page: AppPage.LIBRARY, label: 'Resource Vault', icon: BookOpen, section: 'Manage' },
  { page: AppPage.LANDING_PAGES, label: 'Landing Pages', icon: Globe },
  { page: AppPage.LEADS, label: 'Captured Leads', icon: Users, section: 'Track' },
  { page: AppPage.ANALYTICS, label: 'Analytics', icon: BarChart3 },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  let lastSection = '';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gl-border z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-gl-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 flex items-center justify-center bg-gl-blue rounded-xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 20C7 20 3 15 3 10C3 6.5 5.5 4 9 3C8 6 8.5 9 10 12C11 9 12.5 6 12 3C15.5 4 18 6.5 18 10C18 15 14 20 14 20" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.15"/>
                  <path d="M10.5 20V13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10.5 16L8 13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10.5 14.5L13 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h1 className="heading text-lg text-gl-ink tracking-tight leading-tight">
                  GrowLeads
                </h1>
                <p className="text-[9px]  text-gl-muted tracking-[0.15em] uppercase">
                  Lead Magnet Engine
                </p>
              </div>
            </div>
            <button className="lg:hidden p-1" onClick={onClose}>
              <X className="w-5 h-5 text-gl-muted" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const Icon = item.icon;
            const isActive = currentPage === item.page;

            return (
              <React.Fragment key={item.page}>
                {showSection && (
                  <p className="px-3 pt-5 pb-1.5 text-[10px]  font-medium text-gl-muted/60 tracking-[0.15em] uppercase">
                    {item.section}
                  </p>
                )}
                <button
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm  transition-elegant mb-0.5 ${
                    isActive
                      ? 'bg-gl-blue text-white'
                      : 'text-gl-muted hover:bg-gl-border/40 hover:text-gl-ink'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gl-border">
          <div className="flex items-center gap-2 text-[11px]  text-gl-muted/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/60"></span>
            <span>System Ready</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
