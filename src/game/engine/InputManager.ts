/**
 * Input Manager: Multi-platform controller supporting direct Mouse Movement, Touch Dragging, Keyboard, and Auto-fire.
 */

export interface VirtualInputState {
  moveX: number; // -1 to 1
  moveY: number; // -1 to 1
  fire: boolean;
  special: boolean;
  pause: boolean;
}

export class InputManager {
  private keysHeld: Set<string> = new Set();
  private keysJustPressed: Set<string> = new Set();

  private virtualState: VirtualInputState = {
    moveX: 0,
    moveY: 0,
    fire: false,
    special: false,
    pause: false,
  };

  // Auto-fire is true by default as requested: "as the game will start the jet should start firing independently without any key to press"
  private autoFireEnabled: boolean = true;
  private sensitivity: number = 1.0;

  // Direct pointer control (mouse or touch drag)
  public pointerActive: boolean = false;
  public pointerClientX: number = 0;
  public pointerClientY: number = 0;
  private isTouching: boolean = false;

  constructor() {
    this.setupListeners();
  }

  public setAutoFire(enabled: boolean) {
    this.autoFireEnabled = enabled;
  }

  public setSensitivity(val: number) {
    this.sensitivity = Math.max(0.5, Math.min(2.0, val));
  }

  private setupListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (!this.keysHeld.has(e.code)) {
        this.keysJustPressed.add(e.code);
      }
      this.keysHeld.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keysHeld.delete(e.code);
    });

    window.addEventListener('blur', () => {
      this.clearAll();
    });

    // Mouse movement: player moves directly with mouse cursor
    window.addEventListener('mousemove', (e) => {
      this.pointerActive = true;
      this.pointerClientX = e.clientX;
      this.pointerClientY = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      this.pointerActive = true;
      this.pointerClientX = e.clientX;
      this.pointerClientY = e.clientY;
    });

    // Touch controls: player holds and drags the jet freely without needing on-screen buttons
    window.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          this.pointerActive = true;
          this.isTouching = true;
          this.pointerClientX = t.clientX;
          this.pointerClientY = t.clientY;
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          this.pointerActive = true;
          this.pointerClientX = t.clientX;
          this.pointerClientY = t.clientY;
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'touchend',
      (e) => {
        if (e.touches.length === 0) {
          this.isTouching = false;
        }
      },
      { passive: true }
    );
  }

  public setVirtualJoystick(x: number, y: number) {
    this.virtualState.moveX = Math.max(-1, Math.min(1, x));
    this.virtualState.moveY = Math.max(-1, Math.min(1, y));
  }

  public setVirtualButton(action: 'fire' | 'special' | 'pause', pressed: boolean) {
    this.virtualState[action] = pressed;
    if (pressed) {
      this.keysJustPressed.add(`virtual_${action}`);
    }
  }

  public getMovementVector(): { x: number; y: number } {
    let dx = 0;
    let dy = 0;

    // Keyboard inputs
    if (this.keysHeld.has('KeyA') || this.keysHeld.has('ArrowLeft')) dx -= 1;
    if (this.keysHeld.has('KeyD') || this.keysHeld.has('ArrowRight')) dx += 1;
    if (this.keysHeld.has('KeyW') || this.keysHeld.has('ArrowUp')) dy -= 1;
    if (this.keysHeld.has('KeyS') || this.keysHeld.has('ArrowDown')) dy += 1;

    // Blend with virtual joystick
    if (Math.abs(this.virtualState.moveX) > 0.05) dx = this.virtualState.moveX;
    if (Math.abs(this.virtualState.moveY) > 0.05) dy = this.virtualState.moveY;

    // Normalize diagonal keyboard speed
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }

    return {
      x: dx * this.sensitivity,
      y: dy * this.sensitivity,
    };
  }

  public isFiring(): boolean {
    // True by default: fires independently without any key to press
    if (this.autoFireEnabled) return true;
    return (
      this.keysHeld.has('Space') ||
      this.keysHeld.has('KeyJ') ||
      this.virtualState.fire
    );
  }

  public isSpecialJustPressed(): boolean {
    const pressed =
      this.keysJustPressed.has('ShiftLeft') ||
      this.keysJustPressed.has('ShiftRight') ||
      this.keysJustPressed.has('KeyK') ||
      this.keysJustPressed.has('KeyE') ||
      this.keysJustPressed.has('virtual_special');
    return pressed;
  }

  public isPauseJustPressed(): boolean {
    const pressed =
      this.keysJustPressed.has('Escape') ||
      this.keysJustPressed.has('KeyP') ||
      this.keysJustPressed.has('virtual_pause');
    return pressed;
  }

  public endFrame() {
    this.keysJustPressed.clear();
  }

  public clearAll() {
    this.keysHeld.clear();
    this.keysJustPressed.clear();
    this.virtualState.moveX = 0;
    this.virtualState.moveY = 0;
    this.virtualState.fire = false;
    this.virtualState.special = false;
    this.virtualState.pause = false;
    this.pointerActive = false;
    this.isTouching = false;
  }
}
