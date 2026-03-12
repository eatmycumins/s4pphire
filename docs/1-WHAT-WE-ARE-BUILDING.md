# What Are We Building?

## Product Name
**GrowLeads — Lead Magnet Engine**

## One-Liner
An AI-powered web application that lets B2B growth teams generate, manage, and distribute high-conversion lead magnets in minutes — not days.

## The Problem
B2B companies need lead magnets (playbooks, checklists, frameworks, swipe files, etc.) to capture qualified prospects through LinkedIn, cold email, landing pages, and newsletters. Today, creating one takes 5-15 hours of writing, designing, and formatting. Most teams either skip it entirely or produce generic, low-quality PDFs that fail to convert.

## The Solution
GrowLeads is a single-page React application where users:

1. **Define their target** — niche, persona, pain point, lead goal, distribution channels
2. **Pick a format** — choose from 10 structurally distinct lead magnet formats
3. **Generate with AI** — Google Gemini produces a format-specific, niche-relevant lead magnet with proper markdown structure
4. **Review and edit** — full markdown preview with interactive checkboxes, tables, code blocks, and copy-paste support
5. **Distribute** — create gated landing pages with forms, capture leads, and track performance

## The 10 Lead Magnet Formats

| Format | What It Produces |
|--------|-----------------|
| Playbook | Multi-chapter strategic guide with frameworks, case studies, and execution timelines |
| Checklist | Sequential checkbox items organized by phases (30-40 actionable items) |
| Framework | Named thinking model with stages, inputs/outputs, and evaluation criteria |
| Swipe File | Collection of copy-paste ready templates with context and customization tips |
| Template | Fill-in-the-blank document with [PLACEHOLDERS] and worked examples |
| Guide | Step-by-step instructional walkthrough with pro tips and common mistakes |
| Audit | Scoring rubric with rating scales, interpretation ranges, and action items |
| Scorecard | Numerical evaluation with weighted criteria and industry benchmarks |
| Prompt Pack | Collection of AI prompts organized by use case with chaining workflows |
| Toolkit | Bundle of mini-templates, checklists, frameworks, and swipe files |

## Core Capabilities

### Generate
- AI-powered lead magnet creation using Google Gemini 2.5 Flash
- Format-specific structural prompts (each format has its own template the AI must follow)
- Niche-aware content with real examples, not generic advice

### Repurpose
- Take any existing lead magnet and adapt it for a new niche/audience
- Preserves format structure while swapping all examples and terminology
- Supports both library assets and pasted custom content

### Manage
- Resource Vault (library) with search, status filters, format filters, niche filters
- Status workflow: Draft → Published → Archived
- Edit content in-place with markdown editing
- Copy to clipboard, export as .md file

### Distribute
- Landing page builder with AI-generated copy (headline, subheadline, bullets, CTA)
- Gated download forms (name, email, company, role)
- Lead capture with automatic opt-in/download metric tracking

### Track
- Per-magnet metrics: downloads, opt-ins, replies, meetings booked, revenue
- Analytics dashboard with performance by niche and format
- Leads list with search, filtering, and CSV export

## Target Users
- B2B agency founders and growth leads
- SaaS marketing teams
- SDR/BDR teams running outbound campaigns
- Consultants and freelancers building lead pipelines
- RevOps and demand gen managers

## Tech Stack
- **Frontend**: React 19 + TypeScript (single-page app)
- **Styling**: Tailwind CSS via CDN with custom `gl` design tokens
- **Fonts**: Inter (body) + Space Grotesk (headings)
- **AI**: Google Gemini 2.5 Flash via `@google/genai` SDK
- **Storage**: Browser localStorage (no backend)
- **Icons**: Lucide React
- **Build**: Vite

## Brand Identity
- **Primary color**: Blue (#2563EB) — used for all CTAs, active states, and brand elements
- **Background**: Light slate (#F8FAFC)
- **Text**: Slate-900 (#0F172A)
- **Logo**: Blue rounded square with leaf/growth SVG icon
- **Tone**: Professional, clean, modern SaaS aesthetic
