/**
 * HangarModal: Starship customization, stat inspect, live vector preview, and fleet unlocking.
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Lock, Zap, Shield, Heart, Gauge, Rocket } from 'lucide-react';
import { SHIPS } from '../game/data/ships';
import { ShipDef } from '../game/types';
import { SaveManager } from '../game/SaveManager';
import { CanvasRenderer } from '../game/engine/CanvasRenderer';
import { sound } from '../game/audio/SoundEffects';

interface HangarModalProps {
  onClose: () => void;
  onSelectShip: (shipId: string) => void;
}

export const HangarModal: React.FC<HangarModalProps> = ({ onClose, onSelectShip }) => {
  const saveMgr = SaveManager.getInstance();
  const saveData = saveMgr.getData();
  const [selectedShipId, setSelectedShipId] = useState<string>(saveData.selectedShipId);
  const [unlockedShips, setUnlockedShips] = useState<string[]>(saveData.unlockedShips);
  const [coins, setCoins] = useState<number>(saveData.coins);

  const activeShip = SHIPS.find((s) => s.id === selectedShipId) || SHIPS[0];
  const isUnlocked = unlockedShips.includes(activeShip.id);
  const isEquipped = saveData.selectedShipId === activeShip.id;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  // Live Canvas Preview of active ship
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      CanvasRenderer.drawPlayer(
        ctx,
        activeShip,
        canvas.width * 0.5,
        canvas.height * 0.52,
        Math.sin(time) * 0.4,
        0,
        activeShip.baseShield,
        activeShip.baseShield,
        time
      );
      animRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [activeShip]);

  const handleUnlock = (ship: ShipDef) => {
    if (saveMgr.spendCoins(ship.cost)) {
      saveMgr.unlockShip(ship.id);
      saveMgr.selectShip(ship.id);
      setUnlockedShips([...saveMgr.getData().unlockedShips]);
      setCoins(saveMgr.getData().coins);
      sound.playPowerup();
      onSelectShip(ship.id);
    }
  };

  const handleEquip = (shipId: string) => {
    saveMgr.selectShip(shipId);
    sound.playButtonClick();
    onSelectShip(shipId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-5xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-arcade text-white uppercase">Starship Hangar</h2>
              <p className="text-xs text-slate-400 font-cartoon">
                Inspect ship archetypes, weapon capabilities, and special systems.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-amber-500/50 px-3 py-1.5 rounded-xl font-tech text-amber-300 font-bold text-sm">
              <span>★</span> {coins.toLocaleString()} Coins
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

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Ship Fleet List */}
          <div className="w-full md:w-80 border-r border-slate-800 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-950/40">
            {SHIPS.map((ship) => {
              const unlocked = unlockedShips.includes(ship.id);
              const isCurrent = ship.id === selectedShipId;
              const equipped = saveData.selectedShipId === ship.id;

              return (
                <button
                  key={ship.id}
                  onClick={() => {
                    sound.playButtonClick();
                    setSelectedShipId(ship.id);
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-rose-950/50 border-rose-500 shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border border-white/20"
                      style={{ backgroundColor: ship.primaryColor }}
                    >
                      <Rocket className="w-5 h-5 text-white filter drop-shadow" />
                    </div>
                    <div>
                      <div className="text-sm font-bold font-arcade text-white">{ship.name}</div>
                      <div className="text-[11px] font-cartoon text-slate-400">{ship.archetype}</div>
                    </div>
                  </div>

                  <div>
                    {equipped ? (
                      <span className="text-[10px] font-bold font-arcade bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                        EQUIPPED
                      </span>
                    ) : !unlocked ? (
                      <Lock className="w-4 h-4 text-slate-500" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Ship Inspector */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between bg-slate-900/60">
            <div>
              {/* Ship Title & Visual Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
                <div className="relative w-44 h-44 rounded-3xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(236,72,153,0.15)_0%,_transparent_70%)]" />
                  <canvas ref={canvasRef} width={180} height={180} className="w-full h-full" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">
                      {activeShip.subtitle}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-bold text-pink-400 font-cartoon">
                      {activeShip.archetype}
                    </span>
                  </div>
                  <h3 className="text-3xl font-arcade text-white mt-1 uppercase">{activeShip.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-cartoon mt-2 max-w-lg">
                    {activeShip.description}
                  </p>
                </div>
              </div>

              {/* Stat Comparison Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Hull Integrity */}
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> Hull Integrity
                    </span>
                    <span className="font-mono text-white">{activeShip.baseHealth} HP</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(activeShip.baseHealth / 250) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Shield Capacity */}
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 fill-cyan-500 text-cyan-500" /> Shield Deflector
                    </span>
                    <span className="font-mono text-white">{activeShip.baseShield} SP</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${(activeShip.baseShield / 150) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Engine Thruster Speed */}
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-amber-400" /> Maneuver Speed
                    </span>
                    <span className="font-mono text-white">{activeShip.baseSpeed} u/s</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(activeShip.baseSpeed / 500) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Special Ability Card */}
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-fuchsia-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-fuchsia-400" /> {activeShip.specialAbilityName}
                    </span>
                    <span className="font-mono text-slate-400">{activeShip.specialCooldown}s CD</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-cartoon">
                    {activeShip.specialAbilityDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Purchase or Equip CTA */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                {!isUnlocked && (
                  <div className="text-xs font-bold font-cartoon text-slate-400">
                    Unlock Cost: <span className="text-amber-400 font-mono font-bold text-base">{activeShip.cost.toLocaleString()} Coins</span>
                  </div>
                )}
              </div>

              {isEquipped ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-2xl bg-slate-800 border-2 border-slate-700 text-slate-400 font-arcade text-sm flex items-center gap-2 cursor-default"
                >
                  <Check className="w-4 h-4 text-emerald-400" /> CURRENTLY EQUIPPED
                </button>
              ) : isUnlocked ? (
                <button
                  onClick={() => handleEquip(activeShip.id)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-arcade text-sm tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  EQUIP SHIP
                </button>
              ) : (
                <button
                  onClick={() => handleUnlock(activeShip)}
                  disabled={coins < activeShip.cost}
                  className={`px-6 py-3 rounded-2xl font-arcade text-sm tracking-wider shadow-xl flex items-center gap-2 transition-all ${
                    coins >= activeShip.cost
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 active:scale-95 text-white cursor-pointer'
                      : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" /> UNLOCK SHIP ({activeShip.cost.toLocaleString()} C)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
