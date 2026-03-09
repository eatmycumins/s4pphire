import React, { useState, useEffect, useCallback } from 'react';
import { AINodeInfo, OptimizationResult } from '../types';
import { Icons } from './Icon';
import { optimizeNodePrompt } from '../services/geminiService';

interface Props {
    node: AINodeInfo;
    onBack: () => void;
}

const Optimizer: React.FC<Props> = ({ node, onBack }) => {
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleOptimize = useCallback(async () => {
        setIsOptimizing(true);
        setError(null);
        setResult(null);
        try {
            const res = await optimizeNodePrompt(node);
            setResult(res);
        } catch (err: any) {
            const message =
                err?.message || "Optimization failed. Please check your API key and try again.";
            setError(message);
            console.error("Optimization failed:", err);
        } finally {
            setIsOptimizing(false);
        }
    }, [node]);

    useEffect(() => {
        handleOptimize();
    }, [handleOptimize]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    return (
        <div className="w-full h-screen flex flex-col bg-atelier-bg overflow-hidden animate-fade-in">
            {/* Minimal Header */}
            <div className="flex-none h-20 px-8 border-b border-atelier-border flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="group flex items-center justify-center w-8 h-8 rounded-full border border-atelier-border hover:border-atelier-ink transition-colors"
                    >
                        <Icons.ChevronLeft className="w-4 h-4 text-atelier-muted group-hover:text-atelier-ink" />
                    </button>
                    <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-atelier-muted mb-1">Editing Node</div>
                        <h1 className="serif-heading text-xl text-atelier-ink">{node.name}</h1>
                    </div>
                </div>

                <button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="group px-6 py-2.5 bg-atelier-ink text-white text-sm font-medium tracking-wide hover:bg-black transition-all disabled:opacity-50 flex items-center gap-3"
                >
                    {isOptimizing ? (
                        <>
                            <Icons.Cpu className="w-4 h-4 animate-spin" />
                            <span>Thinking...</span>
                        </>
                    ) : (
                        <>
                            <Icons.Sparkles className="w-4 h-4" />
                            <span>Regenerate</span>
                        </>
                    )}
                </button>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Left: Original Context */}
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-atelier-border bg-white flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-atelier-border/50 bg-[#FAFAFA]">
                        <h2 className="font-serif italic text-lg text-atelier-ink">Source Material</h2>
                        <p className="text-xs text-atelier-muted mt-1">The raw input from your workflow.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-atelier-muted mb-3">Original System Prompt</label>
                            <div className="p-4 bg-atelier-bg border border-atelier-border text-xs font-mono text-atelier-muted leading-relaxed whitespace-pre-wrap break-words">
                                {node.currentSystemPrompt || "— No system prompt defined"}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-atelier-muted mb-3">Original User Prompt</label>
                            <div className="p-4 bg-atelier-bg border border-atelier-border text-xs font-mono text-atelier-muted leading-relaxed whitespace-pre-wrap break-words">
                                {node.currentUserPrompt || "— No user prompt defined"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Optimized Result */}
                <div className="flex-1 flex flex-col bg-atelier-bg overflow-hidden relative">
                    <div className="p-6 border-b border-atelier-border flex items-center gap-3">
                        <Icons.Bot className="w-5 h-5 text-atelier-ink" />
                        <div>
                            <h2 className="font-serif italic text-lg text-atelier-ink">Optimized Intelligence</h2>
                        </div>
                    </div>

                    {error ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="max-w-md text-center space-y-4">
                                <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                                    <Icons.AlertCircle className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="serif-heading text-xl text-atelier-ink">Optimization Failed</h3>
                                <p className="text-sm text-atelier-muted leading-relaxed">{error}</p>
                                <button
                                    onClick={handleOptimize}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-atelier-ink text-white text-sm hover:bg-black transition-all"
                                >
                                    <Icons.Sparkles className="w-4 h-4" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : result ? (
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* Reasoning Block */}
                            <div className="bg-white p-6 border-l-2 border-atelier-ink shadow-soft">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-atelier-ink mb-2">Analysis & Reasoning</h3>
                                <p className="text-sm text-atelier-muted leading-relaxed font-sans">{result.reasoning}</p>
                            </div>

                            {/* System Prompt */}
                            <div className="group relative">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-ink">System Instruction</label>
                                    <button
                                        onClick={() => copyToClipboard(result.systemPrompt, 'system')}
                                        className="text-xs text-atelier-muted hover:text-atelier-ink transition-colors flex items-center gap-1.5"
                                    >
                                        {copiedField === 'system' ? <Icons.CheckCircle className="w-3 h-3" /> : <Icons.Copy className="w-3 h-3" />}
                                        {copiedField === 'system' ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="p-6 bg-white border border-atelier-border shadow-soft text-sm text-atelier-ink font-mono leading-relaxed whitespace-pre-wrap break-words selection:bg-atelier-accent/30">
                                    {result.systemPrompt}
                                </div>
                            </div>

                            {/* User Prompt */}
                            <div className="group relative">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-atelier-ink">User Instruction</label>
                                    <button
                                        onClick={() => copyToClipboard(result.userPrompt, 'user')}
                                        className="text-xs text-atelier-muted hover:text-atelier-ink transition-colors flex items-center gap-1.5"
                                    >
                                        {copiedField === 'user' ? <Icons.CheckCircle className="w-3 h-3" /> : <Icons.Copy className="w-3 h-3" />}
                                        {copiedField === 'user' ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="p-6 bg-white border border-atelier-border shadow-soft text-sm text-atelier-ink font-mono leading-relaxed whitespace-pre-wrap break-words selection:bg-atelier-accent/30">
                                    {result.userPrompt}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center flex-col">
                            <div className="space-y-3 text-center">
                                <div className="w-10 h-10 mx-auto border-2 border-atelier-border border-t-atelier-ink rounded-full animate-spin"></div>
                                <p className="text-sm font-serif italic text-atelier-muted">Constructing optimized prompts...</p>
                                <p className="text-xs text-atelier-accent">This may take a moment</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Optimizer;
