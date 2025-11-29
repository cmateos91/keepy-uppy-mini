/**
 * CONFIGURACION CENTRAL DEL JUEGO
 * Todos los parametros ajustables en un solo lugar
 * Valores identicos al original
 */

import { GameConfig } from './types';

export const Config: GameConfig = {
  // ==================== FISICA ====================
  physics: {
    gravity: 2800,              // Gravedad en pixels/s²
    airResistance: 0.98,        // Factor de resistencia del aire (0-1)
    angularDamping: 0.995,      // Amortiguacion de rotacion (0-1)
    magnusStrength: 0.05,       // Efecto Magnus (spin curva trayectoria)
    bounceDamping: 0.6,         // Perdida de energia en rebotes (0-1)
    minVelocity: 5,             // Velocidad minima antes de parar
  },

  // ==================== TOQUE/KICK ====================
  kick: {
    baseForce: 1500,            // Fuerza base del toque
    verticalBias: 0.7,          // Tendencia hacia arriba (0.5=neutral, 1=todo arriba)
    spinFactor: 0.03,           // Cuanto spin genera el toque lateral
    maxSpin: 25,                // Spin maximo permitido
    touchRadiusMultiplier: 1.5, // Multiplicador del area de toque (jugabilidad)
    momentumRetention: {
      horizontal: 0.2,          // Cuanto momento horizontal conserva
      vertical: 0.1,            // Cuanto momento vertical conserva
    },
  },

  // ==================== BALON ====================
  ball: {
    image: '/ball.svg',         // Ruta de la imagen (en public/)
    minRadius: 40,              // Radio minimo en pixels
    maxRadius: 70,              // Radio maximo en pixels
    radiusRatio: 0.1,           // Radio como % del tamano de pantalla
    initialVelocityY: -200,     // Velocidad inicial al empezar
  },

  // ==================== EFECTOS VISUALES ====================
  visuals: {
    squash: {
      duration: 0.15,           // Duracion del efecto squash (segundos)
      amount: 0.25,             // Intensidad de deformacion
    },
    shadow: {
      maxAlpha: 0.4,            // Opacidad maxima de sombra
      minAlpha: 0.1,            // Opacidad minima de sombra
      minScale: 0.3,            // Escala minima de sombra
      heightRatio: 0.3,         // Proporcion altura de sombra
      offsetY: 5,               // Offset Y de la sombra
    },
    ballShadow: {
      color: 'rgba(0, 0, 0, 0.3)',
      blur: 20,
      offsetY: 10,
    },
  },

  // ==================== PANTALLA/LAYOUT ====================
  screen: {
    groundOffset: 30,           // Distancia del suelo al borde inferior
    ballStartYRatio: 0.3,       // Posicion Y inicial (% desde arriba)
  },

  // ==================== COLORES ====================
  colors: {
    background: {
      top: '#1a1a2e',
      middle: '#16213e',
      bottom: '#0f3460',
    },
    ground: {
      line: 'rgba(255, 255, 255, 0.1)',
      gradientStart: 'rgba(231, 76, 60, 0.3)',
      gradientEnd: 'rgba(231, 76, 60, 0.1)',
    },
    fallback: {
      ballFill: '#ffffff',
      ballStroke: '#333333',
    },
  },

  // ==================== GAMEPLAY ====================
  gameplay: {
    maxDeltaTime: 0.1,          // Delta time maximo (evita saltos)
    storageKey: 'keepy-uppy-best', // Key para localStorage
  },

  // ==================== FEEDBACK ====================
  feedback: {
    vibrationDuration: 10,      // Duracion vibracion en ms
    scoreFlashScale: 1.2,       // Escala del flash de puntuacion
    scoreFlashDuration: 100,    // Duracion del flash en ms
  },
};
