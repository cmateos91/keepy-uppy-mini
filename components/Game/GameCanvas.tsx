"use client";

import { useRef, useEffect } from 'react';
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
  const gameRef = useRef<{
    ball: Ball | null;
    animationId: number;
    lastTime: number;
    groundY: number;
    screenWidth: number;
    screenHeight: number;
    isPlaying: boolean;
  }>({
    ball: null,
    animationId: 0,
    lastTime: 0,
    groundY: 0,
    screenWidth: 0,
    screenHeight: 0,
    isPlaying: false
  });

  // Refs para callbacks para evitar stale closures
  const onScoreRef = useRef(onScore);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onScoreRef.current = onScore;
    onGameOverRef.current = onGameOver;
  }, [onScore, onGameOver]);

  // Sincronizar isPlaying con ref
  useEffect(() => {
    const game = gameRef.current;
    const wasPlaying = game.isPlaying;
    game.isPlaying = isPlaying;

    // Reset ball cuando empieza el juego
    if (isPlaying && !wasPlaying && game.ball) {
      game.ball.reset(
        game.screenWidth / 2,
        game.screenHeight * Config.screen.ballStartYRatio
      );
      game.ball.vy = Config.ball.initialVelocityY;
      game.lastTime = 0;
    }
  }, [isPlaying]);

  // Inicializacion unica
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = gameRef.current;

    // Resize handler
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      game.screenWidth = rect.width;
      game.screenHeight = rect.height;
      game.groundY = rect.height - Config.screen.groundOffset;

      // Calcular radio
      let radius = Math.min(rect.width, rect.height) * Config.ball.radiusRatio;
      radius = Math.max(Config.ball.minRadius, Math.min(Config.ball.maxRadius, radius));

      if (game.ball) {
        game.ball.radius = radius;
      }

      Renderer.setSize(rect.width, rect.height);
    };

    // Inicializar
    Renderer.init(ctx);
    handleResize();

    // Crear balon
    let radius = Math.min(game.screenWidth, game.screenHeight) * Config.ball.radiusRatio;
    radius = Math.max(Config.ball.minRadius, Math.min(Config.ball.maxRadius, radius));
    game.ball = new Ball(game.screenWidth / 2, game.screenHeight / 2, radius);

    // Game loop
    const gameLoop = (currentTime: number) => {
      if (game.lastTime === 0) {
        game.lastTime = currentTime;
      }

      let deltaTime = (currentTime - game.lastTime) / 1000;
      deltaTime = Math.min(deltaTime, Config.gameplay.maxDeltaTime);
      game.lastTime = currentTime;

      if (!game.ball) {
        game.animationId = requestAnimationFrame(gameLoop);
        return;
      }

      // Update physics solo si estamos jugando
      if (game.isPlaying) {
        const bounds = {
          width: game.screenWidth,
          height: game.groundY
        };

        const hitGround = Physics.update(game.ball, deltaTime, bounds);
        game.ball.updateVisuals(deltaTime);

        if (hitGround) {
          onGameOverRef.current();
        }
      }

      // Render siempre
      Renderer.renderFrame(game.ball, game.groundY);

      game.animationId = requestAnimationFrame(gameLoop);
    };

    // Input handlers
    const handleInteraction = (clientX: number, clientY: number) => {
      if (!game.isPlaying || !game.ball) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const hit = Physics.applyKick(game.ball, x, y);

      if (hit) {
        onScoreRef.current();
        if (navigator.vibrate) {
          navigator.vibrate(Config.feedback.vibrationDuration);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

    // Iniciar loop
    game.animationId = requestAnimationFrame(gameLoop);

    // Notificar ready
    onReady();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(game.animationId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none select-none"
    />
  );
}
