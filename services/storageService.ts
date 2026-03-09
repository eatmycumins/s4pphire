// ============================================================
// GrowLeads — Local Storage Service
// ============================================================

import {
  LeadMagnet,
  LandingPage,
  CapturedLead,
  MagnetMetrics,
  AnalyticsSummary,
  LeadMagnetStatus,
} from '../types';

const KEYS = {
  MAGNETS: 'growleads_magnets',
  LANDING_PAGES: 'growleads_landing_pages',
  LEADS: 'growleads_leads',
  METRICS: 'growleads_metrics',
};

// --- Helpers ---

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// --- Lead Magnets ---

export function getAllMagnets(): LeadMagnet[] {
  return read<LeadMagnet>(KEYS.MAGNETS).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getMagnet(id: string): LeadMagnet | undefined {
  return read<LeadMagnet>(KEYS.MAGNETS).find((m) => m.id === id);
}

export function saveMagnet(magnet: LeadMagnet): LeadMagnet {
  const all = read<LeadMagnet>(KEYS.MAGNETS);
  const idx = all.findIndex((m) => m.id === magnet.id);
  if (idx >= 0) {
    all[idx] = { ...magnet, updatedAt: new Date().toISOString() };
  } else {
    all.push(magnet);
  }
  write(KEYS.MAGNETS, all);

  // Ensure metrics entry exists
  const metrics = read<MagnetMetrics>(KEYS.METRICS);
  if (!metrics.find((m) => m.magnetId === magnet.id)) {
    metrics.push({
      magnetId: magnet.id,
      downloads: 0,
      optIns: 0,
      replies: 0,
      meetings: 0,
      revenue: 0,
    });
    write(KEYS.METRICS, metrics);
  }

  return magnet;
}

export function deleteMagnet(id: string): void {
  write(KEYS.MAGNETS, read<LeadMagnet>(KEYS.MAGNETS).filter((m) => m.id !== id));
  write(KEYS.METRICS, read<MagnetMetrics>(KEYS.METRICS).filter((m) => m.magnetId !== id));
  write(KEYS.LANDING_PAGES, read<LandingPage>(KEYS.LANDING_PAGES).filter((p) => p.magnetId !== id));
}

// --- Landing Pages ---

export function getAllLandingPages(): LandingPage[] {
  return read<LandingPage>(KEYS.LANDING_PAGES).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLandingPage(id: string): LandingPage | undefined {
  return read<LandingPage>(KEYS.LANDING_PAGES).find((p) => p.id === id);
}

export function getLandingPageByMagnet(magnetId: string): LandingPage | undefined {
  return read<LandingPage>(KEYS.LANDING_PAGES).find((p) => p.magnetId === magnetId);
}

export function saveLandingPage(page: LandingPage): LandingPage {
  const all = read<LandingPage>(KEYS.LANDING_PAGES);
  const idx = all.findIndex((p) => p.id === page.id);
  if (idx >= 0) {
    all[idx] = page;
  } else {
    all.push(page);
  }
  write(KEYS.LANDING_PAGES, all);
  return page;
}

export function deleteLandingPage(id: string): void {
  write(KEYS.LANDING_PAGES, read<LandingPage>(KEYS.LANDING_PAGES).filter((p) => p.id !== id));
}

// --- Leads ---

export function getAllLeads(): CapturedLead[] {
  return read<CapturedLead>(KEYS.LEADS).sort(
    (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
  );
}

export function getLeadsByMagnet(magnetId: string): CapturedLead[] {
  return getAllLeads().filter((l) => l.magnetId === magnetId);
}

export function saveLead(lead: CapturedLead): CapturedLead {
  const all = read<CapturedLead>(KEYS.LEADS);
  all.push(lead);
  write(KEYS.LEADS, all);

  // Increment opt-in count
  const metrics = read<MagnetMetrics>(KEYS.METRICS);
  const m = metrics.find((x) => x.magnetId === lead.magnetId);
  if (m) {
    m.optIns += 1;
    m.downloads += 1;
    write(KEYS.METRICS, metrics);
  }

  return lead;
}

export function deleteLead(id: string): void {
  write(KEYS.LEADS, read<CapturedLead>(KEYS.LEADS).filter((l) => l.id !== id));
}

export function exportLeadsCSV(): string {
  const leads = getAllLeads();
  if (leads.length === 0) return '';
  const headers = ['Name', 'Email', 'Company', 'Role', 'Captured At', 'Magnet ID'];
  const rows = leads.map((l) => [l.name, l.email, l.company || '', l.role || '', l.capturedAt, l.magnetId]);
  return [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
}

// --- Metrics ---

export function getMetrics(magnetId: string): MagnetMetrics {
  const metrics = read<MagnetMetrics>(KEYS.METRICS);
  return (
    metrics.find((m) => m.magnetId === magnetId) || {
      magnetId,
      downloads: 0,
      optIns: 0,
      replies: 0,
      meetings: 0,
      revenue: 0,
    }
  );
}

export function getAllMetrics(): MagnetMetrics[] {
  return read<MagnetMetrics>(KEYS.METRICS);
}

export function updateMetrics(magnetId: string, updates: Partial<MagnetMetrics>): void {
  const metrics = read<MagnetMetrics>(KEYS.METRICS);
  const m = metrics.find((x) => x.magnetId === magnetId);
  if (m) {
    Object.assign(m, updates);
    write(KEYS.METRICS, metrics);
  }
}

// --- Analytics Summary ---

export function getAnalyticsSummary(): AnalyticsSummary {
  const magnets = getAllMagnets();
  const metrics = getAllMetrics();
  const leads = getAllLeads();

  const totalDownloads = metrics.reduce((s, m) => s + m.downloads, 0);
  const totalOptIns = metrics.reduce((s, m) => s + m.optIns, 0);
  const totalMeetings = metrics.reduce((s, m) => s + m.meetings, 0);
  const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0);

  // Top niches
  const nicheMap: Record<string, number> = {};
  magnets.forEach((m) => {
    nicheMap[m.niche] = (nicheMap[m.niche] || 0) + 1;
  });
  const topNiches = Object.entries(nicheMap)
    .map(([niche, count]) => ({ niche, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top formats
  const formatMap: Record<string, number> = {};
  magnets.forEach((m) => {
    formatMap[m.format] = (formatMap[m.format] || 0) + 1;
  });
  const topFormats = Object.entries(formatMap)
    .map(([format, count]) => ({ format, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalMagnets: magnets.length,
    publishedMagnets: magnets.filter((m) => m.status === LeadMagnetStatus.PUBLISHED).length,
    totalDownloads,
    totalOptIns,
    totalMeetings,
    totalRevenue,
    topNiches,
    topFormats,
    recentLeads: leads.slice(0, 10),
  };
}
