/**
 * Sistema de renderizado
 * Maneja todo el dibujado en canvas
 * Logica identica al original
 */

import { Config } from './config';
import { Ball } from './Ball';

export const Renderer = {
  ctx: null as CanvasRenderingContext2D | null,
  width: 0,
  height: 0,

  /**
   * Inicializa el renderer
   */
  init(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  },

  /**
   * Actualiza dimensiones
   */
  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  },

  /**
   * Limpia el canvas
   */
  clear(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  /**
   * Renderiza el fondo con gradiente
   */
  drawBackground(): void {
    if (!this.ctx) return;

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, Config.colors.background.top);
    gradient.addColorStop(0.5, Config.colors.background.middle);
    gradient.addColorStop(1, Config.colors.background.bottom);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  },

  /**
   * Renderiza el suelo
   */
  drawGround(groundY: number): void {
    if (!this.ctx) return;

    // Linea del suelo
    this.ctx.beginPath();
    this.ctx.moveTo(0, groundY);
    this.ctx.lineTo(this.width, groundY);
    this.ctx.strokeStyle = Config.colors.ground.line;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Gradiente del suelo
    const groundGradient = this.ctx.createLinearGradient(0, groundY, 0, this.height);
    groundGradient.addColorStop(0, Config.colors.ground.gradientStart);
    groundGradient.addColorStop(1, Config.colors.ground.gradientEnd);

    this.ctx.fillStyle = groundGradient;
    this.ctx.fillRect(0, groundY, this.width, this.height - groundY);
  },

  /**
   * Frame completo de renderizado
   */
  renderFrame(ball: Ball, groundY: number): void {
    this.clear();
    this.drawBackground();
    this.drawGround(groundY);
    ball.renderShadow(this.ctx!, groundY);
    ball.render(this.ctx!);
  }
};
