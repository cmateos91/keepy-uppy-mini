/**
 * Motor de fisica custom para el balon
 * Usa Config para todos los parametros
 * Logica identica al original
 */

import { Config } from './config';
import { Ball } from './Ball';
import { Bounds } from './types';

export const Physics = {
  /**
   * Aplica la gravedad al balon
   */
  applyGravity(ball: Ball, deltaTime: number): void {
    ball.vy += Config.physics.gravity * deltaTime;
  },

  /**
   * Aplica resistencia del aire
   */
  applyAirResistance(ball: Ball): void {
    ball.vx *= Config.physics.airResistance;
    ball.vy *= Config.physics.airResistance;
    ball.angularVelocity *= Config.physics.angularDamping;
  },

  /**
   * Efecto Magnus: el spin del balon curva su trayectoria
   */
  applyMagnusEffect(ball: Ball, deltaTime: number): void {
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (speed > Config.physics.minVelocity) {
      const magnusForce = ball.angularVelocity * speed * Config.physics.magnusStrength;
      const nx = -ball.vy / speed;
      const ny = ball.vx / speed;
      ball.vx += nx * magnusForce * deltaTime;
      ball.vy += ny * magnusForce * deltaTime;
    }
  },

  /**
   * Actualiza la posicion del balon
   */
  updatePosition(ball: Ball, deltaTime: number): void {
    ball.x += ball.vx * deltaTime;
    ball.y += ball.vy * deltaTime;
    ball.rotation += ball.angularVelocity * deltaTime;
  },

  /**
   * Maneja colisiones con los bordes de la pantalla
   */
  handleBoundaryCollisions(ball: Ball, bounds: Bounds): boolean {
    const { width, height } = bounds;
    const damping = Config.physics.bounceDamping;

    // Bordes laterales
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx = -ball.vx * damping;
      ball.angularVelocity += ball.vy * 0.01;
    } else if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      ball.vx = -ball.vx * damping;
      ball.angularVelocity -= ball.vy * 0.01;
    }

    // Techo
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy = -ball.vy * damping;
    }

    // Suelo - retorna true si toca
    if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius;
      return true;
    }

    return false;
  },

  /**
   * Aplica el impulso cuando el usuario toca el balon
   */
  applyKick(ball: Ball, touchX: number, touchY: number): boolean {
    const dx = touchX - ball.x;
    const dy = touchY - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const touchRadius = ball.radius * Config.kick.touchRadiusMultiplier;

    if (distance > touchRadius) {
      return false;
    }

    // Direccion del impulso
    let kickDirX = -dx / (distance || 1);
    let kickDirY = -dy / (distance || 1);

    // Bias vertical
    kickDirY = kickDirY * (1 - Config.kick.verticalBias) + (-1) * Config.kick.verticalBias;

    // Normalizar
    const mag = Math.sqrt(kickDirX * kickDirX + kickDirY * kickDirY);
    kickDirX /= mag;
    kickDirY /= mag;

    // Fuerza segun centralidad
    const centeredness = 1 - (distance / touchRadius);
    const kickForce = Config.kick.baseForce * (0.7 + centeredness * 0.3);

    // Aplicar velocidad con retencion de momento
    ball.vx = kickDirX * kickForce * 0.6 + ball.vx * Config.kick.momentumRetention.horizontal;
    ball.vy = kickDirY * kickForce + ball.vy * Config.kick.momentumRetention.vertical;

    // Spin
    const spinOffset = dx / ball.radius;
    ball.angularVelocity += spinOffset * Config.kick.spinFactor * kickForce;
    ball.angularVelocity = Math.max(-Config.kick.maxSpin, Math.min(Config.kick.maxSpin, ball.angularVelocity));

    // Efecto visual
    ball.squashTime = Config.visuals.squash.duration;
    ball.squashAmount = Config.visuals.squash.amount;

    return true;
  },

  /**
   * Paso completo de simulacion fisica
   */
  update(ball: Ball, deltaTime: number, bounds: Bounds): boolean {
    this.applyGravity(ball, deltaTime);
    this.applyMagnusEffect(ball, deltaTime);
    this.applyAirResistance(ball);
    this.updatePosition(ball, deltaTime);
    return this.handleBoundaryCollisions(ball, bounds);
  }
};
