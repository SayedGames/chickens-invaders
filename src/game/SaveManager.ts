/**
 * Save Manager: Handles local persistent storage, save migrations, validation, import/export.
 */

import { SaveData, PlayerSettings, UpgradesState, PlayerStats } from './types';

const SAVE_KEY = 'galactic_critters_save_v1';
const CURRENT_VERSION = 1;

export const DEFAULT_SETTINGS: PlayerSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  muted: false,
  autoFire: false,
  screenShake: true,
  particleQuality: 'high',
  touchControls: true,
  leftHanded: false,
  controlSensitivity: 1.0,
  reducedMotion: false,
};

export const DEFAULT_UPGRADES: UpgradesState = {
  hullLevel: 0,
  shieldLevel: 0,
  blasterLevel: 0,
  magnetLevel: 0,
  specialLevel: 0,
};

export const DEFAULT_STATS: PlayerStats = {
  score: 0,
  coins: 0,
  combo: 0,
  maxCombo: 0,
  enemiesDefeated: 0,
  shotsFired: 0,
  shotsHit: 0,
  damageTaken: 0,
  bossesDefeated: 0,
  missionsCompleted: 0,
  playtimeSeconds: 0,
};

export const DEFAULT_SAVE_DATA: SaveData = {
  version: CURRENT_VERSION,
  coins: 250, // Starter bounty!
  revivalKeys: 2,
  selectedShipId: 'cosmic_finch',
  unlockedShips: ['cosmic_finch'],
  unlockedMissions: ['w1_m1'],
  missionStars: {},
  missionHighScores: {},
  upgrades: { ...DEFAULT_UPGRADES },
  achievements: {},
  stats: { ...DEFAULT_STATS },
  settings: { ...DEFAULT_SETTINGS },
  selectedCompanionId: undefined,
  unlockedCompanions: [],
};

export class SaveManager {
  private static instance: SaveManager;
  private currentData: SaveData;

  private constructor() {
    this.currentData = this.load();
  }

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  public getData(): SaveData {
    return this.currentData;
  }

  public load(): SaveData {
    try {
      const serialized = localStorage.getItem(SAVE_KEY);
      if (!serialized) {
        return { ...DEFAULT_SAVE_DATA };
      }
      const parsed = JSON.parse(serialized);
      // Basic schema merge to prevent undefined property crashes on new game versions
      const merged: SaveData = {
        ...DEFAULT_SAVE_DATA,
        ...parsed,
        upgrades: { ...DEFAULT_UPGRADES, ...(parsed.upgrades || {}) },
        stats: { ...DEFAULT_STATS, ...(parsed.stats || {}) },
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        missionStars: parsed.missionStars || {},
        missionHighScores: parsed.missionHighScores || {},
        unlockedShips: Array.isArray(parsed.unlockedShips) && parsed.unlockedShips.length > 0 
          ? parsed.unlockedShips 
          : ['cosmic_finch'],
        unlockedMissions: Array.isArray(parsed.unlockedMissions) && parsed.unlockedMissions.length > 0 
          ? parsed.unlockedMissions 
          : ['w1_m1'],
      };
      return merged;
    } catch (e) {
      console.warn('Failed to parse save data, falling back to defaults:', e);
      return { ...DEFAULT_SAVE_DATA };
    }
  }

  public save(data?: Partial<SaveData>) {
    if (data) {
      this.currentData = { ...this.currentData, ...data };
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.currentData));
    } catch (e) {
      console.error('Failed to write save data to localStorage:', e);
    }
  }

  public addCoins(amount: number) {
    this.currentData.coins = Math.max(0, this.currentData.coins + amount);
    this.currentData.stats.coins += Math.max(0, amount);
    this.save();
  }

  public spendCoins(amount: number): boolean {
    if (this.currentData.coins >= amount) {
      this.currentData.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  public addRevivalKey(amount: number = 1) {
    this.currentData.revivalKeys = Math.max(0, this.currentData.revivalKeys + amount);
    this.save();
  }

  public useRevivalKey(): boolean {
    if (this.currentData.revivalKeys > 0) {
      this.currentData.revivalKeys--;
      this.save();
      return true;
    }
    return false;
  }

  public recordMissionComplete(missionId: string, stars: number, score: number, coinsEarned: number, nextMissionId?: string) {
    const existingStars = this.currentData.missionStars[missionId] || 0;
    if (stars > existingStars) {
      this.currentData.missionStars[missionId] = stars;
    }
    const existingScore = this.currentData.missionHighScores[missionId] || 0;
    if (score > existingScore) {
      this.currentData.missionHighScores[missionId] = score;
    }
    if (nextMissionId && !this.currentData.unlockedMissions.includes(nextMissionId)) {
      this.currentData.unlockedMissions.push(nextMissionId);
    }
    this.addCoins(coinsEarned);
    this.currentData.stats.missionsCompleted++;
    this.save();
  }

  public unlockShip(shipId: string): boolean {
    if (!this.currentData.unlockedShips.includes(shipId)) {
      this.currentData.unlockedShips.push(shipId);
      this.save();
      return true;
    }
    return false;
  }

  public selectShip(shipId: string) {
    if (this.currentData.unlockedShips.includes(shipId)) {
      this.currentData.selectedShipId = shipId;
      this.save();
    }
  }

  public upgradeStat(key: keyof UpgradesState, cost: number): boolean {
    if (this.spendCoins(cost)) {
      this.currentData.upgrades[key] = (this.currentData.upgrades[key] || 0) + 1;
      this.save();
      return true;
    }
    return false;
  }

  public resetAllProgress() {
    this.currentData = { ...DEFAULT_SAVE_DATA };
    try {
      localStorage.removeItem(SAVE_KEY);
      this.save();
    } catch {
      // Ignored
    }
  }

  public exportSaveJson(): string {
    return JSON.stringify(this.currentData, null, 2);
  }

  public importSaveJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || parsed === null) return false;
      this.currentData = {
        ...DEFAULT_SAVE_DATA,
        ...parsed,
      };
      this.save();
      return true;
    } catch {
      return false;
    }
  }
}
