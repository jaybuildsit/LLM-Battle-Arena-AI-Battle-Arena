import React, { useState, useRef, useEffect } from 'react';
import { Swords, Sparkles, Shuffle, CornerDownLeft, Eraser, Terminal } from 'lucide-react';
import { PRESET_PROMPTS } from '../services/mockData';

interface PromptInputProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onChangePrompt,
  onSubmit,
  isLoading,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(110, textareaRef.current.scrollHeight)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (prompt.trim() && !isLoading && !disabled) {
        onSubmit();
      }
    }
  };

  const handleSelectPreset = (text: string) => {
    onChangePrompt(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleRandomPreset = () => {
    const randomItem = PRESET_PROMPTS[Math.floor(Math.random() * PRESET_PROMPTS.length)];
    onChangePrompt(randomItem.prompt);
  };

  // Rough estimation of tokens
  const tokenEstimate = Math.ceil(prompt.trim().length / 4);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* HERO SECTION */}
      <div className="text-center max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>LLM BENCHMARKING ENGINE</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
          <span>LANGGRAPH POWERED</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 font-mono">
          Let AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-cyan-300 to-purple-400">Battle It Out.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Compare multiple AI models in real time. An independent arbiter scores accuracy, rigor, and depth to crown the victor.
        </p>
      </div>

      {/* PROMPT CARD */}
      <div className="w-full max-w-4xl">
        <div
          className={`relative rounded-2xl transition-all duration-300 ${
            isFocused
              ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.2)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-xl'
          } border backdrop-blur-xl p-4 sm:p-5`}
        >
          {/* Preset Prompts Chips */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80 overflow-x-auto">
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Presets:
              </span>
              {PRESET_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSelectPreset(item.prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/60 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleRandomPreset}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                title="Pick Random Prompt"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
              {prompt && (
                <button
                  type="button"
                  onClick={() => onChangePrompt('')}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  title="Clear input"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => onChangePrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || disabled}
              placeholder="Enter a problem, question, or task for the models..."
              rows={3}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base resize-none focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Bottom Card Controls: Token count & Start Battle Button */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>{prompt.length} chars</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400/90 font-medium">~{tokenEstimate} tokens</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                  Ctrl
                </kbd>
                +
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                  Enter
                </kbd>
              </span>
            </div>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!prompt.trim() || isLoading || disabled}
              className={`relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-mono text-sm font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                !prompt.trim() || isLoading || disabled
                  ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.99] border border-cyan-400/30'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <span>BATTLE IN PROGRESS...</span>
                </>
              ) : (
                <>
                  <Swords className="w-4 h-4 text-cyan-200" />
                  <span>⚔ START BATTLE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
