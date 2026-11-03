/**
 * Missions and Worlds Catalog
 * World 1: Candy Nebula (Missions 1-20)
 * World 2: Mechanical Moon (Missions 21-30+)
 */

import { MissionDef, WorldDef, WaveDef } from '../types';
import { BOSS_CATALOG } from './enemies';

export const WORLDS: WorldDef[] = [
  {
    id: 1,
    name: 'Candy Nebula',
    subtitle: 'Sugar-Coated Skirmish',
    description: 'A vibrant sector rich with star-sugar and candy comets, overrun by General Cluck\'s scout fleet.',
    missionsCount: 20,
    primaryColor: '#ec4899', // Pink
    unlockedAtMission: 1,
  },
  {
    id: 2,
    name: 'Mechanical Moon',
    subtitle: 'Cybernetic Fortresses',
    description: 'An asteroid belt converted into a militarized planetary shipyard run by Mecha-Beak 9000.',
    missionsCount: 30,
    primaryColor: '#06b6d4', // Cyan
    unlockedAtMission: 11,
  },
  {
    id: 3,
    name: 'Toxic Jungle Planet',
    subtitle: 'Bio-Organic Hazard Zone',
    description: 'Deep acidic swamps and hyper-evolved critter broods guarded by Mother Ovum.',
    missionsCount: 40,
    primaryColor: '#10b981', // Emerald
    unlockedAtMission: 21,
  },
  {
    id: 4,
    name: 'Frozen Comet Belt',
    subtitle: 'Zero-Kelvin Gauntlet',
    description: 'Sub-zero temperatures with crystalline asteroid shards and hyper-velocity blizzards.',
    missionsCount: 50,
    primaryColor: '#38bdf8', // Sky Blue
    unlockedAtMission: 31,
  },
];

