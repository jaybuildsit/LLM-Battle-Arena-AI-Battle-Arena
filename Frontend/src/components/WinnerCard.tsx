import React from 'react';
import { Trophy, ArrowDownCircle, Sparkles, Award } from 'lucide-react';
import { ModelInfo } from '../types/battle';

interface WinnerCardProps {
  winnerModel: ModelInfo | null;
  winnerScore: number;
  winnerReasoning: string;
  isTie?: boolean;
  onViewWinningSolution: () => void;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({
  winnerModel,
  winnerScore,
  winnerReasoning,
  isTie = false,
  onViewWinningSolution,
}) => {
  if (isTie) {
    return (
      <div className="w-full max-w-2xl mx-auto my-8 p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900/90 to-slate-900 border border-blue-500/40 text-center shadow-[0_0_35px_rgba(59,130,246,0.15)] backdrop-blur-xl">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-3">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase mb-1">
          BATTLE OUTCOME
        </h3>
        <h2 className="text-3xl font-extrabold font-mono text-white mb-2">
          DEAD HEAT TIE
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
          Both competitors scored identically ({winnerScore.toFixed(1)} / 10). The arbiter determined both solutions possess comparable merit.
        </p>
      </div>
    );
  }

  if (!winnerModel) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 relative group">
      {/* Ambient background glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>

      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-[#0d121c] to-[#0a0e17] border border-amber-500/40 p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl">
        
        {/* Trophy icon with glowing ring */}
        <div className="inline-flex items-center justify-center relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </div>

        {/* Winner Tag */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ARENA CHAMPION</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Model Name */}
        <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-yellow-300 mb-2 tracking-wide">
          {winnerModel.name.toUpperCase()}
        </h2>

        {/* Score Badge */}
        <div className="inline-flex items-baseline gap-1.5 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 mb-4">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
            {winnerScore.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-amber-400/70 font-semibold">/ 10.0</span>
        </div>

        {/* Judge quote excerpt */}
        {winnerReasoning && (
          <p className="text-slate-300 text-sm sm:text-base italic max-w-lg mx-auto leading-relaxed mb-6 font-sans border-t border-b border-slate-800/80 py-3">
            "{winnerReasoning}"
          </p>
        )}

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={onViewWinningSolution}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>View Winning Solution</span>
          </button>
        </div>
      </div>
    </div>
  );
};
