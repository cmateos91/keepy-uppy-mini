import { NextRequest, NextResponse } from "next/server";
import { consumeLife, canPlay, getUserStats, initUserDailyData, getUserDailyData } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, pfpUrl } = body;

    console.log("[PLAY] Request received:", { fid, username });

    if (!fid) {
      console.log("[PLAY] Error: fid is required");
      return NextResponse.json(
        { error: "fid is required" },
        { status: 400 }
      );
    }

    // Asegurarse de que el usuario existe (inicializar si no)
    let user = await getUserDailyData(fid);
    console.log("[PLAY] getUserDailyData result:", user);

    if (!user) {
      // Inicializar usuario si no existe
      console.log("[PLAY] User not found, initializing...");
      user = await initUserDailyData(fid, username || "Player", pfpUrl);
      console.log("[PLAY] User initialized:", user);
    }

    // Verificar si puede jugar
    const playStatus = await canPlay(fid);
    console.log("[PLAY] canPlay result:", playStatus);

    if (!playStatus.canPlay) {
      console.log("[PLAY] Cannot play:", playStatus.reason);
      return NextResponse.json({
        success: false,
        canPlay: false,
        reason: playStatus.reason,
      });
    }

    // Usar una vida (o la partida gratis)
    const result = await consumeLife(fid);
    console.log("[PLAY] consumeLife result:", result);

    if (!result.success) {
      console.log("[PLAY] consumeLife failed");
      return NextResponse.json({
        success: false,
        canPlay: false,
        reason: "no_lives",
      });
    }

    // Obtener stats actualizados
    const stats = await getUserStats(fid);
    console.log("[PLAY] Final stats:", stats);

    return NextResponse.json({
      success: true,
      canPlay: true,
      livesRemaining: result.livesRemaining,
      stats,
    });
  } catch (error) {
    console.error("[PLAY] Error starting play:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
