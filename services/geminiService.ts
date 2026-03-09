// ============================================================
// GrowLeads — AI Generation Service (Google Gemini)
// ============================================================

import { GoogleGenAI, Type } from '@google/genai';
import { GenerateInput, GenerationResult, RepurposeResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL = 'gemini-2.5-flash';

// --- Mode 1: New Lead Magnet ---

const GENERATE_SYSTEM = `You are an elite B2B growth strategist specializing in lead magnet creation.
You create high-value, high-conversion lead magnets for B2B companies.
Your writing is specific, actionable, and avoids generic filler.
Every lead magnet you produce is designed to attract qualified prospects and drive measurable pipeline.
You structure content with clear sections, practical examples, and a compelling call to action.`;

export async function generateLeadMagnet(input: GenerateInput): Promise<GenerationResult> {
  const prompt = `Create a high-value lead magnet with the following parameters:

NICHE: ${input.niche}
TARGET PERSONA: ${input.persona}
PAIN POINT: ${input.painPoint}
FORMAT: ${input.format}
CATEGORY: ${input.category}
LEAD GOAL: ${input.leadGoal}
DISTRIBUTION CHANNELS: ${input.channels.join(', ')}

Requirements:
- Strong, specific title that speaks directly to the target persona
- Clear promise of value in the introduction
- 5-7 core sections with actionable frameworks, steps, or insights
- Real-world examples relevant to the niche
- Bonus tips or advanced tactics section
- Strong call to action aligned with the lead goal
- Written for B2B growth teams — no generic advice
- Professional tone, scannable formatting with headers and bullet points
- Use markdown formatting for structure

Structure:
# [Title]

## Introduction
[Problem statement + promise of what they'll learn]

## Section 1-7
[Core framework, steps, or insights with examples]

## Bonus Tips
[Advanced tactics]

## Next Steps
[Call to action aligned with lead goal]`;

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
          content: { type: Type.STRING, description: 'Full lead magnet content in markdown' },
        },
        required: ['title', 'content'],
      },
    },
  });

  if (!response.text) throw new Error('No response from AI');
  return JSON.parse(response.text) as GenerationResult;
}

// --- Mode 2: Repurpose Asset ---

const REPURPOSE_SYSTEM = `You are an elite B2B content strategist specializing in asset repurposing.
You take existing lead magnets and adapt them for new niches and audiences.
You preserve the core framework and value while making every example, reference, and insight specific to the new target market.
You improve clarity and add niche-relevant insights where useful.`;

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
- Keep the core structure and framework intact
- Replace all examples with ones relevant to the new niche
- Adjust language and terminology for the new persona
- Remove sections that don't apply to the new context
- Add new niche-specific insights where useful
- Update the title to reflect the new audience
- Maintain professional B2B tone
- Use markdown formatting

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
          content: { type: Type.STRING, description: 'Full repurposed lead magnet in markdown' },
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
      systemInstruction: 'You are a conversion copywriter specializing in B2B landing pages.',
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
