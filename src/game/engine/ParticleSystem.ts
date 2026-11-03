/**
 * Pooled High-Performance Particle & Floating Text System
 */

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  type: 'spark' | 'smoke' | 'feather' | 'shell' | 'shockwave' | 'confetti';
  rotation: number;
  vRot: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private pool: Particle[] = [];
  private texts: FloatingText[] = [];
  private textCounter: number = 0;
  private readonly maxParticles = 300;

  constructor() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#ffffff',
        size: 3,
        alpha: 1,
        maxLife: 1,
        life: 0,
        type: 'spark',
        rotation: 0,
        vRot: 0,
      });
    }
  }

  private getParticle(): Particle | null {
    for (const p of this.pool) {
      if (!p.active) return p;
    }
    return null;
  }

  public spawnExplosion(x: number, y: number, color: string = '#f59e0b', scale: number = 1.0) {
    const count = Math.floor(18 * scale);
    for (let i = 0; i < count; i++) {
      const p = this.getParticle();
      if (!p) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 220 + 60) * scale;
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.color = Math.random() > 0.4 ? color : '#ffffff';
      p.size = Math.random() * 4 * scale + 2;
      p.alpha = 1;
      p.maxLife = Math.random() * 0.4 + 0.25;
      p.life = p.maxLife;
      p.type = 'spark';
      p.rotation = 0;
      p.vRot = 0;
    }

    // Add shockwave ring
    const sw = this.getParticle();
    if (sw) {
      sw.active = true;
      sw.x = x;
      sw.y = y;
      sw.vx = 0;
      sw.vy = 0;
      sw.color = color;
      sw.size = 8 * scale;
      sw.alpha = 0.9;
      sw.maxLife = 0.35 * scale;
      sw.life = sw.maxLife;
      sw.type = 'shockwave';
      sw.rotation = 0;
      sw.vRot = 0;
    }
  }

  public spawnFeathers(x: number, y: number, color: string = '#ffffff', count: number = 6) {
    for (let i = 0; i < count; i++) {
      const p = this.getParticle();
      if (!p) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 140 + 40;
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed * 0.7;
      p.color = color;
      p.size = Math.random() * 6 + 6;
      p.alpha = 1;
      p.maxLife = Math.random() * 0.7 + 0.5;
      p.life = p.maxLife;
      p.type = 'feather';
      p.rotation = Math.random() * Math.PI * 2;
      p.vRot = (Math.random() - 0.5) * 6;
    }
  }

  public spawnThrusterFlame(x: number, y: number, color: string = '#38bdf8') {
    const p = this.getParticle();
    if (!p) return;
    p.active = true;
    p.x = x + (Math.random() - 0.5) * 6;
    p.y = y;
    p.vx = (Math.random() - 0.5) * 30;
    p.vy = Math.random() * 120 + 80;
    p.color = Math.random() > 0.3 ? color : '#ffffff';
    p.size = Math.random() * 4 + 3;
    p.alpha = 0.8;
    p.maxLife = 0.2;
    p.life = p.maxLife;
    p.type = 'smoke';
    p.rotation = 0;
    p.vRot = 0;
  }

  public spawnFloatingText(text: string, x: number, y: number, color: string = '#facc15', size: number = 18) {
    this.texts.push({
      id: ++this.textCounter,
      text,
      x,
      y,
      color,
      size,
      life: 0.9,
      maxLife: 0.9,
    });
  }

  public update(dt: number) {
    // Update pooled particles
    for (const p of this.pool) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.vRot * dt;

      // Friction / air drag
      p.vx *= 0.96;
      p.vy *= 0.96;

      if (p.type === 'shockwave') {
        p.size += dt * 140;
      }

      p.alpha = p.life / p.maxLife;
    }

    // Update floating texts
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life -= dt;
      t.y -= dt * 45; // float upward
      if (t.life <= 0) {
        this.texts.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Render particles
    for (const p of this.pool) {
      if (!p.active) continue;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

      if (p.type === 'shockwave') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'feather') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        // Oval feather with tip
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(0, p.size);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Render floating texts with cartoon border
    for (const t of this.texts) {
      const alpha = Math.max(0, Math.min(1, t.life / t.maxLife));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${t.size}px 'Righteous', 'Fredoka', sans-serif`;
      ctx.textAlign = 'center';

      // Outline
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(t.text, t.x, t.y);

      // Fill
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  }

  public clear() {
    for (const p of this.pool) {
      p.active = false;
    }
    this.texts = [];
  }
}
