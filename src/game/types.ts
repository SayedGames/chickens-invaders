/**
 * Galactic Critters: Cosmic Mayhem - Core Types & Interfaces
 */

export type GameScreen = 
  | 'title' 
  | 'gameplay' 
  | 'mission_select' 
  | 'hangar' 
  | 'upgrades' 
  | 'shop' 
  | 'achievements' 
  | 'stats' 
  | 'settings' 
  | 'credits' 
  | 'daily_mission'
  | 'packaging_guide';

export type GameMode = 'campaign' | 'endless' | 'boss_rush';

export interface Vector2D {
  x: number;
  y: number;
}

export type WeaponType = 
  | 'blaster' 
  | 'spread' 
  | 'plasma' 
  | 'missile' 
  | 'laser' 
  | 'lightning';

export interface WeaponDef {
  id: string;
  name: string;
  type: WeaponType;
  description: string;
  fireRate: number; // shots per second
  damage: number;
  projectileSpeed: number;
  bulletCount: number;
  spreadAngle: number;
  color: string;
  glowColor: string;
  size: number;
}

export interface ShipDef {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  archetype: string;
  baseHealth: number;
  baseShield: number;
  baseSpeed: number;
  primaryWeapon: WeaponType;
  specialAbilityName: string;
  specialAbilityDesc: string;
  specialCooldown: number; // seconds
  specialType: 'emp_bomb' | 'shield_burst' | 'hyper_laser' | 'cluster_strike' | 'time_warp' | 'nova_blast';
  unlockedByDefault: boolean;
  cost: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glowColor: string;
  spriteShape: 'falcon' | 'rooster' | 'quack' | 'hopper' | 'canine' | 'phoenix' | 'boar' | 'stealth' | 'titan' | 'saucer' | 'chicken_fighter';
}

export type EnemyType = 
  | 'scout'
  | 'swarmer'
  | 'armored_egg'
  | 'kamikaze_pigeon'
  | 'urchin'
  | 'jelly_pulsar'
  | 'bomber_cockatoo'
  | 'sniper_crow'
  | 'mini_boss'
  | 'boss'
  | 'chicken'
  | 'asteroid'
  | 'giant_egg';

export interface EnemyDef {
  type: EnemyType;
  name: string;
  health: number;
  damage: number;
  score: number;
  coins: number;
  speed: number;
  width: number;
  height: number;
  color: string;
  secondaryColor: string;
  shootInterval?: number;
  projectileType?: 'egg' | 'feather_dart' | 'plasma_ball' | 'laser_beam' | 'quill';
}

export interface BossDef {
  id: string;
  name: string;
  title: string;
  maxHealth: number;
  phases: number;
  width: number;
  height: number;
  color: string;
  secondaryColor: string;
  accentColor: string;
  description: string;
}

export type PowerupType = 
  | 'coin' 
  | 'repair' 
  | 'shield' 
  | 'weapon_upgrade' 
  | 'weapon_gift'
  | 'invincibility' 
  | 'bomb' 
  | 'overdrive' 
  | 'revival_key'
  | 'drumstick'
  | 'roast_chicken';

export interface EggSplatEntity {
  id: number;
  x: number;
  y: number;
  alpha: number;
  life: number;
  maxLife: number;
  scale: number;
}

export interface CollectibleEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: PowerupType;
  value: number;
  radius: number;
  lifeTime: number;
  pulsePhase: number;
  bounceCount?: number;
  weaponType?: WeaponType;
}

export interface ProjectileEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  isPlayer: boolean;
  radius: number;
  color: string;
  glowColor: string;
  shape: 'bullet' | 'egg' | 'beam' | 'plasma' | 'missile' | 'quill' | 'star';
  life: number;
  pierce?: number;
  homing?: boolean;
}

export interface EnemyEntity {
  id: number;
  type: EnemyType;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  damage: number;
  width: number;
  height: number;
  color: string;
  secondaryColor: string;
  scoreValue: number;
  coinValue: number;
  shootCooldown: number;
  shootInterval: number;
  aiPattern: 'straight' | 'sine' | 'dive' | 'hover' | 'circle' | 'escort' | 'boss';
  aiTimer: number;
  originX: number;
  originY: number;
  hitFlash: number;
  diveTargetX?: number;
  isBoss?: boolean;
  bossPhase?: number;
  bossMaxPhases?: number;
  hasWeaponGift?: boolean;
  giftWeaponType?: WeaponType;
}

export interface WaveDef {
  delayBefore: number; // seconds
  enemyCount: number;
  enemyType: EnemyType;
  formation: 'v_shape' | 'line' | 'sine_wave' | 'double_sweep' | 'swarm_circle' | 'boss_arrival';
  spawnInterval: number;
  specialModifier?: string;
}

export interface MissionDef {
  id: string;
  worldId: number;
  missionNumber: number;
  name: string;
  description: string;
  worldName: string;
  waves: WaveDef[];
  bossDef?: BossDef;
  targetScore: [number, number, number]; // 1, 2, 3 stars
  completionCoins: number;
  backgroundTheme: 'candy_nebula' | 'mechanical_moon' | 'toxic_jungle' | 'frozen_comet';
  hazardType?: 'none' | 'candies' | 'asteroids' | 'space_junk';
}

export interface WorldDef {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  missionsCount: number;
  primaryColor: string;
  unlockedAtMission: number;
}

export interface PlayerStats {
  score: number;
  coins: number;
  combo: number;
  maxCombo: number;
  enemiesDefeated: number;
  shotsFired: number;
  shotsHit: number;
  damageTaken: number;
  bossesDefeated: number;
  missionsCompleted: number;
  playtimeSeconds: number;
}

export interface UpgradesState {
  hullLevel: number;       // +Max Health
  shieldLevel: number;     // +Max Shield & Regen
  blasterLevel: number;    // +Damage & Fire Rate
  magnetLevel: number;     // +Coin collection vacuum radius
  specialLevel: number;    // -Special cooldown & +Area
}

export interface PlayerSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  muted: boolean;
  autoFire: boolean;
  screenShake: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  touchControls: boolean;
  leftHanded: boolean;
  controlSensitivity: number;
  reducedMotion: boolean;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface SaveData {
  version: number;
  coins: number;
  revivalKeys: number;
  selectedShipId: string;
  unlockedShips: string[];
  unlockedMissions: string[];
  missionStars: Record<string, number>;
  missionHighScores: Record<string, number>;
  upgrades: UpgradesState;
  achievements: Record<string, boolean>;
  stats: PlayerStats;
  settings: PlayerSettings;
  lastDailyDate?: string;
  selectedCompanionId?: string;
  unlockedCompanions: string[];
}

export interface CompanionDef {
  id: string;
  name: string;
  species: string;
  description: string;
  perk: string;
  cost: number;
  primaryColor: string;
}
