/**
 * UpgradesModal: Permanent ship enhancements with tiered coin progression.
 */

import React, { useState } from 'react';
import { X, Wrench, Shield, Heart, Zap, Magnet, ChevronUp } from 'lucide-react';
import { SaveManager } from '../game/SaveManager';
import { UpgradesState } from '../game/types';
import { sound } from '../game/audio/SoundEffects';

interface UpgradesModalProps {
  onClose: () => void;
}

interface UpgradeNode {
  key: keyof UpgradesState;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  baseCost: number;
}

const UPGRADE_NODES: UpgradeNode[] = [
  {
    key: 'hullLevel',
    title: 'Reinforced Titanium Hull',
    desc: '+20 Max Health per rank. Increases durability against heavy alien collisions.',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
    baseCost: 200,
  },
  {
    key: 'shieldLevel',
    title: 'Deflector Matrix',
    desc: '+15 Max Shield & faster recharge. Absorbs stray enemy bullets before hull damage.',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
    baseCost: 250,
  },
  {
    key: 'blasterLevel',
    title: 'Plasma Accelerator',
    desc: '+15% Weapon Damage & +12% Fire Cadence across all starship weapons.',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
    baseCost: 300,
  },
  {
    key: 'magnetLevel',
    title: 'Cosmic Graviton Vacuum',
    desc: '+45px magnetic item suction radius. Effortlessly pull star coins and repairs.',
    icon: <Magnet className="w-5 h-5" />,
    color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
    baseCost: 150,
  },
  {
    key: 'specialLevel',
    title: 'Superconductor Cores',
    desc: '-15% cooldown on Ship Special Abilities for more frequent tactical bursts.',
    icon: <ChevronUp className="w-5 h-5" />,
    color: 'text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/40',
    baseCost: 350,
  },
];

export const UpgradesModal: React.FC<UpgradesModalProps> = ({ onClose }) => {
  const saveMgr = SaveManager.getInstance();
  const [saveData, setSaveData] = useState(saveMgr.getData());

  const handleUpgrade = (node: UpgradeNode) => {
    const currentLvl = saveData.upgrades[node.key] || 0;
    if (currentLvl >= 5) return;
    const cost = node.baseCost * (currentLvl + 1);

    if (saveMgr.upgradeStat(node.key, cost)) {
      sound.playPowerup();
      setSaveData({ ...saveMgr.getData() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-3xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-arcade text-white uppercase">Starship Upgrades</h2>
              <p className="text-xs text-slate-400 font-cartoon">
                Permanent systemic upgrades that apply to all starships in your hangar.
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

        {/* Upgrades List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3">
          {UPGRADE_NODES.map((node) => {
            const currentLvl = saveData.upgrades[node.key] || 0;
            const isMax = currentLvl >= 5;
            const cost = node.baseCost * (currentLvl + 1);
            const canAfford = saveData.coins >= cost && !isMax;

            return (
              <div
                key={node.key}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-2xl border ${node.color}`}>
                    {node.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-arcade text-white">{node.title}</h3>
                    <p className="text-xs text-slate-300 font-cartoon max-w-md mt-0.5">{node.desc}</p>

                    {/* Level Pips */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`w-5 h-2 rounded-full transition-all ${
                            lvl <= currentLvl
                              ? 'bg-gradient-to-r from-amber-400 to-pink-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] font-mono text-slate-400 ml-1">
                        Rank {currentLvl} / 5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {isMax ? (
                    <span className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400 font-arcade text-xs font-bold">
                      MAX RANK
                    </span>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(node)}
                      disabled={!canAfford}
                      className={`px-5 py-2.5 rounded-xl font-arcade text-xs font-bold tracking-wider shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 active:scale-95 text-white'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      UPGRADE ({cost.toLocaleString()} C)
                    </button>
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
