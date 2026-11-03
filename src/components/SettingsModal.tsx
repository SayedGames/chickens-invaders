/**
 * SettingsModal: Audio, Controls, Visuals, Accessibility, and Save Backup Management.
 */

import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Smartphone,
  Eye,
  Database,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { SaveManager } from '../game/SaveManager';
import { sound } from '../game/audio/SoundEffects';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const saveMgr = SaveManager.getInstance();
  const [saveData, setSaveData] = useState(saveMgr.getData());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStr, setImportStr] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const settings = saveData.settings;

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    const updated = {
      ...settings,
      [key]: value,
    };
    saveData.settings = updated;
    saveMgr.save({ settings: updated });
    setSaveData({ ...saveData });

    // Apply audio volumes immediately
    sound.setVolumes(
      updated.masterVolume,
      updated.sfxVolume,
      updated.musicVolume,
      updated.muted
    );
  };

  const handleExport = () => {
    const json = saveMgr.exportSaveJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galactic_critters_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importStr.trim()) return;
    if (saveMgr.importSaveJson(importStr)) {
      setImportStatus('Save successfully imported!');
      setSaveData(saveMgr.getData());
      sound.playPowerup();
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Error: Invalid save JSON format.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const handleResetData = () => {
    saveMgr.resetAllProgress();
    setSaveData(saveMgr.getData());
    setShowResetConfirm(false);
    sound.playButtonClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl max-h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-arcade text-white uppercase">System Settings</h2>
              <p className="text-xs text-slate-400 font-cartoon">
                Audio parameters, tactile feedback, control layouts, and backups.
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

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          {/* Audio Section */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-arcade uppercase text-cyan-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Audio & Acoustics
              </h3>
              <button
                onClick={() => updateSetting('muted', !settings.muted)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  settings.muted
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                }`}
              >
                {settings.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {settings.muted ? 'Muted' : 'Sound On'}
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Master Volume */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-cartoon mb-1">
                  <span>Master Volume</span>
                  <span className="font-mono">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.masterVolume}
                  onChange={(e) => updateSetting('masterVolume', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* SFX Volume */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-cartoon mb-1">
                  <span>Sound Effects (Laser & Explosions)</span>
                  <span className="font-mono">{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.sfxVolume}
                  onChange={(e) => updateSetting('sfxVolume', parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Music Volume */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-cartoon mb-1">
                  <span>Dynamic Chiptune BGM</span>
                  <span className="font-mono">{Math.round(settings.musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.musicVolume}
                  onChange={(e) => updateSetting('musicVolume', parseFloat(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Gameplay & Controls Section */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold font-arcade uppercase text-amber-400 mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Gameplay & Touch Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Auto Fire Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-xs font-bold font-arcade text-white">Auto-Fire</div>
                  <div className="text-[11px] text-slate-400 font-cartoon">Automatic laser discharge</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoFire}
                  onChange={(e) => updateSetting('autoFire', e.target.checked)}
                  className="w-5 h-5 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Screen Shake Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-xs font-bold font-arcade text-white">Screen Shake</div>
                  <div className="text-[11px] text-slate-400 font-cartoon">Camera tremor on impacts</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.screenShake}
                  onChange={(e) => updateSetting('screenShake', e.target.checked)}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Left Handed Touch Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-xs font-bold font-arcade text-white">Left-Handed Mode</div>
                  <div className="text-[11px] text-slate-400 font-cartoon">Swap joystick & fire button</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.leftHanded}
                  onChange={(e) => updateSetting('leftHanded', e.target.checked)}
                  className="w-5 h-5 accent-pink-400 cursor-pointer"
                />
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-xs font-bold font-arcade text-white">Reduced Motion</div>
                  <div className="text-[11px] text-slate-400 font-cartoon">Mute heavy tilt animations</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="w-5 h-5 accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Backup, Export & Reset Section */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold font-arcade uppercase text-pink-400 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" /> Save Data & Cloud Backup
            </h3>

            <div className="flex flex-wrap gap-2.5 mb-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-cartoon flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" /> Export Save JSON
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold font-cartoon flex items-center gap-2 cursor-pointer ml-auto"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Save Data
              </button>
            </div>

            {/* Import JSON Box */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste backup save JSON here..."
                value={importStr}
                onChange={(e) => setImportStr(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleImport}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-arcade text-xs font-bold cursor-pointer"
              >
                Import
              </button>
            </div>
            {importStatus && (
              <div className="text-xs text-cyan-400 mt-2 font-mono">{importStatus}</div>
            )}
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-md w-full bg-slate-900 border-2 border-rose-600 p-6 rounded-3xl text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-arcade text-white uppercase">Reset All Progress?</h4>
              <p className="text-xs text-slate-300 font-cartoon mt-2">
                This will permanently delete all unlocked ships, stars, coins, and high scores. This action cannot be undone.
              </p>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-arcade text-xs font-bold cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleResetData}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-arcade text-xs font-bold cursor-pointer shadow-lg"
                >
                  CONFIRM RESET
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
