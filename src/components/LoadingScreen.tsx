/**
 * LoadingScreen: 5-second mandatory launch sequence with author tribute,
 * game title, glowing effects, and non-bypassable touch blocking.
 */

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [subText, setSubText] = useState('CALIBRATING ION CANNONS...');

  useEffect(() => {
    const totalDuration = 5000; // 5 seconds
    const intervalTime = 50;
    const increment = 100 / (totalDuration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onLoaded, 250);
          return 100;
        }

        if (next > 75) {
          setSubText('DEFENDING SPACE SECTOR 1...');
        } else if (next > 45) {
          setSubText('DETECTING CHICKEN INVASION FORMATIONS...');
        } else if (next > 20) {
          setSubText('LOADING WEAPONS & DRUMSTICKS...');
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between items-center p-6 bg-slate-950 select-none pointer-events-auto overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Background Star Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.15)_0%,_rgba(2,6,23,0.95)_70%)] pointer-events-none" />

      {/* TOP MIDDLE: Glowing "Made by SAYED NASAR" */}
      <div className="relative pt-6 sm:pt-8 text-center z-10">
        <div className="inline-block px-6 py-2 rounded-full bg-slate-900/80 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.8)] animate-pulse">
          <span className="text-base sm:text-xl font-arcade tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)] uppercase font-bold">
            Made by SAYED NASAR
          </span>
        </div>
      </div>

      {/* CENTER: Game Title & Animated Chicken Mascot */}
      <div className="flex flex-col items-center text-center my-auto z-10">
        {/* Animated Chicken SVG */}
        <div className="relative mb-4">
          <svg
            className="w-24 h-24 sm:w-28 sm:h-28 animate-bounce-short filter drop-shadow-[0_0_20px_rgba(234,179,8,0.7)]"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* White Wings Flapping */}
            <ellipse cx="20" cy="50" rx="16" ry="9" fill="#ffffff" stroke="#0f172a" strokeWidth="3" transform="rotate(-20 20 50)" />
            <ellipse cx="80" cy="50" rx="16" ry="9" fill="#ffffff" stroke="#0f172a" strokeWidth="3" transform="rotate(20 80 50)" />

            {/* Red Comb */}
            <circle cx="45" cy="22" r="6" fill="#ef4444" />
            <circle cx="50" cy="18" r="7" fill="#ef4444" />
            <circle cx="55" cy="22" r="6" fill="#ef4444" />

            {/* Round Blue Chicken Body */}
            <ellipse cx="50" cy="52" rx="26" ry="28" fill="#3b82f6" stroke="#0f172a" strokeWidth="3.5" />
            <ellipse cx="50" cy="58" rx="15" ry="16" fill="#ffffff" />

            {/* Big Expressive Eyes */}
            <circle cx="41" cy="42" r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="59" cy="42" r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="43" cy="44" r="3.5" fill="#0f172a" />
            <circle cx="57" cy="44" r="3.5" fill="#0f172a" />

            {/* Yellow Beak */}
            <polygon points="44,48 56,48 50,60" fill="#f59e0b" stroke="#0f172a" strokeWidth="2.5" />

            {/* Feet */}
            <ellipse cx="40" cy="80" rx="7" ry="4" fill="#f59e0b" />
            <ellipse cx="60" cy="80" rx="7" ry="4" fill="#f59e0b" />
          </svg>
        </div>

        {/* Game Title: Chickens Invaders */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-arcade tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-rose-500 drop-shadow-[0_4px_0_rgba(0,0,0,0.9)] uppercase font-bold">
          CHICKENS INVADERS
        </h1>
        <div className="mt-1 text-xs sm:text-sm font-mono tracking-widest text-emerald-400 uppercase font-bold">
          Galaxy Sector Defense System
        </div>
      </div>

      {/* BOTTOM: 5-Second Progress Bar */}
      <div className="w-full max-w-md pb-6 sm:pb-8 z-10 flex flex-col items-center">
        <div className="text-xs font-mono font-bold text-slate-300 mb-2 tracking-wide uppercase">
          {subText}
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-4 bg-slate-900 border-2 border-slate-700 rounded-full overflow-hidden p-0.5 shadow-2xl">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-yellow-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all duration-75"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="mt-2 text-[11px] font-mono text-slate-400">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
