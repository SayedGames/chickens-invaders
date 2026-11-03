/**
 * Galactic Critters: GameEngine
 * Core game loop, fixed-step simulation, collision systems, wave orchestrator, and boss state machines.
 */

import {
  MissionDef,
  ShipDef,
  EnemyEntity,
  ProjectileEntity,
  CollectibleEntity,
  PowerupType,
  WeaponType,
  GameMode,
  PlayerStats,
  BossDef,
  EggSplatEntity,
} from '../types';
import { SHIPS } from '../data/ships';
import { WEAPONS } from '../data/weapons';
import { ENEMIES, BOSS_CATALOG } from '../data/enemies';
import { ALL_MISSIONS, getMissionById } from '../data/missions';
import { Starfield } from './Starfield';
import { ParticleSystem } from './ParticleSystem';
import { InputManager } from './InputManager';
import { CanvasRenderer } from './CanvasRenderer';
import { sound } from '../audio/SoundEffects';
import { SaveManager } from '../SaveManager';

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, combo: number, coins: number) => void;
  onHealthUpdate: (health: number, maxHealth: number, shield: number, maxShield: number) => void;
  onSpecialUpdate: (cooldownRatio: number, isReady: boolean) => void;
  onBossHealthUpdate: (bossName: string, health: number, maxHealth: number, phase: number, maxPhases: number) => void;
  onBossDefeated: () => void;
  onMissionComplete: (stars: number, score: number, coins: number, stats: PlayerStats) => void;
  onMissionFailed: (score: number, coins: number, stats: PlayerStats) => void;
  onWaveUpdate: (currentWave: number, totalWaves: number) => void;
  onWeaponUpdate?: (weaponName: string, level: number) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;

  // Viewport virtual coordinate bounds (logical 800 x 1000)
  public readonly vWidth = 800;
  public readonly vHeight = 1000;
  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // Subsystems
  public input: InputManager;
  private starfield: Starfield;
  private particles: ParticleSystem;
  private saveMgr: SaveManager;
  private callbacks: GameEngineCallbacks;

  // Current session configuration
  private mode: GameMode = 'campaign';
  private currentMission: MissionDef | null = null;
  private selectedShip: ShipDef;
  private currentWeaponType: WeaponType = 'blaster';

  // Gameplay state
  private playerX: number = 400;
  private playerY: number = 850;
  private playerVx: number = 0;
  private playerVy: number = 0;
  private playerTilt: number = 0;
  private playerHealth: number = 100;
  private playerMaxHealth: number = 100;
  private playerShield: number = 50;
  private playerMaxShield: number = 50;
  private shieldRegenCooldown: number = 0;
  private invulnerableTimer: number = 0;
  private weaponLevel: number = 1;
  private fireTimer: number = 0;
  private specialCooldownTimer: number = 0;
  private specialActiveTimer: number = 0;
  private specialDuration: number = 0;

  // Entities
  private enemies: EnemyEntity[] = [];
  private playerProjectiles: ProjectileEntity[] = [];
  private enemyProjectiles: ProjectileEntity[] = [];
  private collectibles: CollectibleEntity[] = [];
  private eggSplats: EggSplatEntity[] = [];

  // Wave manager state
  private currentWaveIndex: number = 0;
  private waveSpawnTimer: number = 0;
  private waveEnemiesSpawned: number = 0;
  private waveDelayTimer: number = 0;
  private activeBoss: EnemyEntity | null = null;
  private endlessWaveCounter: number = 1;

  // Scoring & Stats
  private score: number = 0;
  private sessionCoins: number = 0;
  private comboCount: number = 0;
  private comboTimer: number = 0;
  private shotsFired: number = 0;
  private shotsHit: number = 0;
  private enemiesDefeated: number = 0;
  private bossesDefeated: number = 0;
  private damageTaken: number = 0;
  private sessionStartTime: number = 0;

  // Game Feel
  private cameraShakeIntensity: number = 0;
  private hitstopTimer: number = 0;
  private gameTime: number = 0;
  private entityIdCounter: number = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    this.input = new InputManager();
    this.starfield = new Starfield(90);
    this.particles = new ParticleSystem();
    this.saveMgr = SaveManager.getInstance();

    const save = this.saveMgr.getData();
    this.selectedShip = SHIPS.find((s) => s.id === save.selectedShipId) || SHIPS[0];

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  public handleResize = () => {
    const parent = this.canvas.parentElement;
    const clientW = parent ? parent.clientWidth : window.innerWidth;
    const clientH = parent ? parent.clientHeight : window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = clientW * dpr;
    this.canvas.height = clientH * dpr;

    // Calculate aspect ratio scale to fit virtual 800x1000
    const scaleX = (clientW * dpr) / this.vWidth;
    const scaleY = (clientH * dpr) / this.vHeight;
    this.scale = Math.min(scaleX, scaleY);

    this.offsetX = (this.canvas.width - this.vWidth * this.scale) * 0.5;
    this.offsetY = (this.canvas.height - this.vHeight * this.scale) * 0.5;
  };

  public startMission(missionId: string, shipId?: string) {
    const save = this.saveMgr.getData();
    if (shipId) {
      this.selectedShip = SHIPS.find((s) => s.id === shipId) || this.selectedShip;
    } else {
      this.selectedShip = SHIPS.find((s) => s.id === save.selectedShipId) || SHIPS[0];
    }

    this.mode = 'campaign';
    const mission = getMissionById(missionId) || ALL_MISSIONS[0];
    this.currentMission = mission;
    this.starfield.setTheme(mission.backgroundTheme);

    this.resetGameplayState();
    this.isRunning = true;
    this.isPaused = false;
    sound.startBgm();

    this.callbacks.onWaveUpdate(1, mission.waves.length);
    this.callbacks.onScoreUpdate(this.score, this.comboCount, this.sessionCoins);
    this.callbacks.onHealthUpdate(this.playerHealth, this.playerMaxHealth, this.playerShield, this.playerMaxShield);

    this.lastTime = performance.now();
    if (this.animFrameId === null) {
      this.loop(this.lastTime);
    }
  }

  public startEndless(shipId?: string) {
    const save = this.saveMgr.getData();
    if (shipId) {
      this.selectedShip = SHIPS.find((s) => s.id === shipId) || this.selectedShip;
    } else {
      this.selectedShip = SHIPS.find((s) => s.id === save.selectedShipId) || SHIPS[0];
    }

    this.mode = 'endless';
    this.currentMission = null;
    this.endlessWaveCounter = 1;
    this.starfield.setTheme('candy_nebula');

    this.resetGameplayState();
    this.isRunning = true;
    this.isPaused = false;
    sound.startBgm();

    this.callbacks.onWaveUpdate(1, 999);
    this.callbacks.onScoreUpdate(this.score, this.comboCount, this.sessionCoins);

    this.lastTime = performance.now();
    if (this.animFrameId === null) {
      this.loop(this.lastTime);
    }
  }

  private resetGameplayState() {
    const upgrades = this.saveMgr.getData().upgrades;

    // Apply upgrade boosts (scaled for challenging arcade play)
    const hullBonus = upgrades.hullLevel * 4;
    const shieldBonus = upgrades.shieldLevel * 2;

    this.playerHealth = this.selectedShip.baseHealth + hullBonus;
    this.playerMaxHealth = this.playerHealth;
    this.playerShield = this.selectedShip.baseShield + shieldBonus;
    this.playerMaxShield = this.playerShield;
    this.currentWeaponType = this.selectedShip.primaryWeapon || 'blaster';
    const initWep = WEAPONS[this.currentWeaponType];
    this.callbacks.onWeaponUpdate?.(initWep?.name || 'Green Ion Blaster', 1);

    this.playerX = this.vWidth * 0.5;
    this.playerY = this.vHeight * 0.85;
    this.playerVx = 0;
    this.playerVy = 0;
    this.playerTilt = 0;

    this.weaponLevel = 1;
    this.fireTimer = 0;
    this.specialCooldownTimer = 0;
    this.specialActiveTimer = 0;
    this.invulnerableTimer = 0.8; // Brief starter immunity

    this.enemies = [];
    this.playerProjectiles = [];
    this.enemyProjectiles = [];
    this.collectibles = [];
    this.particles.clear();

    this.currentWaveIndex = 0;
    this.waveSpawnTimer = 0;
    this.waveEnemiesSpawned = 0;
    this.waveDelayTimer = 0.5;
    this.activeBoss = null;

    this.score = 0;
    this.sessionCoins = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.enemiesDefeated = 0;
    this.bossesDefeated = 0;
    this.damageTaken = 0;
    this.sessionStartTime = performance.now();

    this.cameraShakeIntensity = 0;
    this.hitstopTimer = 0;
    this.gameTime = 0;
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this.lastTime = performance.now();
  }

  public isGamePaused(): boolean {
    return this.isPaused;
  }

  public revivePlayer(): boolean {
    if (this.saveMgr.useRevivalKey()) {
      this.playerHealth = this.playerMaxHealth;
      this.playerShield = this.playerMaxShield;
      this.invulnerableTimer = 3.0; // 3 sec invulnerable on revive
      this.triggerScreenClearBomb();
      this.resume();
      this.callbacks.onHealthUpdate(this.playerHealth, this.playerMaxHealth, this.playerShield, this.playerMaxShield);
      return true;
    }
    return false;
  }

  public triggerScreenClearBomb() {
    sound.playExplosion('boss');
    this.triggerScreenShake(20);
    // Destroy all enemy bullets
    this.enemyProjectiles = [];
    // Damage all enemies
    for (const e of this.enemies) {
      e.health -= 250;
      e.hitFlash = 0.2;
      this.particles.spawnExplosion(e.x, e.y, '#f43f5e', 1.2);
    }
  }

  public stop() {
    this.isRunning = false;
    sound.stopBgm();
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
  }

  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const dt = Math.min(rawDt, 0.05); // Clamp dt to prevent teleporting after pause

    if (!this.isPaused) {
      // Hitstop freeze handling
      if (this.hitstopTimer > 0) {
        this.hitstopTimer -= dt;
      } else {
        this.update(dt);
      }
    }

    this.render();
    this.input.endFrame();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.gameTime += dt;

    // Check pause input
    if (this.input.isPauseJustPressed()) {
      this.pause();
      return;
    }

    // 1. Player Movement: Mouse / Touch Dragging or Keyboard
    if (this.input.pointerActive) {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const mouseX = (this.input.pointerClientX - rect.left) * dpr;
      const mouseY = (this.input.pointerClientY - rect.top) * dpr;
      const targetX = (mouseX - this.offsetX) / this.scale;
      const targetY = (mouseY - this.offsetY) / this.scale;
      const dx = targetX - this.playerX;
      const dy = targetY - this.playerY;

      // Responsive interpolation
      this.playerX += dx * Math.min(1, dt * 24);
      this.playerY += dy * Math.min(1, dt * 24);
      this.playerTilt += (Math.max(-1, Math.min(1, dx * 0.05)) - this.playerTilt) * 14 * dt;
    } else {
      const move = this.input.getMovementVector();
      const speed = this.selectedShip.baseSpeed;
      this.playerVx = move.x * speed;
      this.playerVy = move.y * speed;

      this.playerX += this.playerVx * dt;
      this.playerY += this.playerVy * dt;

      const targetTilt = move.x;
      this.playerTilt += (targetTilt - this.playerTilt) * 12 * dt;
    }

    // Boundary constraints (ship radius ~ 30)
    const marginX = 35;
    const marginY = 40;
    this.playerX = Math.max(marginX, Math.min(this.vWidth - marginX, this.playerX));
    this.playerY = Math.max(marginY, Math.min(this.vHeight - marginY, this.playerY));

    // Thruster exhaust particles
    if (Math.random() < 0.6) {
      this.particles.spawnThrusterFlame(this.playerX, this.playerY + 20, this.selectedShip.primaryColor);
    }

    // 2. Shield Regeneration: Slow regen after cooldown so hits matter
    if (this.shieldRegenCooldown > 0) {
      this.shieldRegenCooldown -= dt;
    } else if (this.playerShield < this.playerMaxShield) {
      this.playerShield = Math.min(this.playerMaxShield, this.playerShield + dt * 2.0);
      this.callbacks.onHealthUpdate(this.playerHealth, this.playerMaxHealth, this.playerShield, this.playerMaxShield);
    }

    // Invulnerability timer
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // 3. Weapons & Firing
    this.fireTimer -= dt;
    if (this.fireTimer <= 0 && this.input.isFiring()) {
      this.firePlayerWeapon();
    }

    // 4. Special Ability Logic
    if (this.specialCooldownTimer > 0) {
      this.specialCooldownTimer -= dt;
      const ratio = 1 - this.specialCooldownTimer / this.selectedShip.specialCooldown;
      this.callbacks.onSpecialUpdate(Math.max(0, ratio), false);
    } else {
      this.callbacks.onSpecialUpdate(1, true);
    }

    if (this.input.isSpecialJustPressed() && this.specialCooldownTimer <= 0) {
      this.activateSpecialAbility();
    }

    // 5. Update Combo Meter
    if (this.comboCount > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
        this.callbacks.onScoreUpdate(this.score, 0, this.sessionCoins);
      }
    }

    // 6. Camera Shake Decay
    if (this.cameraShakeIntensity > 0) {
      this.cameraShakeIntensity = Math.max(0, this.cameraShakeIntensity - dt * 35);
    }

    // 7. Update Projectiles
    this.updateProjectiles(dt);

    // 8. Update Enemies & Formations
    this.updateEnemies(dt);

    // 9. Update Wave Manager
    this.updateWaves(dt);

    // 10. Update Collectibles & Magnet Pull
    this.updateCollectibles(dt);

    // 11. Run Collision Detections
    this.handleCollisions();

    // 12. Subsystems Update
    this.starfield.update(dt, this.vWidth, this.vHeight, 1.2);
    this.particles.update(dt);
  }

  private firePlayerWeapon() {
    const activeType = this.currentWeaponType || this.selectedShip.primaryWeapon || 'blaster';
    const weaponDef = WEAPONS[activeType];
    const upgrades = this.saveMgr.getData().upgrades;
    const fireRateMultiplier = 1 + upgrades.blasterLevel * 0.12;
    this.fireTimer = 1 / (weaponDef.fireRate * fireRateMultiplier);

    const dmgMultiplier = 1 + upgrades.blasterLevel * 0.15;
    const damage = weaponDef.damage * dmgMultiplier;

    this.shotsFired++;
    sound.playShoot(activeType);

    // Bullet count scales with weaponLevel
    const count = Math.min(5, weaponDef.bulletCount + (this.weaponLevel - 1));
    const spreadTotal = weaponDef.spreadAngle * (count - 1);

    for (let i = 0; i < count; i++) {
      const angle = count === 1 ? -Math.PI / 2 : -Math.PI / 2 - spreadTotal * 0.5 + (spreadTotal / (count - 1)) * i;
      const vx = Math.cos(angle) * weaponDef.projectileSpeed;
      const vy = Math.sin(angle) * weaponDef.projectileSpeed;

      let shape: 'bullet' | 'plasma' | 'missile' | 'beam' = 'bullet';
      if (weaponDef.type === 'plasma') shape = 'plasma';
      if (weaponDef.type === 'missile') shape = 'missile';
      if (weaponDef.type === 'laser') shape = 'beam';

      this.playerProjectiles.push({
        id: ++this.entityIdCounter,
        x: this.playerX + (i - (count - 1) / 2) * 8,
        y: this.playerY - 22,
        vx,
        vy,
        damage,
        isPlayer: true,
        radius: weaponDef.size,
        color: weaponDef.color,
        glowColor: weaponDef.glowColor,
        shape,
        life: 2.0,
        homing: weaponDef.type === 'missile',
        pierce: weaponDef.type === 'laser' ? 2 : 1,
      });
    }
  }

  private activateSpecialAbility() {
    this.specialCooldownTimer = this.selectedShip.specialCooldown;
    sound.playSpecial(this.selectedShip.specialType);
    this.triggerScreenShake(14);

    if (this.selectedShip.specialType === 'nova_blast' || this.selectedShip.specialType === 'emp_bomb') {
      this.triggerScreenClearBomb();
      this.particles.spawnExplosion(this.playerX, this.playerY, this.selectedShip.accentColor, 2.5);
    } else if (this.selectedShip.specialType === 'shield_burst') {
      this.playerShield = this.playerMaxShield;
      this.invulnerableTimer = 5.0;
      this.particles.spawnFloatingText('INVULNERABLE!', this.playerX, this.playerY - 40, '#38bdf8', 22);
    } else if (this.selectedShip.specialType === 'cluster_strike') {
      // Launch 10 homing missiles
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        this.playerProjectiles.push({
          id: ++this.entityIdCounter,
          x: this.playerX,
          y: this.playerY,
          vx: Math.cos(a) * 350,
          vy: Math.sin(a) * 350,
          damage: 55,
          isPlayer: true,
          radius: 9,
          color: '#ef4444',
          glowColor: 'rgba(239, 68, 68, 0.8)',
          shape: 'missile',
          life: 3.0,
          homing: true,
        });
      }
    } else if (this.selectedShip.specialType === 'hyper_laser') {
      // Massive beam barrage
      for (let i = -3; i <= 3; i++) {
        this.playerProjectiles.push({
          id: ++this.entityIdCounter,
          x: this.playerX + i * 16,
          y: this.playerY - 20,
          vx: 0,
          vy: -1400,
          damage: 180,
          isPlayer: true,
          radius: 12,
          color: '#ec4899',
          glowColor: 'rgba(236, 72, 153, 0.9)',
          shape: 'bullet',
          life: 1.5,
          pierce: 5,
        });
      }
    } else {
      // Default nova
      this.triggerScreenClearBomb();
    }
  }

  private updateProjectiles(dt: number) {
    // Player projectiles
    for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
      const p = this.playerProjectiles[i];
      p.life -= dt;

      // Homing missile steering
      if (p.homing && this.enemies.length > 0) {
        let nearest: EnemyEntity | null = null;
        let minDist = 999999;
        for (const e of this.enemies) {
          const d = Math.hypot(e.x - p.x, e.y - p.y);
          if (d < minDist) {
            minDist = d;
            nearest = e;
          }
        }
        if (nearest) {
          const targetAngle = Math.atan2(nearest.y - p.y, nearest.x - p.x);
          const currentAngle = Math.atan2(p.vy, p.vx);
          const newAngle = currentAngle + (targetAngle - currentAngle) * 5 * dt;
          const speed = Math.hypot(p.vx, p.vy);
          p.vx = Math.cos(newAngle) * speed;
          p.vy = Math.sin(newAngle) * speed;
        }
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Despawn when out of bounds or expired
      if (p.life <= 0 || p.y < -50 || p.y > this.vHeight + 50 || p.x < -50 || p.x > this.vWidth + 50) {
        this.playerProjectiles.splice(i, 1);
      }
    }

    // Enemy projectiles (Eggs & plasma)
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const p = this.enemyProjectiles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // When an egg reaches the ground: splatters into fried sunny-side-up egg!
      if (p.y >= this.vHeight - 16) {
        if (p.shape === 'egg') {
          this.eggSplats.push({
            id: ++this.entityIdCounter,
            x: p.x,
            y: this.vHeight - 14,
            alpha: 1.0,
            life: 5.0,
            maxLife: 5.0,
            scale: 0.8 + Math.random() * 0.4,
          });
        }
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (p.life <= 0 || p.x < -50 || p.x > this.vWidth + 50) {
        this.enemyProjectiles.splice(i, 1);
      }
    }

    // Update egg splats fading over 5 seconds
    for (let i = this.eggSplats.length - 1; i >= 0; i--) {
      const splat = this.eggSplats[i];
      splat.life -= dt;
      splat.alpha = Math.max(0, splat.life / splat.maxLife);
      if (splat.life <= 0) {
        this.eggSplats.splice(i, 1);
      }
    }
  }

  private updateEnemies(dt: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.aiTimer += dt;
      if (e.hitFlash > 0) e.hitFlash -= dt;

      // Movement patterns
      if (e.isBoss) {
        this.updateBossAI(e, dt);
      } else if (e.aiPattern === 'sine') {
        e.y += e.vy * dt;
        e.x = e.originX + Math.sin(e.aiTimer * 3) * 120;
      } else if (e.aiPattern === 'dive') {
        if (e.aiTimer < 1.0) {
          e.y += 40 * dt; // Slow hover prep
        } else {
          // Dive toward player
          e.y += 360 * dt;
          if (e.diveTargetX !== undefined) {
            e.x += (e.diveTargetX - e.x) * 2 * dt;
          }
        }
      } else {
        e.x += e.vx * dt;
        e.y += e.vy * dt;
      }

      // Firing logic
      if (e.shootInterval > 0) {
        e.shootCooldown -= dt;
        if (e.shootCooldown <= 0) {
          e.shootCooldown = e.shootInterval + Math.random() * 0.5;
          this.fireEnemyProjectile(e);
        }
      }

      // Remove enemies that fell way below screen
      if (e.y > this.vHeight + 80) {
        this.enemies.splice(i, 1);
      }
    }
  }

  private updateBossAI(boss: EnemyEntity, dt: number) {
    // Keep boss inside top 30% of screen with gentle swaying
    const targetY = 160 + Math.sin(boss.aiTimer * 1.5) * 40;
    boss.y += (targetY - boss.y) * 2 * dt;
    boss.x = this.vWidth * 0.5 + Math.sin(boss.aiTimer * 1.2) * 220;

    // Boss Phase Transitions
    const hpRatio = boss.health / boss.maxHealth;
    if (hpRatio <= 0.33 && boss.bossPhase !== 3) {
      boss.bossPhase = 3;
      boss.shootInterval = 0.5; // Furious enrage!
      sound.playBossAlarm();
      this.triggerScreenShake(16);
      this.particles.spawnFloatingText('ENRAGED PHASE!', boss.x, boss.y - 60, '#ef4444', 26);
    } else if (hpRatio <= 0.66 && boss.bossPhase === 1) {
      boss.bossPhase = 2;
      boss.shootInterval = 0.7;
      sound.playBossAlarm();
      this.triggerScreenShake(12);
      this.particles.spawnFloatingText('PHASE 2!', boss.x, boss.y - 60, '#f59e0b', 24);
    }

    this.callbacks.onBossHealthUpdate(
      boss.name,
      Math.max(0, boss.health),
      boss.maxHealth,
      boss.bossPhase || 1,
      boss.bossMaxPhases || 3
    );
  }

  private fireEnemyProjectile(e: EnemyEntity) {
    if (e.isBoss) {
      sound.playShoot('enemy');
      // Boss fires triple or spiral barrage
      const count = e.bossPhase === 3 ? 5 : 3;
      const spread = 0.4;
      for (let i = 0; i < count; i++) {
        const angle = Math.PI / 2 - spread * 0.5 + (spread / (count - 1)) * i;
        this.enemyProjectiles.push({
          id: ++this.entityIdCounter,
          x: e.x + (i - (count - 1) / 2) * 20,
          y: e.y + 40,
          vx: Math.cos(angle) * 320,
          vy: Math.sin(angle) * 320,
          damage: 25,
          isPlayer: false,
          radius: 9,
          color: '#fbbf24',
          glowColor: 'rgba(251, 191, 36, 0.8)',
          shape: 'egg',
          life: 4.0,
        });
      }
    } else {
      sound.playShoot('enemy');
      // Chickens lay eggs that fall slowly slowly down to the ground
      this.enemyProjectiles.push({
        id: ++this.entityIdCounter,
        x: e.x,
        y: e.y + 18,
        vx: (Math.random() - 0.5) * 30,
        vy: 140, // slow descent
        damage: 22,
        isPlayer: false,
        radius: 7,
        color: '#ffffff',
        glowColor: 'rgba(255, 255, 255, 0.8)',
        shape: 'egg',
        life: 8.0,
      });
    }
  }

  private updateWaves(dt: number) {
    if (this.mode === 'campaign' && this.currentMission) {
      const waves = this.currentMission.waves;
      if (this.currentWaveIndex >= waves.length) {
        // All waves deployed; check if all enemies defeated
        if (this.enemies.length === 0) {
          this.completeMission();
        }
        return;
      }

      const wave = waves[this.currentWaveIndex];
      this.waveDelayTimer -= dt;
      if (this.waveDelayTimer > 0) return;

      this.waveSpawnTimer -= dt;
      if (this.waveSpawnTimer <= 0 && this.waveEnemiesSpawned < wave.enemyCount) {
        this.waveSpawnTimer = wave.spawnInterval;
        this.spawnWaveEnemy(wave.enemyType, wave.formation, this.waveEnemiesSpawned, wave.enemyCount);
        this.waveEnemiesSpawned++;

        if (this.waveEnemiesSpawned >= wave.enemyCount) {
          // Finished spawning this wave
          this.currentWaveIndex++;
          this.waveEnemiesSpawned = 0;
          this.waveDelayTimer = 2.5; // Gap before next wave
          this.callbacks.onWaveUpdate(Math.min(waves.length, this.currentWaveIndex + 1), waves.length);
        }
      }
    } else if (this.mode === 'endless') {
      // Endless wave generator
      if (this.enemies.length === 0) {
        this.waveDelayTimer -= dt;
        if (this.waveDelayTimer <= 0) {
          this.spawnEndlessWave(this.endlessWaveCounter);
          this.endlessWaveCounter++;
          this.waveDelayTimer = 2.0;
          this.callbacks.onWaveUpdate(this.endlessWaveCounter, 999);
        }
      }
    }
  }

  private spawnWaveEnemy(
    type: string,
    formation: string,
    index: number,
    total: number
  ) {
    if (type === 'boss') {
      const bossDef = this.currentMission?.bossDef || BOSS_CATALOG.general_cluck;
      sound.playBossAlarm();
      this.triggerScreenShake(20);

      const bossEnemy: EnemyEntity = {
        id: ++this.entityIdCounter,
        type: 'boss',
        name: bossDef.name,
        x: this.vWidth * 0.5,
        y: -120,
        vx: 0,
        vy: 80,
        health: bossDef.maxHealth,
        maxHealth: bossDef.maxHealth,
        damage: 40,
        width: bossDef.width,
        height: bossDef.height,
        color: bossDef.color,
        secondaryColor: bossDef.secondaryColor,
        scoreValue: 5000,
        coinValue: 150,
        shootCooldown: 1.5,
        shootInterval: 0.9,
        aiPattern: 'boss',
        aiTimer: 0,
        originX: this.vWidth * 0.5,
        originY: 180,
        hitFlash: 0,
        isBoss: true,
        bossPhase: 1,
        bossMaxPhases: bossDef.phases,
      };

      this.enemies.push(bossEnemy);
      this.activeBoss = bossEnemy;
      this.callbacks.onBossHealthUpdate(bossEnemy.name, bossEnemy.health, bossEnemy.maxHealth, 1, bossDef.phases);
      return;
    }

    const enemyData = ENEMIES[type as keyof typeof ENEMIES] || ENEMIES.scout;
    let spawnX = 400;
    let spawnY = -40;
    let vx = 0;
    let vy = enemyData.speed;
    let pattern: 'straight' | 'sine' | 'dive' = 'straight';

    if (formation === 'line') {
      const spacing = this.vWidth / (total + 1);
      spawnX = spacing * (index + 1);
    } else if (formation === 'v_shape') {
      const mid = Math.floor(total / 2);
      const offset = Math.abs(index - mid);
      spawnX = this.vWidth * 0.5 + (index - mid) * 65;
      spawnY = -40 - offset * 45;
    } else if (formation === 'sine_wave') {
      spawnX = (this.vWidth / (total + 1)) * (index + 1);
      pattern = 'sine';
    } else if (formation === 'double_sweep') {
      spawnX = index % 2 === 0 ? 80 + index * 40 : this.vWidth - 80 - index * 40;
      pattern = 'dive';
    }

    // In Chicken Invaders, special chickens in formations carry different weapon gifts!
    const possibleWeapons: WeaponType[] = ['blaster', 'spread', 'plasma', 'laser', 'missile', 'lightning'];
    const hasWeaponGift = enemyData.type !== 'asteroid' && ((index % 4 === 1) || Math.random() < 0.22);
    const giftWeaponType = possibleWeapons[Math.floor(Math.random() * possibleWeapons.length)];

    this.enemies.push({
      id: ++this.entityIdCounter,
      type: enemyData.type,
      name: enemyData.name,
      x: spawnX,
      y: spawnY,
      vx,
      vy,
      health: enemyData.health,
      maxHealth: enemyData.health,
      damage: enemyData.damage,
      width: enemyData.width,
      height: enemyData.height,
      color: enemyData.color,
      secondaryColor: enemyData.secondaryColor,
      scoreValue: enemyData.score,
      coinValue: enemyData.coins,
      shootCooldown: Math.random() * (enemyData.shootInterval || 3.0),
      shootInterval: enemyData.shootInterval || 3.0,
      aiPattern: pattern,
      aiTimer: 0,
      originX: spawnX,
      originY: spawnY,
      hitFlash: 0,
      diveTargetX: this.playerX,
      hasWeaponGift,
      giftWeaponType,
    });
  }

  private spawnEndlessWave(waveNum: number) {
    const isBossWave = waveNum % 5 === 0;
    if (isBossWave) {
      this.spawnWaveEnemy('boss', 'boss_arrival', 0, 1);
      return;
    }

    const count = Math.min(18, 5 + waveNum * 2);
    const types: (keyof typeof ENEMIES)[] = ['scout', 'swarmer', 'armored_egg', 'kamikaze_pigeon', 'urchin', 'jelly_pulsar'];
    const chosenType = types[waveNum % types.length];
    for (let i = 0; i < count; i++) {
      this.spawnWaveEnemy(chosenType, i % 2 === 0 ? 'v_shape' : 'sine_wave', i, count);
    }
  }

  private updateCollectibles(dt: number) {
    const upgrades = this.saveMgr.getData().upgrades;
    const magnetRadius = 110 + upgrades.magnetLevel * 45;

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      item.lifeTime -= dt;

      const isMeat = item.type === 'drumstick' || item.type === 'roast_chicken';
      const dist = Math.hypot(this.playerX - item.x, this.playerY - item.y);

      // Magnet pull towards player
      if (dist < magnetRadius) {
        const pullSpeed = 460;
        const angle = Math.atan2(this.playerY - item.y, this.playerX - item.x);
        item.x += Math.cos(angle) * pullSpeed * dt;
        item.y += Math.sin(angle) * pullSpeed * dt;
      } else if (isMeat) {
        // Chicken leg pieces fall towards ground with gravity and bounce 3 times before disappearing!
        item.vy += 340 * dt;
        item.x += item.vx * dt;
        item.y += item.vy * dt;

        // Keep inside screen boundaries
        if (item.x < 30) {
          item.x = 30;
          item.vx = Math.abs(item.vx) * 0.7;
        } else if (item.x > this.vWidth - 30) {
          item.x = this.vWidth - 30;
          item.vx = -Math.abs(item.vx) * 0.7;
        }

        // Ground contact at bottom
        const groundY = this.vHeight - 34;
        if (item.y >= groundY) {
          item.y = groundY;
          item.bounceCount = (item.bounceCount || 0) + 1;

          if (item.bounceCount >= 3) {
            // Disappears on third jump!
            this.particles.spawnExplosion(item.x, item.y, '#f59e0b', 0.4);
            this.collectibles.splice(i, 1);
            continue;
          } else {
            // Bounce up with diminishing hop
            item.vy = -185 * (1 - (item.bounceCount - 1) * 0.22);
            item.vx = (Math.random() - 0.5) * 80;
          }
        }
      } else {
        item.y += item.vy * dt;
        item.x += item.vx * dt;
      }

      // Collect item if touching player
      if (dist < 32 + item.radius) {
        this.collectItem(item);
        this.collectibles.splice(i, 1);
        continue;
      }

      if (item.lifeTime <= 0 || item.y > this.vHeight + 50) {
        this.collectibles.splice(i, 1);
      }
    }
  }

  private collectItem(item: CollectibleEntity) {
    if (item.type === 'drumstick') {
      sound.playCoin();
      this.sessionCoins += item.value;
      this.score += 150;
      this.particles.spawnFloatingText('+150 DRUMSTICK!', item.x, item.y, '#f59e0b', 16);
    } else if (item.type === 'roast_chicken') {
      sound.playPowerup();
      this.sessionCoins += item.value * 3;
      this.score += 500;
      this.particles.spawnFloatingText('+500 ROAST CHICKEN!', item.x, item.y, '#f59e0b', 20);
    } else if (item.type === 'weapon_gift' || item.type === 'weapon_upgrade') {
      sound.playPowerup();
      const targetWeaponType = item.weaponType || 'blaster';
      const weaponDef = WEAPONS[targetWeaponType];

      if (this.currentWeaponType === targetWeaponType) {
        // Power up level of current weapon!
        this.weaponLevel = Math.min(5, this.weaponLevel + 1);
        this.score += 500;
        this.particles.spawnFloatingText(`POWER LEVEL ${this.weaponLevel}!`, item.x, item.y, weaponDef.color, 22);
      } else {
        // Change weapon to the new bullet type!
        this.currentWeaponType = targetWeaponType;
        this.score += 750;
        this.particles.spawnFloatingText(`${weaponDef.name.toUpperCase()}!`, item.x, item.y, weaponDef.color, 24);
      }
      this.callbacks.onWeaponUpdate?.(weaponDef.name, this.weaponLevel);
      this.triggerScreenShake(6);
    } else if (item.type === 'coin') {
      sound.playCoin();
      this.sessionCoins += item.value;
      this.score += 50;
      this.particles.spawnFloatingText(`+${item.value}`, item.x, item.y, '#fbbf24', 16);
    } else if (item.type === 'repair') {
      sound.playPowerup();
      this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 25);
      this.callbacks.onHealthUpdate(this.playerHealth, this.playerMaxHealth, this.playerShield, this.playerMaxShield);
      this.particles.spawnFloatingText('+25 HP', item.x, item.y, '#10b981', 18);
    } else if (item.type === 'shield') {
      sound.playPowerup();
      this.playerShield = this.playerMaxShield;
      this.callbacks.onHealthUpdate(this.playerHealth, this.playerMaxHealth, this.playerShield, this.playerMaxShield);
      this.particles.spawnFloatingText('SHIELD RECHARGED', item.x, item.y, '#38bdf8', 18);
    } else if (item.type === 'bomb') {
      this.triggerScreenClearBomb();
      this.particles.spawnFloatingText('SMART BOMB!', item.x, item.y, '#ef4444', 24);
    }
    this.callbacks.onScoreUpdate(this.score, this.comboCount, this.sessionCoins);
  }

  private handleCollisions() {
    // 1. Player Projectiles vs Enemies
    for (let pIdx = this.playerProjectiles.length - 1; pIdx >= 0; pIdx--) {
      const proj = this.playerProjectiles[pIdx];

      for (let eIdx = this.enemies.length - 1; eIdx >= 0; eIdx--) {
        const enemy = this.enemies[eIdx];
        const dist = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
        const hitRadius = enemy.width * 0.5 + proj.radius;

        if (dist < hitRadius) {
          // Hit registered
          this.shotsHit++;
          enemy.health -= proj.damage;
          enemy.hitFlash = 0.12;
          sound.playHit(enemy.isBoss);

          this.particles.spawnExplosion(proj.x, proj.y, proj.color, 0.5);

          // Pierce handling
          if (!proj.pierce || proj.pierce <= 1) {
            this.playerProjectiles.splice(pIdx, 1);
          } else {
            proj.pierce--;
          }

          // Enemy Death Check
          if (enemy.health <= 0) {
            this.handleEnemyDefeat(enemy, eIdx);
          }
          break;
        }
      }
    }

    // 2. Enemy Projectiles vs Player
    if (this.invulnerableTimer <= 0) {
      for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
        const proj = this.enemyProjectiles[i];
        const dist = Math.hypot(this.playerX - proj.x, this.playerY - proj.y);
        if (dist < 26 + proj.radius) {
          this.damagePlayer(proj.damage);
          this.enemyProjectiles.splice(i, 1);
          break;
        }
      }

      // 3. Enemies colliding with Player (Ramming)
      for (const enemy of this.enemies) {
        const dist = Math.hypot(this.playerX - enemy.x, this.playerY - enemy.y);
        if (dist < 28 + enemy.width * 0.4) {
          this.damagePlayer(enemy.damage);
          break;
        }
      }
    }
  }

  private handleEnemyDefeat(enemy: EnemyEntity, enemyIndex: number) {
    this.enemiesDefeated++;
    this.enemies.splice(enemyIndex, 1);

    // Audio & particles
    sound.playExplosion(enemy.isBoss ? 'boss' : 'small');
    this.particles.spawnExplosion(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 2.5 : 1.0);
    this.particles.spawnFeathers(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 20 : 6);

    // Hitstop & Camera Shake on Boss / Heavy kills
    if (enemy.isBoss) {
      this.bossesDefeated++;
      this.hitstopTimer = 0.08;
      this.triggerScreenShake(24);
      this.callbacks.onBossDefeated();
    } else if (enemy.type === 'mini_boss' || enemy.type === 'armored_egg') {
      this.triggerScreenShake(8);
    }

    // Score & Combo increment
    this.comboCount++;
    this.comboTimer = 2.8; // 2.8 sec combo window
    const comboMultiplier = 1 + (this.comboCount - 1) * 0.1;
    const points = Math.floor(enemy.scoreValue * comboMultiplier);
    this.score += points;

    this.particles.spawnFloatingText(`+${points}`, enemy.x, enemy.y, '#facc15', 16);
    this.callbacks.onScoreUpdate(this.score, this.comboCount, this.sessionCoins);

    // Drop Collectibles
    this.spawnDrops(enemy);
  }

  private spawnDrops(enemy: EnemyEntity) {
    // Roasted chicken leg piece (drumstick) falls towards ground and bounces
    const legCount = enemy.isBoss ? 8 : 1 + (Math.random() < 0.25 ? 1 : 0);
    for (let i = 0; i < legCount; i++) {
      this.collectibles.push({
        id: ++this.entityIdCounter,
        x: enemy.x + (Math.random() - 0.5) * 30,
        y: enemy.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 60,
        vy: 70 + Math.random() * 40,
        type: Math.random() < 0.15 ? 'roast_chicken' : 'drumstick',
        value: 5,
        radius: 12,
        lifeTime: 20,
        pulsePhase: Math.random() * Math.PI * 2,
        bounceCount: 0,
      });
    }

    // Drop Weapon Gift if enemy carried one or by chance
    const weaponsList: WeaponType[] = ['blaster', 'spread', 'plasma', 'laser', 'missile', 'lightning'];
    if (enemy.hasWeaponGift || Math.random() < 0.16) {
      const dropType = enemy.giftWeaponType || weaponsList[Math.floor(Math.random() * weaponsList.length)];
      this.collectibles.push({
        id: ++this.entityIdCounter,
        x: enemy.x,
        y: enemy.y,
        vx: (Math.random() - 0.5) * 20,
        vy: 65,
        type: 'weapon_gift',
        weaponType: dropType,
        value: 1,
        radius: 16,
        lifeTime: 18,
        pulsePhase: 0,
      });
    }

    // Drop other defensive powerups based on small chance
    const roll = Math.random();
    let powerupType: PowerupType | null = null;
    if (roll < 0.05) powerupType = 'repair';
    else if (roll < 0.10) powerupType = 'shield';
    else if (roll < 0.13) powerupType = 'bomb';

    if (powerupType) {
      this.collectibles.push({
        id: ++this.entityIdCounter,
        x: enemy.x,
        y: enemy.y,
        vx: 0,
        vy: 55,
        type: powerupType,
        value: 1,
        radius: 14,
        lifeTime: 14,
        pulsePhase: 0,
      });
    }
  }

  private damagePlayer(amount: number) {
    if (this.invulnerableTimer > 0) return;

    sound.playHit(true);
    this.triggerScreenShake(14);
    this.hitstopTimer = 0.04; // Hitstop freeze on damage
    this.invulnerableTimer = 0.8; // Reduced invulnerability window
    this.damageTaken += amount;

    // Reset combo on hit
    this.comboCount = 0;

    // Absorb with shield first
    if (this.playerShield > 0) {
      if (this.playerShield >= amount) {
        this.playerShield -= amount;
        amount = 0;
      } else {
        amount -= this.playerShield;
        this.playerShield = 0;
      }
    }
    this.shieldRegenCooldown = 8.0; // 8s cooldown before shield starts regening

    // Remaining damage to hull
    if (amount > 0) {
      this.playerHealth = Math.max(0, this.playerHealth - amount);
    }

    this.callbacks.onHealthUpdate(this.playerHealth, this.playerMaxHealth, this.playerShield, this.playerMaxShield);

    if (this.playerHealth <= 0) {
      this.handlePlayerDeath();
    }
  }

  private handlePlayerDeath() {
    sound.playGameOver();
    this.triggerScreenShake(26);
    this.particles.spawnExplosion(this.playerX, this.playerY, '#ef4444', 3.0);
    this.pause();

    const stats: PlayerStats = {
      score: this.score,
      coins: this.sessionCoins,
      combo: this.comboCount,
      maxCombo: this.comboCount,
      enemiesDefeated: this.enemiesDefeated,
      shotsFired: this.shotsFired,
      shotsHit: this.shotsHit,
      damageTaken: this.damageTaken,
      bossesDefeated: this.bossesDefeated,
      missionsCompleted: 0,
      playtimeSeconds: (performance.now() - this.sessionStartTime) / 1000,
    };

    this.callbacks.onMissionFailed(this.score, this.sessionCoins, stats);
  }

  private completeMission() {
    this.pause();
    sound.playVictory();

    // Calculate stars
    let stars = 1;
    if (this.currentMission) {
      if (this.score >= this.currentMission.targetScore[2]) stars = 3;
      else if (this.score >= this.currentMission.targetScore[1]) stars = 2;
    }

    const totalCoins = this.sessionCoins + (this.currentMission?.completionCoins || 50);

    const stats: PlayerStats = {
      score: this.score,
      coins: totalCoins,
      combo: this.comboCount,
      maxCombo: this.comboCount,
      enemiesDefeated: this.enemiesDefeated,
      shotsFired: this.shotsFired,
      shotsHit: this.shotsHit,
      damageTaken: this.damageTaken,
      bossesDefeated: this.bossesDefeated,
      missionsCompleted: 1,
      playtimeSeconds: (performance.now() - this.sessionStartTime) / 1000,
    };

    this.callbacks.onMissionComplete(stars, this.score, totalCoins, stats);
  }

  public triggerScreenShake(intensity: number) {
    const settings = this.saveMgr.getData().settings;
    if (settings.screenShake) {
      this.cameraShakeIntensity = Math.max(this.cameraShakeIntensity, intensity);
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Center & scale virtual coordinate viewport
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);

    // Apply Camera Shake
    if (this.cameraShakeIntensity > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      this.ctx.translate(shakeX, shakeY);
    }

    // Clip rendering to virtual playfield
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.vWidth, this.vHeight);
    this.ctx.clip();

    // 1. Starfield & Background
    this.starfield.render(this.ctx, this.vWidth, this.vHeight);

    // 1b. Sunny-side-up Egg Splats on the ground
    CanvasRenderer.drawEggSplats(this.ctx, this.eggSplats);

    // 2. Collectibles (Drumsticks, whole chicken, powerups)
    for (const item of this.collectibles) {
      CanvasRenderer.drawCollectible(this.ctx, item, this.gameTime);
    }

    // 3. Enemies
    for (const enemy of this.enemies) {
      if (enemy.isBoss) {
        CanvasRenderer.drawBoss(this.ctx, enemy, this.gameTime);
      } else {
        CanvasRenderer.drawEnemy(this.ctx, enemy, this.gameTime);
      }
    }

    // 4. Player Ship
    CanvasRenderer.drawPlayer(
      this.ctx,
      this.selectedShip,
      this.playerX,
      this.playerY,
      this.playerTilt,
      this.invulnerableTimer,
      this.playerShield,
      this.playerMaxShield,
      this.gameTime
    );

    // 5. Projectiles
    for (const p of this.playerProjectiles) {
      CanvasRenderer.drawProjectile(this.ctx, p);
    }
    for (const p of this.enemyProjectiles) {
      CanvasRenderer.drawProjectile(this.ctx, p);
    }

    // 6. Particles & Floating Texts
    this.particles.render(this.ctx);

    this.ctx.restore();
  }
}
