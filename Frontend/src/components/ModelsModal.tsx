import React from 'react';
import { X, Cpu, Scale, Bot, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import { COMPETITOR_MODELS } from '../services/mockData';

interface ModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelsModal: React.FC<ModelsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const m1 = COMPETITOR_MODELS.model_1;
  const m2 = COMPETITOR_MODELS.model_2;
  const judge = COMPETITOR_MODELS.judge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white">Model Fleet & Rubric</h3>
              <p className="text-xs text-slate-400 font-mono">
                Technical specifications & scoring methodology
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Competitors List */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-3 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>Competitor Models</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mistral */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-orange-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-base">{m1.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 text-orange-300">
                    MODEL 01
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">{m1.version}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{m1.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {m1.strengths.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cohere */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-base">{m2.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                    MODEL 02
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">{m2.version}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{m2.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {m2.strengths.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Arbiter Section */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Independent Arbiter (Judge)</span>
            </h4>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-base">{judge.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                  ARBITER
                </span>
              </div>
              <p className="text-xs font-mono text-purple-300/80">{judge.version} • {judge.provider}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{judge.description}</p>
            </div>
          </div>

          {/* Judging Rubric */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Evaluation Rubric & Standards</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-mono font-bold text-cyan-300 block mb-1">1. Technical Accuracy (40%)</span>
                <p className="text-slate-400">Verifiable precision, algorithm soundness, syntax validity, and absence of hallucinations.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-mono font-bold text-purple-300 block mb-1">2. Depth & Completeness (30%)</span>
                <p className="text-slate-400">Comprehensive edge-case consideration, concrete benchmarks, trade-off analysis.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-mono font-bold text-amber-300 block mb-1">3. Structural Elegance (20%)</span>
                <p className="text-slate-400">Clear hierarchy, formatted markdown, readable code blocks, concise prose.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-mono font-bold text-emerald-300 block mb-1">4. Prompt Adherence (10%)</span>
                <p className="text-slate-400">Faithful adherence to all specific constraints and directives in user input.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
