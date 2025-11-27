import React, { useState } from 'react';
import WorkflowUploader from './components/WorkflowUploader';
import NodeList from './components/NodeList';
import Optimizer from './components/Optimizer';
import { N8nWorkflow, AINodeInfo, AppStep } from './types';
import { Icons } from './components/Icon';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [nodes, setNodes] = useState<AINodeInfo[]>([]);
  const [selectedNode, setSelectedNode] = useState<AINodeInfo | null>(null);

  const processWorkflow = (workflow: N8nWorkflow) => {
    const aiNodes: AINodeInfo[] = [];

    workflow.nodes.forEach(node => {
        const typeLower = node.type.toLowerCase();
        
        const isAI = 
            typeLower.includes('langchain') || 
            typeLower.includes('openai') || 
            typeLower.includes('anthropic') || 
            typeLower.includes('gemini') ||
            typeLower.includes('mistral') ||
            (node.type === '@n8n/n8n-nodes-langchain.googleGemini' && node.parameters.prompt); 

        if (isAI) {
            let sys = undefined;
            let user = undefined;

            if (node.parameters.options?.systemMessage) {
                sys = node.parameters.options.systemMessage as string;
            }
            if (node.parameters.messages?.values?.[0]?.content) {
                user = node.parameters.messages.values[0].content;
            } else if (node.parameters.messages?.messageValues?.[0]?.message) {
                 user = node.parameters.messages.messageValues[0].message;
            }

            if (node.parameters.prompt && typeof node.parameters.prompt === 'string') {
                user = node.parameters.prompt;
                sys = "Image Generation Model Context";
            }

            if (!sys && !user) {
                const potentialKeys = Object.keys(node.parameters).filter(k => 
                    typeof node.parameters[k] === 'string' && (k.toLowerCase().includes('prompt') || k.toLowerCase().includes('text'))
                );
                if (potentialKeys.length > 0) {
                    user = node.parameters[potentialKeys[0]] as string;
                }
            }

            aiNodes.push({
                id: node.id,
                name: node.name,
                type: node.type,
                currentSystemPrompt: sys,
                currentUserPrompt: user,
                originalJson: node
            });
        }
    });

    setNodes(aiNodes);
    setStep(AppStep.SELECT);
  };

  const handleNodeSelect = (node: AINodeInfo) => {
    setSelectedNode(node);
    setStep(AppStep.OPTIMIZE);
  };

  return (
    <div className="min-h-screen bg-atelier-bg text-atelier-ink flex flex-col relative selection:bg-atelier-ink selection:text-white">
      
      {/* Texture Overlay */}
      <div className="bg-grain"></div>

      {/* Decorative Aura */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white to-transparent opacity-80 pointer-events-none blur-3xl z-0"></div>

      {step !== AppStep.OPTIMIZE && (
        <header className="relative z-10 w-full pt-12 pb-6 px-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-atelier-border pb-6">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setStep(AppStep.UPLOAD)}>
                    <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-atelier-border shadow-soft group-hover:shadow-md transition-elegant">
                        <Icons.Sparkles className="w-5 h-5 text-atelier-ink" />
                    </div>
                    <div>
                        <h1 className="serif-heading text-2xl text-atelier-ink tracking-tight">
                            The Optimizer
                        </h1>
                        <p className="text-[10px] font-sans text-atelier-muted tracking-[0.2em] uppercase">n8n Agent Atelier</p>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-sans text-atelier-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                        <span className="opacity-60">System Ready</span>
                    </div>
                </div>
            </div>
        </header>
      )}

      <main className="relative z-10 flex-1 flex flex-col items-center w-full">
        <div className="w-full h-full flex items-center justify-center">
            {step === AppStep.UPLOAD && (
                <WorkflowUploader onUpload={processWorkflow} />
            )}

            {step === AppStep.SELECT && (
                <NodeList 
                    nodes={nodes} 
                    onSelect={handleNodeSelect} 
                    onBack={() => setStep(AppStep.UPLOAD)} 
                />
            )}

            {step === AppStep.OPTIMIZE && selectedNode && (
                <Optimizer 
                    node={selectedNode} 
                    onBack={() => setStep(AppStep.SELECT)} 
                />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;