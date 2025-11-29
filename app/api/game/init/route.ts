import { NextRequest, NextResponse } from "next/server";
import { initUserDailyData, getUserStats, canPlay } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, pfpUrl } = body;

    if (!fid || !username) {
      return NextResponse.json(
        { error: "fid and username are required" },
        { status: 400 }
      );
    }

    // Inicializar usuario para hoy
    await initUserDailyData(fid, username, pfpUrl);

    // Obtener stats actualizados
    const stats = await getUserStats(fid);
    const playStatus = await canPlay(fid);

    return NextResponse.json({
      success: true,
      stats,
      canPlay: playStatus.canPlay,
      playReason: playStatus.reason,
    });
  } catch (error) {
    console.error("Error initializing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
