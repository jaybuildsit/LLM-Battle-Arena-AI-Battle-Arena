import React, { useState } from 'react';
import { X, Search, Trophy, Calendar, Clock, Trash2, ArrowRight, ExternalLink, History } from 'lucide-react';
import { BattleRecord } from '../types/battle';

interface BattleHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: BattleRecord[];
  onSelectBattle: (battle: BattleRecord) => void;
  onClearHistory: () => void;
}

export const BattleHistoryModal: React.FC<BattleHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectBattle,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((b) =>
    b.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.model_1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.model_2.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white">Battle History Archive</h3>
              <p className="text-xs text-slate-400 font-mono">
                {history.length} recorded arena competitions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-rose-400 hover:bg-rose-950/40 border border-rose-900/50 transition-colors cursor-pointer"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past battles by prompt, model name..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>
        </div>

        {/* History List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm">
              No battle records match your query.
            </div>
          ) : (
            filteredHistory.map((battle) => {
              const score1 = battle.judge.solution_1_score;
              const score2 = battle.judge.solution_2_score;
              const winnerName = score1 > score2 ? battle.model_1 : score2 > score1 ? battle.model_2 : 'Tie';
              const dateStr = new Date(battle.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={battle.id}
                  onClick={() => {
                    onSelectBattle(battle);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      "{battle.problem}"
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                      <Trophy className="w-3 h-3" />
                      <span>{winnerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span>
                        {battle.model_1} <strong className="text-white">{score1.toFixed(1)}</strong>
                      </span>
                      <span className="text-slate-600">vs</span>
                      <span>
                        {battle.model_2} <strong className="text-white">{score2.toFixed(1)}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform ml-1" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
