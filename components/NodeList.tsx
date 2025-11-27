import React from 'react';
import { AINodeInfo } from '../types';
import { Icons } from './Icon';

interface Props {
    nodes: AINodeInfo[];
    onSelect: (node: AINodeInfo) => void;
    onBack: () => void;
}

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
                        {nodes.length} {nodes.length === 1 ? 'entity' : 'entities'} found in sequence
                    </p>
                </div>
                
                <div className="w-24 hidden md:block"></div> {/* Spacer for alignment */}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodes.map((node, index) => (
                    <div 
                        key={node.id}
                        onClick={() => onSelect(node)}
                        className="group relative bg-white border border-atelier-border p-8 cursor-pointer hover:shadow-elegant hover:-translate-y-1 transition-elegant"
                        style={{animationDelay: `${index * 50}ms`}}
                    >
                        {/* Decorative Pixel Corner */}
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

                            <div className="mt-auto space-y-3 pt-6 border-t border-dashed border-atelier-border">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-atelier-muted">System Context</span>
                                    {node.currentSystemPrompt ? (
                                        <div className="w-2 h-2 bg-atelier-ink rounded-full"></div>
                                    ) : (
                                        <span className="text-[10px] text-atelier-border">EMPTY</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-atelier-muted">User Query</span>
                                    {node.currentUserPrompt ? (
                                        <div className="w-2 h-2 bg-atelier-ink rounded-full"></div>
                                    ) : (
                                        <span className="text-[10px] text-atelier-border">EMPTY</span>
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
                    <h3 className="serif-heading text-xl text-atelier-ink mb-2">Silence.</h3>
                    <p className="text-atelier-muted text-sm font-sans max-w-xs">
                        No compatible AI nodes were discovered in this workflow.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NodeList;