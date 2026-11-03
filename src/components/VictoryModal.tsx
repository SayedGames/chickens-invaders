/**
 * VictoryModal: Mission completion celebration with animated star ratings and score tallies.
 */

import React, { useEffect, useState } from 'react';
import { Star, Play, Home, Coins, Crosshair, Award } from 'lucide-react';
import { sound } from '../game/audio/SoundEffects';
import { PlayerStats } from '../game/types';

interface VictoryModalProps {
  stars: number;
  score: number;
  coinsEarned: number;
  stats: PlayerStats;
  missionName: string;
  hasNextMission: boolean;
  onNextMission: () => void;
  onReturnToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stars,
  score,
  coinsEarned,
  stats,
  missionName,
  hasNextMission,
  onNextMission,
  onReturnToMenu,
}) => {
  const [revealedStars, setRevealedStars] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setRevealedStars(1);
      sound.playCoin();
    }, 400);

    const timer2 = setTimeout(() => {
      if (stars >= 2) {
        setRevealedStars(2);
        sound.playCoin();
      }
    }, 900);

    const timer3 = setTimeout(() => {
      if (stars >= 3) {
        setRevealedStars(3);
        sound.playPowerup();
      }
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [stars]);

  const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl text-center">
        {/* Victory Ribbon Header */}
        <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-arcade text-xs font-bold uppercase tracking-widest mb-2">
          SECTOR SECURED
        </div>

        <h3 className="text-3xl font-arcade text-white uppercase tracking-tight">
          VICTORY!
        </h3>
        <p className="text-xs text-slate-300 font-cartoon mt-0.5 max-w-xs mx-auto">
          {missionName}
        </p>

        {/* Animated Stars */}
        <div className="flex items-center justify-center gap-3 my-6">
          {[1, 2, 3].map((starNum) => (
            <div
              key={starNum}
              className={`transition-all duration-300 transform ${
                revealedStars >= starNum
                  ? 'scale-110 opacity-100 rotate-0'
                  : 'scale-75 opacity-30 -rotate-12'
              }`}
            >
              <Star
                className={`w-12 h-12 ${
                  revealedStars >= starNum
                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                    : 'text-slate-700'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Score & Rewards Card */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 mb-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-cartoon text-slate-300">
            <span>Mission Score</span>
            <span className="font-tech font-bold text-white text-base tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-cartoon text-slate-300">
            <span>Star Coins Earned</span>
            <span className="font-tech font-bold text-amber-400 text-base tabular-nums flex items-center gap-1">
              <Coins className="w-4 h-4 fill-amber-400" /> +{coinsEarned}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-cartoon text-slate-300">
            <span>Accuracy</span>
            <span className="font-mono text-cyan-400 font-bold">{accuracy}%</span>
          </div>

          <div className="flex justify-between items-center text-xs font-cartoon text-slate-300">
            <span>Enemies Defeated</span>
            <span className="font-mono text-slate-200 font-bold">{stats.enemiesDefeated}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          {hasNextMission && (
            <button
              onClick={() => {
                sound.playButtonClick();
                onNextMission();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:brightness-110 active:scale-95 text-white font-arcade text-base tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" /> NEXT MISSION
            </button>
          )}

          <button
            onClick={() => {
              sound.playButtonClick();
              onReturnToMenu();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-arcade text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <Home className="w-4 h-4" /> RETURN TO SECTOR MAP
          </button>
        </div>
      </div>
    </div>
  );
};
