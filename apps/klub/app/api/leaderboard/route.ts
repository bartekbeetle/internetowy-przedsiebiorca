// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { getLevelInfo } from "@/lib/gamification/constants";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";

    let dateFilter = {};
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { lastActiveAt: { gte: weekAgo } };
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { lastActiveAt: { gte: monthAgo } };
    }

    const users = await db.user.findMany({
      where: {
        ...dateFilter,
        role: { not: "ADMIN" },
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        points: true,
        level: true,
        streak: true,
      },
      orderBy: { points: "desc" },
      take: 50,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      streak: user.streak,
      levelInfo: getLevelInfo(user.level),
      isCurrentUser: session?.user?.id === user.id,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie pobrac rankingu" },
      { status: 500 }
    );
  }
}
