/**
 * Ships Catalog: 10 original cartoon spaceships with distinct archetypes, specials, and visual palettes.
 */

import { ShipDef } from '../types';

export const SHIPS: ShipDef[] = [
  {
    id: 'cosmic_finch',
    name: 'Hero Fighter Jet',
    subtitle: 'Classic Interceptor',
    description: 'The legendary silver starfighter engineered to repel alien chicken invasions with high-speed ion blasters.',
    archetype: 'Chicken Hunter',
    baseHealth: 40,
    baseShield: 15,
    baseSpeed: 420,
    primaryWeapon: 'blaster',
    specialAbilityName: 'Missile Barrage',
    specialAbilityDesc: 'Releases a devastating smart missile blast that obliterates chicken swarms and eggs.',
    specialCooldown: 12,
    specialType: 'nova_blast',
    unlockedByDefault: true,
    cost: 0,
    primaryColor: '#cbd5e1', // Classic silver hull
    secondaryColor: '#475569', // Dark grey accents
    accentColor: '#22c55e', // Neon green laser power
    glowColor: 'rgba(56, 189, 248, 0.8)',
    spriteShape: 'chicken_fighter',
  },
  {
    id: 'galactic_rooster',
    name: 'Galactic Rooster',
    subtitle: 'Heavy Blaster',
    description: 'Armed with quad-spread blasters and an explosive Sonic Cluck EMP blast.',
    archetype: 'Spread Cannon',
    baseHealth: 50,
    baseShield: 20,
    baseSpeed: 350,
    primaryWeapon: 'spread',
    specialAbilityName: 'Egg-O-Matic EMP',
    specialAbilityDesc: 'Detonates an electromagnetic egg bomb that freezes all enemies and wipes bullets.',
    specialCooldown: 15,
    specialType: 'emp_bomb',
    unlockedByDefault: false,
    cost: 500,
    primaryColor: '#ef4444', // Crimson Red
    secondaryColor: '#f97316', // Orange
    accentColor: '#fbbf24', // Gold
    glowColor: 'rgba(239, 68, 68, 0.6)',
    spriteShape: 'rooster',
  },
  {
    id: 'nebula_quack',
    name: 'Nebula Quack',
    subtitle: 'Hydro-Plasma Cruiser',
    description: 'Fires heavy bubbling plasma orbs that deal immense splash damage to clusters.',
    archetype: 'Plasma Bomber',
    baseHealth: 55,
    baseShield: 20,
    baseSpeed: 320,
    primaryWeapon: 'plasma',
    specialAbilityName: 'Bubble Dome',
    specialAbilityDesc: 'Deploys an invulnerable energy bubble for 5 seconds that reflects attacks.',
    specialCooldown: 18,
    specialType: 'shield_burst',
    unlockedByDefault: false,
    cost: 1000,
    primaryColor: '#eab308', // Duck Yellow
    secondaryColor: '#10b981', // Emerald
    accentColor: '#f97316', // Beak Orange
    glowColor: 'rgba(234, 179, 8, 0.6)',
    spriteShape: 'quack',
  },
  {
    id: 'void_hopper',
    name: 'Void Hopper',
    subtitle: 'Hyper Bunny Interceptor',
    description: 'Lightweight titanium craft with lightning-fast thrusters and twin precision lasers.',
    archetype: 'Speed Demon',
    baseHealth: 35,
    baseShield: 10,
    baseSpeed: 460,
    primaryWeapon: 'laser',
    specialAbilityName: 'Warp Drift',
    specialAbilityDesc: 'Warps forward instantly while leaving behind a decoy mine that detonates.',
    specialCooldown: 10,
    specialType: 'time_warp',
    unlockedByDefault: false,
    cost: 1500,
    primaryColor: '#ec4899', // Hot Pink
    secondaryColor: '#a855f7', // Purple
    accentColor: '#38bdf8', // Sky Blue
    glowColor: 'rgba(236, 72, 153, 0.6)',
    spriteShape: 'hopper',
  },
  {
    id: 'astro_paws',
    name: 'Astro Paws',
    subtitle: 'Armored Canine Cruiser',
    description: 'Built like a bunker. Launches tracking micro-missiles that seek out sneaky targets.',
    archetype: 'Missile Tank',
    baseHealth: 60,
    baseShield: 20,
    baseSpeed: 290,
    primaryWeapon: 'missile',
    specialAbilityName: 'Cluster Howl',
    specialAbilityDesc: 'Launches a devastating swarm of 12 micro-rockets across the screen.',
    specialCooldown: 16,
    specialType: 'cluster_strike',
    unlockedByDefault: false,
    cost: 2200,
    primaryColor: '#f59e0b', // Golden Amber
    secondaryColor: '#d97706', // Brown Amber
    accentColor: '#ef4444', // Red
    glowColor: 'rgba(245, 158, 11, 0.6)',
    spriteShape: 'canine',
  },
  {
    id: 'solar_finch_prime',
    name: 'Solar Finch Prime',
    subtitle: 'Prismatic Beam Starcraft',
    description: 'Harnesses focused solar energy to melt armored alien exoskeletons in seconds.',
    archetype: 'Beam Sniper',
    baseHealth: 45,
    baseShield: 15,
    baseSpeed: 360,
    primaryWeapon: 'laser',
    specialAbilityName: 'Hyper Laser Lance',
    specialAbilityDesc: 'Fires an immense vertical death ray that pierces through all enemies.',
    specialCooldown: 14,
    specialType: 'hyper_laser',
    unlockedByDefault: false,
    cost: 3000,
    primaryColor: '#f43f5e', // Rose
    secondaryColor: '#fb7185', // Coral
    accentColor: '#facc15', // Yellow
    glowColor: 'rgba(244, 63, 94, 0.6)',
    spriteShape: 'falcon',
  },
  {
    id: 'shadow_raven',
    name: 'Shadow Raven',
    subtitle: 'Void Phantom',
    description: 'Stealth interceptor that channels dark energy. Higher critical strike chances.',
    archetype: 'Infiltrator',
    baseHealth: 38,
    baseShield: 15,
    baseSpeed: 420,
    primaryWeapon: 'lightning',
    specialAbilityName: 'Shadow Veil',
    specialAbilityDesc: 'Becomes untargetable for 4 seconds while firing supercharged plasma.',
    specialCooldown: 13,
    specialType: 'time_warp',
    unlockedByDefault: false,
    cost: 4000,
    primaryColor: '#8b5cf6', // Violet
    secondaryColor: '#6366f1', // Indigo
    accentColor: '#22d3ee', // Cyan
    glowColor: 'rgba(139, 92, 246, 0.6)',
    spriteShape: 'stealth',
  },
  {
    id: 'iron_boar',
    name: 'Iron Boar',
    subtitle: 'Juggernaut Ram-Ship',
    description: 'Colossal reinforced hull designed to ram through alien formations unscathed.',
    archetype: 'Heavy Brawler',
    baseHealth: 70,
    baseShield: 25,
    baseSpeed: 270,
    primaryWeapon: 'plasma',
    specialAbilityName: 'Seismic Impact',
    specialAbilityDesc: 'Charges forward with an invulnerable shield, pulverizing all targets.',
    specialCooldown: 17,
    specialType: 'nova_blast',
    unlockedByDefault: false,
    cost: 5000,
    primaryColor: '#64748b', // Slate
    secondaryColor: '#475569', // Dark Slate
    accentColor: '#f59e0b', // Amber Tusk
    glowColor: 'rgba(245, 158, 11, 0.6)',
    spriteShape: 'boar',
  },
  {
    id: 'glitch_saucer',
    name: 'Chrono Saucer',
    subtitle: 'Dimensional UFO',
    description: 'Alien technology recovered from the Cosmic Rift. Fires erratic bouncing energy discs.',
    archetype: 'Tech Manipulator',
    baseHealth: 45,
    baseShield: 15,
    baseSpeed: 390,
    primaryWeapon: 'spread',
    specialAbilityName: 'Chronos Freeze',
    specialAbilityDesc: 'Slows down time by 75% for 6 seconds while the player operates at normal speed.',
    specialCooldown: 20,
    specialType: 'time_warp',
    unlockedByDefault: false,
    cost: 6500,
    primaryColor: '#10b981', // Emerald
    secondaryColor: '#059669', // Dark Emerald
    accentColor: '#a7f3d0', // Mint
    glowColor: 'rgba(16, 185, 129, 0.6)',
    spriteShape: 'saucer',
  },
  {
    id: 'cosmic_phoenix',
    name: 'Cosmic Phoenix',
    subtitle: 'Eternal Starbird',
    description: 'The pinnacle of interstellar engineering. Emanates blazing heat and regenerates hull.',
    archetype: 'Legendary Flagship',
    baseHealth: 55,
    baseShield: 25,
    baseSpeed: 410,
    primaryWeapon: 'laser',
    specialAbilityName: 'Phoenix Rebirth Nova',
    specialAbilityDesc: 'Unleashes an all-clearing supernova explosion that repairs 50% health.',
    specialCooldown: 22,
    specialType: 'nova_blast',
    unlockedByDefault: false,
    cost: 10000,
    primaryColor: '#ff007f', // Neon Magenta
    secondaryColor: '#ffaa00', // Gold Fire
    accentColor: '#ffffff', // Star White
    glowColor: 'rgba(255, 0, 127, 0.8)',
    spriteShape: 'phoenix',
  },
];
