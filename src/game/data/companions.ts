/**
 * Companions Catalog: Quirky wingmates providing balanced passive perks.
 */

import { CompanionDef } from '../types';

export const COMPANIONS: CompanionDef[] = [
  {
    id: 'astro_hamster',
    name: 'Pip the Space Hamster',
    species: 'Cosmic Rodent',
    description: 'Equipped with a miniature magnetic backpack that pulls nearby coins closer.',
    perk: '+35% Coin Magnet Range',
    cost: 800,
    primaryColor: '#f59e0b',
  },
  {
    id: 'sparks_drone',
    name: 'Sparks the Bee-Bot',
    species: 'Cyber Insectoid',
    description: 'Buzzes around your ship and occasionally zaps nearby enemy bullets.',
    perk: 'Periodic Bullet Interception',
    cost: 1600,
    primaryColor: '#eab308',
  },
  {
    id: 'blobby_jelly',
    name: 'Blobby the Jelly Puff',
    species: 'Gelatinous Star-Creature',
    description: 'Radiates soothing bio-luminescence that accelerates shield regeneration.',
    perk: '+20% Shield Recharge Rate',
    cost: 2400,
    primaryColor: '#06b6d4',
  },
  {
    id: 'sir_quacks_jr',
    name: 'Sir Quacks Jr.',
    species: 'Golden Duckling',
    description: 'Brings high fortune and boosts overall score multiplier by 15%.',
    perk: '+15% Bonus Mission Score',
    cost: 3200,
    primaryColor: '#facc15',
  },
];
