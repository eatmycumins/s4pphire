import React, { useState, useMemo } from 'react';
import { AppPage, LeadMagnet, LeadMagnetStatus, MagnetFormat } from '../types';
import { BookOpen, Search, Plus, Eye, RefreshCw, Globe, FileText } from './Icon';

interface LibraryProps {
  magnets: LeadMagnet[];
  onNavigate: (page: AppPage, magnetId?: string) => void;
}

const Library: React.FC<LibraryProps> = ({ magnets, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterNiche, setFilterNiche] = useState<string>('all');

  const niches = useMemo(() => [...new Set(magnets.map((m) => m.niche))], [magnets]);

  const filtered = useMemo(() => {
    return magnets.filter((m) => {
      if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.niche.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (filterFormat !== 'all' && m.format !== filterFormat) return false;
      if (filterNiche !== 'all' && m.niche !== filterNiche) return false;
      return true;
    });
  }, [magnets, search, filterStatus, filterFormat, filterNiche]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="serif-heading text-2xl md:text-3xl text-atelier-ink flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            Resource Vault
          </h2>
          <p className="text-sm text-atelier-muted mt-1">
            {magnets.length} lead magnet{magnets.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <button
          onClick={() => onNavigate(AppPage.GENERATE)}
          className="flex items-center gap-2 px-4 py-2 bg-atelier-ink text-white text-sm font-sans rounded-lg hover:bg-atelier-ink/90 transition-elegant"
        >
          <Plus className="w-4 h-4" /> New Magnet
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-atelier-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or niche..."
              className="w-full pl-9 pr-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans bg-white focus:outline-none focus:border-atelier-ink">
            <option value="all">All Status</option>
            {Object.values(LeadMagnetStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans bg-white focus:outline-none focus:border-atelier-ink">
            <option value="all">All Formats</option>
            {Object.values(MagnetFormat).map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          {niches.length > 0 && (
            <select value={filterNiche} onChange={(e) => setFilterNiche(e.target.value)} className="px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans bg-white focus:outline-none focus:border-atelier-ink">
              <option value="all">All Niches</option>
              {niches.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft px-8 py-16 text-center">
          <FileText className="w-10 h-10 text-atelier-accent mx-auto mb-4" />
          <p className="text-sm text-atelier-muted mb-1">
            {magnets.length === 0 ? 'Your resource vault is empty.' : 'No magnets match your filters.'}
          </p>
          {magnets.length === 0 && (
            <button onClick={() => onNavigate(AppPage.GENERATE)} className="text-sm text-atelier-highlight hover:underline mt-2">
              Generate your first lead magnet
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-atelier-border shadow-soft hover:shadow-elegant transition-elegant group">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      m.status === LeadMagnetStatus.PUBLISHED
                        ? 'bg-green-50 text-green-700'
                        : m.status === LeadMagnetStatus.ARCHIVED
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {m.status}
                  </span>
                  {m.parentId && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5" /> Repurposed
                    </span>
                  )}
                </div>
                <h3 className="font-sans font-medium text-atelier-ink text-sm leading-snug mb-2 line-clamp-2">
                  {m.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-atelier-bg text-atelier-muted">{m.niche}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-atelier-bg text-atelier-muted">{m.format}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-atelier-bg text-atelier-muted">{m.persona}</span>
                </div>
                <p className="text-[11px] text-atelier-muted">
                  {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex border-t border-atelier-border divide-x divide-atelier-border">
                <button
                  onClick={() => onNavigate(AppPage.VIEW_MAGNET, m.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-atelier-muted hover:text-atelier-ink hover:bg-atelier-bg/50 transition-elegant"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => onNavigate(AppPage.LANDING_PAGES, m.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-atelier-muted hover:text-atelier-ink hover:bg-atelier-bg/50 transition-elegant"
                >
                  <Globe className="w-3.5 h-3.5" /> Landing Page
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
