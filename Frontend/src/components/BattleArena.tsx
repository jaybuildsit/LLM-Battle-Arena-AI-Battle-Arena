import React, { useState } from 'react';
import { Swords, Bot, Scale, Trophy, Flame, ChevronRight } from 'lucide-react';
import { BattleStatus, JudgeResult, ModelInfo } from '../types/battle';
import { SolutionPanel } from './SolutionPanel';
import { JudgePanel } from './JudgePanel';
import { BattleSummary } from './BattleSummary';

interface BattleArenaProps {
  prompt: string;
  status: BattleStatus;
  model1: ModelInfo;
  model2: ModelInfo;
  judgeModel: ModelInfo;
  solution1: string;
  solution2: string;
  judgeResult: JudgeResult | null;
  onNewBattle: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  prompt,
  status,
  model1,
  model2,
  judgeModel,
  solution1,
  solution2,
  judgeResult,
  onNewBattle,
}) => {
  const [highlightedModel, setHighlightedModel] = useState<'01' | '02' | null>(null);

  const isGenerating = status === 'generating';
  const isEvaluating = status === 'evaluating';
  const isCompleted = status === 'completed';

  const score1 = judgeResult?.solution_1_score ?? 0;
  const score2 = judgeResult?.solution_2_score ?? 0;

  const isModel1Winner = isCompleted && score1 > score2;
  const isModel2Winner = isCompleted && score2 > score1;
  const winnerModelName = isModel1Winner ? model1.name : isModel2Winner ? model2.name : 'Tie';

  const handleViewWinningSolution = (modelNumber: '01' | '02') => {
    setHighlightedModel(modelNumber);
    const el = document.getElementById(`solution-panel-${modelNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedModel(null);
    }, 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-2 sm:px-4">
      
      {/* BATTLE ARENA TOP STATUS BAR */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 mb-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block">
                ARENA STATE
              </span>
              <h2 className="text-sm sm:text-base font-bold font-mono text-white flex items-center gap-2">
                {isGenerating && <span className="text-cyan-400 animate-pulse">⚔ BATTLE IN PROGRESS — MODELS GENERATING</span>}
                {isEvaluating && <span className="text-purple-400 animate-pulse">⚖ ARBITER EVALUATION IN PROGRESS</span>}
                {isCompleted && <span className="text-emerald-400">🏆 BATTLE CONCLUDED & VERIFIED</span>}
              </h2>
            </div>
          </div>

          {/* Workflow Stepper */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span className={`px-2 py-0.5 rounded ${isGenerating ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500'}`}>
              1. Synthesize
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className={`px-2 py-0.5 rounded ${isEvaluating ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-500'}`}>
              2. Judge
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className={`px-2 py-0.5 rounded ${isCompleted ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500'}`}>
              3. Outcome
            </span>
          </div>
        </div>

        {/* Prompt Recap */}
        <div className="mt-3 text-xs font-mono text-slate-400 flex items-start gap-2">
          <span className="text-cyan-400 font-bold uppercase shrink-0">Topic:</span>
          <span className="text-slate-200 line-clamp-2 font-sans italic">"{prompt}"</span>
        </div>
      </div>

      {/* TWO-COLUMN SOLUTION PANELS (Desktop) / STACKED (Mobile) */}
      <div className="relative">
        
        {/* Central VS Badge (Desktop floating overlay) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#07090e] border-2 border-slate-700/80 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center text-xs font-mono font-extrabold text-cyan-300 tracking-wider">
            VS
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT SOLUTION PANEL: MISTRAL */}
          <SolutionPanel
            modelNumber="01"
            model={model1}
            solution={solution1}
            isGenerating={isGenerating}
            score={judgeResult?.solution_1_score}
            isWinner={isModel1Winner}
            isEvaluated={isCompleted}
            onHighlight={highlightedModel === '01'}
          />

          {/* MOBILE VS DIVIDER */}
          <div className="flex lg:hidden items-center justify-center my-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shadow-lg">
              VS
            </div>
          </div>

          {/* RIGHT SOLUTION PANEL: COHERE */}
          <SolutionPanel
            modelNumber="02"
            model={model2}
            solution={solution2}
            isGenerating={isGenerating}
            score={judgeResult?.solution_2_score}
            isWinner={isModel2Winner}
            isEvaluated={isCompleted}
            onHighlight={highlightedModel === '02'}
          />
        </div>
      </div>

      {/* JUDGE SECTION */}
      <JudgePanel
        isEvaluating={isEvaluating}
        isEvaluated={isCompleted}
        judgeResult={judgeResult}
        model1={model1}
        model2={model2}
        judgeModel={judgeModel}
        onViewWinningSolution={handleViewWinningSolution}
      />

      {/* BATTLE SUMMARY AT BOTTOM */}
      {isCompleted && (
        <BattleSummary
          prompt={prompt}
          model1={model1}
          model2={model2}
          judgeModel={judgeModel}
          score1={score1}
          score2={score2}
          winnerModelName={winnerModelName}
          onNewBattle={onNewBattle}
        />
      )}
    </div>
  );
};
