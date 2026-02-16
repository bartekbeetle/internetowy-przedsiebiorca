// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { getLevelInfo, LEVEL_THRESHOLDS } from "@/lib/gamification/constants";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        instagramHandle: true,
        points: true,
        level: true,
        streak: true,
        longestStreak: true,
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
          take: 20,
          select: {
            id: true,
            type: true,
            pointsEarned: true,
            metadata: true,
            createdAt: true,
          },
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

    return NextResponse.json({
      ...user,
      levelInfo,
      nextLevelPoints: nextLevelThreshold,
      progressToNextLevel: Math.max(0, Math.min(100, progressToNextLevel)),
      badges: user.badges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        iconUrl: ub.badge.iconUrl,
        category: ub.badge.category,
        earnedAt: ub.earnedAt,
      })),
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie pobrac profilu" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, instagramHandle, avatar } = body;

    // Validation
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        { error: "Imię musi mieć min. 2 znaki" },
        { status: 400 }
      );
    }

    if (bio && bio.length > 300) {
      return NextResponse.json(
        { error: "Bio może mieć max 300 znaków" },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name?.trim() || null,
        bio: bio?.trim() || null,
        instagramHandle: instagramHandle?.trim() || null,
        avatar: avatar || null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Nie udało się zaktualizować profilu" },
      { status: 500 }
    );
  }
}
