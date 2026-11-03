/**
 * CanvasRenderer: High-DPI procedural vector artist for Chicken Invaders.
 * Features the iconic silver fighter jet, flapping chickens with colored bellies,
 * slow falling eggs, fried egg splatters on the ground, golden roast drumsticks,
 * tumbling asteroids, and giant cracked cosmic eggs.
 */

import { ShipDef, EnemyEntity, ProjectileEntity, CollectibleEntity, EggSplatEntity } from '../types';

export class CanvasRenderer {
  // Draw Player Spaceship (Classic Chicken Invader Fighter Jet or custom craft)
  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    ship: ShipDef,
    x: number,
    y: number,
    tilt: number, // -1 (left) to 1 (right)
    invulnerableTimer: number,
    shield: number,
    maxShield: number,
    time: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Subtle banking tilt
    const roll = tilt * 0.22;
    ctx.rotate(roll);

    // Invulnerability flashing
    if (invulnerableTimer > 0 && Math.floor(time * 20) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    // 1. Dual Blue Ion Thruster Flames (Iconic Chicken Invaders Jet Thrusters)
    const flameFlicker = Math.sin(time * 35) * 5;
    const flameHeight = 16 + flameFlicker;

    [-14, 14].forEach((tx) => {
      // Outer blue plume
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(tx - 6, 20);
      ctx.lineTo(tx, 20 + flameHeight);
      ctx.lineTo(tx + 6, 20);
      ctx.closePath();
      ctx.fill();

      // Inner white core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(tx - 3, 20);
      ctx.lineTo(tx, 20 + flameHeight * 0.6);
      ctx.lineTo(tx + 3, 20);
      ctx.closePath();
      ctx.fill();
    });

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0f172a'; // Crisp cartoon outline

    if (ship.spriteShape === 'chicken_fighter' || ship.spriteShape === 'falcon') {
      // Iconic Chicken Invaders Silver Fighter Jet
      // Engine Nacelles
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-18, 6, 8, 14);
      ctx.strokeRect(-18, 6, 8, 14);
      ctx.fillRect(10, 6, 8, 14);
      ctx.strokeRect(10, 6, 8, 14);

      // Swept Delta Wings
      ctx.fillStyle = ship.primaryColor || '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(32, 14);
      ctx.lineTo(24, 20);
      ctx.lineTo(0, 14);
      ctx.lineTo(-24, 20);
      ctx.lineTo(-32, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wing panel seams
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(28, 12);
      ctx.moveTo(-12, 0);
      ctx.lineTo(-28, 12);
      ctx.stroke();

      // Wingtip red beacons
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-33, 11, 4, 6);
      ctx.fillRect(29, 11, 4, 6);

      // Central Aerodynamic Fuselage
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0f172a';
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(14, 8);
      ctx.lineTo(0, 15);
      ctx.lineTo(-14, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Bubble (Cyan tinted dome with reflection)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, -6, 7, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-1.5, -9, 3, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Front Laser Cannons
      ctx.fillStyle = '#334155';
      ctx.fillRect(-3, -32, 2, 7);
      ctx.fillRect(1, -32, 2, 7);
    } else {
      // Custom ship fallback
      ctx.fillStyle = ship.primaryColor;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(24, 16);
      ctx.lineTo(0, 10);
      ctx.lineTo(-24, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Forcefield Shield Overlay
    if (shield > 0) {
      const shieldRatio = shield / Math.max(1, maxShield);
      const shieldPulse = Math.sin(time * 8) * 2;
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + shieldRatio * 0.4})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 36 + shieldPulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(56, 189, 248, ${0.12 * shieldRatio})`;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // Draw Enemies: Authentic Invading Chickens, Asteroids, and Giant Cracked Eggs
  public static drawEnemy(ctx: CanvasRenderingContext2D, enemy: EnemyEntity, time: number) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    // Hit Flash
    if (enemy.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, enemy.width * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0f172a';

    // 1. Asteroid / Space Rock (From Screenshot 1)
    if (enemy.type === 'asteroid') {
      const rot = time * 0.8 + enemy.id;
      ctx.rotate(rot);

      ctx.fillStyle = enemy.color || '#64748b';
      const points = 8;
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radius = 22 + Math.sin(i * 3 + enemy.id) * 5;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Craters
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(-7, -5, 5, 0, Math.PI * 2);
      ctx.arc(6, 4, 4, 0, Math.PI * 2);
      ctx.arc(-2, 8, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // 2. Giant Cosmic Egg Boss (From Screenshot 2)
    if (enemy.type === 'giant_egg' || (enemy.isBoss && enemy.name.includes('Egg'))) {
      const bob = Math.sin(time * 3) * 6;
      ctx.translate(0, bob);

      // Cosmic glow
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 75, 95, 0, 0, Math.PI * 2);
      ctx.fill();

      // Giant white egg body
      ctx.fillStyle = '#f8fafc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 65, 85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cracked shell fractures (more prominent as health decreases)
      const hpPct = enemy.health / enemy.maxHealth;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Center crack
      ctx.moveTo(-15, -40);
      ctx.lineTo(-5, -20);
      ctx.lineTo(8, -25);
      ctx.lineTo(15, -5);
      ctx.lineTo(2, 15);
      ctx.lineTo(12, 35);
      ctx.stroke();

      if (hpPct < 0.6) {
        ctx.beginPath();
        ctx.moveTo(25, -20);
        ctx.lineTo(40, -10);
        ctx.lineTo(35, 10);
        ctx.stroke();
      }

      if (hpPct < 0.3) {
        ctx.beginPath();
        ctx.moveTo(-35, 10);
        ctx.lineTo(-20, 20);
        ctx.lineTo(-30, 40);
        ctx.stroke();
      }

      // Health bar
      const barW = 120;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(-barW * 0.5, -95, barW, 8);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-barW * 0.5, -95, barW * (enemy.health / enemy.maxHealth), 8);
      ctx.strokeRect(-barW * 0.5, -95, barW, 8);

      ctx.restore();
      return;
    }

    // 3. Classic Invader Chicken (Screenshots 2, 3, 4, 5)
    // Wings flap smoothly up and down
    const flap = Math.sin(time * 16 + enemy.id * 0.5);
    const bob = Math.sin(time * 6 + enemy.id) * 3;

    // Glowing sunburst aura for chickens carrying special weapon gifts (Screenshot 5)
    if (enemy.hasWeaponGift) {
      ctx.save();
      const auraPulse = Math.sin(time * 10) * 4 + 28;
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, bob, auraPulse, 0, Math.PI * 2);
      ctx.stroke();

      // Sunburst rays
      const rays = 8;
      for (let r = 0; r < rays; r++) {
        const rayAngle = (r / rays) * Math.PI * 2 + time * 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rayAngle) * 20, bob + Math.sin(rayAngle) * 20);
        ctx.lineTo(
          Math.cos(rayAngle) * (28 + Math.sin(time * 14 + r) * 7),
          bob + Math.sin(rayAngle) * (28 + Math.sin(time * 14 + r) * 7)
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    // White Feathered Wings (Distinct 3-lobe Chicken Invaders wings)
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2.5;

    // Left Wing
    ctx.save();
    ctx.translate(-14, bob);
    ctx.rotate(flap * 0.45 - 0.2);
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(-22, -18);
    ctx.lineTo(-26, -6);
    ctx.lineTo(-22, 4);
    ctx.lineTo(-14, 8);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.translate(14, bob);
    ctx.rotate(-flap * 0.45 + 0.2);
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(22, -18);
    ctx.lineTo(26, -6);
    ctx.lineTo(22, 4);
    ctx.lineTo(14, 8);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Red comb on head
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-4, bob - 20, 4.5, 0, Math.PI * 2);
    ctx.arc(0, bob - 24, 5.5, 0, Math.PI * 2);
    ctx.arc(4, bob - 20, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Round Plump Chicken Body (Colored belly)
    // Color varies by chicken rank: Blue, Red, Yellow, Orange, Purple, Green
    const chickenColors = ['#3b82f6', '#ef4444', '#facc15', '#f97316', '#a855f7', '#10b981'];
    const bodyColor = enemy.color || chickenColors[enemy.id % chickenColors.length];

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, bob, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // White belly bib
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, bob + 4, 10, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Orange/Yellow Feet
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-8, bob + 20, 5, 3, 0.2, 0, Math.PI * 2);
    ctx.ellipse(8, bob + 20, 5, 3, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Expressive Big Eyes (Looking down at player)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-6, bob - 7, 6, 0, Math.PI * 2);
    ctx.arc(6, bob - 7, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Black Pupils (Track down)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-5, bob - 4, 2.5, 0, Math.PI * 2);
    ctx.arc(7, bob - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Yellow Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-5, bob - 2);
    ctx.lineTo(5, bob - 2);
    ctx.lineTo(0, bob + 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Draw Massive Boss (General Cluck / Dreadnought)
  public static drawBoss(ctx: CanvasRenderingContext2D, boss: EnemyEntity, time: number) {
    ctx.save();
    ctx.translate(boss.x, boss.y);

    if (boss.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const floatY = Math.sin(time * 3) * 6;
    const wingFlap = Math.sin(time * 6) * 16;

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';

    // Giant Armored White Wings
    ctx.fillStyle = '#ffffff';
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-40, 10);
    ctx.lineTo(-85, -25 + wingFlap);
    ctx.lineTo(-75, 35 + wingFlap);
    ctx.lineTo(-30, 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(85, -25 - wingFlap);
    ctx.lineTo(75, 35 - wingFlap);
    ctx.lineTo(30, 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rooster Comb
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-22, -50 + floatY, 16, 0, Math.PI * 2);
    ctx.arc(0, -60 + floatY, 20, 0, Math.PI * 2);
    ctx.arc(22, -50 + floatY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Main Body
    ctx.fillStyle = boss.color;
    ctx.beginPath();
    ctx.ellipse(0, floatY, 56, 48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Golden General Medals
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(0, floatY - 10);
    ctx.lineTo(24, floatY + 22);
    ctx.lineTo(-24, floatY + 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-16, floatY - 14, 11, 0, Math.PI * 2);
    ctx.arc(16, floatY - 14, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(-15, floatY - 13, 5, 0, Math.PI * 2);
    ctx.arc(17, floatY - 13, 5, 0, Math.PI * 2);
    ctx.fill();

    // Big Razor Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-16, floatY + 4);
    ctx.lineTo(16, floatY + 4);
    ctx.lineTo(0, floatY + 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Draw Projectiles: Green Zig-Zag Lasers, Red Vulcans, Purple Plasma, Cyan Beams, Missiles, and White Eggs
  public static drawProjectile(ctx: CanvasRenderingContext2D, proj: ProjectileEntity) {
    ctx.save();
    ctx.translate(proj.x, proj.y);

    if (proj.shape === 'egg' || !proj.isPlayer) {
      // Slow falling white egg
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, proj.radius, proj.radius * 1.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Specular highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.ellipse(-2, -3, proj.radius * 0.35, proj.radius * 0.6, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (proj.shape === 'plasma') {
      // Superheated Purple Plasma Sphere
      ctx.fillStyle = proj.glowColor || 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, proj.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = proj.color || '#a855f7';
      ctx.beginPath();
      ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
      ctx.fill();

      // Bright white core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2, -2, proj.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (proj.shape === 'beam') {
      // Focused Piercing Cyan Laser Beam
      ctx.fillStyle = proj.glowColor || 'rgba(6, 182, 212, 0.6)';
      ctx.fillRect(-5, -24, 10, 48);

      ctx.fillStyle = proj.color || '#38bdf8';
      ctx.fillRect(-3, -24, 6, 48);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1.5, -24, 3, 48);
    } else if (proj.shape === 'missile') {
      // Swarm Micro-Rocket
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(4, -4);
      ctx.lineTo(4, 8);
      ctx.lineTo(-4, 8);
      ctx.lineTo(-4, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Stabilizer fins
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-6, 4, 3, 5);
      ctx.fillRect(3, 4, 3, 5);

      // Rocket flame
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-2, 8);
      ctx.lineTo(0, 16);
      ctx.lineTo(2, 8);
      ctx.fill();
    } else if (proj.color === '#ef4444' || proj.color === '#fb923c') {
      // Glowing Red / Orange Vulcan Neutron Pellets (Screenshot 4 & 5)
      ctx.fillStyle = proj.glowColor || 'rgba(239, 68, 68, 0.6)';
      ctx.beginPath();
      ctx.ellipse(0, 0, proj.radius * 1.4, proj.radius * 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, proj.radius, proj.radius * 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, -3, proj.radius * 0.4, proj.radius * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (proj.color === '#facc15') {
      // Arc Volt Lightning Bolt
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.lineTo(5, 4);
      ctx.lineTo(-4, -2);
      ctx.lineTo(4, -8);
      ctx.lineTo(0, -16);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.lineTo(5, 4);
      ctx.lineTo(-4, -2);
      ctx.lineTo(4, -8);
      ctx.lineTo(0, -16);
      ctx.stroke();
    } else {
      // Iconic Green Electric Zig-Zag Ion Blaster Laser (Screenshots 1, 2, 4)
      ctx.strokeStyle = proj.glowColor || 'rgba(34, 197, 94, 0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(-6, 3);
      ctx.lineTo(6, -3);
      ctx.lineTo(-5, -9);
      ctx.lineTo(0, -15);
      ctx.stroke();

      // Bright white-green core
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(-6, 3);
      ctx.lineTo(6, -3);
      ctx.lineTo(-5, -9);
      ctx.lineTo(0, -15);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw Collectibles: Roast Chicken Drumstick Leg Piece, Roast Chicken, Powerups, Weapon Gifts
  public static drawCollectible(ctx: CanvasRenderingContext2D, item: CollectibleEntity, time: number) {
    ctx.save();
    ctx.translate(item.x, item.y);

    const bob = Math.sin(time * 6 + item.id) * 3;
    const pulse = Math.sin(time * 8 + item.id) * 0.12 + 1.0;
    ctx.scale(pulse, pulse);

    // Roasted Chicken Leg Piece / Drumstick (User Request: "chicken leg pieces should fall towards the ground and on third jump that will disappear")
    if (item.type === 'drumstick' || item.type === 'coin') {
      const rot = Math.sin(time * 4 + item.id) * 0.3;
      ctx.rotate(rot);

      // White Bone handle
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(-2.5, bob + 4, 5, 12);
      ctx.fill();
      ctx.stroke();

      // Bone Knobs
      ctx.beginPath();
      ctx.arc(-3, bob + 16, 3, 0, Math.PI * 2);
      ctx.arc(3, bob + 16, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Crispy Golden-Brown Roast Meat
      ctx.fillStyle = '#b45309'; // Rich roast brown
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, bob - 2, 11, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Golden glaze highlight
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(-2, bob - 4, 6, 8, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.type === 'roast_chicken') {
      // Whole roast chicken
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, bob, 14, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Golden drumstick wings
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(-8, bob + 3, 5, 0, Math.PI * 2);
      ctx.arc(8, bob + 3, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.type === 'weapon_gift' || item.type === 'weapon_upgrade') {
      // Chicken Invaders Weapon Gift Parcel Box
      const weaponType = item.weaponType || 'blaster';
      let boxColor = '#22c55e'; // Green Blaster
      let boxLetter = 'B';

      if (weaponType === 'spread') {
        boxColor = '#ef4444'; // Red Vulcan
        boxLetter = 'V';
      } else if (weaponType === 'plasma') {
        boxColor = '#a855f7'; // Purple Plasma
        boxLetter = 'P';
      } else if (weaponType === 'laser') {
        boxColor = '#06b6d4'; // Cyan Laser
        boxLetter = 'L';
      } else if (weaponType === 'missile') {
        boxColor = '#f97316'; // Orange Missile
        boxLetter = 'M';
      } else if (weaponType === 'lightning') {
        boxColor = '#facc15'; // Yellow Lightning
        boxLetter = '⚡';
      }

      // Outer glow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(-item.radius - 2, bob - item.radius - 2, (item.radius + 2) * 2, (item.radius + 2) * 2);

      // Main Box
      ctx.fillStyle = boxColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.fillRect(-item.radius, bob - item.radius, item.radius * 2, item.radius * 2);
      ctx.strokeRect(-item.radius, bob - item.radius, item.radius * 2, item.radius * 2);

      // Ribbon cross
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-2, bob - item.radius, 4, item.radius * 2);
      ctx.fillRect(-item.radius, bob - 2, item.radius * 2, 4);

      // Weapon Letter / Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(boxLetter, 0, bob);
    } else if (item.type === 'repair' || item.type === 'shield') {
      // Cyan Shield capsule
      ctx.fillStyle = '#06b6d4';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, bob, item.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2.5, bob - 6, 5, 12);
      ctx.fillRect(-6, bob - 2.5, 12, 5);
    } else {
      // Default Powerup
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, bob, item.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw Fried Egg Splatters on the Ground (Sunny-Side-Up)
  public static drawEggSplats(ctx: CanvasRenderingContext2D, splats: EggSplatEntity[]) {
    for (const splat of splats) {
      ctx.save();
      ctx.translate(splat.x, splat.y);
      ctx.globalAlpha = Math.max(0, Math.min(1, splat.alpha));

      const s = splat.scale || 1.0;
      ctx.scale(s, s);

      // White Albumen Spread
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Additional albumen blobs
      ctx.beginPath();
      ctx.arc(-8, 1, 6, 0, Math.PI * 2);
      ctx.arc(8, -1, 5, 0, Math.PI * 2);
      ctx.arc(2, 4, 5, 0, Math.PI * 2);
      ctx.fill();

      // Bright Sunny Yellow Yolk Dome
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -1, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Specular highlight on yolk
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-1.5, -2.5, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
