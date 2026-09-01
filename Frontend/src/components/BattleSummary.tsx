import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Share2, FileCode, CheckCircle, Trophy, Scale } from 'lucide-react';
import { BattleRecord, ModelInfo } from '../types/battle';

interface BattleSummaryProps {
  prompt: string;
  model1: ModelInfo;
  model2: ModelInfo;
  judgeModel: ModelInfo;
  score1: number;
  score2: number;
  winnerModelName: string;
  onNewBattle: () => void;
  fullBattleRecord?: BattleRecord;
}

export const BattleSummary: React.FC<BattleSummaryProps> = ({
  prompt,
  model1,
  model2,
  judgeModel,
  score1,
  score2,
  winnerModelName,
  onNewBattle,
  fullBattleRecord,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `⚔️ AI BATTLE ARENA REPORT ⚔️
======================================
Prompt: "${prompt}"

Competitors:
• ${model1.name} (${model1.version}) - Score: ${score1.toFixed(1)}/10
• ${model2.name} (${model2.version}) - Score: ${score2.toFixed(1)}/10

Independent Judge:
• ${judgeModel.name} (${judgeModel.version})

🏆 ARENA WINNER: ${winnerModelName} (${Math.max(score1, score2).toFixed(1)}/10)
======================================
Evaluated via LangGraph & Gemini Arbiter`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-8 p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
          <h3 className="text-sm font-mono font-bold tracking-widest text-slate-200 uppercase">
            Battle Summary & Telemetry
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">Autonomous Verdict Log</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* LEFT COLUMN: Prompt & Participants */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-1">
              Prompt
            </span>
            <p className="text-slate-200 text-sm font-sans italic bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              "{prompt}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 block mb-0.5">Competitors</span>
              <span className="text-slate-200 font-semibold">
                {model1.name} <span className="text-slate-500">vs</span> {model2.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Judge</span>
              <span className="text-purple-300 font-semibold">{judgeModel.name}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scores & Winner */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-1">
              Score Breakdown
            </span>
            <div className="space-y-1.5 font-mono text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  {model1.name}
                </span>
                <span className="font-bold text-white">{score1.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  {model2.name}
                </span>
                <span className="font-bold text-white">{score2.toFixed(1)} / 10</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-1">
              Winner
            </span>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <Trophy className="w-4 h-4 fill-amber-400" />
              <span>{winnerModelName}</span>
              <span className="text-amber-400/60 ml-auto font-normal">
                ({Math.max(score1, score2).toFixed(1)} / 10)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80 flex-wrap gap-3">
        <button
          type="button"
          onClick={onNewBattle}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Battle</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied Report</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Result</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
