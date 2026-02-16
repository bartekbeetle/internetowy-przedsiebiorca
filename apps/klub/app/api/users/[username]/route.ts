// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@repo/database";
import { getLevelInfo } from "@/lib/gamification/constants";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = await params;

    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        points: true,
        level: true,
        streak: true,
        totalPosts: true,
        totalComments: true,
        totalLikes: true,
        completedCourses: true,
        createdAt: true,
        badges: {
          include: { badge: true },
          orderBy: { earnedAt: "desc" },
          take: 6,
        },
        activityLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            type: true,
            pointsEarned: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Uzytkownik nie znaleziony" }, { status: 404 });
    }

    const levelInfo = getLevelInfo(user.level);

    return NextResponse.json({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      points: user.points,
      level: user.level,
      levelInfo,
      streak: user.streak,
      totalPosts: user.totalPosts,
      totalComments: user.totalComments,
      totalLikes: user.totalLikes,
      completedCourses: user.completedCourses,
      createdAt: user.createdAt,
      badges: user.badges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        iconUrl: ub.badge.iconUrl,
        category: ub.badge.category,
        earnedAt: ub.earnedAt,
      })),
      recentActivity: user.activityLogs,
    });
  } catch (error) {
    console.error("User profile error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie pobrac profilu" },
      { status: 500 }
    );
  }
}
