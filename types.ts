// n8n Workflow JSON structures (simplified for extraction)
export interface N8nNodeParameters {
    [key: string]: any;
    options?: {
        systemMessage?: string;
        [key: string]: any;
    };
    messages?: {
        values?: Array<{ content: string; role?: string }>;
        messageValues?: Array<{ message: string; }>;
    };
    prompt?: string; // For image generation nodes
}

export interface N8nNode {
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: number[];
    parameters: N8nNodeParameters;
    notes?: string;
}

export interface N8nWorkflow {
    nodes: N8nNode[];
    connections: any;
}

// Application Types
export interface AINodeInfo {
    id: string;
    name: string;
    type: string;
    currentSystemPrompt?: string;
    currentUserPrompt?: string;
    originalJson: N8nNode;
}

export interface OptimizationResult {
    systemPrompt: string;
    userPrompt: string;
    reasoning: string;
}

export enum AppStep {
    UPLOAD = 'UPLOAD',
    SELECT = 'SELECT',
    OPTIMIZE = 'OPTIMIZE'
}
