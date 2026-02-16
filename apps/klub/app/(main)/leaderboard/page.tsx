// @ts-nocheck
import { db } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLevelInfo } from "@/lib/gamification/constants";
import { LeaderboardClient } from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);

  const users = await db.user.findMany({
    where: { role: { not: "ADMIN" } },
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

  return <LeaderboardClient entries={leaderboard} />;
}
