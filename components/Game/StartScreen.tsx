"use client";

interface StartScreenProps {
  onStart: () => void;
  playerName?: string;
}

export default function StartScreen({ onStart, playerName }: StartScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#1a1a2e]/95 z-20">
      <h1 className="font-black text-white text-5xl mb-2">
        Keepy Uppy
      </h1>

      {playerName && (
        <p className="text-white/60 text-lg mb-2">
          Hola, {playerName}!
        </p>
      )}

      <p className="text-white/70 text-lg mb-6">
        Manten el balon en el aire
      </p>

      <button
        onClick={onStart}
        className="font-black text-2xl py-4 px-12 border-none rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white cursor-pointer shadow-lg shadow-[#667eea]/40 transition-transform duration-200 active:scale-95 active:shadow-md"
      >
        JUGAR
      </button>
    </div>
  );
}
