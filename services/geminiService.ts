import { GoogleGenAI, Type } from "@google/genai";
import { AINodeInfo, OptimizationResult } from "../types";

// Initialize Gemini Client
// process.env.API_KEY is injected via Vite's define config.
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";

let ai: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!ai) {
    if (!apiKey) {
      throw new Error(
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file."
      );
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const SYSTEM_INSTRUCTION = `
You are a world-class Prompt Engineer and AI Systems Architect with 20+ years of experience.
You hold a PhD in Computational Linguistics and have mastered business strategy, consumer psychology, and digital marketing.

Your Goal:
Analyze a specific "Node" from an n8n automation workflow. This node contains existing prompts (System and User) intended for an LLM (like Gemini, GPT-4, or Claude).
You must rewrite these prompts to be significantly more robust, consistent, and high-performing.

Your Methodology:
1.  **Analyze**: Understand the node's intent based on the existing prompts and variable mappings.
2.  **Strategies**: Apply Chain-of-Thought, Role-Playing (Persona), Delimiters, and constrained output formats.
3.  **Psychology**: Use hooks, micro-dopamine strategies in the *output* instructions (if the agent generates content), and strict SOP adherence.
4.  **Reliability**: Ensure the agent won't hallucinate or deviate from the format.
5.  **Variable Preservation**: You MUST strictly preserve all n8n expressions (e.g., {{ $json.body }} or {{ $('NodeName').item.json.field }}). These are vital for the code to run. Do not hallucinate new variables. Map existing ones correctly.

Output Format:
Return a JSON object containing the optimized 'systemPrompt', 'userPrompt', and a brief 'reasoning' for your changes.
`;

export const optimizeNodePrompt = async (
  nodeInfo: AINodeInfo
): Promise<OptimizationResult> => {
  const client = getClient();
  const modelId = "gemini-2.5-flash";

  const prompt = `
    I need you to optimize the prompts for this n8n AI Agent Node.

    **Node Context:**
    - Name: ${nodeInfo.name}
    - Type: ${nodeInfo.type}

    **Current System Prompt:**
    \`\`\`
    ${nodeInfo.currentSystemPrompt || "N/A (no system prompt provided — please create one from scratch based on the node's purpose)"}
    \`\`\`

    **Current User Prompt:**
    \`\`\`
    ${nodeInfo.currentUserPrompt || "N/A (no user prompt provided — please create one from scratch based on the node's purpose)"}
    \`\`\`

    **Instructions:**
    1. Create a highly detailed **System Prompt** defining a specialized persona (e.g., "Elite Corporate Intelligence Officer"). Include specific SOPs, constraints, and formatting rules (Markdown, XML tags).
    2. Create a refined **User Prompt** that clearly maps the input variables.
    3. Ensure consistency and reliability.
    4. **CRITICAL:** Do not remove or alter the n8n variable syntax (e.g. {{ $json['Field'] }}). Only wrap them in better context.
    5. If either prompt was "N/A", infer the purpose from the node name and type, then create an appropriate prompt from scratch.
  `;

  const response = await client.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          systemPrompt: {
            type: Type.STRING,
            description:
              "The optimized system instruction for the AI agent.",
          },
          userPrompt: {
            type: Type.STRING,
            description: "The optimized user message/prompt.",
          },
          reasoning: {
            type: Type.STRING,
            description: "Explanation of the improvements made.",
          },
        },
        required: ["systemPrompt", "userPrompt", "reasoning"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as OptimizationResult;
  }

  throw new Error("No response received from Gemini. Please try again.");
};
