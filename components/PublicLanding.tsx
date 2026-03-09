import React, { useState } from 'react';
import { AppPage, LandingPage, CapturedLead } from '../types';
import { getMagnet, saveLead, generateId } from '../services/storageService';
import { ArrowLeft, Check, Download, Sparkles } from './Icon';

interface PublicLandingProps {
  landingPage: LandingPage;
  onNavigate: (page: AppPage) => void;
}

const PublicLanding: React.FC<PublicLandingProps> = ({ landingPage, onNavigate }) => {
  const magnet = getMagnet(landingPage.magnetId);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    landingPage.formFields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.name])) {
        newErrors[field.name] = 'Please enter a valid email';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save lead
    const lead: CapturedLead = {
      id: generateId(),
      magnetId: landingPage.magnetId,
      landingPageId: landingPage.id,
      name: formData['name'] || '',
      email: formData['email'] || '',
      company: formData['company'],
      role: formData['role'],
      capturedAt: new Date().toISOString(),
    };

    saveLead(lead);
    setSubmitted(true);
  };

  const handleDownload = () => {
    if (!magnet) return;
    const blob = new Blob([magnet.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${magnet.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-atelier-bg flex flex-col">
      {/* Back button */}
      <div className="px-6 py-4">
        <button
          onClick={() => onNavigate(AppPage.LANDING_PAGES)}
          className="flex items-center gap-1.5 text-xs text-atelier-muted hover:text-atelier-ink transition-elegant"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {submitted ? (
            /* Success State */
            <div className="bg-white rounded-2xl border border-atelier-border shadow-elegant p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="serif-heading text-2xl text-atelier-ink mb-2">You're In!</h2>
              <p className="text-sm text-atelier-muted mb-6">
                Your download is ready. Click below to get your resource.
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-atelier-ink text-white font-sans font-medium rounded-xl hover:bg-atelier-ink/90 transition-elegant"
              >
                <Download className="w-5 h-5" />
                Download {magnet?.format || 'Resource'}
              </button>
              <p className="text-[11px] text-atelier-muted mt-6">
                A copy has also been sent to {formData['email']}.
              </p>
            </div>
          ) : (
            /* Form State */
            <div className="animate-fade-in">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 text-[10px] text-atelier-muted bg-white border border-atelier-border rounded-full px-3 py-1 mb-4">
                  <Sparkles className="w-3 h-3" /> FREE RESOURCE
                </div>
                <h1 className="serif-heading text-3xl md:text-4xl text-atelier-ink mb-3 leading-tight">
                  {landingPage.headline}
                </h1>
                {landingPage.subheadline && (
                  <p className="text-base text-atelier-muted max-w-md mx-auto">
                    {landingPage.subheadline}
                  </p>
                )}
              </div>

              {/* Bullets */}
              {landingPage.bulletPoints.length > 0 && (
                <div className="bg-white rounded-xl border border-atelier-border p-5 mb-6">
                  <p className="text-xs font-sans font-medium text-atelier-muted uppercase tracking-wide mb-3">What you'll get:</p>
                  <ul className="space-y-2.5">
                    {landingPage.bulletPoints.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-atelier-ink">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Form */}
              <div className="bg-white rounded-2xl border border-atelier-border shadow-elegant p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {landingPage.formFields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-sans font-medium text-atelier-ink mb-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => {
                          setFormData((p) => ({ ...p, [field.name]: e.target.value }));
                          setErrors((p) => ({ ...p, [field.name]: '' }));
                        }}
                        placeholder={field.label}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm font-sans focus:outline-none transition-elegant ${
                          errors[field.name] ? 'border-rose-300 focus:border-rose-500' : 'border-atelier-border focus:border-atelier-ink'
                        }`}
                      />
                      {errors[field.name] && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors[field.name]}</p>
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-atelier-ink text-white font-sans font-medium rounded-xl hover:bg-atelier-ink/90 transition-elegant"
                  >
                    <Download className="w-5 h-5" />
                    {landingPage.ctaText}
                  </button>

                  <p className="text-[10px] text-center text-atelier-muted/60">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;
