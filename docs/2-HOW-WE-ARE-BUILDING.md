# How We Are Building It

## Architecture Overview

GrowLeads is a **client-side single-page application** with no backend server. All data lives in the browser's localStorage, and AI generation calls go directly from the client to the Google Gemini API.

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  React   │  │  Storage     │  │  Gemini       │  │
│  │  UI      │──│  Service     │  │  Service      │  │
│  │  (11     │  │  (localStorage│  │  (API calls)  │  │
│  │  comps)  │  │   CRUD ops)  │  │               │  │
│  └──────────┘  └──────────────┘  └───────┬───────┘  │
│                                          │           │
└──────────────────────────────────────────┼───────────┘
                                           │
                                    ┌──────▼──────┐
                                    │  Google     │
                                    │  Gemini API │
                                    │  (2.5 Flash)│
                                    └─────────────┘
```

## Project Structure

```
s4pphire/
├── index.html              # Entry point, Tailwind config, design tokens, CSS
├── index.tsx               # React root mount
├── App.tsx                 # Router + layout (sidebar + main content)
├── types.ts                # All TypeScript enums, interfaces, types
├── vite.config.ts          # Vite build config + env vars
│
├── services/
│   ├── geminiService.ts    # AI generation (generate, repurpose, landing copy)
│   └── storageService.ts   # localStorage CRUD for all entities
│
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar with logo
│   ├── Dashboard.tsx       # Overview with stats and recent magnets
│   ├── GeneratorForm.tsx   # Lead magnet creation form
│   ├── RepurposeForm.tsx   # Adapt existing magnet for new audience
│   ├── Library.tsx         # Resource vault (grid view with filters)
│   ├── MagnetViewer.tsx    # Preview, edit, export, metrics for a magnet
│   ├── LandingPageBuilder.tsx  # Create gated landing pages
│   ├── PublicLanding.tsx   # Public-facing lead capture page
│   ├── LeadsList.tsx       # Captured leads table
│   ├── Analytics.tsx       # Performance dashboards
│   └── Icon.tsx            # Lucide icon re-exports
│
└── docs/                   # Project documentation
```

## How Each Layer Works

### 1. Routing (App.tsx)
- Uses a `page` state enum (`AppPage`) instead of URL-based routing
- `navigate(page, id?)` function passed to all components
- Sidebar is persistent; main content area swaps based on current page
- Public landing pages get a full-screen layout (no sidebar)

### 2. AI Generation (geminiService.ts)
Three AI functions, all using Google Gemini 2.5 Flash:

**`generateLeadMagnet(input)`**
- Takes: niche, persona, pain point, format, category, lead goal, channels
- Looks up format-specific structural instructions from `FORMAT_STRUCTURES` map
- Sends a prompt with the user's parameters + structural requirements
- Returns: `{ title, content }` as structured JSON via Gemini's response schema

**`repurposeLeadMagnet(content, niche, persona, context)`**
- Takes existing content and new target parameters
- Instructs the AI to preserve format structure while adapting all examples
- Returns: `{ title, content, changeNotes }`

**`generateLandingPageCopy(title, content, niche, persona)`**
- Takes a magnet's details and generates landing page copy
- Returns: `{ headline, subheadline, bullets[], ctaText }`

### 3. Storage (storageService.ts)
Four localStorage collections, each with full CRUD:

| Collection | Key | Entity |
|-----------|-----|--------|
| Lead Magnets | `growleads_magnets` | `LeadMagnet` |
| Landing Pages | `growleads_landing_pages` | `LandingPage` |
| Captured Leads | `growleads_leads` | `CapturedLead` |
| Metrics | `growleads_metrics` | `MagnetMetrics` |

Key behaviors:
- `saveMagnet()` auto-creates a metrics entry for new magnets
- `deleteMagnet()` cascades to delete related metrics and landing pages
- `saveLead()` auto-increments opt-in and download counts
- `getAnalyticsSummary()` aggregates all metrics into a dashboard view
- IDs are generated with `Date.now().toString(36) + random`

### 4. Markdown Rendering (MagnetViewer.tsx)
The `renderContent()` function converts AI-generated markdown to HTML:

1. **Code blocks** — extracted first, replaced with placeholders to protect from other regex passes
2. **Tables** — pipe-delimited markdown tables converted to `<table>` HTML
3. **Checkboxes** — `- [ ]` and `- [x]` converted to interactive checkbox elements
4. **Blockquotes** — `>` lines wrapped in `<blockquote>`
5. **Headers** — h1 through h4
6. **Bold/italic** — standard markdown inline formatting
7. **Inline code** — backtick-wrapped text
8. **Placeholder tokens** — `[LIKE_THIS]` highlighted in amber
9. **Lists** — unordered and ordered, wrapped in `<ul>`
10. **Paragraphs** — double newlines create paragraph breaks

CSS styling for all rendered elements is defined in `index.html` under the `.magnet-content` class.

### 5. Design System (index.html)
All design tokens are defined in the Tailwind CDN config:

**Colors** (`gl-*` namespace):
- `gl-bg`: #F8FAFC (page background)
- `gl-card`: #FFFFFF (card surfaces)
- `gl-ink`: #0F172A (primary text)
- `gl-muted`: #64748B (secondary text)
- `gl-border`: #E2E8F0 (borders/dividers)
- `gl-accent`: #CBD5E1 (decorative accents)
- `gl-blue`: #2563EB (primary brand / CTAs)
- `gl-blue-light`: #DBEAFE (light blue backgrounds)
- `gl-blue-dark`: #1D4ED8 (hover states)

**Typography**:
- Body: Inter (weights 300-800)
- Headings: Space Grotesk via `.heading` class (weight 700)

**Utility classes**:
- `.transition-elegant` — 0.2s ease all transitions
- `.shadow-soft` — subtle card shadows
- `.shadow-elegant` — hover state shadows

## Build & Run

```bash
# Install dependencies
npm install

# Set Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Start dev server
npm run dev    # → http://localhost:3000
```

Vite injects the API key at build time via `process.env.API_KEY`.

## Key Design Decisions

1. **No backend** — localStorage keeps it simple and deployable anywhere. Trade-off: data is browser-local only.
2. **Tailwind via CDN** — no build-time purging, all utility classes available. Enables rapid prototyping.
3. **Format-specific prompts** — each of the 10 formats has its own structural template (~30-60 lines) that the AI must follow. This ensures a Checklist actually has checkboxes, a Scorecard has tables, etc.
4. **Gemini structured output** — using `responseMimeType: 'application/json'` with a response schema guarantees parseable output.
5. **Regex-based markdown** — lighter than a full markdown parser library. Handles the specific patterns the AI produces.
6. **State-based routing** — simpler than React Router for a single-page app with no URL sharing requirements.
