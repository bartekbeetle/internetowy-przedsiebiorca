// @ts-nocheck
import { db } from "@repo/database";
import { LEVEL_THRESHOLDS, calculateLevel } from "./gamification/constants";

export type PointAction =
  | "POST_CREATED"
  | "COMMENT_CREATED"
  | "LIKE_RECEIVED"
  | "LIKE_GIVEN"
  | "LESSON_COMPLETED"
  | "MODULE_COMPLETED"
  | "COURSE_COMPLETED"
  | "REEL_SAVED"
  | "DAILY_LOGIN"
  | "CHALLENGE_COMPLETED"
  | "BADGE_EARNED";

export class PointsService {
  static BASE_POINTS: Record<PointAction, number> = {
    POST_CREATED: 10,
    COMMENT_CREATED: 5,
    LIKE_RECEIVED: 3,
    LIKE_GIVEN: 1,
    LESSON_COMPLETED: 5,
    MODULE_COMPLETED: 5,
    COURSE_COMPLETED: 20,
    REEL_SAVED: 1,
    DAILY_LOGIN: 2,
    CHALLENGE_COMPLETED: 10,
    BADGE_EARNED: 3,
  };

  // Milestone bonuses for likes on a post
  static LIKE_MILESTONES: Record<number, number> = {
    10: 15,
    50: 50,
    100: 100,
  };

  // Engagement bonus (likes + comments combined)
  static ENGAGEMENT_TIERS = [
    { threshold: 20, bonus: 25 },
    { threshold: 50, bonus: 75 },
    { threshold: 100, bonus: 150 },
  ];

  static async awardPoints(
    userId: string,
    action: PointAction,
    metadata?: Record<string, string>
  ) {
    const points = this.BASE_POINTS[action];
    if (!points) return;

    // Update user points
    const user = await db.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
      select: { points: true, level: true, streak: true, longestStreak: true, lastActiveAt: true },
    });

    // Check if user leveled up
    const newLevel = calculateLevel(user.points);
    const leveledUp = newLevel > user.level;
    if (leveledUp) {
      await db.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }

    // Update streak
    await this.updateStreak(userId, user.lastActiveAt, user.streak, user.longestStreak);

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        type: action,
        pointsEarned: points,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return { points: user.points, level: newLevel, leveledUp };
  }

  /**
   * Update user's daily streak. Called on every point award.
   */
  static async updateStreak(
    userId: string,
    lastActiveAt: Date | null,
    currentStreak: number,
    longestStreak: number
  ) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (lastActiveAt) {
      const lastActive = new Date(lastActiveAt);
      const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day - just update lastActiveAt
        await db.user.update({
          where: { id: userId },
          data: { lastActiveAt: now },
        });
      } else if (diffDays === 1) {
        // Consecutive day - increment streak
        const newStreak = currentStreak + 1;
        await db.user.update({
          where: { id: userId },
          data: {
            streak: newStreak,
            longestStreak: Math.max(newStreak, longestStreak),
            lastActiveAt: now,
          },
        });
      } else {
        // Streak broken - reset to 1
        await db.user.update({
          where: { id: userId },
          data: {
            streak: 1,
            lastActiveAt: now,
          },
        });
      }
    } else {
      // First activity ever
      await db.user.update({
        where: { id: userId },
        data: {
          streak: 1,
          longestStreak: Math.max(1, longestStreak),
          lastActiveAt: now,
        },
      });
    }
  }

  /**
   * Check if a post hit a like milestone (10, 50, 100 likes).
   * Awards bonus points to the post author if a milestone was just reached.
   */
  static async checkMilestones(postId: string) {
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { likesCount: true, authorId: true },
    });
    if (!post) return;

    const milestoneThreshold = this.LIKE_MILESTONES[post.likesCount];
    if (!milestoneThreshold) return;

    // Check if this milestone was already awarded
    const alreadyAwarded = await db.activityLog.findFirst({
      where: {
        userId: post.authorId,
        type: "MILESTONE_LIKES",
        metadata: { contains: `"postId":"${postId}"` },
      },
    });
    if (alreadyAwarded) return;

    // Award milestone bonus
    await db.user.update({
      where: { id: post.authorId },
      data: { points: { increment: milestoneThreshold } },
    });

    await db.activityLog.create({
      data: {
        userId: post.authorId,
        type: "MILESTONE_LIKES",
        pointsEarned: milestoneThreshold,
        metadata: JSON.stringify({
          postId,
          milestone: post.likesCount.toString(),
        }),
      },
    });

    // Check level up
    const user = await db.user.findUnique({
      where: { id: post.authorId },
      select: { points: true, level: true },
    });
    if (user) {
      const newLevel = calculateLevel(user.points);
      if (newLevel > user.level) {
        await db.user.update({
          where: { id: post.authorId },
          data: { level: newLevel },
        });
      }
    }

    return { milestone: post.likesCount, bonus: milestoneThreshold };
  }

  /**
   * Check if a post hit an engagement tier (likes + comments combined).
   * Awards bonus points to the post author.
   */
  static async checkEngagementBonus(postId: string) {
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { likesCount: true, commentsCount: true, authorId: true },
    });
    if (!post) return;

    const totalEngagement = post.likesCount + post.commentsCount;

    for (const tier of this.ENGAGEMENT_TIERS) {
      if (totalEngagement >= tier.threshold) {
        // Check if already awarded for this tier
        const alreadyAwarded = await db.activityLog.findFirst({
          where: {
            userId: post.authorId,
            type: "ENGAGEMENT_BONUS",
            metadata: {
              contains: `"postId":"${postId}","tier":"${tier.threshold}"`,
            },
          },
        });
        if (alreadyAwarded) continue;

        await db.user.update({
          where: { id: post.authorId },
          data: { points: { increment: tier.bonus } },
        });

        await db.activityLog.create({
          data: {
            userId: post.authorId,
            type: "ENGAGEMENT_BONUS",
            pointsEarned: tier.bonus,
            metadata: JSON.stringify({
              postId,
              tier: tier.threshold.toString(),
              engagement: totalEngagement.toString(),
            }),
          },
        });
      }
    }
  }

  static getPointsForAction(action: PointAction): number {
    return this.BASE_POINTS[action] || 0;
  }
}
