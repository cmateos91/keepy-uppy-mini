"use client";

import { useState, useCallback } from "react";

export interface UserStats {
  todayBest: number;
  todayGames: number;
  allTimeBest: number;
  rank: number;
  lives: number;
  freePlayUsed: boolean;
}

export interface RankingEntry {
  fid: number;
  username: string;
  pfpUrl?: string;
  score: number;
  rank: number;
}

export interface GameState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  stats: UserStats | null;
  canPlay: boolean;
  playReason: string;
  ranking: RankingEntry[];
}

export function useGameApi() {
  const [state, setState] = useState<GameState>({
    initialized: false,
    loading: false,
    error: null,
    stats: null,
    canPlay: false,
    playReason: "",
    ranking: [],
  });

  // Inicializar usuario
  const initUser = useCallback(async (fid: number, username: string, pfpUrl?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/game/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid, username, pfpUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize user");
      }

      setState(prev => ({
        ...prev,
        initialized: true,
        loading: false,
        stats: data.stats,
        canPlay: data.canPlay,
        playReason: data.playReason,
      }));

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setState(prev => ({ ...prev, loading: false, error: message }));
      return null;
    }
  }, []);

  // Iniciar partida (consume vida o free play)
  const startPlay = useCallback(async (fid: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/game/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start play");
      }

      setState(prev => ({
        ...prev,
        loading: false,
        stats: data.stats,
        canPlay: data.canPlay || false,
        playReason: data.reason || "",
      }));

      return data.success;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setState(prev => ({ ...prev, loading: false, error: message }));
      return false;
    }
  }, []);

  // Enviar score
  const submitScore = useCallback(async (
    fid: number,
    username: string,
    pfpUrl: string | undefined,
    score: number
  ) => {
    try {
      const response = await fetch("/api/game/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid, username, pfpUrl, score }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit score");
      }

      setState(prev => ({
        ...prev,
        stats: data.stats,
        canPlay: data.canPlay,
        playReason: data.playReason,
      }));

      return data;
    } catch (error) {
      console.error("Error submitting score:", error);
      return null;
    }
  }, []);

  // Obtener ranking
  const fetchRanking = useCallback(async (fid?: number, limit: number = 20) => {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (fid) params.set("fid", fid.toString());

      const response = await fetch(`/api/game/ranking?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch ranking");
      }

      setState(prev => ({
        ...prev,
        ranking: data.ranking,
        stats: data.userStats || prev.stats,
      }));

      return data;
    } catch (error) {
      console.error("Error fetching ranking:", error);
      return null;
    }
  }, []);

  // Añadir vidas (despues de pago)
  const addLives = useCallback(async (fid: number, txHash?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/game/lives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid, txHash }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add lives");
      }

      setState(prev => ({
        ...prev,
        loading: false,
        stats: data.stats,
        canPlay: data.canPlay,
        playReason: data.playReason,
      }));

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setState(prev => ({ ...prev, loading: false, error: message }));
      return null;
    }
  }, []);

  // Obtener info de precio de vidas
  const getLivesPrice = useCallback(async () => {
    try {
      const response = await fetch("/api/game/lives");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching lives price:", error);
      return null;
    }
  }, []);

  return {
    state,
    initUser,
    startPlay,
    submitScore,
    fetchRanking,
    addLives,
    getLivesPrice,
  };
}
