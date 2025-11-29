import { NextRequest, NextResponse } from "next/server";
import { initUserDailyData, getUserStats, canPlay } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, pfpUrl } = body;

    console.log("[INIT] Request received:", { fid, username });

    if (!fid || !username) {
      console.log("[INIT] Error: fid and username are required");
      return NextResponse.json(
        { error: "fid and username are required" },
        { status: 400 }
      );
    }

    // Inicializar usuario para hoy
    const userData = await initUserDailyData(fid, username, pfpUrl);
    console.log("[INIT] User data:", userData);

    // Obtener stats actualizados
    const stats = await getUserStats(fid);
    const playStatus = await canPlay(fid);

    console.log("[INIT] Stats:", stats);
    console.log("[INIT] Play status:", playStatus);

    return NextResponse.json({
      success: true,
      stats,
      canPlay: playStatus.canPlay,
      playReason: playStatus.reason,
    });
  } catch (error) {
    console.error("[INIT] Error initializing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
