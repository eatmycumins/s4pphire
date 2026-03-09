import React, { useState, useRef, useCallback } from 'react';
import { Icons } from './Icon';
import { N8nWorkflow } from '../types';

interface Props {
    onUpload: (workflow: N8nWorkflow) => void;
}

const SAMPLE_WORKFLOW: N8nWorkflow = {
    nodes: [
        {
            id: "demo-agent-1",
            name: "Customer Support Agent",
            type: "@n8n/n8n-nodes-langchain.agent",
            typeVersion: 1,
            position: [250, 300],
            parameters: {
                options: {
                    systemMessage: "You are a customer support agent. Answer questions about our product."
                },
                messages: {
                    values: [{ content: "User says: {{ $json.message }}", role: "user" }]
                }
            }
        },
        {
            id: "demo-agent-2",
            name: "Content Writer",
            type: "@n8n/n8n-nodes-langchain.openAi",
            typeVersion: 1,
            position: [500, 300],
            parameters: {
                options: {
                    systemMessage: "Write blog posts about {{ $json.topic }}."
                },
                messages: {
                    values: [{ content: "Write a blog post about {{ $json.topic }} for {{ $json.audience }}", role: "user" }]
                }
            }
        },
        {
            id: "demo-agent-3",
            name: "Data Analyzer",
            type: "@n8n/n8n-nodes-langchain.anthropic",
            typeVersion: 1,
            position: [750, 300],
            parameters: {
                options: {
                    systemMessage: "Analyze the data and provide insights."
                },
                messages: {
                    values: [{ content: "Analyze this data: {{ $json.data }}", role: "user" }]
                }
            }
        }
    ],
    connections: {}
};

const WorkflowUploader: React.FC<Props> = ({ onUpload }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parseAndUpload = useCallback((text: string) => {
        try {
            setError(null);
            const parsed = JSON.parse(text);

            if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
                throw new Error("Invalid n8n workflow format: missing 'nodes' array. Please export a valid workflow from n8n.");
            }

            if (parsed.nodes.length === 0) {
                throw new Error("This workflow has no nodes. Please use a workflow that contains at least one node.");
            }

            onUpload(parsed as N8nWorkflow);
        } catch (e: any) {
            if (e instanceof SyntaxError) {
                setError("Invalid JSON syntax. Please check your workflow data and try again.");
            } else {
                setError(e.message || "Failed to parse workflow");
            }
        }
    }, [onUpload]);

    const handleParse = () => {
        parseAndUpload(jsonInput);
    };

    const handleFileUpload = (file: File) => {
        if (!file.name.endsWith('.json')) {
            setError("Please upload a .json file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setJsonInput(text);
            parseAndUpload(text);
        };
        reader.onerror = () => {
            setError("Failed to read file. Please try again.");
        };
        reader.readAsText(file);
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleLoadSample = () => {
        const sampleJson = JSON.stringify(SAMPLE_WORKFLOW, null, 2);
        setJsonInput(sampleJson);
        parseAndUpload(sampleJson);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 animate-slide-up">
            <div className="text-center mb-12">
                <h2 className="serif-heading text-4xl md:text-5xl text-atelier-ink mb-6 leading-tight">
                    Refine your <br/><i className="font-serif italic text-atelier-muted">artificial thought</i>.
                </h2>
                <p className="text-atelier-muted font-sans text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    Paste your n8n workflow JSON below, drag & drop a file, or try a sample workflow.
                </p>
            </div>

            <div
                className="relative group"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Decorative corners */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-atelier-ink opacity-30"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-atelier-ink opacity-30"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-atelier-ink opacity-30"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-atelier-ink opacity-30"></div>

                <div className={`bg-white rounded-sm shadow-elegant border transition-all duration-500 hover:shadow-xl p-2 ${
                    isDragging ? 'border-atelier-highlight border-2 shadow-xl' : 'border-atelier-border'
                }`}>
                    {/* Drag overlay */}
                    {isDragging && (
                        <div className="absolute inset-0 bg-atelier-highlight/5 z-10 flex items-center justify-center rounded-sm">
                            <div className="text-center">
                                <Icons.FileJson className="w-12 h-12 text-atelier-highlight mx-auto mb-2" />
                                <p className="text-sm font-sans text-atelier-highlight font-medium">Drop your workflow JSON here</p>
                            </div>
                        </div>
                    )}

                    <div className="relative w-full h-80 bg-[#FAFAFA] rounded-none border border-atelier-border overflow-hidden">
                        <div className="absolute top-4 left-4 text-[10px] font-bold tracking-widest text-atelier-muted/40 uppercase pointer-events-none">
                            Input Sequence
                        </div>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => { setJsonInput(e.target.value); setError(null); }}
                            placeholder='Paste your n8n workflow JSON here, or drag & drop a .json file...'
                            className="w-full h-full bg-transparent text-atelier-ink font-sans text-xs p-8 pt-12 border-none focus:ring-0 outline-none resize-none placeholder:text-atelier-accent leading-loose"
                            spellCheck={false}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mt-4 flex items-center gap-3 text-red-600 text-sm font-sans animate-fade-in bg-red-50 border border-red-200 rounded px-4 py-3">
                        <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleParse}
                        disabled={!jsonInput.trim()}
                        className="group relative px-10 py-4 bg-atelier-ink text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:bg-black"
                    >
                        <span className="relative z-10 flex items-center gap-3 font-serif italic text-lg tracking-wide group-hover:gap-4 transition-all">
                            Begin Analysis
                            <Icons.ArrowRight className="w-4 h-4 stroke-[1.5]" />
                        </span>
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="group px-6 py-4 border border-atelier-border text-atelier-muted hover:border-atelier-ink hover:text-atelier-ink transition-all duration-300"
                    >
                        <span className="flex items-center gap-2 text-sm font-sans">
                            <Icons.Upload className="w-4 h-4" />
                            Upload File
                        </span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                    />
                </div>

                {/* Sample workflow button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleLoadSample}
                        className="text-xs font-sans text-atelier-muted hover:text-atelier-ink transition-colors underline underline-offset-4 decoration-atelier-border hover:decoration-atelier-ink"
                    >
                        Or try with a sample workflow
                    </button>
                </div>
            </div>

            <div className="mt-16 flex justify-center gap-8 opacity-40">
                <div className="w-16 h-px bg-atelier-border"></div>
                <div className="w-16 h-px bg-atelier-border"></div>
            </div>
        </div>
    );
};

export default WorkflowUploader;
