import React, { useState } from 'react';
import { Icons } from './Icon';
import { N8nWorkflow } from '../types';

interface Props {
    onUpload: (workflow: N8nWorkflow) => void;
}

const WorkflowUploader: React.FC<Props> = ({ onUpload }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleParse = () => {
        try {
            setError(null);
            const parsed = JSON.parse(jsonInput);
            
            if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
                throw new Error("Invalid format. Please check your workflow JSON.");
            }
            
            onUpload(parsed as N8nWorkflow);
        } catch (e: any) {
            setError(e.message || "Invalid JSON");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 animate-slide-up">
            <div className="text-center mb-12">
                <h2 className="serif-heading text-4xl md:text-5xl text-atelier-ink mb-6 leading-tight">
                    Refine your <br/><i className="font-serif italic text-atelier-muted">artificial thought</i>.
                </h2>
                <p className="text-atelier-muted font-sans text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    Paste your n8n workflow JSON below. We will dissect the neural architecture and elevate your prompt engineering.
                </p>
            </div>

            <div className="relative group">
                {/* Decorative corners for pixel feel */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-atelier-ink opacity-30"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-atelier-ink opacity-30"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-atelier-ink opacity-30"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-atelier-ink opacity-30"></div>

                <div className="bg-white rounded-sm shadow-elegant border border-atelier-border p-2 transition-all duration-500 hover:shadow-xl">
                    <div className="relative w-full h-80 bg-[#FAFAFA] rounded-none border border-atelier-border overflow-hidden">
                        <div className="absolute top-4 left-4 text-[10px] font-bold tracking-widest text-atelier-muted/40 uppercase pointer-events-none">
                            Input Sequence
                        </div>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder='Paste JSON here...'
                            className="w-full h-full bg-transparent text-atelier-ink font-sans text-xs p-8 pt-12 border-none focus:ring-0 outline-none resize-none placeholder:text-atelier-accent leading-loose"
                            spellCheck={false}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mt-4 flex items-center gap-3 text-red-600 text-sm font-sans animate-fade-in">
                        <Icons.AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="mt-8 flex justify-center">
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