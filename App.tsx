import React, { useState, useCallback } from 'react';
import { AppPage, LeadMagnet } from './types';
import { getAllMagnets, getMagnet, getLandingPage } from './services/storageService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GeneratorForm from './components/GeneratorForm';
import RepurposeForm from './components/RepurposeForm';
import Library from './components/Library';
import MagnetViewer from './components/MagnetViewer';
import LandingPageBuilder from './components/LandingPageBuilder';
import PublicLanding from './components/PublicLanding';
import LeadsList from './components/LeadsList';
import Analytics from './components/Analytics';
import { Menu } from './components/Icon';

const App: React.FC = () => {
  const [page, setPage] = useState<AppPage>(AppPage.DASHBOARD);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [magnets, setMagnets] = useState<LeadMagnet[]>(() => getAllMagnets());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshMagnets = useCallback(() => {
    setMagnets(getAllMagnets());
  }, []);

  const navigate = useCallback((newPage: AppPage, id?: string) => {
    setPage(newPage);
    setSelectedId(id);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (page) {
      case AppPage.DASHBOARD:
        return <Dashboard magnets={magnets} onNavigate={navigate} />;

      case AppPage.GENERATE:
        return <GeneratorForm onNavigate={navigate} onMagnetsChange={refreshMagnets} />;

      case AppPage.REPURPOSE:
        return <RepurposeForm magnets={magnets} onNavigate={navigate} onMagnetsChange={refreshMagnets} />;

      case AppPage.LIBRARY:
        return <Library magnets={magnets} onNavigate={navigate} />;

      case AppPage.VIEW_MAGNET: {
        const magnet = selectedId ? getMagnet(selectedId) : undefined;
        if (!magnet) return <Library magnets={magnets} onNavigate={navigate} />;
        return <MagnetViewer magnet={magnet} onNavigate={navigate} onMagnetsChange={refreshMagnets} />;
      }

      case AppPage.LANDING_PAGES:
        return <LandingPageBuilder magnets={magnets} targetMagnetId={selectedId} onNavigate={navigate} />;

      case AppPage.PUBLIC_LANDING: {
        const landingPage = selectedId ? getLandingPage(selectedId) : undefined;
        if (!landingPage) return <LandingPageBuilder magnets={magnets} onNavigate={navigate} />;
        return <PublicLanding landingPage={landingPage} onNavigate={navigate} />;
      }

      case AppPage.LEADS:
        return <LeadsList magnets={magnets} onNavigate={navigate} />;

      case AppPage.ANALYTICS:
        return <Analytics magnets={magnets} onNavigate={navigate} />;

      default:
        return <Dashboard magnets={magnets} onNavigate={navigate} />;
    }
  };

  // Public landing page gets full screen
  if (page === AppPage.PUBLIC_LANDING) {
    const landingPage = selectedId ? getLandingPage(selectedId) : undefined;
    if (landingPage) {
      return (
        <div className="min-h-screen bg-gl-bg text-gl-ink relative selection:bg-gl-blue selection:text-white">
          <PublicLanding landingPage={landingPage} onNavigate={navigate} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gl-bg text-gl-ink flex relative selection:bg-gl-blue selection:text-white">
      {/* Sidebar */}
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gl-border px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-gl-bg rounded-lg transition-elegant">
              <Menu className="w-5 h-5 text-gl-ink" />
            </button>
            <h1 className="heading text-lg text-gl-ink">GrowLeads</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 relative z-10 px-4 md:px-8 py-6 md:py-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
