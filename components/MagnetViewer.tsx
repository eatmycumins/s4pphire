import React, { useState, useMemo } from 'react';
import {
  AppPage,
  LeadMagnet,
  LeadMagnetStatus,
  MagnetMetrics,
} from '../types';
import {
  saveMagnet,
  deleteMagnet,
  getMetrics,
  updateMetrics,
  getLandingPageByMagnet,
} from '../services/storageService';
import {
  ArrowLeft,
  Copy,
  Download,
  Edit3,
  Trash2,
  Save,
  Eye,
  Globe,
  RefreshCw,
  Target,
  Users,
  Calendar,
  DollarSign,
  Check,
  Archive,
  Send,
} from './Icon';

interface MagnetViewerProps {
  magnet: LeadMagnet;
  onNavigate: (page: AppPage, magnetId?: string) => void;
  onMagnetsChange: () => void;
}

const MagnetViewer: React.FC<MagnetViewerProps> = ({ magnet, onNavigate, onMagnetsChange }) => {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(magnet.content);
  const [editTitle, setEditTitle] = useState(magnet.title);
  const [copied, setCopied] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [metricsForm, setMetricsForm] = useState<MagnetMetrics>(() => getMetrics(magnet.id));

  const hasLandingPage = useMemo(() => !!getLandingPageByMagnet(magnet.id), [magnet.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(magnet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([magnet.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${magnet.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    saveMagnet({ ...magnet, title: editTitle, content: editContent, updatedAt: new Date().toISOString() });
    onMagnetsChange();
    setEditing(false);
  };

  const handleStatusChange = (status: LeadMagnetStatus) => {
    saveMagnet({ ...magnet, status, updatedAt: new Date().toISOString() });
    onMagnetsChange();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this lead magnet?')) {
      deleteMagnet(magnet.id);
      onMagnetsChange();
      onNavigate(AppPage.LIBRARY);
    }
  };

  const handleMetricsSave = () => {
    updateMetrics(magnet.id, metricsForm);
    setShowMetrics(false);
  };

  // Simple markdown to HTML
  const renderContent = (md: string) => {
    return md
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-atelier-ink">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3 text-atelier-ink serif-heading">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-atelier-ink serif-heading">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm text-atelier-ink/80 mb-1">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm text-atelier-ink/80 mb-1">$2</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <button
          onClick={() => onNavigate(AppPage.LIBRARY)}
          className="flex items-center gap-1.5 text-sm text-atelier-muted hover:text-atelier-ink transition-elegant self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-2xl serif-heading px-2 py-1 border border-atelier-border rounded-lg focus:outline-none focus:border-atelier-ink"
              />
            ) : (
              <h2 className="serif-heading text-2xl md:text-3xl text-atelier-ink">{magnet.title}</h2>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-atelier-bg border border-atelier-border text-atelier-muted">
                {magnet.niche}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-atelier-bg border border-atelier-border text-atelier-muted">
                {magnet.format}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-atelier-bg border border-atelier-border text-atelier-muted">
                {magnet.persona}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  magnet.status === LeadMagnetStatus.PUBLISHED
                    ? 'bg-green-50 text-green-700'
                    : magnet.status === LeadMagnetStatus.ARCHIVED
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {magnet.status}
              </span>
              {magnet.parentId && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  Repurposed
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-elegant">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={() => { setEditing(false); setEditContent(magnet.content); setEditTitle(magnet.title); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-atelier-border text-xs rounded-lg hover:bg-atelier-bg transition-elegant">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-atelier-border text-xs rounded-lg hover:bg-atelier-bg transition-elegant">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 border border-atelier-border text-xs rounded-lg hover:bg-atelier-bg transition-elegant">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 border border-atelier-border text-xs rounded-lg hover:bg-atelier-bg transition-elegant">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button onClick={() => onNavigate(AppPage.REPURPOSE)} className="flex items-center gap-1.5 px-3 py-1.5 border border-atelier-border text-xs rounded-lg hover:bg-atelier-bg transition-elegant">
                  <RefreshCw className="w-3.5 h-3.5" /> Repurpose
                </button>
                {!hasLandingPage && (
                  <button onClick={() => onNavigate(AppPage.LANDING_PAGES, magnet.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-atelier-ink text-white text-xs rounded-lg hover:bg-atelier-ink/90 transition-elegant">
                    <Globe className="w-3.5 h-3.5" /> Create Landing Page
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-atelier-border shadow-soft">
          <div className="flex items-center justify-between px-5 py-3 border-b border-atelier-border">
            <h3 className="text-sm font-sans font-medium text-atelier-ink flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {editing ? 'Edit Content' : 'Preview'}
            </h3>
          </div>
          {editing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-5 text-sm font-sans text-atelier-ink/80 leading-relaxed focus:outline-none resize-y min-h-[400px]"
              style={{ minHeight: '500px' }}
            />
          ) : (
            <div
              className="p-5 prose prose-sm max-w-none text-sm font-sans text-atelier-ink/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderContent(magnet.content) }}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-4">
            <h4 className="text-xs font-sans font-medium text-atelier-muted uppercase tracking-wide mb-3">Status</h4>
            <div className="space-y-1.5">
              {Object.values(LeadMagnetStatus).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-elegant ${
                    magnet.status === s ? 'bg-atelier-ink text-white' : 'hover:bg-atelier-bg text-atelier-muted'
                  }`}
                >
                  {s === LeadMagnetStatus.PUBLISHED && <Send className="w-3 h-3 inline mr-1.5" />}
                  {s === LeadMagnetStatus.DRAFT && <Edit3 className="w-3 h-3 inline mr-1.5" />}
                  {s === LeadMagnetStatus.ARCHIVED && <Archive className="w-3 h-3 inline mr-1.5" />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-sans font-medium text-atelier-muted uppercase tracking-wide">Metrics</h4>
              <button onClick={() => setShowMetrics(!showMetrics)} className="text-[10px] text-atelier-highlight hover:underline">
                {showMetrics ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {showMetrics ? (
              <div className="space-y-2">
                {(['downloads', 'optIns', 'replies', 'meetings', 'revenue'] as const).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-xs text-atelier-muted capitalize">{key === 'optIns' ? 'Opt-ins' : key}</label>
                    <input
                      type="number"
                      value={metricsForm[key]}
                      onChange={(e) => setMetricsForm((p) => ({ ...p, [key]: Number(e.target.value) }))}
                      className="w-20 px-2 py-1 text-xs border border-atelier-border rounded text-right focus:outline-none focus:border-atelier-ink"
                    />
                  </div>
                ))}
                <button onClick={handleMetricsSave} className="w-full text-xs px-3 py-1.5 bg-atelier-ink text-white rounded-lg mt-2 hover:bg-atelier-ink/90 transition-elegant">
                  Save Metrics
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-xs text-atelier-muted flex items-center gap-1"><Download className="w-3 h-3" /> Downloads</span><span className="text-sm font-medium">{metricsForm.downloads}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-atelier-muted flex items-center gap-1"><Users className="w-3 h-3" /> Opt-ins</span><span className="text-sm font-medium">{metricsForm.optIns}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-atelier-muted flex items-center gap-1"><Target className="w-3 h-3" /> Replies</span><span className="text-sm font-medium">{metricsForm.replies}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-atelier-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> Meetings</span><span className="text-sm font-medium">{metricsForm.meetings}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-atelier-muted flex items-center gap-1"><DollarSign className="w-3 h-3" /> Revenue</span><span className="text-sm font-medium">${metricsForm.revenue.toLocaleString()}</span></div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-4">
            <h4 className="text-xs font-sans font-medium text-atelier-muted uppercase tracking-wide mb-3">Details</h4>
            <div className="space-y-2 text-xs">
              <div><span className="text-atelier-muted">Category:</span> <span className="text-atelier-ink">{magnet.category}</span></div>
              <div><span className="text-atelier-muted">Lead Goal:</span> <span className="text-atelier-ink">{magnet.leadGoal}</span></div>
              <div><span className="text-atelier-muted">Pain Point:</span> <span className="text-atelier-ink">{magnet.painPoint}</span></div>
              <div><span className="text-atelier-muted">Channels:</span> <span className="text-atelier-ink">{magnet.channels.join(', ')}</span></div>
              <div><span className="text-atelier-muted">Created:</span> <span className="text-atelier-ink">{new Date(magnet.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          {/* Delete */}
          <button onClick={handleDelete} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-elegant">
            <Trash2 className="w-3.5 h-3.5" /> Delete Lead Magnet
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagnetViewer;
