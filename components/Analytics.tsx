import React, { useMemo } from 'react';
import { AppPage, LeadMagnet } from '../types';
import { getAllMetrics, getAllLeads, getAnalyticsSummary } from '../services/storageService';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Calendar,
  DollarSign,
  Target,
  FileText,
  Eye,
} from './Icon';

interface AnalyticsProps {
  magnets: LeadMagnet[];
  onNavigate: (page: AppPage, id?: string) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ magnets, onNavigate }) => {
  const summary = useMemo(() => getAnalyticsSummary(), [magnets]);
  const allMetrics = useMemo(() => getAllMetrics(), [magnets]);
  const allLeads = useMemo(() => getAllLeads(), [magnets]);

  // Per-magnet performance
  const magnetPerformance = useMemo(() => {
    return magnets
      .map((m) => {
        const metrics = allMetrics.find((x) => x.magnetId === m.id);
        const leads = allLeads.filter((l) => l.magnetId === m.id);
        return {
          magnet: m,
          downloads: metrics?.downloads || 0,
          optIns: metrics?.optIns || 0,
          replies: metrics?.replies || 0,
          meetings: metrics?.meetings || 0,
          revenue: metrics?.revenue || 0,
          leads: leads.length,
        };
      })
      .sort((a, b) => b.optIns - a.optIns);
  }, [magnets, allMetrics, allLeads]);

  // Conversion rate
  const conversionRate = summary.totalDownloads > 0
    ? ((summary.totalMeetings / summary.totalDownloads) * 100).toFixed(1)
    : '0';

  // Niche performance
  const nichePerformance = useMemo(() => {
    const map: Record<string, { downloads: number; optIns: number; meetings: number; revenue: number; count: number }> = {};
    magnets.forEach((m) => {
      if (!map[m.niche]) map[m.niche] = { downloads: 0, optIns: 0, meetings: 0, revenue: 0, count: 0 };
      const metrics = allMetrics.find((x) => x.magnetId === m.id);
      map[m.niche].count++;
      if (metrics) {
        map[m.niche].downloads += metrics.downloads;
        map[m.niche].optIns += metrics.optIns;
        map[m.niche].meetings += metrics.meetings;
        map[m.niche].revenue += metrics.revenue;
      }
    });
    return Object.entries(map)
      .map(([niche, data]) => ({ niche, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [magnets, allMetrics]);

  const bigStats = [
    { label: 'Total Downloads', value: summary.totalDownloads, icon: Download, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Leads Captured', value: summary.totalOptIns, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Meetings Booked', value: summary.totalMeetings, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: `$${summary.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: Target, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Active Magnets', value: summary.publishedMagnets, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="heading text-2xl md:text-3xl text-gl-ink flex items-center gap-3">
          <BarChart3 className="w-7 h-7" />
          Analytics
        </h2>
        <p className="text-sm text-gl-muted mt-1">
          Track performance across all your lead magnets
        </p>
      </div>

      {/* Big Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {bigStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gl-border p-4 shadow-soft">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xl  font-semibold text-gl-ink">{stat.value}</p>
              <p className="text-[10px] text-gl-muted uppercase tracking-wide mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Niche Performance */}
        <div className="bg-white rounded-xl border border-gl-border shadow-soft">
          <div className="px-5 py-4 border-b border-gl-border">
            <h3 className=" font-medium text-gl-ink flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gl-blue" />
              Performance by Niche
            </h3>
          </div>
          {nichePerformance.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gl-muted">No data yet</div>
          ) : (
            <div className="divide-y divide-gl-border">
              {nichePerformance.map((n) => (
                <div key={n.niche} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gl-ink">{n.niche}</p>
                    <p className="text-[11px] text-gl-muted">{n.count} magnet{n.count !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-gl-muted">
                    <span>{n.downloads} DL</span>
                    <span>{n.optIns} leads</span>
                    <span>{n.meetings} mtgs</span>
                    <span className="font-medium text-gl-ink">${n.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Format Performance */}
        <div className="bg-white rounded-xl border border-gl-border shadow-soft">
          <div className="px-5 py-4 border-b border-gl-border">
            <h3 className=" font-medium text-gl-ink flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Performance by Format
            </h3>
          </div>
          {summary.topFormats.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gl-muted">No data yet</div>
          ) : (
            <div className="divide-y divide-gl-border">
              {summary.topFormats.map((f) => {
                const formatMagnets = magnets.filter((m) => m.format === f.format);
                const formatMetrics = formatMagnets.map((m) => allMetrics.find((x) => x.magnetId === m.id));
                const totalDL = formatMetrics.reduce((s, m) => s + (m?.downloads || 0), 0);
                const totalRevenue = formatMetrics.reduce((s, m) => s + (m?.revenue || 0), 0);
                return (
                  <div key={f.format} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gl-ink">{f.format}</p>
                      <p className="text-[11px] text-gl-muted">{f.count} magnet{f.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-gl-muted">
                      <span>{totalDL} DL</span>
                      <span className="font-medium text-gl-ink">${totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Per-Magnet Table */}
      <div className="bg-white rounded-xl border border-gl-border shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-gl-border">
          <h3 className=" font-medium text-gl-ink">Individual Magnet Performance</h3>
        </div>
        {magnetPerformance.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gl-muted">No lead magnets to track yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gl-border bg-gl-bg/30">
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3">Title</th>
                  <th className="text-left text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3 hidden md:table-cell">Niche</th>
                  <th className="text-center text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-3 py-3">DL</th>
                  <th className="text-center text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-3 py-3">Leads</th>
                  <th className="text-center text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-3 py-3 hidden sm:table-cell">Replies</th>
                  <th className="text-center text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-3 py-3 hidden sm:table-cell">Mtgs</th>
                  <th className="text-right text-[11px]  font-medium text-gl-muted uppercase tracking-wide px-5 py-3">Revenue</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gl-border">
                {magnetPerformance.map((item) => (
                  <tr key={item.magnet.id} className="hover:bg-gl-bg/30 transition-elegant">
                    <td className="px-5 py-3 text-sm text-gl-ink font-medium max-w-[250px] truncate">{item.magnet.title}</td>
                    <td className="px-5 py-3 text-xs text-gl-muted hidden md:table-cell">{item.magnet.niche}</td>
                    <td className="px-3 py-3 text-sm text-center">{item.downloads}</td>
                    <td className="px-3 py-3 text-sm text-center">{item.optIns}</td>
                    <td className="px-3 py-3 text-sm text-center hidden sm:table-cell">{item.replies}</td>
                    <td className="px-3 py-3 text-sm text-center hidden sm:table-cell">{item.meetings}</td>
                    <td className="px-5 py-3 text-sm text-right font-medium">${item.revenue.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => onNavigate(AppPage.VIEW_MAGNET, item.magnet.id)} className="text-gl-muted hover:text-gl-ink transition-elegant">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
