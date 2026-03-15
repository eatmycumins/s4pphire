// ============================================================
// GrowLeads — AI Generation Service (Google Gemini)
// Format-specific lead magnet generation
// ============================================================

import { GoogleGenAI, Type } from '@google/genai';
import { GenerateInput, GenerationResult, RepurposeResult, MagnetFormat, LeadMagnet, MagnetImages } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL = 'gemini-2.5-flash';

// --- Format-Specific Structural Instructions ---

const FORMAT_STRUCTURES: Record<MagnetFormat, string> = {
  [MagnetFormat.PLAYBOOK]: `Structure this as a multi-chapter STRATEGIC PLAYBOOK.

Required structure:
# [Strong Title] — The Definitive Playbook

## Introduction
Brief problem statement and what the reader will achieve by following this playbook.

## Chapter 1: [Topic]
### Overview
Brief context for this chapter.
### Strategy
The strategic thinking behind this step.
### Step-by-Step Execution
1. First action with detail
2. Second action with detail
3. Third action with detail
### Key Metrics to Track
- Metric 1: what to measure and why
- Metric 2: what to measure and why

## Chapter 2: [Topic]
(Same subsection structure)

(Continue for 5-7 chapters)

## Advanced Plays
Bonus advanced tactics for teams ready to go deeper.

## Implementation Timeline
Week 1: [actions]
Week 2: [actions]
Week 3-4: [actions]

## Next Steps
Strong call to action.

Requirements:
- 5-7 chapters minimum, each with Overview/Strategy/Execution/Metrics subsections
- Include real tactical examples (specific subject lines, scripts, templates inline)
- Each chapter should build on the previous one
- Include an implementation timeline
- Use numbered steps within execution sections`,

  [MagnetFormat.CHECKLIST]: `Structure this as an ACTIONABLE CHECKLIST with checkbox items.

Required structure:
# [Strong Title] — Complete Checklist

## Overview
One paragraph explaining who this checklist is for and what they'll accomplish by completing it.

## Phase 1: [Phase Name]
- [ ] Action item with specific, measurable detail
- [ ] Action item with specific, measurable detail
- [ ] Action item with specific, measurable detail
- [ ] Action item with specific, measurable detail
- [ ] Action item with specific, measurable detail

## Phase 2: [Phase Name]
- [ ] Action item with specific, measurable detail
- [ ] Action item with specific, measurable detail
- [ ] Action item with specific, measurable detail
- [ ] Action item with specific, measurable detail

(Continue for 4-6 phases)

## Quick Wins (Do These First)
- [ ] Highest-impact quick win
- [ ] Second quick win
- [ ] Third quick win

## Completion Tracker
Total items: [X]
Completed: ___
Progress: ___%

## Next Steps
Call to action.

Requirements:
- MUST use - [ ] checkbox format for EVERY action item
- Group into 4-6 clear phases with 5-8 items each
- Each item must be specific and actionable (not vague)
- Include a "Quick Wins" section at the end
- Total 30-40 checkbox items
- Make items scannable — one line each, start with an action verb`,

  [MagnetFormat.FRAMEWORK]: `Structure this as a NAMED STRATEGIC FRAMEWORK with distinct stages.

Required structure:
# The [NAME] Framework: [Subtitle Explaining the Promise]

## Overview
Explain the framework philosophy and why traditional approaches fail. Introduce the framework name as an acronym or memorable model.

## The [NAME] Framework at a Glance
Brief visual summary:
Stage 1: [Name] → Stage 2: [Name] → Stage 3: [Name] → Stage 4: [Name]

## Stage 1: [Stage Name]
**What it is**: One-line definition
**Input**: What you need before starting this stage
**Process**: Step-by-step what to do
1. First step
2. Second step
3. Third step
**Output**: What you should have when this stage is complete
**Evaluation Criteria**: How to know if you did it well
**Common Pitfall**: What most people get wrong at this stage

## Stage 2: [Stage Name]
(Same structure)

## Stage 3: [Stage Name]
(Same structure)

## Stage 4: [Stage Name]
(Same structure)

## Putting It All Together
How the stages connect and reinforce each other.

## Framework Application Examples
Example 1: [Specific scenario]
Example 2: [Specific scenario]

## Next Steps
Call to action.

Requirements:
- Create a memorable framework NAME (acronym or branded model)
- 4-6 stages, each with Input/Process/Output/Evaluation/Pitfall
- Each stage should be self-contained but connected to others
- Include 2-3 real application examples
- The framework should feel like a proprietary methodology`,

  [MagnetFormat.SWIPE_FILE]: `Structure this as a COPY-PASTE READY SWIPE FILE with real examples.

Required structure:
# [Strong Title] — [X] Ready-to-Use [Type]

## How to Use This Swipe File
Brief instructions on how to customize and deploy these templates.

## Category 1: [Category Name]

### Template 1: [Descriptive Name]
**When to use**: [Specific scenario/context]
**The copy**:
> [The actual copy-paste ready text. This should be a complete, ready-to-send message, email, or script. Include personalization placeholders like [FIRST_NAME], [COMPANY], [PAIN_POINT] where appropriate.]

**Why it works**: [1-2 sentences explaining the psychology/tactic]

---

### Template 2: [Descriptive Name]
**When to use**: [Specific scenario/context]
**The copy**:
> [Complete ready-to-use copy]

**Why it works**: [Explanation]

---

(Continue with 4-6 templates per category)

## Category 2: [Category Name]
(Same structure, 4-6 templates)

## Category 3: [Category Name]
(Same structure, 4-6 templates)

## Customization Guide
How to adapt these templates for different industries and personas.

## Next Steps
Call to action.

Requirements:
- MUST use > blockquote format for all copy-paste text
- Include [PLACEHOLDER] tokens for personalization
- 3-4 categories with 4-6 templates each (15-25 total templates)
- Each template MUST be complete and ready to use — not a fragment
- Include specific subject lines, opening lines, CTAs
- "Why it works" must reference a specific persuasion principle`,

  [MagnetFormat.TEMPLATE]: `Structure this as a FILL-IN-THE-BLANK TEMPLATE document.

Required structure:
# [Strong Title] — Ready-to-Fill Template

## Instructions
How to use this template: step-by-step guide for filling it in.

## Section 1: [Section Name]

**[FIELD_NAME_1]**: _______________
*Instructions*: [What to write here and why it matters]
*Example*: [A filled-in example showing what good looks like]

**[FIELD_NAME_2]**: _______________
*Instructions*: [What to write here]
*Example*: [Filled example]

**[FIELD_NAME_3]**: _______________
*Instructions*: [What to write here]
*Example*: [Filled example]

## Section 2: [Section Name]

**[FIELD_NAME_4]**: _______________
*Instructions*: [What to write here]
*Example*: [Filled example]

(Continue for 5-7 sections)

## Complete Example
Here is what the template looks like when fully filled in:

(Show the entire template filled in with a realistic example)

## Next Steps
Call to action.

Requirements:
- MUST use [PLACEHOLDER_NAME] format for all blank fields
- Use _______________ as fill-in lines
- Every field needs Instructions AND an Example
- 5-7 sections with 3-5 fields each
- Include a fully completed example at the end
- Make instructions clear enough that someone can fill this in without help
- Fields should be specific, not generic`,

  [MagnetFormat.GUIDE]: `Structure this as a STEP-BY-STEP INSTRUCTIONAL GUIDE.

Required structure:
# [Strong Title] — A Step-by-Step Guide

## Who This Guide Is For
Brief description of the target reader and what they will achieve.

## Prerequisites
What you need before starting (tools, accounts, knowledge).

## Step 1: [Step Name]
**What**: One-line description of what this step accomplishes
**Why it matters**: Why this step is critical
**How to do it**:
1. Detailed sub-step
2. Detailed sub-step
3. Detailed sub-step

**Pro Tip**: Expert insight that saves time or improves results
**Common Mistake**: What most people get wrong and how to avoid it

## Step 2: [Step Name]
(Same structure)

(Continue for 7-10 steps)

## Troubleshooting
**Problem**: [Common issue]
**Solution**: [How to fix it]

**Problem**: [Common issue]
**Solution**: [How to fix it]

## Summary Checklist
- [ ] Step 1 completed
- [ ] Step 2 completed
(Quick reference of all steps)

## Next Steps
Call to action.

Requirements:
- 7-10 detailed steps, each with What/Why/How/Pro Tip/Common Mistake
- Steps should be in logical sequential order
- Include a troubleshooting section
- Include a summary checklist at the end with - [ ] items
- Each "How to do it" section should have 2-4 numbered sub-steps
- Include specific tool recommendations where relevant`,

  [MagnetFormat.AUDIT]: `Structure this as a SCORING ASSESSMENT / AUDIT RUBRIC.

Required structure:
# [Strong Title] — Self-Assessment Audit

## How to Use This Audit
Instructions: Rate yourself 1-5 on each criteria. Be honest. Your total score reveals where you stand and what to fix first.

## Category 1: [Category Name]

| Criteria | Score (1-5) | Notes |
|----------|-------------|-------|
| [Specific criteria to evaluate] | ___ | |
| [Specific criteria to evaluate] | ___ | |
| [Specific criteria to evaluate] | ___ | |
| [Specific criteria to evaluate] | ___ | |

**Score 4-5**: You are performing well. Focus on optimization.
**Score 2-3**: Significant room for improvement. Prioritize these areas.
**Score 1**: Critical gap. Address immediately.

**Quick Fixes**: [2-3 actionable improvements for this category]

## Category 2: [Category Name]
(Same table + scoring structure)

(Continue for 5-7 categories)

## Scoring Summary

| Category | Your Score | Max Score |
|----------|-----------|-----------|
| [Category 1] | ___ | 20 |
| [Category 2] | ___ | 20 |
| **Total** | ___ | **100** |

## Score Interpretation
- **80-100**: Industry leader. Fine-tune and scale.
- **60-79**: Solid foundation. Address gaps for major gains.
- **40-59**: Below average. Significant improvements needed.
- **Below 40**: Critical state. Immediate action required.

## Priority Action Plan
Based on your lowest-scoring categories, here is where to start:
1. [Action for lowest category]
2. [Action for second lowest]
3. [Action for third lowest]

## Next Steps
Call to action.

Requirements:
- MUST use markdown table format for all scoring grids
- 5-7 categories with 3-5 criteria each
- Each category needs score interpretation (what 1-5 means)
- Include a scoring summary table
- Include score interpretation ranges
- Include a priority action plan based on scores
- Total should add up to 100 points`,

  [MagnetFormat.SCORECARD]: `Structure this as a WEIGHTED NUMERICAL SCORECARD.

Required structure:
# [Strong Title] — Performance Scorecard

## Scoring Methodology
This scorecard evaluates key areas on a scale of 1-10. Each area is weighted based on its impact on overall performance.

## Master Scorecard

| # | Category | Weight | Score (1-10) | Weighted Score |
|---|----------|--------|-------------|----------------|
| 1 | [Category] | [X]% | ___ | ___ |
| 2 | [Category] | [X]% | ___ | ___ |
| 3 | [Category] | [X]% | ___ | ___ |
| 4 | [Category] | [X]% | ___ | ___ |
| 5 | [Category] | [X]% | ___ | ___ |
| 6 | [Category] | [X]% | ___ | ___ |
| | **Total** | **100%** | | **___** |

## Category 1: [Name] (Weight: [X]%)

**What this measures**: [Description]
**Industry benchmark**: [What good looks like in your industry]

**Scoring Guide**:
- **8-10 (Excellent)**: [What this level looks like]
- **5-7 (Average)**: [What this level looks like]
- **1-4 (Below Average)**: [What this level looks like]

**Key questions to determine your score**:
1. [Question]
2. [Question]
3. [Question]

(Repeat for all categories)

## Results Interpretation
- **80-100**: Top performer.
- **60-79**: Above average. Strategic improvements will yield big results.
- **40-59**: Average. Multiple areas need attention.
- **Below 40**: Underperforming. Consider a comprehensive strategy overhaul.

## Improvement Roadmap
For each score range, recommended next steps.

## Next Steps
Call to action.

Requirements:
- MUST use markdown tables for the master scorecard
- 6-8 categories that total 100% weight
- Each category needs a scoring guide (what 1-4, 5-7, 8-10 looks like)
- Include industry benchmarks
- Include key diagnostic questions per category
- Results interpretation with clear ranges`,

  [MagnetFormat.PROMPT_PACK]: `Structure this as a CURATED AI PROMPT COLLECTION.

Required structure:
# [Strong Title] — [X] AI Prompts for [Use Case]

## How to Use These Prompts
Quick guide on how to use these prompts with ChatGPT, Claude, or other AI tools. Include tips on customization.

## Category 1: [Category Name]

### Prompt 1: [Purpose/Goal]
\`\`\`
[The complete prompt text, ready to copy and paste. Include variables in [BRACKETS] that the user should fill in. Make the prompt detailed and specific enough to generate high-quality output.]
\`\`\`
**Expected output**: [What the AI will generate]
**Customization tip**: [How to adapt this for different contexts]

---

### Prompt 2: [Purpose/Goal]
\`\`\`
[Complete prompt text]
\`\`\`
**Expected output**: [Description]
**Customization tip**: [Tip]

---

(Continue for 8-12 prompts per category)

## Category 2: [Category Name]
(Same structure)

## Category 3: [Category Name]
(Same structure)

## Prompt Stacking Guide
How to chain these prompts together for more powerful results:
1. Start with [Prompt X] to...
2. Then use [Prompt Y] to...
3. Finish with [Prompt Z] to...

## Next Steps
Call to action.

Requirements:
- MUST use code block format (triple backticks) for all prompts
- 3-4 categories with 8-12 prompts each (30-50 total)
- Each prompt must be COMPLETE and ready to paste into an AI tool
- Include [BRACKET] variables for customization
- Include expected output description for each
- Include a prompt stacking/chaining guide
- Prompts should be sophisticated, not basic`,

  [MagnetFormat.TOOLKIT]: `Structure this as a BUNDLED RESOURCE TOOLKIT with multiple tool types.

Required structure:
# [Strong Title] — Complete Toolkit

## What Is Inside This Toolkit
Overview of all tools included and how they work together.

## Tool 1: [Name] — Quick-Reference Framework
[A mini framework with 3-4 stages, keeping it concise]

### Stage 1: [Name]
- Key action
- Key action

### Stage 2: [Name]
- Key action
- Key action

---

## Tool 2: [Name] — Ready-to-Use Template

**[FIELD_1]**: _______________
*Instructions*: [What to fill in]

**[FIELD_2]**: _______________
*Instructions*: [What to fill in]

---

## Tool 3: [Name] — Action Checklist
- [ ] Checklist item
- [ ] Checklist item
- [ ] Checklist item
- [ ] Checklist item
- [ ] Checklist item

---

## Tool 4: [Name] — Swipe File
### Example 1: [Name]
> [Copy-paste ready text]

### Example 2: [Name]
> [Copy-paste ready text]

---

## Tool 5: [Name] — Scoring Matrix

| Criteria | Score (1-5) | Notes |
|----------|-------------|-------|
| [Item] | ___ | |
| [Item] | ___ | |

---

## Tool 6: [Name] — AI Prompt
\`\`\`
[Ready-to-use AI prompt]
\`\`\`

## How to Use This Toolkit
Recommended order and workflow for getting maximum value.

## Next Steps
Call to action.

Requirements:
- Include 5-8 distinct tools/resources
- Mix different formats: at least one framework, one template, one checklist, one swipe file
- Each tool should be usable on its own
- Include a "How to Use" section explaining the recommended workflow
- Use --- horizontal rules between tools
- Each tool should solve a specific sub-problem`,
};

