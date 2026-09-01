import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, Sparkles, MessageSquare } from 'lucide-react';
import { ModelInfo } from '../types/battle';

interface ReasoningPanelProps {
  model1: ModelInfo;
  model2: ModelInfo;
  score1: number;
  score2: number;
  reasoning1: string;
  reasoning2: string;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({
  model1,
  model2,
  score1,
  score2,
  reasoning1,
  reasoning2,
}) => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <div className="w-full my-6 space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
            Judge's Evaluation Analysis
          </h4>
        </div>
        <button
          onClick={() => {
            const shouldOpen = !open1 || !open2;
            setOpen1(shouldOpen);
            setOpen2(shouldOpen);
          }}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          {open1 && open2 ? 'Hide All' : 'Expand All'}
        </button>
      </div>

      {/* Accordion 1: Model 1 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all duration-300">
        <button
          type="button"
          onClick={() => setOpen1(!open1)}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-900/80 hover:bg-slate-850 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-sm font-bold font-mono text-slate-200">
              Why {model1.name} scored {score1.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{open1 ? 'Hide reasoning' : 'Show reasoning'}</span>
            {open1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {open1 && (
          <div className="p-5 bg-slate-950/50 border-t border-slate-800/80 text-sm text-slate-300 leading-relaxed font-sans animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div>
              <p>{reasoning1 || 'No specific reasoning was provided by the judge.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Model 2 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all duration-300">
        <button
          type="button"
          onClick={() => setOpen2(!open2)}
          className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-900/80 hover:bg-slate-850 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-sm font-bold font-mono text-slate-200">
              Why {model2.name} scored {score2.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{open2 ? 'Hide reasoning' : 'Show reasoning'}</span>
            {open2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {open2 && (
          <div className="p-5 bg-slate-950/50 border-t border-slate-800/80 text-sm text-slate-300 leading-relaxed font-sans animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></div>
              <p>{reasoning2 || 'No specific reasoning was provided by the judge.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
