/**
 * StatsModal: Lifetime pilot statistics, combat accuracy, and score ledgers.
 */

import React from 'react';
import { X, BarChart3, Target, Crosshair, Skull, Star, Flame, Clock } from 'lucide-react';
import { SaveManager } from '../game/SaveManager';
import { sound } from '../game/audio/SoundEffects';

interface StatsModalProps {
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  const saveMgr = SaveManager.getInstance();
  const saveData = saveMgr.getData();
  const stats = saveData.stats;

  const totalStars = Object.values(saveData.missionStars).reduce((a, b) => a + b, 0);
  const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;
  const minutes = Math.floor(stats.playtimeSeconds / 60);

  const STAT_CARDS = [
    { title: 'Stars Earned', value: `${totalStars} ★`, icon: <Star className="w-5 h-5 text-amber-400" />, color: 'border-amber-500/40 bg-amber-500/10' },
    { title: 'Enemies Defeated', value: stats.enemiesDefeated.toLocaleString(), icon: <Crosshair className="w-5 h-5 text-rose-400" />, color: 'border-rose-500/40 bg-rose-500/10' },
    { title: 'Bosses Defeated', value: stats.bossesDefeated.toString(), icon: <Skull className="w-5 h-5 text-purple-400" />, color: 'border-purple-500/40 bg-purple-500/10' },
    { title: 'Combat Accuracy', value: `${accuracy}%`, icon: <Target className="w-5 h-5 text-cyan-400" />, color: 'border-cyan-500/40 bg-cyan-500/10' },
    { title: 'Highest Combo', value: `${stats.maxCombo}x`, icon: <Flame className="w-5 h-5 text-orange-400" />, color: 'border-orange-500/40 bg-orange-500/10' },
    { title: 'Missions Completed', value: stats.missionsCompleted.toString(), icon: <BarChart3 className="w-5 h-5 text-emerald-400" />, color: 'border-emerald-500/40 bg-emerald-500/10' },
    { title: 'Shots Fired', value: stats.shotsFired.toLocaleString(), icon: <Target className="w-5 h-5 text-blue-400" />, color: 'border-blue-500/40 bg-blue-500/10' },
    { title: 'Career Flight Time', value: `${minutes} mins`, icon: <Clock className="w-5 h-5 text-slate-400" />, color: 'border-slate-500/40 bg-slate-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-arcade text-white uppercase">Pilot Dossier & Stats</h2>
              <p className="text-xs text-slate-400 font-cartoon">
                Comprehensive combat records and mission efficiency.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playButtonClick();
              onClose();
            }}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAT_CARDS.map((card, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center justify-center ${card.color}`}
            >
              <div className="p-2 rounded-xl bg-slate-900/60 mb-2">{card.icon}</div>
              <div className="text-lg sm:text-2xl font-tech font-bold text-white tabular-nums">
                {card.value}
              </div>
              <div className="text-[11px] font-cartoon text-slate-400 mt-1 uppercase">
                {card.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