// --- Mode 1: New Lead Magnet ---

const GENERATE_SYSTEM = `You are an elite B2B growth strategist at Growleads, a leading B2B lead generation agency.
You create high-value, high-conversion lead magnets for B2B companies across SaaS, agencies, consulting, FinTech, recruiting, and other industries.
Your content is specific, actionable, and avoids generic filler.
Every lead magnet you produce is designed to attract qualified prospects and drive measurable pipeline.
You are an expert in LinkedIn outreach, cold email, Google Ads, appointment setting, and multi-channel B2B growth.
You MUST follow the structural format instructions exactly — the format determines the structure.`;

export async function generateLeadMagnet(input: GenerateInput): Promise<GenerationResult> {
  const formatInstructions = FORMAT_STRUCTURES[input.format];

  const prompt = `Create a high-value lead magnet with the following parameters:

NICHE: ${input.niche}
TARGET PERSONA: ${input.persona}
PAIN POINT: ${input.painPoint}
FORMAT: ${input.format}
CATEGORY: ${input.category}
LEAD GOAL: ${input.leadGoal}
DISTRIBUTION CHANNELS: ${input.channels.join(', ')}

FORMAT-SPECIFIC STRUCTURE (YOU MUST FOLLOW THIS EXACTLY):
${formatInstructions}

Additional requirements:
- Title must be specific to the niche and persona
- All content must be relevant to the niche — no generic advice
- Use markdown formatting throughout
- Ensure the call to action aligns with the lead goal: "${input.leadGoal}"
- Make it feel like a premium resource, not a blog post
- Include niche-specific examples, not hypothetical ones`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: GENERATE_SYSTEM,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'The lead magnet title' },
          content: { type: Type.STRING, description: 'Full lead magnet content in markdown, following the exact format structure specified' },
        },
        required: ['title', 'content'],
      },
    },
  });

  if (!response.text) throw new Error('No response from AI');
  return JSON.parse(response.text) as GenerationResult;
}

