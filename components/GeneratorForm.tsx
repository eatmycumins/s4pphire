import React, { useState } from 'react';
import {
  MagnetFormat,
  MagnetCategory,
  CampaignChannel,
  GenerateInput,
  LeadMagnet,
  LeadMagnetStatus,
  AppPage,
} from '../types';
import { generateLeadMagnet } from '../services/geminiService';
import { saveMagnet, generateId } from '../services/storageService';
import { Loader2, Sparkles, Zap, Lightbulb } from './Icon';

interface GeneratorFormProps {
  onNavigate: (page: AppPage, magnetId?: string) => void;
  onMagnetsChange: () => void;
}

const NICHE_SUGGESTIONS = ['SaaS', 'B2B Agencies', 'Consulting Firms', 'AI Startups', 'Recruiting Agencies', 'FinTech', 'E-Commerce B2B', 'MarTech'];
const PERSONA_SUGGESTIONS = ['Founders / CEOs', 'Growth Leads', 'Marketing Heads', 'SDR Teams', 'Demand Gen Managers', 'VP of Sales', 'RevOps Leaders'];
const PAIN_SUGGESTIONS = ['Inconsistent lead flow', 'Poor outbound conversion', 'Weak LinkedIn pipeline', 'Low cold email response rates', 'Unqualified leads', 'High CAC', 'No repeatable process'];
const GOAL_SUGGESTIONS = ['Book a strategy call', 'Request a lead gen audit', 'Join the newsletter', 'Reply to outreach', 'Schedule a demo', 'Download resource'];

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onNavigate, onMagnetsChange }) => {
  const [input, setInput] = useState<GenerateInput>({
    niche: '',
    persona: '',
    painPoint: '',
    format: MagnetFormat.PLAYBOOK,
    category: MagnetCategory.EDUCATIONAL,
    leadGoal: '',
    channels: [CampaignChannel.WEBSITE],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.niche || !input.persona || !input.painPoint || !input.leadGoal) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await generateLeadMagnet(input);
      const magnet: LeadMagnet = {
        id: generateId(),
        title: result.title,
        niche: input.niche,
        persona: input.persona,
        painPoint: input.painPoint,
        format: input.format,
        category: input.category,
        leadGoal: input.leadGoal,
        content: result.content,
        status: LeadMagnetStatus.DRAFT,
        channels: input.channels,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveMagnet(magnet);
      onMagnetsChange();
      onNavigate(AppPage.VIEW_MAGNET, magnet.id);
    } catch (err: any) {
      setError(err.message || 'Generation failed. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleChannel = (ch: CampaignChannel) => {
    setInput((prev) => ({
      ...prev,
      channels: prev.channels.includes(ch)
        ? prev.channels.filter((c) => c !== ch)
        : [...prev.channels, ch],
    }));
  };

  const SuggestionChips = ({ suggestions, value, onSelect }: { suggestions: string[]; value: string; onSelect: (v: string) => void }) => (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className={`text-[11px] px-2.5 py-1 rounded-full border transition-elegant ${
            value === s ? 'bg-atelier-ink text-white border-atelier-ink' : 'border-atelier-border text-atelier-muted hover:border-atelier-ink hover:text-atelier-ink'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h2 className="serif-heading text-2xl md:text-3xl text-atelier-ink flex items-center gap-3">
          <Sparkles className="w-7 h-7" />
          New Lead Magnet
        </h2>
        <p className="text-sm text-atelier-muted mt-1">
          Define your target parameters and the AI will generate a high-conversion lead magnet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Niche */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">
            Target Niche <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={input.niche}
            onChange={(e) => setInput((p) => ({ ...p, niche: e.target.value }))}
            placeholder="e.g., SaaS, B2B Agencies, AI Startups..."
            className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant"
          />
          <SuggestionChips suggestions={NICHE_SUGGESTIONS} value={input.niche} onSelect={(v) => setInput((p) => ({ ...p, niche: v }))} />
        </div>

        {/* Persona */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">
            Target Persona <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={input.persona}
            onChange={(e) => setInput((p) => ({ ...p, persona: e.target.value }))}
            placeholder="e.g., Founders, Growth Leads, SDR Teams..."
            className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant"
          />
          <SuggestionChips suggestions={PERSONA_SUGGESTIONS} value={input.persona} onSelect={(v) => setInput((p) => ({ ...p, persona: v }))} />
        </div>

        {/* Pain Point */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">
            Pain Point <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={input.painPoint}
            onChange={(e) => setInput((p) => ({ ...p, painPoint: e.target.value }))}
            placeholder="e.g., Inconsistent lead flow, poor outbound conversion..."
            className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant"
          />
          <SuggestionChips suggestions={PAIN_SUGGESTIONS} value={input.painPoint} onSelect={(v) => setInput((p) => ({ ...p, painPoint: v }))} />
        </div>

        {/* Format + Category */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
            <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">Format</label>
            <select
              value={input.format}
              onChange={(e) => setInput((p) => ({ ...p, format: e.target.value as MagnetFormat }))}
              className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant bg-white"
            >
              {Object.values(MagnetFormat).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
            <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">Category</label>
            <select
              value={input.category}
              onChange={(e) => setInput((p) => ({ ...p, category: e.target.value as MagnetCategory }))}
              className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant bg-white"
            >
              {Object.values(MagnetCategory).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lead Goal */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">
            Lead Goal <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={input.leadGoal}
            onChange={(e) => setInput((p) => ({ ...p, leadGoal: e.target.value }))}
            placeholder="e.g., Book a strategy call, join newsletter..."
            className="w-full px-3 py-2 border border-atelier-border rounded-lg text-sm font-sans focus:outline-none focus:border-atelier-ink transition-elegant"
          />
          <SuggestionChips suggestions={GOAL_SUGGESTIONS} value={input.leadGoal} onSelect={(v) => setInput((p) => ({ ...p, leadGoal: v }))} />
        </div>

        {/* Channels */}
        <div className="bg-white rounded-xl border border-atelier-border shadow-soft p-5">
          <label className="block text-sm font-sans font-medium text-atelier-ink mb-2">Distribution Channels</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(CampaignChannel).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => toggleChannel(ch)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-elegant ${
                  input.channels.includes(ch) ? 'bg-atelier-ink text-white border-atelier-ink' : 'border-atelier-border text-atelier-muted hover:border-atelier-ink'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-atelier-ink text-white font-sans font-medium rounded-xl hover:bg-atelier-ink/90 transition-elegant disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Lead Magnet...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Lead Magnet
            </>
          )}
        </button>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Lightbulb className="w-4 h-4" />
              The AI is crafting your lead magnet. This typically takes 15-30 seconds...
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default GeneratorForm;
