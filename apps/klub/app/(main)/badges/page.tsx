// @ts-nocheck
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BadgeService } from "@/lib/gamification/badge-service";
import { BADGE_CATEGORIES } from "@/lib/gamification/constants";
import { BadgesClient } from "./BadgesClient";

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const badges = await BadgeService.getUserBadges(session.user.id);

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalCount = badges.length;

  return (
    <BadgesClient
      badges={badges}
      earnedCount={earnedCount}
      totalCount={totalCount}
      categories={BADGE_CATEGORIES}
    />
  );
}
