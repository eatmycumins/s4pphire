import React, { useMemo } from 'react';
import { AppPage, LeadMagnet, LeadMagnetStatus } from '../types';
import { getAnalyticsSummary } from '../services/storageService';
import {
  FileText,
  Download,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  BookOpen,
  Target,
} from './Icon';

interface DashboardProps {
  magnets: LeadMagnet[];
  onNavigate: (page: AppPage, magnetId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ magnets, onNavigate }) => {
  const summary = useMemo(() => getAnalyticsSummary(), [magnets]);

  const statCards = [
    { label: 'Total Magnets', value: summary.totalMagnets, icon: FileText, color: 'text-blue-600' },
    { label: 'Published', value: summary.publishedMagnets, icon: Target, color: 'text-green-600' },
    { label: 'Total Downloads', value: summary.totalDownloads, icon: Download, color: 'text-purple-600' },
    { label: 'Leads Captured', value: summary.totalOptIns, icon: Users, color: 'text-amber-600' },
    { label: 'Meetings Booked', value: summary.totalMeetings, icon: Calendar, color: 'text-rose-600' },
    { label: 'Revenue', value: `$${summary.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
  ];

  const recentMagnets = magnets.slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="serif-heading text-2xl md:text-3xl text-atelier-ink">Dashboard</h2>
          <p className="text-sm text-atelier-muted mt-1">Your lead magnet engine at a glance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate(AppPage.GENERATE)}
            className="flex items-center gap-2 px-4 py-2 bg-atelier-ink text-white text-sm font-sans rounded-lg hover:bg-atelier-ink/90 transition-elegant"
          >
            <Plus className="w-4 h-4" />
            New Magnet
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-atelier-border p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-[11px] text-atelier-muted font-sans uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-xl font-sans font-semibold text-atelier-ink">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Magnets */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-atelier-border shadow-soft">
          <div className="flex items-center justify-between px-5 py-4 border-b border-atelier-border">
            <h3 className="font-sans font-medium text-atelier-ink">Recent Lead Magnets</h3>
            <button
              onClick={() => onNavigate(AppPage.LIBRARY)}
              className="text-xs text-atelier-highlight hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-atelier-border">
            {recentMagnets.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <BookOpen className="w-8 h-8 text-atelier-accent mx-auto mb-3" />
                <p className="text-sm text-atelier-muted mb-3">No lead magnets yet</p>
                <button
                  onClick={() => onNavigate(AppPage.GENERATE)}
                  className="text-sm text-atelier-highlight hover:underline"
                >
                  Create your first one
                </button>
              </div>
            ) : (
              recentMagnets.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onNavigate(AppPage.VIEW_MAGNET, m.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-atelier-bg/50 transition-elegant text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-sans font-medium text-atelier-ink truncate">{m.title}</p>
                    <p className="text-xs text-atelier-muted mt-0.5">
                      {m.niche} &middot; {m.format} &middot; {m.persona}
                    </p>
                  </div>
                  <span
                    className={`ml-3 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${
                      m.status === LeadMagnetStatus.PUBLISHED
                        ? 'bg-green-50 text-green-700'
                        : m.status === LeadMagnetStatus.ARCHIVED
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {m.status}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Top Niches */}
          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
            <h3 className="font-sans font-medium text-atelier-ink mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-atelier-highlight" />
              Top Niches
            </h3>
            {summary.topNiches.length === 0 ? (
              <p className="text-xs text-atelier-muted">No data yet</p>
            ) : (
              <div className="space-y-2">
                {summary.topNiches.map((n) => (
                  <div key={n.niche} className="flex items-center justify-between">
                    <span className="text-sm text-atelier-ink">{n.niche}</span>
                    <span className="text-xs text-atelier-muted bg-atelier-bg px-2 py-0.5 rounded">
                      {n.count} magnet{n.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Formats */}
          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
            <h3 className="font-sans font-medium text-atelier-ink mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Top Formats
            </h3>
            {summary.topFormats.length === 0 ? (
              <p className="text-xs text-atelier-muted">No data yet</p>
            ) : (
              <div className="space-y-2">
                {summary.topFormats.map((f) => (
                  <div key={f.format} className="flex items-center justify-between">
                    <span className="text-sm text-atelier-ink">{f.format}</span>
                    <span className="text-xs text-atelier-muted bg-atelier-bg px-2 py-0.5 rounded">
                      {f.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
            <h3 className="font-sans font-medium text-atelier-ink mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              Recent Leads
            </h3>
            {summary.recentLeads.length === 0 ? (
              <p className="text-xs text-atelier-muted">No leads captured yet</p>
            ) : (
              <div className="space-y-2">
                {summary.recentLeads.slice(0, 5).map((l) => (
                  <div key={l.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-atelier-ink">{l.name}</p>
                      <p className="text-[11px] text-atelier-muted">{l.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
