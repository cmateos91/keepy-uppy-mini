"use client";

import { useRef, useEffect, useCallback } from 'react';
import { Ball, Physics, Renderer, Config } from '@/game';

interface GameCanvasProps {
  isPlaying: boolean;
  onScore: () => void;
  onGameOver: () => void;
  onReady: () => void;
}

export default function GameCanvas({
  isPlaying,
  onScore,
  onGameOver,
  onReady
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball | null>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const groundYRef = useRef<number>(0);
  const screenSizeRef = useRef({ width: 0, height: 0 });

  // Calcular radio del balon segun pantalla
  const calculateBallRadius = useCallback((width: number, height: number) => {
    let radius = Math.min(width, height) * Config.ball.radiusRatio;
    return Math.max(Config.ball.minRadius, Math.min(Config.ball.maxRadius, radius));
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    screenSizeRef.current = { width: rect.width, height: rect.height };
    groundYRef.current = rect.height - Config.screen.groundOffset;

    const newRadius = calculateBallRadius(rect.width, rect.height);
    if (ballRef.current) {
      ballRef.current.radius = newRadius;
    }

    Renderer.setSize(rect.width, rect.height);
  }, [calculateBallRadius]);

  // Handle tap/click
  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!isPlaying || !ballRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const hit = Physics.applyKick(ballRef.current, x, y);

    if (hit) {
      onScore();

      // Vibracion haptica
      if (navigator.vibrate) {
        navigator.vibrate(Config.feedback.vibrationDuration);
      }
    }
  }, [isPlaying, onScore]);

  // Mouse/Touch handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleInteraction(e.clientX, e.clientY);
  }, [handleInteraction]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleInteraction(touch.clientX, touch.clientY);
  }, [handleInteraction]);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime;
    }

    let deltaTime = (currentTime - lastTimeRef.current) / 1000;
    deltaTime = Math.min(deltaTime, Config.gameplay.maxDeltaTime);
    lastTimeRef.current = currentTime;

    const ball = ballRef.current;
    if (!ball) return;

    // Update physics solo si estamos jugando
    if (isPlaying) {
      const bounds = {
        width: screenSizeRef.current.width,
        height: groundYRef.current
      };

      const hitGround = Physics.update(ball, deltaTime, bounds);
      ball.updateVisuals(deltaTime);

      if (hitGround) {
        onGameOver();
      }
    }

    // Render siempre
    Renderer.renderFrame(ball, groundYRef.current);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, onGameOver]);

  // Reset ball para nuevo juego
  useEffect(() => {
    if (isPlaying && ballRef.current) {
      const { width, height } = screenSizeRef.current;
      ballRef.current.reset(
        width / 2,
        height * Config.screen.ballStartYRatio
      );
      ballRef.current.vy = Config.ball.initialVelocityY;
      lastTimeRef.current = 0;
    }
  }, [isPlaying]);

  // Inicializacion
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Inicializar renderer
    Renderer.init(ctx);

    // Setup inicial
    handleResize();

    // Crear balon
    const { width, height } = screenSizeRef.current;
    const radius = calculateBallRadius(width, height);
    ballRef.current = new Ball(width / 2, height / 2, radius);

    // Notificar que esta listo
    onReady();

    // Listener de resize
    window.addEventListener('resize', handleResize);

    // Iniciar game loop
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [handleResize, calculateBallRadius, gameLoop, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    />
  );
}
