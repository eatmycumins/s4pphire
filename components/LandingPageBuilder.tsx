import React, { useState, useMemo } from 'react';
import {
  AppPage,
  LeadMagnet,
  LandingPage,
  FormField,
} from '../types';
import {
  getAllLandingPages,
  saveLandingPage,
  deleteLandingPage,
  getMagnet,
  generateId,
} from '../services/storageService';
import { generateLandingPageCopy } from '../services/geminiService';
import {
  Globe,
  Plus,
  Loader2,
  Trash2,
  Eye,
  Sparkles,
  ExternalLink,
  ArrowLeft,
} from './Icon';

interface LandingPageBuilderProps {
  magnets: LeadMagnet[];
  targetMagnetId?: string;
  onNavigate: (page: AppPage, id?: string) => void;
}

const DEFAULT_FIELDS: FormField[] = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'company', label: 'Company', type: 'text', required: false },
  { name: 'role', label: 'Role', type: 'text', required: false },
];

const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({ magnets, targetMagnetId, onNavigate }) => {
  const [pages, setPages] = useState<LandingPage[]>(() => getAllLandingPages());
  const [showCreate, setShowCreate] = useState(!!targetMagnetId);
  const [selectedMagnetId, setSelectedMagnetId] = useState(targetMagnetId || '');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [bullets, setBullets] = useState<string[]>(['', '', '']);
  const [ctaText, setCtaText] = useState('Download Now');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const selectedMagnet = magnets.find((m) => m.id === selectedMagnetId);

  const handleAutoGenerate = async () => {
    if (!selectedMagnet) return;
    setGenerating(true);
    try {
      const copy = await generateLandingPageCopy(selectedMagnet.title, selectedMagnet.content, selectedMagnet.niche, selectedMagnet.persona);
      setHeadline(copy.headline);
      setSubheadline(copy.subheadline);
      setBullets(copy.bullets.slice(0, 5));
      setCtaText(copy.ctaText);
    } catch (err: any) {
      setError('Failed to generate copy: ' + (err.message || 'Unknown error'));
    } finally {
      setGenerating(false);
    }
  };

  const handleCreate = () => {
    if (!selectedMagnetId || !headline) {
      setError('Please select a lead magnet and add a headline.');
      return;
    }
    setLoading(true);
    setError('');

    const page: LandingPage = {
      id: generateId(),
      magnetId: selectedMagnetId,
      headline,
      subheadline,
      bulletPoints: bullets.filter(Boolean),
      ctaText: ctaText || 'Download Now',
      formFields: DEFAULT_FIELDS,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    saveLandingPage(page);
    setPages(getAllLandingPages());
    setShowCreate(false);
    resetForm();
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this landing page?')) {
      deleteLandingPage(id);
      setPages(getAllLandingPages());
    }
  };

  const resetForm = () => {
    setSelectedMagnetId('');
    setHeadline('');
    setSubheadline('');
    setBullets(['', '', '']);
    setCtaText('Download Now');
    setError('');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="serif-heading text-2xl md:text-3xl text-atelier-ink flex items-center gap-3">
            <Globe className="w-7 h-7" />
            Landing Pages
          </h2>
          <p className="text-sm text-atelier-muted mt-1">
            Create gated download pages for your lead magnets
          </p>
        </div>
        {!showCreate && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-atelier-ink text-white text-sm font-sans rounded-lg hover:bg-atelier-ink/90 transition-elegant">
            <Plus className="w-4 h-4" /> New Landing Page
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-medium text-atelier-ink">Create Landing Page</h3>
            <button onClick={() => { setShowCreate(false); resetForm(); }} className="text-xs text-atelier-muted hover:text-atelier-ink">
              <ArrowLeft className="w-4 h-4 inline mr-1" />Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">Lead Magnet *</label>
              <select
                value={selectedMagnetId}
                onChange={(e) => setSelectedMagnetId(e.target.value)}
                className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans bg-white focus:outline-none focus:border-atelier-ink"
              >
                <option value="">Select a lead magnet...</option>
                {magnets.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>

            {selectedMagnet && (
              <button
                type="button"
                onClick={handleAutoGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:opacity-90 transition-elegant disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? 'Generating Copy...' : 'Auto-Generate Copy with AI'}
              </button>
            )}

            <div>
              <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">Headline *</label>
              <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g., Get The Proven Framework That..." className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink" />
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">Subheadline</label>
              <input type="text" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Supporting text below the headline..." className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink" />
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">Bullet Points</label>
              {bullets.map((b, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const newBullets = [...bullets];
                      newBullets[i] = e.target.value;
                      setBullets(newBullets);
                    }}
                    placeholder={`Benefit ${i + 1}...`}
                    className="flex-1 px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink"
                  />
                </div>
              ))}
              {bullets.length < 6 && (
                <button type="button" onClick={() => setBullets([...bullets, ''])} className="text-xs text-atelier-highlight hover:underline">
                  + Add bullet
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">CTA Button Text</label>
              <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink" />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-sm text-rose-700">{error}</div>
            )}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-atelier-ink text-white font-sans font-medium rounded-xl hover:bg-atelier-ink/90 transition-elegant disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
              Create Landing Page
            </button>
          </div>
        </div>
      )}

      {/* Existing Pages */}
      {pages.length === 0 && !showCreate ? (
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft px-8 py-16 text-center">
          <Globe className="w-10 h-10 text-atelier-accent mx-auto mb-4" />
          <p className="text-sm text-atelier-muted">No landing pages yet.</p>
          <button onClick={() => setShowCreate(true)} className="text-sm text-atelier-highlight hover:underline mt-2">
            Create your first landing page
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => {
            const magnet = getMagnet(page.magnetId);
            return (
              <div key={page.id} className="bg-white rounded-xl border border-atelier-border shadow-soft hover:shadow-elegant transition-elegant">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${page.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-sans font-medium text-atelier-ink text-sm mb-1 line-clamp-2">{page.headline}</h3>
                  <p className="text-xs text-atelier-muted mb-2 line-clamp-1">{page.subheadline}</p>
                  {magnet && (
                    <p className="text-[10px] text-atelier-muted">
                      Magnet: {magnet.title}
                    </p>
                  )}
                </div>
                <div className="flex border-t border-atelier-border divide-x divide-atelier-border">
                  <button
                    onClick={() => onNavigate(AppPage.PUBLIC_LANDING, page.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-atelier-muted hover:text-atelier-ink hover:bg-atelier-bg/50 transition-elegant"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-rose-500 hover:bg-rose-50 transition-elegant"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandingPageBuilder;