// Handcrafted 10 Initial Core Missions for World 1
const CORE_MISSIONS: MissionDef[] = [
  {
    id: 'w1_m1',
    worldId: 1,
    missionNumber: 1,
    name: 'Sector 1: The Chicken Armada',
    description: 'Infiltrate the outer nebula, dodge falling eggs, and shatter the Giant Cosmic Egg!',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 10, enemyType: 'chicken', formation: 'line', spawnInterval: 0.45 },
      { delayBefore: 1.5, enemyCount: 12, enemyType: 'chicken', formation: 'v_shape', spawnInterval: 0.4 },
      { delayBefore: 2.0, enemyCount: 8, enemyType: 'asteroid', formation: 'double_sweep', spawnInterval: 0.5 },
      { delayBefore: 2.5, enemyCount: 1, enemyType: 'giant_egg', formation: 'boss_arrival', spawnInterval: 1.0 },
    ],
    targetScore: [1500, 3000, 5000],
    completionCoins: 120,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m2',
    worldId: 1,
    missionNumber: 2,
    name: 'Meteor Belt & Egg Barrage',
    description: 'Dense tumbling space rocks and agile chicken formations dropping egg salvos.',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 10, enemyType: 'asteroid', formation: 'sine_wave', spawnInterval: 0.4 },
      { delayBefore: 1.8, enemyCount: 14, enemyType: 'chicken', formation: 'double_sweep', spawnInterval: 0.35 },
      { delayBefore: 2.0, enemyCount: 12, enemyType: 'chicken', formation: 'v_shape', spawnInterval: 0.35 },
    ],
    targetScore: [2000, 3800, 6000],
    completionCoins: 150,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m3',
    worldId: 1,
    missionNumber: 3,
    name: 'Cosmic Hatchery Stronghold',
    description: 'Heavily defended chicken breeding sector guarded by cracked cosmic eggs.',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 12, enemyType: 'chicken', formation: 'line', spawnInterval: 0.4 },
      { delayBefore: 1.5, enemyCount: 8, enemyType: 'asteroid', formation: 'double_sweep', spawnInterval: 0.45 },
      { delayBefore: 2.0, enemyCount: 1, enemyType: 'giant_egg', formation: 'boss_arrival', spawnInterval: 1.0 },
      { delayBefore: 2.5, enemyCount: 16, enemyType: 'chicken', formation: 'v_shape', spawnInterval: 0.3 },
    ],
    targetScore: [2500, 4800, 7500],
    completionCoins: 180,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m4',
    worldId: 1,
    missionNumber: 4,
    name: 'Pigeon Dive Alley',
    description: 'Aggressive Kamikaze Dive-Pigeons sweep down at maximum thrust. Stay mobile!',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 6, enemyType: 'kamikaze_pigeon', formation: 'double_sweep', spawnInterval: 0.5 },
      { delayBefore: 2.0, enemyCount: 8, enemyType: 'scout', formation: 'sine_wave', spawnInterval: 0.4 },
      { delayBefore: 2.5, enemyCount: 8, enemyType: 'kamikaze_pigeon', formation: 'line', spawnInterval: 0.4 },
      { delayBefore: 2.0, enemyCount: 2, enemyType: 'armored_egg', formation: 'v_shape', spawnInterval: 0.8 },
    ],
    targetScore: [2500, 4500, 6800],
    completionCoins: 170,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m5',
    worldId: 1,
    missionNumber: 5,
    name: 'Mini-Boss: Captain Red-Beak',
    description: 'The squadron captain arrives with an escort fleet. Defeat the Rooster Commander!',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 6, enemyType: 'scout', formation: 'line', spawnInterval: 0.4 },
      { delayBefore: 1.5, enemyCount: 4, enemyType: 'armored_egg', formation: 'v_shape', spawnInterval: 0.7 },
      { delayBefore: 2.0, enemyCount: 1, enemyType: 'mini_boss', formation: 'boss_arrival', spawnInterval: 1.0 },
    ],
    targetScore: [3000, 5500, 8000],
    completionCoins: 220,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m6',
    worldId: 1,
    missionNumber: 6,
    name: 'Spiky Cosmic Urchins',
    description: 'The nebula thickens with floating Urchins that fire sharp quills when damaged.',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 5, enemyType: 'urchin', formation: 'line', spawnInterval: 0.7 },
      { delayBefore: 2.0, enemyCount: 8, enemyType: 'swarmer', formation: 'swarm_circle', spawnInterval: 0.3 },
      { delayBefore: 2.0, enemyCount: 6, enemyType: 'urchin', formation: 'v_shape', spawnInterval: 0.6 },
    ],
    targetScore: [3200, 5800, 8500],
    completionCoins: 250,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m7',
    worldId: 1,
    missionNumber: 7,
    name: 'Jelly Blob Forcefield',
    description: 'Jelly Star-Blobs emit oscillating forcefields and shoot concentrated plasma orbs.',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 4, enemyType: 'jelly_pulsar', formation: 'sine_wave', spawnInterval: 0.8 },
      { delayBefore: 2.0, enemyCount: 6, enemyType: 'kamikaze_pigeon', formation: 'double_sweep', spawnInterval: 0.4 },
      { delayBefore: 2.0, enemyCount: 6, enemyType: 'jelly_pulsar', formation: 'line', spawnInterval: 0.7 },
    ],
    targetScore: [3500, 6200, 9200],
    completionCoins: 280,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m8',
    worldId: 1,
    missionNumber: 8,
    name: 'Cockatoo Bombing Run',
    description: 'Heavy Cockatoo Bombers drop gravity eggs that burst into multi-directional shrapnel.',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 3, enemyType: 'bomber_cockatoo', formation: 'line', spawnInterval: 1.0 },
      { delayBefore: 2.0, enemyCount: 8, enemyType: 'swarmer', formation: 'v_shape', spawnInterval: 0.3 },
      { delayBefore: 2.0, enemyCount: 4, enemyType: 'bomber_cockatoo', formation: 'double_sweep', spawnInterval: 0.8 },
      { delayBefore: 2.0, enemyCount: 6, enemyType: 'urchin', formation: 'sine_wave', spawnInterval: 0.5 },
    ],
    targetScore: [4000, 7000, 10500],
    completionCoins: 320,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m9',
    worldId: 1,
    missionNumber: 9,
    name: 'The Royal Guard Gauntlet',
    description: 'Elite guard units form an impenetrable defensive barrier before General Cluck\'s flagship.',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 5, enemyType: 'armored_egg', formation: 'line', spawnInterval: 0.6 },
      { delayBefore: 2.0, enemyCount: 6, enemyType: 'bomber_cockatoo', formation: 'v_shape', spawnInterval: 0.7 },
      { delayBefore: 2.0, enemyCount: 8, enemyType: 'kamikaze_pigeon', formation: 'double_sweep', spawnInterval: 0.35 },
      { delayBefore: 2.0, enemyCount: 2, enemyType: 'mini_boss', formation: 'double_sweep', spawnInterval: 1.2 },
    ],
    targetScore: [5000, 9000, 13000],
    completionCoins: 380,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
  {
    id: 'w1_m10',
    worldId: 1,
    missionNumber: 10,
    name: 'SHOWDOWN: GENERAL CLUCK',
    description: 'Confront General Cluck himself in his armored Dreadnought flagship. Multi-stage battle!',
    worldName: 'Candy Nebula',
    waves: [
      { delayBefore: 0.5, enemyCount: 4, enemyType: 'armored_egg', formation: 'line', spawnInterval: 0.6 },
      { delayBefore: 1.5, enemyCount: 6, enemyType: 'swarmer', formation: 'v_shape', spawnInterval: 0.3 },
      { delayBefore: 2.0, enemyCount: 1, enemyType: 'boss', formation: 'boss_arrival', spawnInterval: 1.0 },
    ],
    bossDef: BOSS_CATALOG.general_cluck,
    targetScore: [6000, 12000, 18000],
    completionCoins: 600,
    backgroundTheme: 'candy_nebula',
    hazardType: 'candies',
  },
];

