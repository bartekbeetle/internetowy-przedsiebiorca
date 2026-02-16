// @ts-nocheck
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChallengeService } from "@/lib/gamification/challenge-service";
import { ChallengesClient } from "./ChallengesClient";

export default async function ChallengesPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const challenges = await ChallengeService.getActiveChallenges(userId);

  return <ChallengesClient challenges={challenges} isLoggedIn={!!userId} />;
}
