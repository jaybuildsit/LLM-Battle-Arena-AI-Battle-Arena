export type BattleStatus = 'idle' | 'generating' | 'evaluating' | 'completed' | 'error';

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  provider: string;
  color: string;
  accentHex: string;
  borderGlow: string;
  bgGlow: string;
  description: string;
  strengths: string[];
  role: 'competitor' | 'judge';
}

export interface JudgeResult {
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
}

export interface BattleApiResponse {
  problem: string;
  solution_1: string;
  solution_2: string;
  judge: JudgeResult;
}

export interface BattleRecord {
  id: string;
  timestamp: number;
  problem: string;
  model_1: string;
  model_2: string;
  judge_model: string;
  solution_1: string;
  solution_2: string;
  judge: JudgeResult;
  winner: 'model_1' | 'model_2' | 'tie';
  durationMs?: number;
}
