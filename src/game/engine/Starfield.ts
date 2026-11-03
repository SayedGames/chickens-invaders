/**
 * Parallax Starfield & Cosmic Nebula Renderer
 */

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  twinklePhase: number;
}

interface NebulaCloud {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
}

export class Starfield {
  private stars: Star[] = [];
  private nebulas: NebulaCloud[] = [];
  private theme: string = 'candy_nebula';

  constructor(count: number = 90) {
    this.initStars(count);
    this.initNebulas();
  }

  public setTheme(theme: string) {
    this.theme = theme;
    this.initNebulas();
  }

  private initStars(count: number) {
    this.stars = [];
    const colors = ['#ffffff', '#38bdf8', '#f472b6', '#facc15', '#a78bfa'];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * 1200,
        y: Math.random() * 1600,
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 80 + 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  private initNebulas() {
    this.nebulas = [];
    let colors = ['rgba(236, 72, 153, 0.12)', 'rgba(168, 85, 247, 0.12)', 'rgba(6, 182, 212, 0.1)'];
    if (this.theme === 'mechanical_moon') {
      colors = ['rgba(6, 182, 212, 0.12)', 'rgba(30, 58, 138, 0.15)', 'rgba(100, 116, 139, 0.12)'];
    } else if (this.theme === 'toxic_jungle') {
      colors = ['rgba(16, 185, 129, 0.12)', 'rgba(132, 204, 22, 0.12)', 'rgba(6, 95, 70, 0.15)'];
    }

    for (let i = 0; i < 5; i++) {
      this.nebulas.push({
        x: Math.random() * 1000,
        y: Math.random() * 1400,
        radius: Math.random() * 180 + 120,
        color: colors[i % colors.length],
        speed: Math.random() * 20 + 10,
      });
    }
  }

  public update(dt: number, width: number, height: number, speedBoost: number = 1.0) {
    // Update stars
    for (const star of this.stars) {
      star.y += star.speed * speedBoost * dt;
      star.twinklePhase += dt * 3;
      if (star.y > height + 20) {
        star.y = -20;
        star.x = Math.random() * width;
      }
    }

    // Update nebulas
    for (const neb of this.nebulas) {
      neb.y += neb.speed * speedBoost * dt;
      if (neb.y > height + neb.radius) {
        neb.y = -neb.radius;
        neb.x = Math.random() * width;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Deep cosmic gradient
    let grad = ctx.createLinearGradient(0, 0, 0, height);
    if (this.theme === 'mechanical_moon') {
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#090d16');
      grad.addColorStop(1, '#051329');
    } else {
      grad.addColorStop(0, '#090514');
      grad.addColorStop(0.5, '#130826');
      grad.addColorStop(1, '#0c071d');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Render nebulas
    for (const neb of this.nebulas) {
      const nebGrad = ctx.createRadialGradient(neb.x, neb.y, 10, neb.x, neb.y, neb.radius);
      nebGrad.addColorStop(0, neb.color);
      nebGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nebGrad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render stars
    for (const star of this.stars) {
      const alpha = 0.5 + Math.sin(star.twinklePhase) * 0.45;
      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
