/**
 * HUDOverlay: World-matched, low-occlusion arcade heads-up display.
 */

import React from 'react';
import { Pause, Zap, Shield, Heart, Coins } from 'lucide-react';

interface HUDOverlayProps {
  score: number;
  combo: number;
  coins: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  specialReady: boolean;
  specialRatio: number;
  specialName: string;
  wave: number;
  totalWaves: number;
  bossInfo: {
    active: boolean;
    name: string;
    health: number;
    maxHealth: number;
    phase: number;
    maxPhases: number;
  } | null;
  onPause: () => void;
  onSpecial: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  score,
  combo,
  coins,
  health,
  maxHealth,
  shield,
  maxShield,
  specialReady,
  specialRatio,
  specialName,
  wave,
  totalWaves,
  bossInfo,
  onPause,
  onSpecial,
}) => {
  const hpPct = Math.max(0, Math.min(100, (health / Math.max(1, maxHealth)) * 100));
  const shieldPct = Math.max(0, Math.min(100, (shield / Math.max(1, maxShield)) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-4 z-20">
      {/* Top Header Bar */}
      <div className="w-full flex items-start justify-between gap-4">
        {/* Left: Player Status Gauge Cluster */}
        <div className="flex flex-col gap-1.5 min-w-[170px] sm:min-w-[220px]">
          {/* Hull Bar */}
          <div className="bg-slate-900/85 backdrop-blur-none border-2 border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> HULL
              </span>
              <span className="tabular-nums font-mono text-slate-100">{Math.ceil(health)} / {maxHealth}</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  hpPct > 50 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : hpPct > 25 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${hpPct}%` }}
              />
            </div>
          </div>

          {/* Shield Bar */}
          <div className="bg-slate-900/85 border-2 border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300 mb-1">
              <span className="flex items-center gap-1 text-cyan-400">
                <Shield className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" /> SHIELD
              </span>
              <span className="tabular-nums font-mono text-slate-100">{Math.ceil(shield)} / {maxShield}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300 transition-all duration-150"
                style={{ width: `${shieldPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Boss Health Bar if Active, or Mission Wave */}
        {bossInfo && bossInfo.active ? (
          <div className="flex-1 max-w-sm sm:max-w-md mx-2 animate-bounce-short">
            <div className="bg-rose-950/90 border-2 border-rose-600 rounded-xl px-3 py-2 shadow-2xl text-center">
              <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-1 font-arcade uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                  {bossInfo.name}
                </span>
                <span className="bg-rose-900/90 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  PHASE {bossInfo.phase} / {bossInfo.maxPhases}
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-rose-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 transition-all duration-150"
                  style={{ width: `${Math.max(0, Math.min(100, (bossInfo.health / bossInfo.maxHealth) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-full px-4 py-1.5 shadow-md flex items-center gap-2">
            <span className="text-slate-400 text-xs font-bold font-cartoon uppercase">Wave</span>
            <span className="text-white font-mono font-bold text-sm tabular-nums">
              {wave} <span className="text-slate-500">/</span> {totalWaves}
            </span>
          </div>
        )}

        {/* Right: Score, Coins, and Pause Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</div>
            <div className="text-lg sm:text-2xl font-bold font-tech text-white tabular-nums tracking-wide text-shadow-arcade">
              {score.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="tabular-nums font-mono">{coins}</span>
            </div>
          </div>

          <button
            onClick={onPause}
            className="pointer-events-auto p-2 sm:p-2.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 border border-slate-600 text-white rounded-xl shadow-lg transition-all"
            title="Pause Game (Esc)"
          >
            <Pause className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Center Combo Pop (Transient) */}
      {combo > 1 && (
        <div className="self-center mb-auto mt-6 animate-pulse">
          <div className="bg-amber-500/20 border-2 border-amber-400/80 rounded-2xl px-4 py-1.5 backdrop-blur-none shadow-xl text-center">
            <div className="font-arcade text-lg sm:text-2xl text-amber-300 font-bold tracking-wider text-shadow-amber">
              {combo}x COMBO!
            </div>
            <div className="text-[10px] font-bold text-amber-200 uppercase">+{combo * 10}% Bonus</div>
          </div>
        </div>
      )}

      {/* Bottom Floating Special Ability Button (clickable on desktop or mobile) */}
      <div className="w-full flex items-end justify-between">
        <button
          onClick={onSpecial}
          disabled={!specialReady}
          className={`pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border-2 transition-all shadow-xl ${
            specialReady
              ? 'bg-gradient-to-r from-fuchsia-600 to-pink-500 border-pink-300 text-white scale-100 hover:scale-105 active:scale-95 animate-pulse cursor-pointer'
              : 'bg-slate-900/80 border-slate-700/80 text-slate-500 cursor-not-allowed'
          }`}
          title="Activate Special (Shift)"
        >
          <div className="relative w-8 h-8 rounded-full bg-slate-950/70 flex items-center justify-center border border-white/20">
            <Zap className={`w-4 h-4 ${specialReady ? 'fill-yellow-300 text-yellow-300' : 'text-slate-500'}`} />
            {!specialReady && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="88"
                  strokeDashoffset={88 * (1 - specialRatio)}
                />
              </svg>
            )}
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase text-slate-300 leading-none">
              Special (Shift)
            </div>
            <div className="text-xs font-bold font-arcade tracking-wide leading-tight">
              {specialReady ? specialName : 'Charging...'}
            </div>
          </div>
        </button>

        {/* Controls Quick Hint */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 font-mono shadow-md">
          <span className="text-emerald-400 font-bold">● Auto-Firing</span>
          <span>•</span>
          <span>Move Mouse / Drag to Steer</span>
          <span>•</span>
          <span>Shift / Click Special</span>
          <span>•</span>
          <span>Esc Pause</span>
        </div>
      </div>
    </div>
  );
};
