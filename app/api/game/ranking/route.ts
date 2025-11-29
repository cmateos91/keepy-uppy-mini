import { NextRequest, NextResponse } from "next/server";
import { getDailyRanking, getUserStats, getTodayKey } from "@/lib/kv";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const fid = searchParams.get("fid");

    // Obtener ranking diario
    const ranking = await getDailyRanking(limit);

    // Si se proporciona fid, obtener stats del usuario
    let userStats = null;
    if (fid) {
      userStats = await getUserStats(parseInt(fid));
    }

    return NextResponse.json({
      success: true,
      date: getTodayKey(),
      ranking,
      userStats,
    });
  } catch (error) {
    console.error("Error fetching ranking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
