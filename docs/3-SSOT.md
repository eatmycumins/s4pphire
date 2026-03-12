# Single Source of Truth (SSOT)

This document defines the authoritative reference for every entity, enum, token, file, and convention in the GrowLeads codebase. When in doubt, this is what's true.

---

## 1. File Authority Map

Every piece of the system has exactly one authoritative file:

| Concern | Authoritative File | Notes |
|---------|-------------------|-------|
| Type definitions (all enums, interfaces) | `types.ts` | Every data shape in the app is defined here and nowhere else |
| Design tokens (colors, fonts, shadows) | `index.html` (Tailwind config + CSS) | All `gl-*` colors, font families, animations, and `.magnet-content` styles |
| AI generation logic | `services/geminiService.ts` | All Gemini API calls, format prompt templates, system instructions |
| Data persistence (CRUD) | `services/storageService.ts` | All localStorage read/write operations, ID generation, analytics aggregation |
| App routing & layout | `App.tsx` | Page state management, sidebar/main layout, public landing full-screen mode |
| Navigation structure | `components/Sidebar.tsx` | `NAV_ITEMS` array defines all pages, labels, icons, and section groupings |
| Icon exports | `components/Icon.tsx` | All Lucide icon re-exports — components import from here, not from `lucide-react` directly |

---

## 2. Enums (Defined in `types.ts`)

### AppPage — Application Routes
```
DASHBOARD | GENERATE | REPURPOSE | LIBRARY | VIEW_MAGNET | LANDING_PAGES | PUBLIC_LANDING | LEADS | ANALYTICS
```

### MagnetFormat — Lead Magnet Types
```
Playbook | Checklist | Framework | Swipe File | Template | Guide | Audit | Scorecard | Prompt Pack | Toolkit
```

### MagnetCategory — Content Categories
```
Educational | Tactical | Diagnostic | AI-Based
```

### CampaignChannel — Distribution Channels
```
LinkedIn | Website | Cold Email | DM Outreach | Newsletter | Landing Page
```

### LeadMagnetStatus — Lifecycle States
```
Draft → Published → Archived
```

---

## 3. Data Models (Defined in `types.ts`)

### LeadMagnet
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique ID (base36 timestamp + random) |
| title | string | yes | AI-generated or user-edited title |
| niche | string | yes | Target industry/vertical |
| persona | string | yes | Target job role/audience |
| painPoint | string | yes | Problem the magnet addresses |
| format | MagnetFormat | yes | Structural format type |
| category | MagnetCategory | yes | Content category |
| leadGoal | string | yes | Desired action (e.g., "Book a strategy call") |
| content | string | yes | Full markdown content |
| status | LeadMagnetStatus | yes | Draft / Published / Archived |
| channels | CampaignChannel[] | yes | Distribution channels |
| parentId | string | no | ID of source magnet if repurposed |
| createdAt | string (ISO) | yes | Creation timestamp |
| updatedAt | string (ISO) | yes | Last update timestamp |

### LandingPage
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique ID |
| magnetId | string | yes | Associated lead magnet |
| headline | string | yes | Page headline |
| subheadline | string | yes | Supporting text |
| bulletPoints | string[] | yes | Benefit bullets |
| ctaText | string | yes | Button text |
| formFields | FormField[] | yes | Form configuration |
| isActive | boolean | yes | Whether page is live |
| createdAt | string (ISO) | yes | Creation timestamp |

### CapturedLead
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique ID |
| magnetId | string | yes | Which magnet captured this lead |
| landingPageId | string | yes | Which landing page |
| name | string | yes | Lead's full name |
| email | string | yes | Lead's email |
| company | string | no | Lead's company |
| role | string | no | Lead's job title |
| capturedAt | string (ISO) | yes | Capture timestamp |

### MagnetMetrics
| Field | Type | Description |
|-------|------|-------------|
| magnetId | string | Associated magnet ID |
| downloads | number | Total download count |
| optIns | number | Form submission count |
| replies | number | Outreach reply count |
| meetings | number | Meetings booked |
| revenue | number | Revenue attributed ($) |

---

## 4. localStorage Keys (Defined in `services/storageService.ts`)

| Key | Entity Array | Description |
|-----|-------------|-------------|
| `growleads_magnets` | `LeadMagnet[]` | All lead magnets |
| `growleads_landing_pages` | `LandingPage[]` | All landing pages |
| `growleads_leads` | `CapturedLead[]` | All captured leads |
| `growleads_metrics` | `MagnetMetrics[]` | Per-magnet performance metrics |

---

## 5. Design Tokens (Defined in `index.html`)

### Colors (`gl-*` Tailwind namespace)
| Token | Hex | Usage |
|-------|-----|-------|
| `gl-bg` | #F8FAFC | Page background |
| `gl-card` | #FFFFFF | Card surfaces |
| `gl-ink` | #0F172A | Primary text |
| `gl-muted` | #64748B | Secondary/helper text |
| `gl-border` | #E2E8F0 | Borders, dividers |
| `gl-accent` | #CBD5E1 | Decorative/empty state icons |
| `gl-blue` | #2563EB | Primary brand, CTAs, active states |
| `gl-blue-light` | #DBEAFE | Light blue backgrounds |
| `gl-blue-dark` | #1D4ED8 | Hover states on blue buttons |

