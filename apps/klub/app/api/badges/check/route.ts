// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BadgeService } from "@/lib/gamification/badge-service";
import { db } from "@repo/database";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newBadges = await BadgeService.checkAndAwardBadges(session.user.id);

    // If badges were awarded, fetch their display info
    let awardedBadges = [];
    if (newBadges.length > 0) {
      awardedBadges = await db.badge.findMany({
        where: { name: { in: newBadges } },
        select: { name: true, description: true, iconUrl: true, points: true },
      });
    }

    return NextResponse.json({
      newBadges: awardedBadges,
      count: newBadges.length,
    });
  } catch (error) {
    console.error("Badge check error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie sprawdzic odznak" },
      { status: 500 }
    );
  }
}
