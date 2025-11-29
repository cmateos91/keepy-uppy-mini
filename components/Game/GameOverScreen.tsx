"use client";

interface GameOverScreenProps {
  score: number;
  bestScore: number;
  rank: number;
  lives: number;
  canPlay: boolean;
  onRestart: () => void;
  onShowLeaderboard: () => void;
  onBuyLives: () => void;
}

export default function GameOverScreen({
  score,
  bestScore,
  rank,
  lives,
  canPlay,
  onRestart,
  onShowLeaderboard,
  onBuyLives,
}: GameOverScreenProps) {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#1a1a2e]/95 z-20 p-4">
      <h2 className="font-black text-white text-4xl mb-4">
        Game Over
      </h2>

      {isNewBest && (
        <p className="text-yellow-400 text-lg font-bold mb-2 animate-pulse">
          Nuevo record!
        </p>
      )}

      <p className="text-white/70 text-lg mb-1">
        Toques: <span className="text-white font-bold text-3xl">{score}</span>
      </p>

      <p className="text-white/70 text-lg mb-2">
        Mejor hoy: <span className="text-white font-bold">{bestScore}</span>
      </p>

      {rank > 0 && (
        <p className="text-yellow-400 font-bold text-lg mb-4">
          Posicion #{rank} en el ranking
        </p>
      )}

      {/* Info de vidas */}
      <div className="mb-6 text-center">
        {lives > 0 ? (
          <p className="text-white/70 text-sm">
            Vidas restantes: <span className="text-green-400 font-bold">{lives}</span>
          </p>
        ) : (
          <p className="text-orange-400 text-sm">
            Sin vidas
          </p>
        )}
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {canPlay ? (
          <button
            onClick={onRestart}
            className="font-black text-xl py-4 px-8 border-none rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white cursor-pointer shadow-lg shadow-[#667eea]/40 transition-transform duration-200 active:scale-95"
          >
            REINTENTAR
          </button>
        ) : (
          <button
            onClick={onBuyLives}
            className="font-bold text-lg py-4 px-8 border-none rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white cursor-pointer shadow-lg shadow-green-500/30 transition-transform duration-200 active:scale-95"
          >
            COMPRAR 3 VIDAS - $0.20
          </button>
        )}

        <button
          onClick={onShowLeaderboard}
          className="font-bold text-lg py-3 px-8 border-2 border-white/30 rounded-full bg-transparent text-white cursor-pointer transition-all duration-200 hover:bg-white/10 active:scale-95"
        >
          VER RANKING
        </button>
      </div>
    </div>
  );
}
