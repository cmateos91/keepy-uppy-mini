import { kv } from "@vercel/kv";

// Claves para Redis
const KEYS = {
  // Ranking diario: sorted set con scores
  dailyRanking: (date: string) => `ranking:${date}`,
  // Datos del usuario para hoy
  userDaily: (fid: number, date: string) => `user:${fid}:${date}`,
  // Mejor score historico del usuario
  userBest: (fid: number) => `user:${fid}:best`,
};

// Obtener fecha actual en formato YYYY-MM-DD (UTC)
export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

// Tipos
export interface UserDailyData {
  fid: number;
  username: string;
  pfpUrl?: string;
  lives: number;
  freePlayUsed: boolean;
  bestScore: number;
  totalGames: number;
  lastUpdated: number;
}

export interface RankingEntry {
  fid: number;
  username: string;
  pfpUrl?: string;
  score: number;
  rank: number;
}

// === FUNCIONES DE USUARIO ===

export async function getUserDailyData(fid: number): Promise<UserDailyData | null> {
  const today = getTodayKey();
  const data = await kv.get<UserDailyData>(KEYS.userDaily(fid, today));
  return data;
}

export async function initUserDailyData(
  fid: number,
  username: string,
  pfpUrl?: string
): Promise<UserDailyData> {
  const today = getTodayKey();
  const existing = await getUserDailyData(fid);

  if (existing) {
    return existing;
  }

  const newUser: UserDailyData = {
    fid,
    username,
    pfpUrl,
    lives: 0, // Empieza con 0 vidas compradas
    freePlayUsed: false,
    bestScore: 0,
    totalGames: 0,
    lastUpdated: Date.now(),
  };

  // Expira a las 00:00 UTC del dia siguiente + 1 hora de margen
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(1, 0, 0, 0);
  const ttlSeconds = Math.floor((tomorrow.getTime() - Date.now()) / 1000);

  await kv.set(KEYS.userDaily(fid, today), newUser, { ex: ttlSeconds });
  return newUser;
}

export async function updateUserDailyData(
  fid: number,
  updates: Partial<UserDailyData>
): Promise<UserDailyData | null> {
  const today = getTodayKey();
  const existing = await getUserDailyData(fid);

  if (!existing) {
    return null;
  }

  const updated: UserDailyData = {
    ...existing,
    ...updates,
    lastUpdated: Date.now(),
  };

  // Mantener el TTL original
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(1, 0, 0, 0);
  const ttlSeconds = Math.floor((tomorrow.getTime() - Date.now()) / 1000);

  await kv.set(KEYS.userDaily(fid, today), updated, { ex: ttlSeconds });
  return updated;
}

// === FUNCIONES DE VIDAS ===

export async function consumeLife(fid: number): Promise<{ success: boolean; livesRemaining: number }> {
  const user = await getUserDailyData(fid);

  if (!user) {
    return { success: false, livesRemaining: 0 };
  }

  // Primero intentar usar la partida gratis
  if (!user.freePlayUsed) {
    await updateUserDailyData(fid, { freePlayUsed: true });
    return { success: true, livesRemaining: user.lives };
  }

  // Si no hay vidas, no se puede jugar
  if (user.lives <= 0) {
    return { success: false, livesRemaining: 0 };
  }

  // Usar una vida
  const newLives = user.lives - 1;
  await updateUserDailyData(fid, { lives: newLives });
  return { success: true, livesRemaining: newLives };
}

export async function addLives(fid: number, amount: number = 3): Promise<number> {
  const user = await getUserDailyData(fid);

  if (!user) {
    return 0;
  }

  const newLives = user.lives + amount;
  await updateUserDailyData(fid, { lives: newLives });
  return newLives;
}

export async function canPlay(fid: number): Promise<{ canPlay: boolean; reason: string }> {
  const user = await getUserDailyData(fid);

  if (!user) {
    return { canPlay: false, reason: "user_not_found" };
  }

  if (!user.freePlayUsed) {
    return { canPlay: true, reason: "free_play" };
  }

  if (user.lives > 0) {
    return { canPlay: true, reason: "has_lives" };
  }

  return { canPlay: false, reason: "no_lives" };
}

// === FUNCIONES DE SCORE Y RANKING ===

export async function submitScore(
  fid: number,
  username: string,
  pfpUrl: string | undefined,
  score: number
): Promise<{ newBest: boolean; rank: number }> {
  const today = getTodayKey();
  const user = await getUserDailyData(fid);

  if (!user) {
    return { newBest: false, rank: -1 };
  }

  // Actualizar contador de partidas
  await updateUserDailyData(fid, { totalGames: user.totalGames + 1 });

  // Solo actualizar ranking si es mejor score del dia
  if (score > user.bestScore) {
    await updateUserDailyData(fid, { bestScore: score });

    // Guardar en el ranking (sorted set)
    // Guardamos los datos del usuario como JSON en el member
    const memberData = JSON.stringify({ fid, username, pfpUrl });
    await kv.zadd(KEYS.dailyRanking(today), { score, member: memberData });

    // Establecer expiracion del ranking (25 horas para dar margen)
    await kv.expire(KEYS.dailyRanking(today), 90000);

    // Actualizar mejor score historico
    const currentBest = await kv.get<number>(KEYS.userBest(fid));
    if (!currentBest || score > currentBest) {
      await kv.set(KEYS.userBest(fid), score);
    }
  }

  // Obtener rank actual
  const rank = await getUserRank(fid);
  return { newBest: score > user.bestScore, rank };
}

export async function getUserRank(fid: number): Promise<number> {
  const today = getTodayKey();
  const user = await getUserDailyData(fid);

  if (!user || user.bestScore === 0) {
    return -1;
  }

  // Obtener todos los scores mayores o iguales
  const higherScores = await kv.zcount(
    KEYS.dailyRanking(today),
    user.bestScore + 1,
    "+inf"
  );

  return higherScores + 1;
}

export async function getDailyRanking(limit: number = 20): Promise<RankingEntry[]> {
  const today = getTodayKey();

  // Obtener top scores (de mayor a menor)
  const results = await kv.zrange<string[]>(
    KEYS.dailyRanking(today),
    0,
    limit - 1,
    { rev: true, withScores: true }
  );

  if (!results || results.length === 0) {
    return [];
  }

  const entries: RankingEntry[] = [];

  // Los resultados vienen como [member, score, member, score, ...]
  for (let i = 0; i < results.length; i += 2) {
    try {
      const memberData = JSON.parse(results[i]);
      const score = Number(results[i + 1]);
      entries.push({
        fid: memberData.fid,
        username: memberData.username,
        pfpUrl: memberData.pfpUrl,
        score,
        rank: entries.length + 1,
      });
    } catch {
      // Skip invalid entries
    }
  }

  return entries;
}

export async function getUserStats(fid: number): Promise<{
  todayBest: number;
  todayGames: number;
  allTimeBest: number;
  rank: number;
  lives: number;
  freePlayUsed: boolean;
} | null> {
  const user = await getUserDailyData(fid);

  if (!user) {
    return null;
  }

  const allTimeBest = (await kv.get<number>(KEYS.userBest(fid))) || 0;
  const rank = await getUserRank(fid);

  return {
    todayBest: user.bestScore,
    todayGames: user.totalGames,
    allTimeBest,
    rank,
    lives: user.lives,
    freePlayUsed: user.freePlayUsed,
  };
}
