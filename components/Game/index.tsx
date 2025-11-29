"use client";

import { useState, useCallback, useEffect } from 'react';
import { Config, GameState } from '@/game';
import GameCanvas from './GameCanvas';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import ScoreDisplay from './ScoreDisplay';

interface GameProps {
  playerName?: string;
}

export default function Game({ playerName }: GameProps) {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Cargar mejor puntuacion al inicio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(Config.gameplay.storageKey);
      if (saved) {
        setBestScore(parseInt(saved, 10));
      }
    }
  }, []);

  // Guardar mejor puntuacion
  const saveBestScore = useCallback((newBest: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(Config.gameplay.storageKey, newBest.toString());
    }
  }, []);

  const handleStart = useCallback(() => {
    setScore(0);
    setGameState('playing');
  }, []);

  const handleScore = useCallback(() => {
    setScore(prev => prev + 1);
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('gameover');

    // Actualizar mejor puntuacion si es necesario
    setScore(currentScore => {
      if (currentScore > bestScore) {
        setBestScore(currentScore);
        saveBestScore(currentScore);
      }
      return currentScore;
    });
  }, [bestScore, saveBestScore]);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a1a2e]">
      <GameCanvas
        isPlaying={gameState === 'playing'}
        onScore={handleScore}
        onGameOver={handleGameOver}
        onReady={handleReady}
      />

      {isReady && gameState === 'playing' && (
        <ScoreDisplay score={score} bestScore={bestScore} />
      )}

      {isReady && gameState === 'start' && (
        <StartScreen onStart={handleStart} playerName={playerName} />
      )}

      {isReady && gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          bestScore={bestScore}
          onRestart={handleStart}
        />
      )}

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]">
          <div className="text-white/60 text-lg">Cargando...</div>
        </div>
      )}
    </div>
  );
}
