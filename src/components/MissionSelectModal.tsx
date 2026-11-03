/**
 * MissionSelectModal: Galaxy sector map with star ratings and briefings.
 */

import React, { useState } from 'react';
import { X, Star, Play, Lock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ALL_MISSIONS, WORLDS } from '../game/data/missions';
import { SaveManager } from '../game/SaveManager';
import { sound } from '../game/audio/SoundEffects';

interface MissionSelectModalProps {
  onClose: () => void;
  onLaunchMission: (missionId: string) => void;
}

export const MissionSelectModal: React.FC<MissionSelectModalProps> = ({
  onClose,
  onLaunchMission,
}) => {
  const saveMgr = SaveManager.getInstance();
  const saveData = saveMgr.getData();
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1);

  const worldMissions = ALL_MISSIONS.filter((m) => m.worldId === selectedWorldId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-2xl font-arcade text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 uppercase">
              Mission Registry & Galaxy Map
            </h2>
            <p className="text-xs text-slate-400 font-cartoon">
              Select a sector to deploy your starship. Earn up to 3 stars per mission!
            </p>
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

        {/* World Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-slate-900/40 overflow-x-auto">
          {WORLDS.slice(0, 2).map((world) => {
            const isSelected = world.id === selectedWorldId;
            return (
              <button
                key={world.id}
                onClick={() => {
                  sound.playButtonClick();
                  setSelectedWorldId(world.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-arcade tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-lg border border-pink-400'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                World {world.id}: {world.name}
              </button>
            );
          })}
        </div>

        {/* Missions Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {worldMissions.map((mission) => {
            const isUnlocked = saveData.unlockedMissions.includes(mission.id);
            const stars = saveData.missionStars[mission.id] || 0;
            const highScore = saveData.missionHighScores[mission.id] || 0;
            const isBoss = !!mission.bossDef;

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                  !isUnlocked
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-60'
                    : isBoss
                    ? 'bg-gradient-to-br from-rose-950/70 to-slate-900 border-rose-500/80 shadow-xl'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-cyan-500/80 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold font-mono text-cyan-400 uppercase tracking-wider">
                      Mission {mission.missionNumber}
                    </span>
                    {isBoss && (
                      <span className="flex items-center gap-1 text-[10px] font-bold font-arcade uppercase text-rose-400 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/50">
                        <ShieldAlert className="w-3 h-3" /> BOSS SHOWDOWN
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white font-arcade">{mission.name}</h3>
                  <p className="text-xs text-slate-300 font-cartoon mt-1 line-clamp-2">
                    {mission.description}
                  </p>

                  {/* Stars Display */}
                  <div className="flex items-center gap-1.5 mt-3">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                    {highScore > 0 && (
                      <span className="ml-auto text-xs font-mono text-slate-400">
                        Best: <span className="text-slate-200 font-bold">{highScore.toLocaleString()}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-amber-300 font-bold font-tech">
                    Reward: +{mission.completionCoins} Coins
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playButtonClick();
                        onLaunchMission(mission.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-arcade text-xs font-bold tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> LAUNCH
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                      <Lock className="w-3.5 h-3.5" /> LOCKED
                    </div>
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
