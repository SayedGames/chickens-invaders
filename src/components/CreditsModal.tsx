/**
 * CreditsModal: Original story lore, controls glossary, and engineering credits.
 */

import React from 'react';
import { X, Info, Sparkles, Heart } from 'lucide-react';
import { sound } from '../game/audio/SoundEffects';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-arcade text-white uppercase">Lore & Credits</h2>
              <p className="text-xs text-slate-400 font-cartoon">
                Galactic Critters: Cosmic Mayhem v1.0.0
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-300 font-cartoon text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h3 className="text-sm font-bold font-arcade uppercase text-amber-400 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> The Great Cosmic Egg Uprising
            </h3>
            <p className="leading-relaxed">
              In the far reaches of Sector 7, General Cluck rallied a massive interstellar fleet of rogue space birds, mutant egg drones, and robotic cyber-chickens to seize control of the Candy Nebula. Pilot your customizable starfighter, blast through relentless critter formations, and restore peace to the galaxy!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h3 className="text-sm font-bold font-arcade uppercase text-cyan-400 mb-2">
              Engineering & Systems
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• <strong>Engine:</strong> Bespoke 60fps HTML5 Canvas Vector Engine with dynamic resolution scaling.</li>
              <li>• <strong>Audio:</strong> 100% procedural Web Audio synthesizer (blasters, explosions, chiptune arpeggios).</li>
              <li>• <strong>Persistence:</strong> LocalStorage versioned schema with JSON import/export backup.</li>
              <li>• <strong>Controls:</strong> Unified Keyboard, Mouse, and Virtual Multitouch Joystick.</li>
            </ul>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 flex items-center justify-center gap-1">
            <span>Crafted with</span> <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> <span>for arcade space shooter fans everywhere.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
