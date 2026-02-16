// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { getLevelInfo, LEVEL_THRESHOLDS, BADGE_DEFINITIONS } from "@/lib/gamification/constants";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        points: true,
        level: true,
        streak: true,
        longestStreak: true,
        totalPosts: true,
        totalComments: true,
        totalLikes: true,
        completedCourses: true,
        _count: {
          select: { badges: true },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const levelInfo = getLevelInfo(user.level);
    const nextLevelThreshold = LEVEL_THRESHOLDS[Math.min(user.level + 1, LEVEL_THRESHOLDS.length - 1)];
    const currentLevelThreshold = LEVEL_THRESHOLDS[user.level] || 0;
    const progressToNextLevel = user.level >= 10
      ? 100
      : Math.round(((user.points - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100);

    // Get rank
    const rank = await db.user.count({
      where: { points: { gt: user.points } },
    }) + 1;

    const totalBadges = await db.badge.count({ where: { isSecret: false } });

    return NextResponse.json({
      points: user.points,
      level: user.level,
      levelName: levelInfo.name,
      levelColor: levelInfo.color,
      levelIcon: levelInfo.icon,
      nextLevelPoints: nextLevelThreshold,
      progressToNextLevel: Math.max(0, Math.min(100, progressToNextLevel)),
      streak: user.streak,
      longestStreak: user.longestStreak,
      badgesEarned: user._count.badges,
      totalBadges,
      rank,
      totalPosts: user.totalPosts,
      totalComments: user.totalComments,
      totalLikes: user.totalLikes,
      completedCourses: user.completedCourses,
    });
  } catch (error) {
    console.error("Gamification stats error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie pobrac statystyk" },
      { status: 500 }
    );
  }
}
