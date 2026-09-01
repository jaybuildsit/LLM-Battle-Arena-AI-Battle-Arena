import React from 'react';
import { Scale, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { JudgeResult, ModelInfo } from '../types/battle';
import { ScoreCard } from './ScoreCard';
import { ReasoningPanel } from './ReasoningPanel';
import { WinnerCard } from './WinnerCard';

interface JudgePanelProps {
  isEvaluating: boolean;
  isEvaluated: boolean;
  judgeResult: JudgeResult | null;
  model1: ModelInfo;
  model2: ModelInfo;
  judgeModel: ModelInfo;
  onViewWinningSolution: (modelNumber: '01' | '02') => void;
}

export const JudgePanel: React.FC<JudgePanelProps> = ({
  isEvaluating,
  isEvaluated,
  judgeResult,
  model1,
  model2,
  judgeModel,
  onViewWinningSolution,
}) => {
  if (!isEvaluating && !isEvaluated) return null;

  const score1 = judgeResult?.solution_1_score ?? 0;
  const score2 = judgeResult?.solution_2_score ?? 0;

  const isModel1Winner = score1 > score2;
  const isModel2Winner = score2 > score1;
  const isTie = score1 === score2 && isEvaluated;

  const winnerModel = isModel1Winner ? model1 : isModel2Winner ? model2 : null;
  const winnerScore = isModel1Winner ? score1 : score2;
  const winnerReasoning = isModel1Winner
    ? judgeResult?.solution_1_reasoning ?? ''
    : judgeResult?.solution_2_reasoning ?? '';

  return (
    <div id="judge-section" className="w-full my-10 pt-8 border-t border-slate-800/80 transition-all duration-700">
      
      {/* JUDGE HEADER BANNER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono mb-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <Scale className="w-4 h-4 text-purple-400" />
          <span>INDEPENDENT ARBITER</span>
          <span className="w-1 h-1 rounded-full bg-purple-400"></span>
          <span>{judgeModel.name} ({judgeModel.version})</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wide flex items-center justify-center gap-2">
          <span>⚖ AI JUDGE EVALUATION</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1 font-mono">
          Rigorous impartial evaluation scored on correctness, depth, architecture, and instruction fidelity.
        </p>
      </div>

      {/* EVALUATING LOADING STATE */}
      {isEvaluating && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin"></div>
            <Scale className="w-8 h-8 text-purple-300 absolute animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold font-mono text-purple-200">
              Evaluating both solutions...
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Gemini arbiter is executing multi-factor rubric comparison
            </p>
          </div>

          <div className="flex justify-center items-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100"></span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200"></span>
          </div>
        </div>
      )}

      {/* EVALUATION RESULTS */}
      {isEvaluated && judgeResult && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* WINNER HERO CARD */}
          <WinnerCard
            winnerModel={winnerModel}
            winnerScore={winnerScore}
            winnerReasoning={winnerReasoning}
            isTie={isTie}
            onViewWinningSolution={() => {
              if (isModel1Winner) onViewWinningSolution('01');
              else if (isModel2Winner) onViewWinningSolution('02');
            }}
          />

          {/* SIDE-BY-SIDE SCORE COMPARISON CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <ScoreCard
              modelNumber="01"
              model={model1}
              score={score1}
              isWinner={isModel1Winner}
              isTie={isTie}
            />
            <ScoreCard
              modelNumber="02"
              model={model2}
              score={score2}
              isWinner={isModel2Winner}
              isTie={isTie}
            />
          </div>

          {/* EXPANDABLE REASONING ACCORDIONS */}
          <ReasoningPanel
            model1={model1}
            model2={model2}
            score1={score1}
            score2={score2}
            reasoning1={judgeResult.solution_1_reasoning}
            reasoning2={judgeResult.solution_2_reasoning}
          />
        </div>
      )}
    </div>
  );
};
