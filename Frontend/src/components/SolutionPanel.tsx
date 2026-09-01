import React, { useState } from 'react';
import { Bot, Copy, Check, Sparkles, Trophy, Terminal, Clock, Activity } from 'lucide-react';
import { ModelInfo } from '../types/battle';
import { MarkdownView } from './MarkdownView';

interface SolutionPanelProps {
  modelNumber: '01' | '02';
  model: ModelInfo;
  solution: string;
  isGenerating: boolean;
  score?: number;
  isWinner?: boolean;
  isEvaluated?: boolean;
  onHighlight?: boolean;
}

export const SolutionPanel: React.FC<SolutionPanelProps> = ({
  modelNumber,
  model,
  solution,
  isGenerating,
  score,
  isWinner = false,
  isEvaluated = false,
  onHighlight = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = solution ? solution.trim().split(/\s+/).length : 0;

  // Custom border & glow depending on state
  const getPanelBorderClass = () => {
    if (isWinner && isEvaluated) {
      return 'border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.25)] bg-slate-900/90 ring-1 ring-amber-400/40';
    }
    if (isGenerating) {
      return modelNumber === '01'
        ? 'border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.15)] bg-slate-900/80'
        : 'border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.15)] bg-slate-900/80';
    }
    if (onHighlight) {
      return 'border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-slate-900/90';
    }
    return 'border-slate-800/90 hover:border-slate-700 bg-slate-900/70';
  };

  return (
    <div
      id={`solution-panel-${modelNumber}`}
      className={`relative flex flex-col rounded-2xl border transition-all duration-500 backdrop-blur-xl overflow-hidden min-h-[480px] shadow-2xl ${getPanelBorderClass()}`}
    >
      {/* Top Banner Indicator for Winner */}
      {isWinner && isEvaluated && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-4 py-1.5 flex items-center justify-between text-slate-950 text-xs font-mono font-bold tracking-wider uppercase shadow-md">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 fill-slate-950" />
            <span>VICTORIOUS MODEL</span>
          </div>
          <span>SCORE: {score?.toFixed(1)} / 10</span>
        </div>
      )}

      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border font-mono font-bold text-sm ${
              modelNumber === '01'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
            }`}
          >
            <Bot className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                MODEL {modelNumber}
              </span>
              <span className="text-slate-600">•</span>
              <h3 className="text-base font-bold text-white font-mono tracking-wide">
                {model.name}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">{model.version}</p>
          </div>
        </div>

        {/* Right Header Status / Scores */}
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Generating...</span>
            </div>
          ) : isEvaluated && score !== undefined ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-mono text-xs font-bold ${
                isWinner
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700'
              }`}
            >
              <span>Score:</span>
              <span className="text-sm font-extrabold">{score.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400">/ 10</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span>Completed</span>
            </div>
          )}

          {/* Copy Button */}
          {solution && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              title="Copy Solution"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Solution Body */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto text-slate-200 leading-relaxed text-sm">
        {isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-16 h-16 rounded-full border-2 border-t-transparent animate-spin ${
                  modelNumber === '01' ? 'border-orange-400' : 'border-cyan-400'
                }`}
              ></div>
              <Activity
                className={`w-6 h-6 absolute animate-pulse ${
                  modelNumber === '01' ? 'text-orange-400' : 'text-cyan-400'
                }`}
              />
            </div>
            <div>
              <p className="font-mono text-sm font-medium text-slate-300">
                Synthesizing response for {model.name}...
              </p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Executing LangGraph agent invoke pipeline
              </p>
            </div>

            {/* Subtle animated placeholder lines */}
            <div className="w-full max-w-sm space-y-2.5 pt-4 opacity-30">
              <div className="h-3 bg-slate-700 rounded-full animate-pulse"></div>
              <div className="h-3 bg-slate-700 rounded-full w-5/6 animate-pulse delay-75"></div>
              <div className="h-3 bg-slate-700 rounded-full w-4/6 animate-pulse delay-150"></div>
            </div>
          </div>
        ) : solution ? (
          <MarkdownView content={solution} />
        ) : (
          <div className="h-full flex items-center justify-center py-16 text-slate-500 text-sm font-mono italic">
            Awaiting battle start...
          </div>
        )}
      </div>

      {/* Footer Info */}
      {solution && !isGenerating && (
        <div className="px-5 py-2.5 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{solution.length} characters</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Terminal className="w-3 h-3 text-cyan-400/80" />
            <span>Output Verified</span>
          </div>
        </div>
      )}
    </div>
  );
};
