/**
 * TitleScreen: Full-viewport cartoon arcade title lockup with live cosmic background and menu grid.
 */

import React from 'react';
import {
  Play,
  Rocket,
  Map,
  Wrench,
  ShoppingBag,
  Trophy,
  BarChart3,
  Settings,
  Sparkles,
  Info,
  Calendar,
  Smartphone,
  RotateCcw,
} from 'lucide-react';
import { GameScreen } from '../game/types';
import { sound } from '../game/audio/SoundEffects';

interface TitleScreenProps {
  onStartCampaign: () => void;
  onContinue: () => void;
  onNavigate: (screen: GameScreen) => void;
  coins: number;
  unlockedMissionsCount: number;
  latestMissionName: string;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartCampaign,
  onContinue,
  onNavigate,
  coins,
  unlockedMissionsCount,
  latestMissionName,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-between items-center p-4 sm:p-6 select-none overflow-y-auto overflow-x-hidden z-10">
      {/* Top Banner / Currency & Quick Nav */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-2xl shadow-lg">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold font-cartoon text-emerald-400 uppercase tracking-wider">
            Sector 1 Online
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Coins Badge */}
          <div
            onClick={() => {
              sound.playButtonClick();
              onNavigate('shop');
            }}
            className="flex items-center gap-2 bg-slate-900/90 border-2 border-amber-500/80 hover:border-amber-400 px-3 py-1.5 rounded-2xl cursor-pointer shadow-lg transition-all active:scale-95"
            title="Open Shop"
          >
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs">
              ★
            </div>
            <span className="font-tech font-bold text-amber-300 text-sm tabular-nums">
              {coins.toLocaleString()}
            </span>
          </div>

          {/* Quick Settings */}
          <button
            onClick={() => {
              sound.playButtonClick();
              onNavigate('settings');
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup */}
      <div className="flex flex-col items-center text-center my-auto py-4">
        {/* Animated Flying Saucer / Critter Mascot SVG Lockup */}
        <div className="relative mb-3">
          <svg
            className="w-24 h-24 sm:w-28 sm:h-28 animate-bounce-short filter drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]"
            viewBox="0 0 120 120"
            fill="none"
          >
            {/* UFO Dome */}
            <ellipse cx="60" cy="50" rx="35" ry="24" fill="#38bdf8" stroke="#0f172a" strokeWidth="4" />
            <ellipse cx="50" cy="42" rx="10" ry="5" fill="rgba(255,255,255,0.7)" />

            {/* Quirky Chicken Pilot */}
            <circle cx="60" cy="48" r="14" fill="#ef4444" stroke="#0f172a" strokeWidth="3" />
            {/* Beak */}
            <polygon points="56,52 64,52 60,60" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="55" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="56" cy="45" r="1.5" fill="#000000" />
            <circle cx="65" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="66" cy="45" r="1.5" fill="#000000" />

            {/* UFO Saucer Rim */}
            <ellipse cx="60" cy="68" rx="55" ry="16" fill="#facc15" stroke="#0f172a" strokeWidth="5" />
            {/* Saucer Lights */}
            <circle cx="25" cy="68" r="4" fill="#ef4444" />
            <circle cx="42" cy="73" r="4" fill="#10b981" />
            <circle cx="60" cy="75" r="4.5" fill="#38bdf8" />
            <circle cx="78" cy="73" r="4" fill="#ec4899" />
            <circle cx="95" cy="68" r="4" fill="#ef4444" />

            {/* Tractor Ray Beam */}
            <polygon points="40,84 80,84 95,115 25,115" fill="rgba(56,189,248,0.25)" />
          </svg>
        </div>

        {/* Bespoke Logo Typography */}
        <div className="mb-2">
          <span className="inline-block px-4 py-1 rounded-full bg-slate-900/90 border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.6)] text-xs font-arcade text-cyan-300 font-bold uppercase tracking-widest animate-pulse">
            Made by SAYED NASAR
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-arcade tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-rose-500 drop-shadow-[0_4px_0_rgba(0,0,0,0.9)] uppercase font-bold">
          CHICKENS INVADERS
        </h1>

        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="h-0.5 w-8 bg-gradient-to-r from-transparent to-pink-500" />
          <span className="text-lg sm:text-2xl font-arcade tracking-widest text-emerald-400 text-shadow-arcade uppercase font-bold">
            GALAXY SECTOR DEFENSE
          </span>
          <span className="h-0.5 w-8 bg-gradient-to-l from-transparent to-pink-500" />
        </div>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 font-cartoon max-w-md">
          Dodge falling eggs, collect crispy chicken legs, and defeat the chicken invasion!
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            onClick={() => {
              sound.playButtonClick();
              onStartCampaign();
            }}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 border-2 border-yellow-200 text-white font-arcade text-lg sm:text-xl tracking-wider shadow-[0_6px_0_0_#9f1239] hover:brightness-110 active:translate-y-1 active:shadow-[0_2px_0_0_#9f1239] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            PLAY MISSION
          </button>

          {unlockedMissionsCount > 1 && (
            <button
              onClick={() => {
                sound.playButtonClick();
                onContinue();
              }}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border-2 border-slate-600 text-cyan-300 font-arcade text-base tracking-wider shadow-[0_6px_0_0_#1e293b] active:translate-y-1 active:shadow-[0_2px_0_0_#1e293b] transition-all flex items-center justify-center gap-2 cursor-pointer"
              title={`Continue ${latestMissionName}`}
            >
              <RotateCcw className="w-5 h-5" />
              CONTINUE
            </button>
          )}
        </div>

        {/* Flat control-hint line */}
        <div className="mt-4 text-[11px] sm:text-xs text-slate-300 font-mono tracking-wide">
          Move with Mouse / Touch Drag · Auto-Fires Lasers · Collect Chicken Legs!
        </div>
      </div>

      {/* Bottom Menu Navigation Matrix */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5 pt-2">
        <button
          onClick={() => {
            sound.playButtonClick();
            onNavigate('mission_select');
          }}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex flex-col items-center text-center gap-1 text-slate-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Map className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold font-cartoon">Missions</span>
        </button>

        <button
          onClick={() => {
            sound.playButtonClick();
            onNavigate('hangar');
          }}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex flex-col items-center text-center gap-1 text-slate-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Rocket className="w-5 h-5 text-rose-400" />
          <span className="text-xs font-bold font-cartoon">Hangar</span>
        </button>

        <button
          onClick={() => {
            sound.playButtonClick();
            onNavigate('upgrades');
          }}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex flex-col items-center text-center gap-1 text-slate-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Wrench className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold font-cartoon">Upgrades</span>
        </button>

        <button
          onClick={() => {
            sound.playButtonClick();
            onNavigate('shop');
          }}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex flex-col items-center text-center gap-1 text-slate-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold font-cartoon">Shop</span>
        </button>

        <button
          onClick={() => {
            sound.playButtonClick();
            onNavigate('achievements');
          }}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex flex-col items-center text-center gap-1 text-slate-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-xs font-bold font-cartoon">Awards</span>
        </button>
      </div>

      {/* Sub-bar */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
        <span className="text-cyan-400 font-mono text-[11px]">
          Classic Arcade Edition
        </span>

        <button
          onClick={() => {
            sound.playButtonClick();
            onNavigate('credits');
          }}
          className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Credits & Lore</span>
        </button>
      </div>
    </div>
  );
};
