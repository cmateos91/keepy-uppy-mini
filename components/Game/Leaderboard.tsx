"use client";

import { RankingEntry } from "@/hooks/useGameApi";

interface LeaderboardProps {
  ranking: RankingEntry[];
  userFid?: number;
  userRank?: number;
  onClose: () => void;
}

export default function Leaderboard({
  ranking,
  userFid,
  userRank,
  onClose,
}: LeaderboardProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm bg-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Ranking Diario</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              X
            </button>
          </div>
          {userRank && userRank > 0 && (
            <p className="text-white/80 text-sm mt-1">
              Tu posicion: #{userRank}
            </p>
          )}
        </div>

        {/* Lista */}
        <div className="max-h-80 overflow-y-auto">
          {ranking.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>No hay puntuaciones todavia</p>
              <p className="text-sm mt-1">Se el primero en jugar!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {ranking.map((entry, index) => (
                <li
                  key={entry.fid}
                  className={`flex items-center gap-3 p-3 ${
                    entry.fid === userFid ? "bg-yellow-500/10" : ""
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                        ? "bg-gray-300 text-black"
                        : index === 2
                        ? "bg-orange-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {entry.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                    {entry.pfpUrl ? (
                      <img
                        src={entry.pfpUrl}
                        alt={entry.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        entry.fid === userFid ? "text-yellow-400" : "text-white"
                      }`}
                    >
                      @{entry.username}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span className="font-bold text-lg text-white">
                      {entry.score}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900/50">
          <p className="text-xs text-gray-400 text-center">
            El ranking se reinicia cada dia a las 00:00 UTC
          </p>
        </div>
      </div>
    </div>
  );
}
