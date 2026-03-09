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
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-atelier-border z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-atelier-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 flex items-center justify-center bg-atelier-ink rounded-lg">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="serif-heading text-lg text-atelier-ink tracking-tight leading-tight">
                  GrowLeads
                </h1>
                <p className="text-[9px] font-sans text-atelier-muted tracking-[0.15em] uppercase">
                  Lead Magnet Engine
                </p>
              </div>
            </div>
            <button className="lg:hidden p-1" onClick={onClose}>
              <X className="w-5 h-5 text-atelier-muted" />
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
                  <p className="px-3 pt-5 pb-1.5 text-[10px] font-sans font-medium text-atelier-muted/60 tracking-[0.15em] uppercase">
                    {item.section}
                  </p>
                )}
                <button
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-sans transition-elegant mb-0.5 ${
                    isActive
                      ? 'bg-atelier-ink text-white'
                      : 'text-atelier-muted hover:bg-atelier-border/40 hover:text-atelier-ink'
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
        <div className="px-5 py-4 border-t border-atelier-border">
          <div className="flex items-center gap-2 text-[11px] font-sans text-atelier-muted/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/60"></span>
            <span>System Ready</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
