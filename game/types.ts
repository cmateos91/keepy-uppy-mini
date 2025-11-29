/**
 * Tipos para el juego Keepy Uppy
 */

export interface PhysicsConfig {
  gravity: number;
  airResistance: number;
  angularDamping: number;
  magnusStrength: number;
  bounceDamping: number;
  minVelocity: number;
}

export interface KickConfig {
  baseForce: number;
  verticalBias: number;
  spinFactor: number;
  maxSpin: number;
  touchRadiusMultiplier: number;
  momentumRetention: {
    horizontal: number;
    vertical: number;
  };
}

export interface BallConfig {
  image: string;
  minRadius: number;
  maxRadius: number;
  radiusRatio: number;
  initialVelocityY: number;
}

export interface VisualsConfig {
  squash: {
    duration: number;
    amount: number;
  };
  shadow: {
    maxAlpha: number;
    minAlpha: number;
    minScale: number;
    heightRatio: number;
    offsetY: number;
  };
  ballShadow: {
    color: string;
    blur: number;
    offsetY: number;
  };
}

export interface ScreenConfig {
  groundOffset: number;
  ballStartYRatio: number;
}

export interface ColorsConfig {
  background: {
    top: string;
    middle: string;
    bottom: string;
  };
  ground: {
    line: string;
    gradientStart: string;
    gradientEnd: string;
  };
  fallback: {
    ballFill: string;
    ballStroke: string;
  };
}

export interface GameplayConfig {
  maxDeltaTime: number;
  storageKey: string;
}

export interface FeedbackConfig {
  vibrationDuration: number;
  scoreFlashScale: number;
  scoreFlashDuration: number;
}

export interface GameConfig {
  physics: PhysicsConfig;
  kick: KickConfig;
  ball: BallConfig;
  visuals: VisualsConfig;
  screen: ScreenConfig;
  colors: ColorsConfig;
  gameplay: GameplayConfig;
  feedback: FeedbackConfig;
}

export interface Bounds {
  width: number;
  height: number;
}

export type GameState = 'start' | 'playing' | 'gameover';
