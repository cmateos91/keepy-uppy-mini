import { NextRequest, NextResponse } from "next/server";
import { getUserDailyData, getTodayKey, canPlay, getUserStats } from "@/lib/kv";
import { kv } from "@vercel/kv";

// GET - Ver estado del usuario
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "fid required" }, { status: 400 });
  }

  const fidNum = parseInt(fid);
  const today = getTodayKey();

  const userData = await getUserDailyData(fidNum);
  const playStatus = await canPlay(fidNum);
  const stats = await getUserStats(fidNum);

  return NextResponse.json({
    today,
    fid: fidNum,
    userData,
    playStatus,
    stats,
  });
}

// DELETE - Reset usuario para testing
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "fid required" }, { status: 400 });
  }

  const fidNum = parseInt(fid);
  const today = getTodayKey();
  const key = `user:${fidNum}:${today}`;

  await kv.del(key);

  return NextResponse.json({
    success: true,
    message: `Deleted ${key}`,
  });
}