### Typography
| Usage | Font | Weight | Class |
|-------|------|--------|-------|
| Body text | Inter | 400 | (default) |
| Labels/meta | Inter | 500 | `font-medium` |
| Headings | Space Grotesk | 700 | `.heading` |

### Shadows
| Token | Usage |
|-------|-------|
| `shadow-soft` | Default card shadow |
| `shadow-elegant` | Hover/elevated card shadow |

### Animations
| Token | Effect |
|-------|--------|
| `animate-fade-in` | 0.5s ease-out opacity |
| `animate-slide-up` | 0.4s ease-out opacity + translateY |

---

## 6. AI Configuration (Defined in `services/geminiService.ts`)

| Setting | Value |
|---------|-------|
| Model | `gemini-2.5-flash` |
| API Key Source | `process.env.API_KEY` (injected by Vite from `.env` `GEMINI_API_KEY`) |
| Response Format | `application/json` with typed schema |
| Format Prompts | `FORMAT_STRUCTURES` map — 10 entries, one per `MagnetFormat` enum value |

### AI Functions
| Function | Input | Output |
|----------|-------|--------|
| `generateLeadMagnet` | `GenerateInput` | `{ title, content }` |
| `repurposeLeadMagnet` | content, niche, persona, context | `{ title, content, changeNotes }` |
| `generateLandingPageCopy` | title, content, niche, persona | `{ headline, subheadline, bullets[], ctaText }` |

---

## 7. Component Responsibilities

| Component | Owns | Does NOT Own |
|-----------|------|-------------|
| `App.tsx` | Routing state, layout, magnet list refresh | Page-specific logic |
| `Sidebar.tsx` | Navigation items, logo, mobile drawer | Page content |
| `Dashboard.tsx` | Stats display, recent magnets list | Data fetching (uses storageService) |
| `GeneratorForm.tsx` | Form state, validation, format descriptions | AI call logic (uses geminiService) |
| `RepurposeForm.tsx` | Source selection, new params form | AI call logic |
| `Library.tsx` | Search, filter state, grid rendering | Magnet CRUD |
| `MagnetViewer.tsx` | Markdown rendering, edit mode, metrics form | Navigation |
| `LandingPageBuilder.tsx` | Page creation form, AI copy generation | Lead capture |
| `PublicLanding.tsx` | Form rendering, validation, lead saving | Page management |
| `LeadsList.tsx` | Lead table, search, CSV export | Lead creation |
| `Analytics.tsx` | Charts, aggregation display | Metric writes |

---

## 8. Conventions

### Naming
- Tailwind color classes: `gl-{token}` (e.g., `text-gl-ink`, `bg-gl-blue`)
- CSS custom classes: kebab-case (e.g., `magnet-content`, `transition-elegant`)
- TypeScript enums: PascalCase values (e.g., `MagnetFormat.PLAYBOOK`)
- Component files: PascalCase (e.g., `MagnetViewer.tsx`)
- Service files: camelCase (e.g., `geminiService.ts`)

### Button Hierarchy
- **Primary CTA**: `bg-gl-blue text-white hover:bg-gl-blue-dark` (Generate, Create, Export)
- **Secondary**: `border border-gl-border hover:bg-gl-bg` (Edit, Copy, Repurpose)
- **Destructive**: `text-rose-600 border-rose-200 hover:bg-rose-50` (Delete)
- **Selected chip/toggle**: `bg-gl-blue text-white border-gl-blue`
- **Unselected chip**: `border-gl-border text-gl-muted`

### Form Inputs
- Base: `border border-gl-border rounded-lg text-sm focus:outline-none focus:border-gl-blue`
- Error: `border-rose-300 focus:border-rose-500`

### Card Pattern
- Container: `bg-white rounded-xl border border-gl-border shadow-soft`
- Hover (interactive): add `hover:shadow-elegant transition-elegant`
- Header section: `border-b border-gl-border px-5 py-4`

### Status Badges
- Draft: `bg-amber-50 text-amber-700`
- Published: `bg-green-50 text-green-700`
- Archived: `bg-gray-100 text-gray-500`

---

## 9. Environment Variables

| Variable | Location | Used By |
|----------|----------|---------|
| `GEMINI_API_KEY` | `.env` file (root) | `vite.config.ts` → injected as `process.env.API_KEY` |

---

## 10. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | UI framework |
| `react-dom` | ^19.2.0 | React DOM rendering |
| `@google/genai` | ^1.30.0 | Google Gemini API SDK |
| `lucide-react` | ^0.555.0 | Icon library |
| `@vitejs/plugin-react` | (dev) | Vite React plugin |
| `vite` | (dev) | Build tool |
| `typescript` | (dev) | Type checking |

All runtime dependencies are loaded via import maps from `aistudiocdn.com` (CDN). Vite handles the dev server and env injection.
