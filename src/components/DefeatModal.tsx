/**
 * DefeatModal: Second-chance revival, score summary, and retry options.
 */

import React from 'react';
import { Skull, Key, RotateCcw, Home, Sparkles } from 'lucide-react';
import { sound } from '../game/audio/SoundEffects';
import { PlayerStats } from '../game/types';
import { SaveManager } from '../game/SaveManager';

interface DefeatModalProps {
  score: number;
  coins: number;
  stats: PlayerStats;
  onRevive: () => void;
  onRetry: () => void;
  onReturnToMenu: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({
  score,
  coins,
  stats,
  onRevive,
  onRetry,
  onReturnToMenu,
}) => {
  const saveMgr = SaveManager.getInstance();
  const revivalKeys = saveMgr.getData().revivalKeys;
  const canRevive = revivalKeys > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center mb-2">
          <Skull className="w-8 h-8" />
        </div>

        <h3 className="text-3xl font-arcade text-rose-500 uppercase tracking-tight">
          HULL DESTROYED!
        </h3>
        <p className="text-xs text-slate-300 font-cartoon mt-0.5">
          Your starship was overwhelmed by the alien critter swarm.
        </p>

        {/* Stats Card */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 my-5 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs font-cartoon text-slate-300">
            <span>Score Reached</span>
            <span className="font-tech font-bold text-white text-base tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-cartoon text-slate-300">
            <span>Coins Collected</span>
            <span className="font-tech font-bold text-amber-400 text-base tabular-nums">
              +{coins}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-cartoon text-slate-300">
            <span>Enemies Defeated</span>
            <span className="font-mono text-slate-200 font-bold">{stats.enemiesDefeated}</span>
          </div>
        </div>

        {/* Second Chance Revive Section */}
        <div className="mb-4">
          <button
            onClick={() => {
              sound.playButtonClick();
              onRevive();
            }}
            disabled={!canRevive}
            className={`w-full py-3.5 px-4 rounded-2xl font-arcade text-sm sm:text-base tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all ${
              canRevive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white cursor-pointer animate-pulse'
                : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Key className="w-5 h-5 text-yellow-300" />
            REVIVE SHIP ({revivalKeys} KEYS LEFT)
          </button>
          {!canRevive && (
            <p className="text-[11px] text-slate-500 font-cartoon mt-1">
              No revival keys remaining. Acquire keys in the Shop!
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              sound.playButtonClick();
              onRetry();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-arcade text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> RETRY MISSION
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onReturnToMenu();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-white font-arcade text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
          >
            <Home className="w-4 h-4" /> RETURN TO SECTOR MAP
          </button>
        </div>
      </div>
    </div>
  );
};
