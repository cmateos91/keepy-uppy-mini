"use client";

interface GameOverScreenProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
}

export default function GameOverScreen({ score, bestScore, onRestart }: GameOverScreenProps) {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#1a1a2e]/95 z-20">
      <h2 className="font-black text-white text-4xl mb-4">
        Game Over
      </h2>

      {isNewBest && (
        <p className="text-yellow-400 text-lg font-bold mb-2">
          Nuevo record!
        </p>
      )}

      <p className="text-white/70 text-lg mb-1">
        Toques: <span className="text-white font-bold text-2xl">{score}</span>
      </p>

      <p className="text-white/70 text-lg mb-6">
        Mejor: <span className="text-white font-bold">{bestScore}</span>
      </p>

      <button
        onClick={onRestart}
        className="font-black text-2xl py-4 px-12 border-none rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white cursor-pointer shadow-lg shadow-[#667eea]/40 transition-transform duration-200 active:scale-95 active:shadow-md"
      >
        REINTENTAR
      </button>
    </div>
  );
}
