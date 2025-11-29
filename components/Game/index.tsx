"use client";

import { useState, useCallback, useEffect } from 'react';
import { Config, GameState } from '@/game';
import { useGameApi } from '@/hooks/useGameApi';
import { useLanguage } from '@/contexts/language-context';
import GameCanvas from './GameCanvas';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import ScoreDisplay from './ScoreDisplay';
import Leaderboard from './Leaderboard';
import BuyLivesModal from './BuyLivesModal';
import LanguageSelector from './LanguageSelector';

// Direccion donde se reciben pagos (configurable via env)
const PAYMENT_RECEIVER = process.env.NEXT_PUBLIC_PAYMENT_RECEIVER || "0x0000000000000000000000000000000000000000";

interface GameProps {
  fid: number;
  username: string;
  pfpUrl?: string;
}

export default function Game({ fid, username, pfpUrl }: GameProps) {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Modales
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBuyLives, setShowBuyLives] = useState(false);

  // Game API hook
  const { state: apiState, initUser, startPlay, submitScore, fetchRanking, addLives } = useGameApi();

  // Inicializar usuario al montar
  useEffect(() => {
    if (fid && username) {
      initUser(fid, username, pfpUrl);
      fetchRanking(fid);
    }
  }, [fid, username, pfpUrl, initUser, fetchRanking]);

  // Manejar inicio de partida
  const handleStart = useCallback(async () => {
    // Verificar si puede jugar (tambien inicializa usuario si no existe)
    const canStartPlay = await startPlay(fid, username, pfpUrl);

    if (!canStartPlay) {
      // No tiene vidas, mostrar modal de compra
      setShowBuyLives(true);
      return;
    }

    // Puede jugar, iniciar
    setScore(0);
    setGameState('playing');
  }, [fid, username, pfpUrl, startPlay]);

  // Manejar puntuacion
  const handleScore = useCallback(() => {
    setScore(prev => prev + 1);
  }, []);

  // Manejar game over
  const handleGameOver = useCallback(async () => {
    setGameState('gameover');

    // Enviar score al servidor
    await submitScore(fid, username, pfpUrl, score);

    // Actualizar ranking
    await fetchRanking(fid);
  }, [fid, username, pfpUrl, score, submitScore, fetchRanking]);

  // Cuando cambia el score y el juego termina, enviar
  useEffect(() => {
    if (gameState === 'gameover' && score > 0) {
      submitScore(fid, username, pfpUrl, score);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  // Manejar compra de vidas exitosa
  const handleBuyLivesSuccess = useCallback(async (txHash: string) => {
    await addLives(fid, txHash);
    setShowBuyLives(false);
  }, [fid, addLives]);

  // Datos del usuario
  const lives = apiState.stats?.lives || 0;
  const freePlayAvailable = !apiState.stats?.freePlayUsed;
  const todayBest = apiState.stats?.todayBest || 0;
  const rank = apiState.stats?.rank || -1;

  // Determinar si puede jugar
  const canPlayNow = freePlayAvailable || lives > 0;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a1a2e]">
      <GameCanvas
        isPlaying={gameState === 'playing'}
        onScore={handleScore}
        onGameOver={handleGameOver}
        onReady={handleReady}
      />

      {/* HUD durante el juego */}
      {isReady && gameState === 'playing' && (
        <ScoreDisplay score={score} bestScore={todayBest} />
      )}

      {/* Pantalla de inicio */}
      {isReady && gameState === 'start' && (
        <StartScreen
          onStart={handleStart}
          onShowLeaderboard={() => {
            fetchRanking(fid);
            setShowLeaderboard(true);
          }}
          playerName={username}
          lives={lives}
          freePlayAvailable={freePlayAvailable}
          canPlay={canPlayNow}
          rank={rank}
          todayBest={todayBest}
          onBuyLives={() => setShowBuyLives(true)}
          loading={apiState.loading}
        />
      )}

      {/* Pantalla de game over */}
      {isReady && gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          bestScore={todayBest}
          rank={rank}
          lives={lives}
          canPlay={canPlayNow}
          onRestart={handleStart}
          onShowLeaderboard={() => {
            fetchRanking(fid);
            setShowLeaderboard(true);
          }}
          onBuyLives={() => setShowBuyLives(true)}
        />
      )}

      {/* Loading inicial */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]">
          <div className="text-white/60 text-lg">{t.loading}</div>
        </div>
      )}

      {/* Selector de idioma (visible en start y gameover) */}
      {isReady && gameState !== 'playing' && (
        <LanguageSelector />
      )}

      {/* Modal de Leaderboard */}
      {showLeaderboard && (
        <Leaderboard
          ranking={apiState.ranking}
          userFid={fid}
          userRank={rank}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Modal de Comprar Vidas */}
      {showBuyLives && (
        <BuyLivesModal
          onClose={() => setShowBuyLives(false)}
          onSuccess={handleBuyLivesSuccess}
          receiverAddress={PAYMENT_RECEIVER}
        />
      )}
    </div>
  );
}
