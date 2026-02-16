// @ts-nocheck
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { getLevelInfo, LEVEL_THRESHOLDS } from "@/lib/gamification/constants";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

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

  if (!user) redirect("/login");

  const levelInfo = getLevelInfo(user.level);
  const nextThreshold = LEVEL_THRESHOLDS[Math.min(user.level + 1, LEVEL_THRESHOLDS.length - 1)];
  const totalBadges = await db.badge.count({ where: { isSecret: false } });

  const profileData = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    levelInfo,
    nextLevelPoints: nextThreshold,
    totalBadgesCount: totalBadges,
    badges: user.badges.map((ub) => ({
      id: ub.badge.id,
      name: ub.badge.name,
      iconUrl: ub.badge.iconUrl,
      category: ub.badge.category,
      earnedAt: ub.earnedAt.toISOString(),
    })),
    activityLogs: user.activityLogs.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  return <ProfileClient profile={profileData} />;
}
