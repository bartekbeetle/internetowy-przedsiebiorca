// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChallengeService } from "@/lib/gamification/challenge-service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const challenges = await ChallengeService.getActiveChallenges(userId);

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Challenges error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie pobrac wyzwan" },
      { status: 500 }
    );
  }
}
