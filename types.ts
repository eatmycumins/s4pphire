// ============================================================
// GrowLeads Lead Magnet Generator — Type Definitions
// ============================================================

// --- Enums ---

export enum AppPage {
  DASHBOARD = 'DASHBOARD',
  GENERATE = 'GENERATE',
  REPURPOSE = 'REPURPOSE',
  LIBRARY = 'LIBRARY',
  VIEW_MAGNET = 'VIEW_MAGNET',
  LANDING_PAGES = 'LANDING_PAGES',
  PUBLIC_LANDING = 'PUBLIC_LANDING',
  LEADS = 'LEADS',
  ANALYTICS = 'ANALYTICS',
}

export enum MagnetFormat {
  PLAYBOOK = 'Playbook',
  CHECKLIST = 'Checklist',
  FRAMEWORK = 'Framework',
  SWIPE_FILE = 'Swipe File',
  TEMPLATE = 'Template',
  GUIDE = 'Guide',
  AUDIT = 'Audit',
  SCORECARD = 'Scorecard',
  PROMPT_PACK = 'Prompt Pack',
  TOOLKIT = 'Toolkit',
}

export enum MagnetCategory {
  EDUCATIONAL = 'Educational',
  TACTICAL = 'Tactical',
  DIAGNOSTIC = 'Diagnostic',
  AI_BASED = 'AI-Based',
}

export enum CampaignChannel {
  LINKEDIN = 'LinkedIn',
  WEBSITE = 'Website',
  COLD_EMAIL = 'Cold Email',
  DM_OUTREACH = 'DM Outreach',
  NEWSLETTER = 'Newsletter',
  LANDING_PAGE = 'Landing Page',
}

export enum LeadMagnetStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
}

// --- Core Data Models ---

export interface LeadMagnet {
  id: string;
  title: string;
  niche: string;
  persona: string;
  painPoint: string;
  format: MagnetFormat;
  category: MagnetCategory;
  leadGoal: string;
  content: string;
  status: LeadMagnetStatus;
  channels: CampaignChannel[];
  parentId?: string; // If repurposed from another magnet
  createdAt: string;
  updatedAt: string;
}

export interface LandingPage {
  id: string;
  magnetId: string;
  headline: string;
  subheadline: string;
  bulletPoints: string[];
  ctaText: string;
  formFields: FormField[];
  isActive: boolean;
  createdAt: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email';
  required: boolean;
}

export interface CapturedLead {
  id: string;
  magnetId: string;
  landingPageId: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  capturedAt: string;
}

export interface MagnetMetrics {
  magnetId: string;
  downloads: number;
  optIns: number;
  replies: number;
  meetings: number;
  revenue: number;
}

// --- Form Inputs ---

export interface GenerateInput {
  niche: string;
  persona: string;
  painPoint: string;
  format: MagnetFormat;
  category: MagnetCategory;
  leadGoal: string;
  channels: CampaignChannel[];
}

export interface RepurposeInput {
  originalMagnetId: string;
  originalContent: string;
  newNiche: string;
  newPersona: string;
  additionalContext: string;
}

// --- AI Service ---

export interface GenerationResult {
  title: string;
  content: string;
}

export interface RepurposeResult {
  title: string;
  content: string;
  changeNotes: string;
}

// --- Analytics ---

export interface AnalyticsSummary {
  totalMagnets: number;
  publishedMagnets: number;
  totalDownloads: number;
  totalOptIns: number;
  totalMeetings: number;
  totalRevenue: number;
  topNiches: { niche: string; count: number }[];
  topFormats: { format: string; count: number }[];
  recentLeads: CapturedLead[];
}
