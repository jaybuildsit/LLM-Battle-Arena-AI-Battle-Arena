import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { PromptInput } from '../components/PromptInput';
import { ModelConfigurationCards } from '../components/ModelCard';
import { BattleArena } from '../components/BattleArena';
import { BattleHistoryModal } from '../components/BattleHistoryModal';
import { ModelsModal } from '../components/ModelsModal';
import { SettingsModal } from '../components/SettingsModal';
import { ErrorState } from '../components/ErrorState';
import { BattleRecord, BattleStatus } from '../types/battle';
import { COMPETITOR_MODELS, INITIAL_BATTLE_HISTORY } from '../services/mockData';
import { executeBattleApi } from '../services/api';

const STORAGE_KEY_HISTORY = 'ai_battle_arena_history_v1';
const STORAGE_KEY_API_URL = 'ai_battle_arena_api_url_v1';
const STORAGE_KEY_SIMULATING = 'ai_battle_arena_simulating_v1';

export function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [status, setStatus] = useState<BattleStatus>('idle');
  const [currentBattle, setCurrentBattle] = useState<BattleRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isModelsOpen, setIsModelsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Settings state
  const [apiUrl, setApiUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_API_URL) || '/api';
  });
  const [isSimulating, setIsSimulating] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_SIMULATING) === 'true';
  });

  // History state
  const [history, setHistory] = useState<BattleRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return INITIAL_BATTLE_HISTORY;
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Ignore storage errors
    }
  }, [history]);

  // Save API URL
  const handleSaveApiUrl = (newUrl: string) => {
    setApiUrl(newUrl);
    localStorage.setItem(STORAGE_KEY_API_URL, newUrl);
  };

  // Save simulation toggle
  const handleToggleSimulating = (sim: boolean) => {
    setIsSimulating(sim);
    localStorage.setItem(STORAGE_KEY_SIMULATING, String(sim));
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  };

  // Initiate AI Battle
  const handleStartBattle = async () => {
    if (!prompt.trim() || status === 'generating' || status === 'evaluating') return;

    const startTime = Date.now();
    setStatus('generating');
    setErrorMessage('');

    // Pre-initialize empty current battle
    setCurrentBattle({
      id: `battle-${Date.now()}`,
      timestamp: startTime,
      problem: prompt.trim(),
      model_1: COMPETITOR_MODELS.model_1.name,
      model_2: COMPETITOR_MODELS.model_2.name,
      judge_model: COMPETITOR_MODELS.judge.name,
      solution_1: '',
      solution_2: '',
      judge: {
        solution_1_score: 0,
        solution_2_score: 0,
        solution_1_reasoning: '',
        solution_2_reasoning: '',
      },
      winner: 'tie',
    });

    try {
      // Execute battle via API
      const result = await executeBattleApi(prompt.trim(), {
        apiUrl,
        forceSimulation: isSimulating,
      });

      // Update solutions
      setCurrentBattle((prev) =>
        prev
          ? {
              ...prev,
              solution_1: result.solution_1,
              solution_2: result.solution_2,
            }
          : null
      );

      // Transition to evaluating phase
      setStatus('evaluating');

      // Dramatic judge suspense pause (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const score1 = result.judge.solution_1_score;
      const score2 = result.judge.solution_2_score;
      const winner = score1 > score2 ? 'model_1' : score2 > score1 ? 'model_2' : 'tie';

      const completedRecord: BattleRecord = {
        id: `battle-${Date.now()}`,
        timestamp: Date.now(),
        problem: prompt.trim(),
        model_1: COMPETITOR_MODELS.model_1.name,
        model_2: COMPETITOR_MODELS.model_2.name,
        judge_model: COMPETITOR_MODELS.judge.name,
        solution_1: result.solution_1,
        solution_2: result.solution_2,
        judge: result.judge,
        winner,
        durationMs: Date.now() - startTime,
      };

      setCurrentBattle(completedRecord);
      setStatus('completed');

      // Add to history
      setHistory((prev) => [completedRecord, ...prev.filter((b) => b.problem !== completedRecord.problem)]);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Battle execution failed. Check backend connectivity.');
      setStatus('error');
    }
  };

  // Reset to New Battle
  const handleNewBattle = () => {
    setStatus('idle');
    setPrompt('');
    setCurrentBattle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select historical battle
  const handleSelectHistoricalBattle = (battle: BattleRecord) => {
    setPrompt(battle.problem);
    setCurrentBattle(battle);
    setStatus('completed');
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-grid-pattern relative flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-radial-glow pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <Navbar
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenModels={() => setIsModelsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSimulating={isSimulating}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* HERO & PROMPT INPUT AREA */}
        <PromptInput
          prompt={prompt}
          onChangePrompt={setPrompt}
          onSubmit={handleStartBattle}
          isLoading={status === 'generating' || status === 'evaluating'}
        />

        {/* ERROR STATE */}
        {status === 'error' && (
          <ErrorState
            errorMessage={errorMessage}
            onRetry={handleStartBattle}
            onRunSimulation={() => {
              handleToggleSimulating(true);
              setTimeout(() => handleStartBattle(), 100);
            }}
          />
        )}

        {/* IDLE STATE: SHOW MODEL COMBATANTS CARDS */}
        {status === 'idle' && <ModelConfigurationCards />}

        {/* ACTIVE BATTLE ARENA (generating, evaluating, completed) */}
        {(status === 'generating' || status === 'evaluating' || status === 'completed') && currentBattle && (
          <BattleArena
            prompt={currentBattle.problem}
            status={status}
            model1={COMPETITOR_MODELS.model_1}
            model2={COMPETITOR_MODELS.model_2}
            judgeModel={COMPETITOR_MODELS.judge}
            solution1={currentBattle.solution_1}
            solution2={currentBattle.solution_2}
            judgeResult={status === 'completed' ? currentBattle.judge : null}
            onNewBattle={handleNewBattle}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800/60 py-6 bg-[#07090e]/80 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
          <span>AI Battle Arena • Express + LangGraph Tri-Model Architecture</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Mistral Medium</span>
            <span>•</span>
            <span>Cohere Command</span>
            <span>•</span>
            <span className="text-purple-400">Gemini 3.6 Flash Arbiter</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <BattleHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectBattle={handleSelectHistoricalBattle}
        onClearHistory={handleClearHistory}
      />

      <ModelsModal
        isOpen={isModelsOpen}
        onClose={() => setIsModelsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiUrl={apiUrl}
        onSaveApiUrl={handleSaveApiUrl}
        isSimulating={isSimulating}
        onToggleSimulating={handleToggleSimulating}
      />
    </div>
  );
}

export default App;
