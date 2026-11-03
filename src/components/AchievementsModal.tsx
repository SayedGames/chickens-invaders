/**
 * AchievementsModal: Trophy cabinet with reward unlocks and progress bars.
 */

import React, { useState } from 'react';
import { X, Trophy, Check, Award, Star, Coins } from 'lucide-react';
import { ACHIEVEMENTS } from '../game/data/achievements';
import { SaveManager } from '../game/SaveManager';
import { sound } from '../game/audio/SoundEffects';

interface AchievementsModalProps {
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const saveMgr = SaveManager.getInstance();
  const [saveData, setSaveData] = useState(saveMgr.getData());
  const stats = saveData.stats;

  const getProgress = (id: string, max: number): number => {
    switch (id) {
      case 'first_blood':
        return Math.min(max, stats.enemiesDefeated);
      case 'egg_scrambler':
        return Math.min(max, Math.floor(stats.enemiesDefeated * 0.4));
      case 'general_fall':
        return Math.min(max, stats.bossesDefeated);
      case 'star_collector':
        return Math.min(max, Object.values(saveData.missionStars).reduce((a, b) => a + b, 0));
      case 'galactic_tycoon':
        return Math.min(max, stats.coins);
      case 'combo_master':
        return Math.min(max, stats.maxCombo);
      case 'fleet_commander':
        return Math.min(max, saveData.unlockedShips.length);
      case 'survivor_ace':
        return Math.min(max, stats.missionsCompleted);
      default:
        return 0;
    }
  };

  const handleClaim = (achId: string, reward: number) => {
    saveData.achievements[achId] = true;
    saveMgr.addCoins(reward);
    saveMgr.save(saveData);
    sound.playPowerup();
    setSaveData({ ...saveMgr.getData() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-3xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-arcade text-white uppercase">Awards & Trophies</h2>
              <p className="text-xs text-slate-400 font-cartoon">
                Accomplish combat milestones to claim hefty coin bounties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-amber-500/50 px-3 py-1.5 rounded-xl font-tech text-amber-300 font-bold text-sm">
              <span>★</span> {saveData.coins.toLocaleString()} Coins
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const currentProg = getProgress(ach.id, ach.maxProgress);
            const isCompleted = currentProg >= ach.maxProgress;
            const isClaimed = !!saveData.achievements[ach.id];

            return (
              <div
                key={ach.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-3 rounded-2xl border ${
                      isCompleted
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-arcade text-white">{ach.title}</h3>
                    <p className="text-xs text-slate-300 font-cartoon max-w-md mt-0.5">
                      {ach.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-36 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                          style={{ width: `${(currentProg / ach.maxProgress) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {currentProg} / {ach.maxProgress}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {isClaimed ? (
                    <span className="text-xs font-bold font-arcade text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> CLAIMED
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(ach.id, ach.rewardCoins)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-arcade text-xs font-bold tracking-wider shadow-lg hover:brightness-110 active:scale-95 cursor-pointer animate-pulse"
                    >
                      CLAIM +{ach.rewardCoins} C
                    </button>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Reward: +{ach.rewardCoins} C
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
