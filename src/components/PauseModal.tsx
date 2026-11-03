/**
 * PauseModal: In-game pause overlay with quick resume, audio toggle, and restart.
 */

import React from 'react';
import { Play, RotateCcw, Home, Settings, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/audio/SoundEffects';
import { SaveManager } from '../game/SaveManager';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuit,
  onOpenSettings,
}) => {
  const saveMgr = SaveManager.getInstance();
  const settings = saveMgr.getData().settings;
  const [muted, setMuted] = React.useState(settings.muted);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    settings.muted = next;
    saveMgr.save({ settings });
    sound.setVolumes(settings.masterVolume, settings.sfxVolume, settings.musicVolume, next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl text-center">
        <h3 className="text-3xl font-arcade text-white uppercase tracking-wider mb-1">
          MISSION PAUSED
        </h3>
        <p className="text-xs text-slate-400 font-cartoon mb-6">
          System suspended. Press Escape or Resume to continue.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              sound.playButtonClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-arcade text-base tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" /> RESUME MISSION
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-arcade text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> RESTART MISSION
          </button>

          <button
            onClick={toggleSound}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-arcade text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            {muted ? 'UNMUTE SOUND' : 'MUTE SOUND'}
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-arcade text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <Settings className="w-4 h-4 text-purple-400" /> SETTINGS
          </button>

          <button
            onClick={() => {
              sound.playButtonClick();
              onQuit();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 active:scale-95 text-rose-300 font-arcade text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Home className="w-4 h-4" /> ABORT TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
