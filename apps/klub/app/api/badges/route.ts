// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BadgeService } from "@/lib/gamification/badge-service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const badges = await BadgeService.getUserBadges(session.user.id);

    return NextResponse.json(badges);
  } catch (error) {
    console.error("Badges error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie pobrac odznak" },
      { status: 500 }
    );
  }
}