// --- Mode 2: Repurpose Asset ---

const REPURPOSE_SYSTEM = `You are an elite B2B content strategist at Growleads specializing in asset repurposing.
You take existing lead magnets and adapt them for new niches and audiences.
You preserve the core structure, formatting style, and framework while making every example, reference, and insight specific to the new target market.
You improve clarity and add niche-relevant insights where useful.
CRITICAL: Maintain the exact same format type (checklist stays checklist, playbook stays playbook, etc.)`;

export async function repurposeLeadMagnet(
  originalContent: string,
  newNiche: string,
  newPersona: string,
  additionalContext: string
): Promise<RepurposeResult> {
  const prompt = `Repurpose the following lead magnet for a new niche and audience.

ORIGINAL ASSET:
${originalContent}

NEW NICHE: ${newNiche}
NEW TARGET PERSONA: ${newPersona}
ADDITIONAL CONTEXT: ${additionalContext || 'None'}

Instructions:
- Keep the EXACT same structural format (if it uses checkboxes, keep checkboxes; if tables, keep tables)
- Replace all examples with ones relevant to the new niche
- Adjust language and terminology for the new persona
- Remove sections that do not apply to the new context
- Add new niche-specific insights where useful
- Update the title to reflect the new audience
- Maintain professional B2B tone
- Use the same markdown formatting conventions as the original

Output the complete repurposed lead magnet.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: REPURPOSE_SYSTEM,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Updated title for the new niche' },
          content: { type: Type.STRING, description: 'Full repurposed lead magnet in markdown, preserving the original format structure' },
          changeNotes: { type: Type.STRING, description: 'Summary of what was changed and why' },
        },
        required: ['title', 'content', 'changeNotes'],
      },
    },
  });

  if (!response.text) throw new Error('No response from AI');
  return JSON.parse(response.text) as RepurposeResult;
}

// --- Landing Page Copy Generator ---

export async function generateLandingPageCopy(
  magnetTitle: string,
  magnetContent: string,
  niche: string,
  persona: string
): Promise<{ headline: string; subheadline: string; bullets: string[]; ctaText: string }> {
  const prompt = `Generate landing page copy for this lead magnet download page.

LEAD MAGNET TITLE: ${magnetTitle}
NICHE: ${niche}
TARGET PERSONA: ${persona}
CONTENT SUMMARY (first 500 chars): ${magnetContent.slice(0, 500)}

Create compelling copy that will maximize form submissions and downloads.
The headline should create urgency and speak to the pain point.
Bullet points should highlight specific benefits and outcomes.
CTA should be action-oriented.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: 'You are a conversion copywriter specializing in B2B landing pages for Growleads, a B2B lead generation agency.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          subheadline: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          ctaText: { type: Type.STRING },
        },
        required: ['headline', 'subheadline', 'bullets', 'ctaText'],
      },
    },
  });

  if (!response.text) throw new Error('No response from AI');
  return JSON.parse(response.text);
}

