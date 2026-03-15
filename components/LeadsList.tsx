import React, { useState, useMemo } from 'react';
import { AppPage, CapturedLead, LeadMagnet } from '../types';
import { getAllLeads, deleteLead, exportLeadsCSV } from '../services/storageService';
import { Users, Download, Trash2, Search, Mail } from './Icon';

interface LeadsListProps {
  magnets: LeadMagnet[];
  onNavigate: (page: AppPage) => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ magnets }) => {
  const [leads, setLeads] = useState<CapturedLead[]>(() => getAllLeads());
  const [search, setSearch] = useState('');
  const [filterMagnet, setFilterMagnet] = useState('all');

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email.toLowerCase().includes(search.toLowerCase()) && !(l.company || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (filterMagnet !== 'all' && l.magnetId !== filterMagnet) return false;
      return true;
    });
  }, [leads, search, filterMagnet]);

  const handleExport = () => {
    const csv = exportLeadsCSV();
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growleads_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    deleteLead(id);
    setLeads(getAllLeads());
  };

  const getMagnetTitle = (id: string) => {
    const m = magnets.find((m) => m.id === id);
    return m ? m.title : 'Unknown';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="heading text-2xl md:text-3xl text-gl-ink flex items-center gap-3">
            <Users className="w-7 h-7" />
            Captured Leads
          </h2>
          <p className="text-sm text-gl-muted mt-1">
            {leads.length} total lead{leads.length !== 1 ? 's' : ''} captured
          </p>
        </div>
        {leads.length > 0 && (
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-gl-blue text-white text-sm  rounded-lg hover:bg-gl-blue-dark transition-elegant">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      {leads.length > 0 && (
        <div className="bg-white rounded-xl border border-gl-border shadow-soft p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gl-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or company..."
                className="w-full pl-9 pr-3 py-2 border border-gl-border rounded-lg text-sm  focus:outline-none focus:border-gl-blue transition-elegant"
              />
            </div>
            <select value={filterMagnet} onChange={(e) => setFilterMagnet(e.target.value)} className="px-3 py-2 border border-gl-border rounded-lg text-sm  bg-white focus:outline-none focus:border-gl-blue">
              <option value="all">All Magnets</option>
              {magnets.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gl-border shadow-soft px-8 py-16 text-center">
          <Mail className="w-10 h-10 text-gl-accent mx-auto mb-4" />
          <p className="text-sm text-gl-muted">
            {leads.length === 0 ? 'No leads captured yet. Share your landing pages to start collecting leads.' : 'No leads match your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gl-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gl-border bg-gl-bg/30">
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3">Name</th>
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3">Email</th>
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3 hidden md:table-cell">Company</th>
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3 hidden md:table-cell">Role</th>
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Lead Magnet</th>
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gl-border">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gl-bg/30 transition-elegant">
                    <td className="px-5 py-3 text-sm text-gl-ink font-medium">{lead.name}</td>
                    <td className="px-5 py-3 text-sm text-gl-muted">{lead.email}</td>
                    <td className="px-5 py-3 text-sm text-gl-muted hidden md:table-cell">{lead.company || '—'}</td>
                    <td className="px-5 py-3 text-sm text-gl-muted hidden md:table-cell">{lead.role || '—'}</td>
                    <td className="px-5 py-3 text-xs text-gl-muted hidden lg:table-cell max-w-[200px] truncate">{getMagnetTitle(lead.magnetId)}</td>
                    <td className="px-5 py-3 text-xs text-gl-muted">{new Date(lead.capturedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(lead.id)} className="text-gl-muted hover:text-rose-500 transition-elegant">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
