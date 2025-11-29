"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Game from "@/components/Game";

export default function Home() {
  const { context } = useMiniKit();

  // Obtener datos del usuario del contexto de MiniKit
  const user = context?.user;
  const fid = user?.fid;
  const username = user?.username || user?.displayName || "Jugador";
  const pfpUrl = user?.pfpUrl;

  // Si no hay FID, mostrar mensaje
  if (!fid) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-[#1a1a2e] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Keepy Uppy</h1>
          <p className="text-gray-400 mb-6">
            Abre esta app desde Base App o Warpcast para acceder al ranking y competir con otros jugadores.
          </p>
          <a
            href="https://base.org/names"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Descargar Base App
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Game
        fid={fid}
        username={username}
        pfpUrl={pfpUrl}
      />
    </div>
  );
}
