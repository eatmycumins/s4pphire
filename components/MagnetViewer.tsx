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

  // Enhanced markdown to HTML renderer
  const renderContent = (md: string): string => {
    // First pass: handle code blocks (preserve their content from other replacements)
    const codeBlocks: string[] = [];
    let processed = md.replace(/```([\s\S]*?)```/gm, (_match, code) => {
      codeBlocks.push(code.trim());
      return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });

    // Tables: collect and convert markdown tables
    processed = processed.replace(
      /(?:^|\n)((?:\|[^\n]+\|\n?)+)/gm,
      (_match, tableBlock: string) => {
        const rows = tableBlock.trim().split('\n').filter((r: string) => r.trim());
        if (rows.length < 2) return _match;

        // Check if second row is separator
        const sepRow = rows[1];
        if (!/^\|[\s\-:|]+\|$/.test(sepRow.trim())) return _match;

        const parseRow = (row: string) =>
          row.split('|').slice(1, -1).map((c: string) => c.trim());

        const headers = parseRow(rows[0]);
        const headerHtml = headers
          .map((h: string) => `<th>${h}</th>`)
          .join('');

        const bodyRows = rows.slice(2);
        const bodyHtml = bodyRows
          .map((row: string) => {
            const cells = parseRow(row);
            return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
          })
          .join('');

        return `\n<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>\n`;
      }
    );

    // Checkboxes (must come before general list items)
    processed = processed
      .replace(/^- \[x\] (.+)$/gm,
        '<div class="checkbox-item"><input type="checkbox" checked disabled /><span style="text-decoration:line-through;opacity:0.6">$1</span></div>')
      .replace(/^- \[ \] (.+)$/gm,
        '<div class="checkbox-item"><input type="checkbox" /><span>$1</span></div>');

    // Blockquotes
    processed = processed.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

    // Headers
    processed = processed
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rules
    processed = processed.replace(/^---$/gm, '<hr />');

    // Bold and italic
    processed = processed
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Placeholder tokens [LIKE_THIS]
    processed = processed.replace(/\[([A-Z][A-Z_0-9]+)\]/g, '<span class="placeholder">[$1]</span>');

    // Lists (after checkbox handling)
    processed = processed
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');

    // Wrap consecutive <li> in <ul>/<ol>
    processed = processed.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Paragraphs — double newlines
    processed = processed.replace(/\n\n/g, '</p><p>');
    processed = processed.replace(/\n/g, '<br/>');
    processed = '<p>' + processed + '</p>';

    // Clean up empty paragraphs
    processed = processed.replace(/<p>\s*<\/p>/g, '');
    processed = processed.replace(/<p>(<h[1-4]>)/g, '$1');
    processed = processed.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    processed = processed.replace(/<p>(<table>)/g, '$1');
    processed = processed.replace(/(<\/table>)<\/p>/g, '$1');
    processed = processed.replace(/<p>(<ul>)/g, '$1');
    processed = processed.replace(/(<\/ul>)<\/p>/g, '$1');
    processed = processed.replace(/<p>(<hr \/>)/g, '$1');
    processed = processed.replace(/(<hr \/>)<\/p>/g, '$1');
    processed = processed.replace(/<p>(<div class="checkbox-item">)/g, '$1');
    processed = processed.replace(/(<\/div>)<\/p>/g, '$1');
    processed = processed.replace(/<p>(<blockquote>)/g, '$1');
    processed = processed.replace(/(<\/blockquote>)<\/p>/g, '$1');
    processed = processed.replace(/<p>(<pre )/g, '$1');

    // Restore code blocks
    codeBlocks.forEach((code, i) => {
      processed = processed.replace(
        `%%CODEBLOCK_${i}%%`,
        `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
      );
    });

    return processed;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <button
          onClick={() => onNavigate(AppPage.LIBRARY)}
          className="flex items-center gap-1.5 text-sm text-gl-muted hover:text-gl-ink transition-elegant self-start"
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
                className="w-full text-2xl heading px-2 py-1 border border-gl-border rounded-lg focus:outline-none focus:border-gl-blue"
              />
            ) : (
              <h2 className="heading text-2xl md:text-3xl text-gl-ink">{magnet.title}</h2>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gl-bg border border-gl-border text-gl-muted">
                {magnet.niche}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gl-bg border border-gl-border text-gl-muted">
                {magnet.format}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gl-bg border border-gl-border text-gl-muted">
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
                <button onClick={() => { setEditing(false); setEditContent(magnet.content); setEditTitle(magnet.title); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-gl-border text-xs rounded-lg hover:bg-gl-bg transition-elegant">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gl-border text-xs rounded-lg hover:bg-gl-bg transition-elegant">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 border border-gl-border text-xs rounded-lg hover:bg-gl-bg transition-elegant">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 border border-gl-border text-xs rounded-lg hover:bg-gl-bg transition-elegant">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button onClick={() => onNavigate(AppPage.REPURPOSE)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gl-border text-xs rounded-lg hover:bg-gl-bg transition-elegant">
                  <RefreshCw className="w-3.5 h-3.5" /> Repurpose
                </button>
                {!hasLandingPage && (
                  <button onClick={() => onNavigate(AppPage.LANDING_PAGES, magnet.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gl-blue text-white text-xs rounded-lg hover:bg-gl-blue-dark transition-elegant">
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
        <div className="lg:col-span-3 bg-white rounded-xl border border-gl-border shadow-soft">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gl-border">
            <h3 className="text-sm  font-medium text-gl-ink flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {editing ? 'Edit Content' : 'Preview'}
            </h3>
          </div>
          {editing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-5 text-sm  text-gl-ink/80 leading-relaxed focus:outline-none resize-y min-h-[400px]"
              style={{ minHeight: '500px' }}
            />
          ) : (
            <div
              className="p-5 magnet-content max-w-none"
              dangerouslySetInnerHTML={{ __html: renderContent(magnet.content) }}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl border border-gl-border shadow-soft p-4">
            <h4 className="text-xs  font-medium text-gl-muted uppercase tracking-wide mb-3">Status</h4>
            <div className="space-y-1.5">
              {Object.values(LeadMagnetStatus).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-elegant ${
                    magnet.status === s ? 'bg-gl-blue text-white' : 'hover:bg-gl-bg text-gl-muted'
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
          <div className="bg-white rounded-xl border border-gl-border shadow-soft p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs  font-medium text-gl-muted uppercase tracking-wide">Metrics</h4>
              <button onClick={() => setShowMetrics(!showMetrics)} className="text-[10px] text-gl-blue hover:underline">
                {showMetrics ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {showMetrics ? (
              <div className="space-y-2">
                {(['downloads', 'optIns', 'replies', 'meetings', 'revenue'] as const).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-xs text-gl-muted capitalize">{key === 'optIns' ? 'Opt-ins' : key}</label>
                    <input
                      type="number"
                      value={metricsForm[key]}
                      onChange={(e) => setMetricsForm((p) => ({ ...p, [key]: Number(e.target.value) }))}
                      className="w-20 px-2 py-1 text-xs border border-gl-border rounded text-right focus:outline-none focus:border-gl-blue"
                    />
                  </div>
                ))}
                <button onClick={handleMetricsSave} className="w-full text-xs px-3 py-1.5 bg-gl-blue text-white rounded-lg mt-2 hover:bg-gl-blue-dark transition-elegant">
                  Save Metrics
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-xs text-gl-muted flex items-center gap-1"><Download className="w-3 h-3" /> Downloads</span><span className="text-sm font-medium">{metricsForm.downloads}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-gl-muted flex items-center gap-1"><Users className="w-3 h-3" /> Opt-ins</span><span className="text-sm font-medium">{metricsForm.optIns}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-gl-muted flex items-center gap-1"><Target className="w-3 h-3" /> Replies</span><span className="text-sm font-medium">{metricsForm.replies}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-gl-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> Meetings</span><span className="text-sm font-medium">{metricsForm.meetings}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs text-gl-muted flex items-center gap-1"><DollarSign className="w-3 h-3" /> Revenue</span><span className="text-sm font-medium">${metricsForm.revenue.toLocaleString()}</span></div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-gl-border shadow-soft p-4">
            <h4 className="text-xs  font-medium text-gl-muted uppercase tracking-wide mb-3">Details</h4>
            <div className="space-y-2 text-xs">
              <div><span className="text-gl-muted">Category:</span> <span className="text-gl-ink">{magnet.category}</span></div>
              <div><span className="text-gl-muted">Lead Goal:</span> <span className="text-gl-ink">{magnet.leadGoal}</span></div>
              <div><span className="text-gl-muted">Pain Point:</span> <span className="text-gl-ink">{magnet.painPoint}</span></div>
              <div><span className="text-gl-muted">Channels:</span> <span className="text-gl-ink">{magnet.channels.join(', ')}</span></div>
              <div><span className="text-gl-muted">Created:</span> <span className="text-gl-ink">{new Date(magnet.createdAt).toLocaleDateString()}</span></div>
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
