import React, { useState } from 'react';
import {
  AppPage,
  LeadMagnet,
  LeadMagnetStatus,
  MagnetCategory,
  CampaignChannel,
} from '../types';
import { repurposeLeadMagnet } from '../services/geminiService';
import { saveMagnet, generateId } from '../services/storageService';
import { Loader2, RefreshCw, Lightbulb } from './Icon';

interface RepurposeFormProps {
  magnets: LeadMagnet[];
  onNavigate: (page: AppPage, magnetId?: string) => void;
  onMagnetsChange: () => void;
}

const RepurposeForm: React.FC<RepurposeFormProps> = ({ magnets, onNavigate, onMagnetsChange }) => {
  const [selectedId, setSelectedId] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [newNiche, setNewNiche] = useState('');
  const [newPersona, setNewPersona] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const selectedMagnet = magnets.find((m) => m.id === selectedId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = useCustom ? customContent : selectedMagnet?.content;
    if (!content || !newNiche || !newPersona) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await repurposeLeadMagnet(content, newNiche, newPersona, additionalContext);
      const magnet: LeadMagnet = {
        id: generateId(),
        title: result.title,
        niche: newNiche,
        persona: newPersona,
        painPoint: selectedMagnet?.painPoint || '',
        format: selectedMagnet?.format || magnets[0]?.format || 'Playbook' as any,
        category: selectedMagnet?.category || MagnetCategory.EDUCATIONAL,
        leadGoal: selectedMagnet?.leadGoal || '',
        content: result.content,
        status: LeadMagnetStatus.DRAFT,
        channels: selectedMagnet?.channels || [CampaignChannel.WEBSITE],
        parentId: selectedMagnet?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveMagnet(magnet);
      onMagnetsChange();
      onNavigate(AppPage.VIEW_MAGNET, magnet.id);
    } catch (err: any) {
      setError(err.message || 'Repurposing failed. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h2 className="serif-heading text-2xl md:text-3xl text-atelier-ink flex items-center gap-3">
          <RefreshCw className="w-7 h-7" />
          Repurpose Asset
        </h2>
        <p className="text-sm text-atelier-muted mt-1">
          Take an existing lead magnet and adapt it for a new niche and audience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Source Selection */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-2">Source Content</label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUseCustom(false)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-elegant ${
                !useCustom ? 'bg-atelier-ink text-white border-atelier-ink' : 'border-atelier-border text-atelier-muted'
              }`}
            >
              From Library
            </button>
            <button
              type="button"
              onClick={() => setUseCustom(true)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-elegant ${
                useCustom ? 'bg-atelier-ink text-white border-atelier-ink' : 'border-atelier-border text-atelier-muted'
              }`}
            >
              Paste Content
            </button>
          </div>

          {!useCustom ? (
            magnets.length === 0 ? (
              <p className="text-sm text-atelier-muted">
                No lead magnets in your library yet.{' '}
                <button type="button" onClick={() => onNavigate(AppPage.GENERATE)} className="text-atelier-highlight hover:underline">
                  Create one first
                </button>
                {' '}or paste custom content.
              </p>
            ) : (
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant bg-white"
              >
                <option value="">Select a lead magnet...</option>
                {magnets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.niche})
                  </option>
                ))}
              </select>
            )
          ) : (
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Paste your existing lead magnet, guide, checklist, or framework content here..."
              rows={8}
              className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant resize-y"
            />
          )}

          {selectedMagnet && !useCustom && (
            <div className="mt-3 p-3 bg-atelier-bg rounded-lg">
              <p className="text-xs text-atelier-muted mb-1">Selected:</p>
              <p className="text-sm font-medium text-atelier-ink">{selectedMagnet.title}</p>
              <p className="text-xs text-atelier-muted mt-0.5">
                {selectedMagnet.niche} &middot; {selectedMagnet.format} &middot; {selectedMagnet.persona}
              </p>
            </div>
          )}
        </div>

        {/* New Niche */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">
            New Niche <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={newNiche}
            onChange={(e) => setNewNiche(e.target.value)}
            placeholder="e.g., AI Startups, Recruiting Firms..."
            className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant"
          />
        </div>

        {/* New Persona */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">
            New Target Persona <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={newPersona}
            onChange={(e) => setNewPersona(e.target.value)}
            placeholder="e.g., Founders, Growth Leads..."
            className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant"
          />
        </div>

        {/* Additional Context */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">Additional Context</label>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Any specific instructions, focus areas, or nuances for this adaptation..."
            rows={3}
            className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant resize-y"
          />
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-atelier-ink text-white font-sans font-medium rounded-xl hover:bg-atelier-ink/90 transition-elegant disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Repurposing Asset...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Repurpose for New Audience
            </>
          )}
        </button>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Lightbulb className="w-4 h-4" />
              Adapting your content for the new audience. This typically takes 15-30 seconds...
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RepurposeForm;