// Procedural generator for World 1 (Missions 11-20) and World 2 (Missions 21-30)
function generateProceduralMissions(): MissionDef[] {
  const generated: MissionDef[] = [];
  
  // World 1 remaining missions (11-20)
  for (let m = 11; m <= 20; m++) {
    const isBoss = m === 20;
    const isMiniBoss = m === 15;
    const enemyTypes = ['scout', 'swarmer', 'armored_egg', 'urchin', 'kamikaze_pigeon', 'jelly_pulsar', 'bomber_cockatoo'] as const;
    const type1 = enemyTypes[(m * 2) % enemyTypes.length];
    const type2 = enemyTypes[(m * 3 + 1) % enemyTypes.length];

    const waves: WaveDef[] = [
      { delayBefore: 0.5, enemyCount: 6 + (m - 10), enemyType: type1, formation: 'double_sweep', spawnInterval: 0.4 },
      { delayBefore: 2.0, enemyCount: 8 + (m - 10), enemyType: type2, formation: 'sine_wave', spawnInterval: 0.35 },
      { delayBefore: 2.0, enemyCount: 6 + (m - 10), enemyType: 'kamikaze_pigeon', formation: 'v_shape', spawnInterval: 0.3 },
    ];

    if (isMiniBoss) {
      waves.push({ delayBefore: 2.0, enemyCount: 1, enemyType: 'mini_boss', formation: 'boss_arrival', spawnInterval: 1.0 });
    }

    if (isBoss) {
      waves.push({ delayBefore: 2.0, enemyCount: 1, enemyType: 'boss', formation: 'boss_arrival', spawnInterval: 1.0 });
    }

    generated.push({
      id: `w1_m${m}`,
      worldId: 1,
      missionNumber: m,
      name: isBoss ? 'Cluck\'s Revenge: Apex Dreadnought' : `Nebula Sector ${m}: Sugar Storm`,
      description: isBoss ? 'General Cluck returns with an upgraded armor core!' : `Infiltrate deep candy nebular pockets with increased enemy density.`,
      worldName: 'Candy Nebula',
      waves,
      bossDef: isBoss ? BOSS_CATALOG.general_cluck : undefined,
      targetScore: [5000 + m * 500, 9000 + m * 800, 14000 + m * 1000],
      completionCoins: 200 + m * 20,
      backgroundTheme: 'candy_nebula',
      hazardType: 'candies',
    });
  }

  // World 2: Mechanical Moon (Missions 21-30)
  for (let m = 21; m <= 30; m++) {
    const isBoss = m === 30;
    const isMiniBoss = m === 25;

    const waves: WaveDef[] = [
      { delayBefore: 0.5, enemyCount: 8, enemyType: 'armored_egg', formation: 'line', spawnInterval: 0.5 },
      { delayBefore: 2.0, enemyCount: 10, enemyType: 'urchin', formation: 'double_sweep', spawnInterval: 0.35 },
      { delayBefore: 2.0, enemyCount: 8, enemyType: 'bomber_cockatoo', formation: 'v_shape', spawnInterval: 0.4 },
    ];

    if (isMiniBoss) {
      waves.push({ delayBefore: 2.0, enemyCount: 2, enemyType: 'mini_boss', formation: 'boss_arrival', spawnInterval: 1.0 });
    }
    if (isBoss) {
      waves.push({ delayBefore: 2.0, enemyCount: 1, enemyType: 'boss', formation: 'boss_arrival', spawnInterval: 1.0 });
    }

    generated.push({
      id: `w2_m${m}`,
      worldId: 2,
      missionNumber: m,
      name: isBoss ? 'TITAN SHOWDOWN: MECHA-BEAK 9000' : `Cyborg Outpost ${m - 20}`,
      description: isBoss ? 'Face the ultimate planetary warmachine Mecha-Beak 9000!' : 'Infiltrate the automated defense grid of the Mechanical Moon.',
      worldName: 'Mechanical Moon',
      waves,
      bossDef: isBoss ? BOSS_CATALOG.mecha_beak_9000 : undefined,
      targetScore: [10000 + (m - 20) * 800, 18000 + (m - 20) * 1200, 26000 + (m - 20) * 1500],
      completionCoins: 400 + (m - 20) * 30,
      backgroundTheme: 'mechanical_moon',
      hazardType: 'space_junk',
    });
  }

  return generated;
}

export const ALL_MISSIONS: MissionDef[] = [
  ...CORE_MISSIONS,
  ...generateProceduralMissions(),
];

export function getMissionById(id: string): MissionDef | undefined {
  return ALL_MISSIONS.find((m) => m.id === id);
}

export function getNextMissionId(currentId: string): string | undefined {
  const index = ALL_MISSIONS.findIndex((m) => m.id === currentId);
  if (index >= 0 && index < ALL_MISSIONS.length - 1) {
    return ALL_MISSIONS[index + 1].id;
  }
  return undefined;
}
