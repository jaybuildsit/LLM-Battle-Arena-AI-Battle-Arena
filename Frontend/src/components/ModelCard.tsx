import React from 'react';
import { Bot, Scale, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { COMPETITOR_MODELS } from '../services/mockData';

export const ModelConfigurationCards: React.FC = () => {
  const m1 = COMPETITOR_MODELS.model_1;
  const m2 = COMPETITOR_MODELS.model_2;
  const judge = COMPETITOR_MODELS.judge;

  return (
    <div className="w-full my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            Active Combatants & Arbiter
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Autonomous Tri-Model Pipeline</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MODEL 01: MISTRAL */}
        <div className="relative rounded-xl bg-slate-900/60 border border-orange-500/20 hover:border-orange-500/40 p-4 transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
                MODEL 01
              </span>
              <span className="text-xs text-slate-400 font-mono">Competitor</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Ready</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-mono tracking-wide flex items-center gap-1.5">
                {m1.name}
              </h4>
              <p className="text-xs text-slate-400">{m1.version}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
            {m1.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
            {m1.strengths.map((str) => (
              <span
                key={str}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/60 text-slate-300 border border-slate-700/50"
              >
                {str}
              </span>
            ))}
          </div>
        </div>

        {/* MODEL 02: COHERE */}
        <div className="relative rounded-xl bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/40 p-4 transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                MODEL 02
              </span>
              <span className="text-xs text-slate-400 font-mono">Competitor</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Ready</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-mono tracking-wide flex items-center gap-1.5">
                {m2.name}
              </h4>
              <p className="text-xs text-slate-400">{m2.version}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
            {m2.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
            {m2.strengths.map((str) => (
              <span
                key={str}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/60 text-slate-300 border border-slate-700/50"
              >
                {str}
              </span>
            ))}
          </div>
        </div>

        {/* INDEPENDENT JUDGE: GEMINI */}
        <div className="relative rounded-xl bg-gradient-to-b from-purple-950/30 via-slate-900/70 to-slate-900/60 border border-purple-500/30 hover:border-purple-500/50 p-4 transition-all duration-300 group shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                JUDGE
              </span>
              <span className="text-xs text-purple-300 font-mono">Arbiter</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-[10px] font-mono text-purple-300 font-semibold">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Independent Judge</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Scale className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-mono tracking-wide flex items-center gap-1.5">
                {judge.name}
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </h4>
              <p className="text-xs text-purple-300/80">{judge.version}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
            {judge.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
            {judge.strengths.map((str) => (
              <span
                key={str}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-950/40 text-purple-300 border border-purple-800/50"
              >
                {str}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
