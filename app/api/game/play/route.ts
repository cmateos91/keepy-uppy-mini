import { NextRequest, NextResponse } from "next/server";
import { consumeLife, canPlay, getUserStats } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json(
        { error: "fid is required" },
        { status: 400 }
      );
    }

    // Verificar si puede jugar
    const playStatus = await canPlay(fid);

    if (!playStatus.canPlay) {
      return NextResponse.json({
        success: false,
        canPlay: false,
        reason: playStatus.reason,
      });
    }

    // Usar una vida (o la partida gratis)
    const result = await consumeLife(fid);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        canPlay: false,
        reason: "no_lives",
      });
    }

    // Obtener stats actualizados
    const stats = await getUserStats(fid);

    return NextResponse.json({
      success: true,
      canPlay: true,
      livesRemaining: result.livesRemaining,
      stats,
    });
  } catch (error) {
    console.error("Error starting play:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
