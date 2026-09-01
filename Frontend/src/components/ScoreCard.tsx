import React from 'react';
import { Bot, Trophy, CheckCircle, ArrowUpRight } from 'lucide-react';
import { ModelInfo } from '../types/battle';

interface ScoreCardProps {
  modelNumber: '01' | '02';
  model: ModelInfo;
  score: number;
  isWinner: boolean;
  isTie?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  modelNumber,
  model,
  score,
  isWinner,
  isTie = false,
}) => {
  // Score percentage for gauge
  const scorePercentage = Math.min(100, Math.max(0, (score / 10) * 100));

  return (
    <div
      className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-500 backdrop-blur-xl border ${
        isWinner
          ? 'bg-gradient-to-b from-amber-950/30 via-slate-900/80 to-slate-900/70 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider ${
              modelNumber === '01'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            MODEL {modelNumber}
          </span>
          <span className="text-xs font-mono text-slate-400 font-semibold">{model.name}</span>
        </div>

        {isWinner && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
            <Trophy className="w-3.5 h-3.5 fill-amber-300" />
            <span>WINNER</span>
          </div>
        )}
        {isTie && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold">
            <span>TIE SCORE</span>
          </div>
        )}
      </div>

      {/* Large Score Display */}
      <div className="flex items-baseline gap-2 mb-3">
        <span
          className={`text-5xl sm:text-6xl font-extrabold font-mono tracking-tight ${
            isWinner
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400'
              : 'text-white'
          }`}
        >
          {score.toFixed(1)}
        </span>
        <span className="text-xl sm:text-2xl font-mono text-slate-500 font-bold">/ 10</span>
      </div>

      {/* Score Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden mb-3 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isWinner
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
              : modelNumber === '01'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500'
          }`}
          style={{ width: `${scorePercentage}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>{model.version}</span>
        <span className={score >= 8.5 ? 'text-emerald-400' : score >= 6.0 ? 'text-cyan-400' : 'text-amber-400'}>
          {score >= 9.0 ? 'Exceptional' : score >= 7.5 ? 'Strong Output' : score >= 5.0 ? 'Moderate' : 'Needs Work'}
        </span>
      </div>
    </div>
  );
};