// --- Mode 4: Image Generation ---

const IMAGE_MODEL = 'imagen-3.0-generate-002';
const MAX_SECTION_IMAGES = 5;

function extractHeadings(content: string): string[] {
  const matches = content.match(/^#{1,2} (.+)$/gm);
  if (!matches) return [];
  return matches
    .map((m) => m.replace(/^#{1,2} /, ''))
    .slice(0, MAX_SECTION_IMAGES);
}

export async function generateMagnetImages(
  magnet: LeadMagnet,
  onProgress?: (current: number, total: number, label: string) => void
): Promise<MagnetImages> {
  const headings = extractHeadings(magnet.content);
  const total = 1 + headings.length;
  const result: MagnetImages = {
    sectionImages: {},
    generatedAt: new Date().toISOString(),
  };

  // Generate cover image
  onProgress?.(1, total, 'Cover Image');
  try {
    const coverPrompt = `Professional, modern cover illustration for a B2B lead magnet titled "${magnet.title}" in the ${magnet.niche} industry targeting ${magnet.persona}. Clean, minimalist corporate design with abstract shapes and gradients. No text, no words, no letters.`;
    const coverResponse = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: coverPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg',
        outputCompressionQuality: 70,
      },
    });
    const coverImg = coverResponse.generatedImages?.[0]?.image;
    if (coverImg?.imageBytes) {
      result.coverImage = `data:${coverImg.mimeType || 'image/jpeg'};base64,${coverImg.imageBytes}`;
    }
  } catch {
    // Cover image failed — continue with sections
  }

  // Generate section images
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    onProgress?.(i + 2, total, heading);
    try {
      const sectionPrompt = `Clean, professional illustration representing the concept of "${heading}" for ${magnet.niche} professionals. Minimalist, modern corporate style with subtle colors. No text, no words, no letters.`;
      const sectionResponse = await ai.models.generateImages({
        model: IMAGE_MODEL,
        prompt: sectionPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: '16:9',
          outputMimeType: 'image/jpeg',
          outputCompressionQuality: 60,
        },
      });
      const sectionImg = sectionResponse.generatedImages?.[0]?.image;
      if (sectionImg?.imageBytes) {
        result.sectionImages[heading] = `data:${sectionImg.mimeType || 'image/jpeg'};base64,${sectionImg.imageBytes}`;
      }
    } catch {
      // Skip failed section images
    }
  }

  return result;
}
