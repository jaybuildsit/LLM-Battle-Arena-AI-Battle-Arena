import React from 'react';
import { AlertTriangle, RefreshCw, Sparkles, Terminal } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  onRunSimulation: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
  onRunSimulation,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-rose-950/30 via-slate-900/90 to-slate-900 border border-rose-500/40 text-center shadow-[0_0_35px_rgba(244,63,94,0.15)] backdrop-blur-xl animate-fadeIn">
      
      {/* Icon */}
      <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
        <AlertTriangle className="w-8 h-8 animate-pulse" />
      </div>

      {/* Heading */}
      <h3 className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase mb-1">
        TELEMETRY EXCEPTION
      </h3>
      <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-3">
        Battle Could Not Be Completed
      </h2>

      {/* Error message detail */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-rose-300/90 max-w-lg mx-auto mb-6 text-left overflow-x-auto leading-relaxed">
        <div className="flex items-center gap-1.5 text-slate-500 mb-1 border-b border-slate-800 pb-1">
          <Terminal className="w-3 h-3" />
          <span>Error Diagnostics</span>
        </div>
        <span>{errorMessage || 'One of the AI models or the independent judge failed to respond within the expected threshold.'}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={onRunSimulation}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 shadow-lg transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Switch to Demo Simulation</span>
        </button>
      </div>
    </div>
  );
};
