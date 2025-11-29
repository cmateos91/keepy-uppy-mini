"use client";

interface StartScreenProps {
  onStart: () => void;
  onShowLeaderboard: () => void;
  onBuyLives: () => void;
  playerName?: string;
  lives: number;
  freePlayAvailable: boolean;
  canPlay: boolean;
  rank: number;
  todayBest: number;
  loading?: boolean;
}

export default function StartScreen({
  onStart,
  onShowLeaderboard,
  onBuyLives,
  playerName,
  lives,
  freePlayAvailable,
  canPlay,
  rank,
  todayBest,
  loading,
}: StartScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#1a1a2e]/95 z-20 p-4">
      <h1 className="font-black text-white text-5xl mb-2">
        Keepy Uppy
      </h1>

      {playerName && (
        <p className="text-white/60 text-lg mb-2">
          Hola, {playerName}!
        </p>
      )}

      <p className="text-white/70 text-lg mb-4">
        Manten el balon en el aire
      </p>

      {/* Stats del usuario */}
      <div className="flex gap-4 mb-6">
        {todayBest > 0 && (
          <div className="bg-gray-800/50 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Mejor hoy</p>
            <p className="text-xl font-bold text-white">{todayBest}</p>
          </div>
        )}
        {rank > 0 && (
          <div className="bg-gray-800/50 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Posicion</p>
            <p className="text-xl font-bold text-yellow-400">#{rank}</p>
          </div>
        )}
      </div>

      {/* Info de vidas */}
      <div className="mb-6 text-center">
        {freePlayAvailable ? (
          <p className="text-green-400 text-sm">
            Partida gratis disponible
          </p>
        ) : lives > 0 ? (
          <p className="text-white/70 text-sm">
            Vidas: <span className="text-green-400 font-bold">{lives}</span>
          </p>
        ) : (
          <p className="text-orange-400 text-sm">
            Sin vidas - Compra mas para seguir jugando
          </p>
        )}
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onStart}
          disabled={loading || !canPlay}
          className={`font-black text-xl py-4 px-8 border-none rounded-full text-white cursor-pointer shadow-lg transition-all duration-200 active:scale-95 ${
            canPlay
              ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-[#667eea]/40"
              : "bg-gray-600 cursor-not-allowed opacity-70"
          }`}
        >
          {loading ? "..." : canPlay ? "JUGAR" : "SIN VIDAS"}
        </button>

        {!canPlay && (
          <button
            onClick={onBuyLives}
            className="font-bold text-lg py-3 px-8 border-none rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white cursor-pointer shadow-lg shadow-green-500/30 transition-transform duration-200 active:scale-95"
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
