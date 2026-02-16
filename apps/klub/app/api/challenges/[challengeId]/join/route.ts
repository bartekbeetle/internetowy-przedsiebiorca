// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChallengeService } from "@/lib/gamification/challenge-service";

export async function POST(
  request: Request,
  { params }: { params: { challengeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId } = await params;

    const participation = await ChallengeService.joinChallenge(
      session.user.id,
      challengeId
    );

    return NextResponse.json(participation);
  } catch (error) {
    console.error("Join challenge error:", error);
    return NextResponse.json(
      { error: error.message || "Nie udalo sie dolaczyc do wyzwania" },
      { status: 400 }
    );
  }
}
