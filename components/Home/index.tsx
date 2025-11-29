"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Game from "@/components/Game";

export default function Home() {
  const { context } = useMiniKit();

  // Obtener nombre del usuario del contexto de MiniKit
  const playerName = context?.user?.displayName || context?.user?.username;

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Game playerName={playerName} />
    </div>
  );
}
