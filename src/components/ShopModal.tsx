/**
 * ShopModal: Virtual item emporium for Revival Keys, Companions, and Test Currency.
 */

import React, { useState } from 'react';
import { X, ShoppingBag, Key, Sparkles, Check, Gift, ShieldAlert } from 'lucide-react';
import { COMPANIONS } from '../game/data/companions';
import { SaveManager } from '../game/SaveManager';
import { sound } from '../game/audio/SoundEffects';

interface ShopModalProps {
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ onClose }) => {
  const saveMgr = SaveManager.getInstance();
  const [saveData, setSaveData] = useState(saveMgr.getData());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBuyKey = (cost: number, amount: number) => {
    if (saveMgr.spendCoins(cost)) {
      saveMgr.addRevivalKey(amount);
      sound.playPowerup();
      setSaveData({ ...saveMgr.getData() });
      showToast(`Acquired +${amount} Cosmic Revival Key!`);
    }
  };

  const handleClaimFreeBonus = (amount: number) => {
    saveMgr.addCoins(amount);
    sound.playCoin();
    setSaveData({ ...saveMgr.getData() });
    showToast(`Claimed +${amount} Star Coins!`);
  };

  const handleBuyCompanion = (companionId: string, cost: number) => {
    if (saveMgr.spendCoins(cost)) {
      const data = saveMgr.getData();
      data.unlockedCompanions.push(companionId);
      data.selectedCompanionId = companionId;
      saveMgr.save(data);
      sound.playPowerup();
      setSaveData({ ...saveMgr.getData() });
      showToast(`Unlocked companion!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-arcade text-white uppercase">Cosmic Depot & Shop</h2>
              <p className="text-xs text-slate-400 font-cartoon">
                Acquire emergency supplies, revival keys, and alien companions.
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

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-500/90 text-white font-arcade text-center py-1.5 text-xs animate-bounce-short">
            {toastMessage}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          {/* Section 1: Revival Keys */}
          <div>
            <h3 className="text-sm font-bold font-arcade uppercase text-cyan-400 mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" /> Mission Revival Keys (Current: {saveData.revivalKeys})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold font-arcade text-white">Single Revival Key</div>
                  <div className="text-xs text-slate-400 font-cartoon">Instantly resurrect on mission defeat.</div>
                </div>
                <button
                  onClick={() => handleBuyKey(250, 1)}
                  disabled={saveData.coins < 250}
                  className={`px-4 py-2 rounded-xl font-arcade text-xs font-bold transition-all ${
                    saveData.coins >= 250
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  BUY (250 C)
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold font-arcade text-white">Pack of 5 Revival Keys</div>
                  <div className="text-xs text-slate-400 font-cartoon">Value bundle with 20% discount.</div>
                </div>
                <button
                  onClick={() => handleBuyKey(1000, 5)}
                  disabled={saveData.coins < 1000}
                  className={`px-4 py-2 rounded-xl font-arcade text-xs font-bold transition-all ${
                    saveData.coins >= 1000
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  BUY (1,000 C)
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Alien Wingmate Companions */}
          <div>
            <h3 className="text-sm font-bold font-arcade uppercase text-pink-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" /> Alien Wingmates & Companions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPANIONS.map((comp) => {
                const isUnlocked = saveData.unlockedCompanions.includes(comp.id);
                const isSelected = saveData.selectedCompanionId === comp.id;

                return (
                  <div
                    key={comp.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold font-arcade text-white">{comp.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
                          {comp.species}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-cartoon">{comp.description}</p>
                      <div className="mt-2 text-xs font-bold text-amber-300 font-tech">
                        Perk: {comp.perk}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      {isUnlocked ? (
                        isSelected ? (
                          <span className="text-xs font-bold font-arcade text-emerald-400 flex items-center gap-1">
                            <Check className="w-4 h-4" /> ACTIVE COMPANION
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              saveData.selectedCompanionId = comp.id;
                              saveMgr.save(saveData);
                              sound.playButtonClick();
                              setSaveData({ ...saveMgr.getData() });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                          >
                            Equip Companion
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleBuyCompanion(comp.id, comp.cost)}
                          disabled={saveData.coins < comp.cost}
                          className={`px-4 py-2 rounded-xl font-arcade text-xs font-bold transition-all ${
                            saveData.coins >= comp.cost
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 active:scale-95 text-white cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          ADOPT ({comp.cost.toLocaleString()} C)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
