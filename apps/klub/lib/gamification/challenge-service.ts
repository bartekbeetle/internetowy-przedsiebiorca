// @ts-nocheck
import { db } from "@repo/database";
import { PointsService } from "../points";

export class ChallengeService {
  /**
   * Get active challenges with user's participation/progress.
   */
  static async getActiveChallenges(userId?: string) {
    const now = new Date();

    const challenges = await db.challenge.findMany({
      where: {
        isActive: true,
        endDate: { gte: now },
      },
      include: {
        badge: { select: { name: true, iconUrl: true } },
        participations: userId
          ? { where: { userId }, take: 1 }
          : false,
        _count: { select: { participations: true } },
      },
      orderBy: { endDate: "asc" },
    });

    return challenges.map((c) => {
      const requirement = JSON.parse(c.requirement);
      const participation = c.participations?.[0] || null;

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        type: c.type,
        reward: c.reward,
        startDate: c.startDate.toISOString(),
        endDate: c.endDate.toISOString(),
        requirement,
        badgeName: c.badge?.name || null,
        badgeIcon: c.badge?.iconUrl || null,
        participantCount: c._count.participations,
        participation: participation
          ? {
              progress: participation.progress,
              completed: participation.completed,
              completedAt: participation.completedAt?.toISOString() || null,
              joinedAt: participation.joinedAt.toISOString(),
            }
          : null,
      };
    });
  }

  /**
   * Join a challenge. Idempotent - returns existing participation if already joined.
   */
  static async joinChallenge(userId: string, challengeId: string) {
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge || !challenge.isActive) {
      throw new Error("Wyzwanie nie istnieje lub jest nieaktywne");
    }
    if (new Date() > challenge.endDate) {
      throw new Error("Wyzwanie juz sie zakonczylo");
    }

    const existing = await db.challengeParticipation.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    });
    if (existing) return existing;

    return db.challengeParticipation.create({
      data: { userId, challengeId },
    });
  }

  /**
   * Update progress for all active challenge participations matching the action type.
   * Called after user performs an action (post, comment, like, lesson complete, etc.)
   */
  static async updateProgress(userId: string, actionType: string) {
    const now = new Date();

    // Find all active participations for this user where challenge is ongoing
    const participations = await db.challengeParticipation.findMany({
      where: {
        userId,
        completed: false,
        challenge: {
          isActive: true,
          endDate: { gte: now },
        },
      },
      include: { challenge: true },
    });

    const results: { challengeId: string; completed: boolean }[] = [];

    for (const p of participations) {
      const requirement = JSON.parse(p.challenge.requirement);

      // Check if this action type matches the challenge requirement
      if (!this.actionMatchesRequirement(actionType, requirement.type)) continue;

      const newProgress = p.progress + 1;
      const completed = newProgress >= requirement.target;

      await db.challengeParticipation.update({
        where: { id: p.id },
        data: {
          progress: newProgress,
          completed,
          completedAt: completed ? now : null,
        },
      });

      if (completed) {
        // Award challenge reward points
        await PointsService.awardPoints(userId, "CHALLENGE_COMPLETED", {
          challengeId: p.challengeId,
          challengeTitle: p.challenge.title,
        });
      }

      results.push({ challengeId: p.challengeId, completed });
    }

    return results;
  }

  /**
   * Map user actions to challenge requirement types.
   */
  static actionMatchesRequirement(actionType: string, requirementType: string): boolean {
    const mapping: Record<string, string[]> = {
      post_count: ["POST_CREATED"],
      comment_count: ["COMMENT_CREATED"],
      like_given: ["LIKE_GIVEN"],
      lesson_completed: ["LESSON_COMPLETED"],
      course_completed: ["COURSE_COMPLETED"],
      reel_saved: ["REEL_SAVED"],
      any_action: ["POST_CREATED", "COMMENT_CREATED", "LIKE_GIVEN", "LESSON_COMPLETED"],
    };

    const validActions = mapping[requirementType] || [];
    return validActions.includes(actionType);
  }
}
