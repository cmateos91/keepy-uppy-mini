/**
 * Clase del balon con renderizado y estado
 * Usa Config para parametros visuales
 * Logica identica al original
 */

import { Config } from './config';

export class Ball {
  // Posicion
  x: number;
  y: number;
  radius: number;

  // Velocidad
  vx: number = 0;
  vy: number = 0;

  // Rotacion
  rotation: number = 0;
  angularVelocity: number = 0;

  // Efectos visuales
  squashTime: number = 0;
  squashAmount: number = 0;

  // Imagen
  private image: HTMLImageElement | null = null;
  private imageLoaded: boolean = false;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    // Cargar imagen solo en cliente
    if (typeof window !== 'undefined') {
      this.image = new Image();
      this.image.onload = () => {
        this.imageLoaded = true;
      };
      this.image.src = Config.ball.image;
    }
  }

  /**
   * Resetea el balon a su posicion inicial
   */
  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
    this.angularVelocity = 0;
    this.squashTime = 0;
    this.squashAmount = 0;
  }

  /**
   * Actualiza efectos visuales
   */
  updateVisuals(deltaTime: number): void {
    if (this.squashTime > 0) {
      this.squashTime -= deltaTime;
    }
  }

  /**
   * Renderiza el balon en el canvas
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Squash & stretch
    let scaleX = 1;
    let scaleY = 1;
    if (this.squashTime > 0) {
      const t = this.squashTime / Config.visuals.squash.duration;
      const squash = this.squashAmount * t;
      scaleX = 1 + squash;
      scaleY = 1 - squash * 0.5;
    }
    ctx.scale(scaleX, scaleY);

    // Sombra del balon
    ctx.shadowColor = Config.visuals.ballShadow.color;
    ctx.shadowBlur = Config.visuals.ballShadow.blur;
    ctx.shadowOffsetY = Config.visuals.ballShadow.offsetY;

    // Dibujar imagen o fallback
    if (this.imageLoaded && this.image) {
      const size = this.radius * 2;
      ctx.drawImage(this.image, -this.radius, -this.radius, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = Config.colors.fallback.ballFill;
      ctx.fill();
      ctx.strokeStyle = Config.colors.fallback.ballStroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Dibuja la sombra en el suelo
   */
  renderShadow(ctx: CanvasRenderingContext2D, groundY: number): void {
    ctx.save();

    const shadow = Config.visuals.shadow;
    const distanceToGround = groundY - this.y;
    const maxDistance = groundY * 0.8;
    const ratio = distanceToGround / maxDistance;

    const shadowScale = Math.max(shadow.minScale, 1 - ratio * 0.7);
    const shadowAlpha = Math.max(shadow.minAlpha, shadow.maxAlpha - ratio * 0.3);

    const shadowWidth = this.radius * 2 * shadowScale;
    const shadowHeight = this.radius * shadow.heightRatio * shadowScale;

    ctx.beginPath();
    ctx.ellipse(
      this.x,
      groundY - shadow.offsetY,
      shadowWidth,
      shadowHeight,
      0, 0, Math.PI * 2
    );
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.fill();

    ctx.restore();
  }
}
