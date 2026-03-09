import React from 'react';
import { AINodeInfo } from '../types';
import { Icons } from './Icon';

interface Props {
    nodes: AINodeInfo[];
    onSelect: (node: AINodeInfo) => void;
    onBack: () => void;
}

const truncate = (text: string, maxLen: number): string => {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trim() + '...';
};

const NodeList: React.FC<Props> = ({ nodes, onSelect, onBack }) => {
    return (
        <div className="w-full max-w-5xl mx-auto p-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-atelier-muted hover:text-atelier-ink transition-colors"
                >
                    <div className="w-8 h-8 rounded-full border border-atelier-border flex items-center justify-center bg-white group-hover:border-atelier-muted transition-colors">
                        <Icons.ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-sans text-xs tracking-widest uppercase">Return</span>
                </button>

                <div className="text-center">
                    <h2 className="serif-heading text-3xl text-atelier-ink">Detected Minds</h2>
                    <p className="text-atelier-muted text-xs font-sans mt-2 tracking-wide">
                        {nodes.length} {nodes.length === 1 ? 'entity' : 'entities'} found — select one to optimize
                    </p>
                </div>

                <div className="w-24 hidden md:block"></div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodes.map((node, index) => (
                    <div
                        key={node.id}
                        onClick={() => onSelect(node)}
                        className="group relative bg-white border border-atelier-border p-8 cursor-pointer hover:shadow-elegant hover:-translate-y-1 transition-elegant animate-slide-up"
                        style={{animationDelay: `${index * 80}ms`}}
                    >
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Icons.ArrowRight className="w-4 h-4 text-atelier-ink -rotate-45" />
                        </div>

                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <span className="inline-block px-2 py-1 bg-atelier-bg border border-atelier-border text-[10px] font-bold tracking-widest uppercase text-atelier-muted mb-4">
                                    {node.type.split('.').pop()?.replace('Tool', '')}
                                </span>
                                <h3 className="serif-heading text-xl text-atelier-ink leading-snug group-hover:underline decoration-1 underline-offset-4 decoration-atelier-muted/30">
                                    {node.name}
                                </h3>
                            </div>

                            {/* Prompt preview */}
                            {(node.currentSystemPrompt || node.currentUserPrompt) && (
                                <p className="text-[11px] text-atelier-muted font-mono leading-relaxed mb-4 opacity-60">
                                    {truncate(node.currentSystemPrompt || node.currentUserPrompt || '', 80)}
                                </p>
                            )}

                            <div className="mt-auto space-y-3 pt-6 border-t border-dashed border-atelier-border">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-atelier-muted">System Context</span>
                                    {node.currentSystemPrompt ? (
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    ) : (
                                        <span className="text-[10px] text-atelier-accent">EMPTY</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-atelier-muted">User Query</span>
                                    {node.currentUserPrompt ? (
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    ) : (
                                        <span className="text-[10px] text-atelier-accent">EMPTY</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {nodes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-atelier-border rounded-lg bg-white/50">
                    <Icons.Bot className="w-12 h-12 text-atelier-accent mb-4 stroke-[1]" />
                    <h3 className="serif-heading text-xl text-atelier-ink mb-2">No AI Nodes Found</h3>
                    <p className="text-atelier-muted text-sm font-sans max-w-xs mb-6">
                        No compatible AI nodes were discovered in this workflow. Make sure your workflow contains LangChain, OpenAI, Anthropic, Gemini, or similar AI nodes.
                    </p>
                    <button
                        onClick={onBack}
                        className="px-6 py-2.5 bg-atelier-ink text-white text-sm hover:bg-black transition-all flex items-center gap-2"
                    >
                        <Icons.ChevronLeft className="w-4 h-4" />
                        Try Another Workflow
                    </button>
                </div>
            )}
        </div>
    );
};

export default NodeList;
