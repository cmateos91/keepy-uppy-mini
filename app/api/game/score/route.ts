import { NextRequest, NextResponse } from "next/server";
import { submitScore, getUserStats, canPlay } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, pfpUrl, score } = body;

    if (!fid || score === undefined) {
      return NextResponse.json(
        { error: "fid and score are required" },
        { status: 400 }
      );
    }

    // Validar score (prevenir trampas obvias)
    if (score < 0 || score > 10000) {
      return NextResponse.json(
        { error: "Invalid score" },
        { status: 400 }
      );
    }

    // Enviar score
    const result = await submitScore(fid, username, pfpUrl, score);

    // Obtener stats actualizados
    const stats = await getUserStats(fid);
    const playStatus = await canPlay(fid);

    return NextResponse.json({
      success: true,
      newBest: result.newBest,
      rank: result.rank,
      stats,
      canPlay: playStatus.canPlay,
      playReason: playStatus.reason,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
