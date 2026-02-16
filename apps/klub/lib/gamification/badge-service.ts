// @ts-nocheck
import { db } from "@repo/database";
import { BADGE_DEFINITIONS } from "./constants";
import { PointsService } from "../points";

export class BadgeService {
  /**
   * Check all badge criteria for a user and award any newly earned badges.
   * Returns array of newly awarded badge names.
   */
  static async checkAndAwardBadges(userId: string): Promise<string[]> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        points: true,
        level: true,
        streak: true,
        longestStreak: true,
        totalPosts: true,
        totalComments: true,
        totalLikes: true,
        completedCourses: true,
        createdAt: true,
      },
    });
    if (!user) return [];

    // Get all badges from DB
    const allBadges = await db.badge.findMany();
    // Get user's already earned badges
    const earnedBadges = await db.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });
    const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badgeId));

    const newlyAwarded: string[] = [];

    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      const requirement = JSON.parse(badge.requirement);
      const earned = await this.checkRequirement(userId, user, requirement);

      if (earned) {
        await db.userBadge.create({
          data: { userId, badgeId: badge.id },
        });

        // Award bonus points for earning a badge
        await db.activityLog.create({
          data: {
            userId,
            type: "BADGE_EARNED",
            pointsEarned: badge.points,
            metadata: JSON.stringify({ badgeName: badge.name }),
          },
        });

        if (badge.points > 0) {
          await db.user.update({
            where: { id: userId },
            data: { points: { increment: badge.points } },
          });
        }

        newlyAwarded.push(badge.name);
      }
    }

    return newlyAwarded;
  }

  /**
   * Check if a specific requirement is met by the user.
   */
  static async checkRequirement(
    userId: string,
    user: any,
    requirement: { type: string; threshold: number }
  ): Promise<boolean> {
    switch (requirement.type) {
      case "post_count":
        return user.totalPosts >= requirement.threshold;

      case "comment_count":
        return user.totalComments >= requirement.threshold;

      case "like_given": {
        const likeCount = await db.like.count({ where: { userId } });
        return likeCount >= requirement.threshold;
      }

      case "total_likes_received":
        return user.totalLikes >= requirement.threshold;

      case "post_likes": {
        // Check if any single post has >= threshold likes
        const topPost = await db.post.findFirst({
          where: { authorId: userId },
          orderBy: { likesCount: "desc" },
          select: { likesCount: true },
        });
        return (topPost?.likesCount || 0) >= requirement.threshold;
      }

      case "streak_days":
        return Math.max(user.streak, user.longestStreak) >= requirement.threshold;

      case "course_enrolled": {
        const enrollments = await db.courseEnrollment.count({ where: { userId } });
        return enrollments >= requirement.threshold;
      }

      case "lesson_completed": {
        const lessons = await db.lessonProgress.count({
          where: { userId, completed: true },
        });
        return lessons >= requirement.threshold;
      }

      case "course_completed":
        return user.completedCourses >= requirement.threshold;

      case "reel_saved": {
        const reels = await db.savedReel.count({ where: { userId } });
        return reels >= requirement.threshold;
      }

      case "level_reached":
        return user.level >= requirement.threshold;

      case "points_reached":
        return user.points >= requirement.threshold;

      case "early_adopter": {
        // Joined within first 30 days of platform (consider platform start as earliest user)
        const daysSinceCreation = Math.floor(
          (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceCreation <= 30 || user.createdAt < new Date("2026-03-01");
      }

      case "night_post": {
        // Check if user has posted between 00:00 and 05:00
        const nightPosts = await db.post.findMany({
          where: { authorId: userId },
          select: { createdAt: true },
        });
        return nightPosts.some((p) => {
          const hour = new Date(p.createdAt).getHours();
          return hour >= 0 && hour < 5;
        });
      }

      case "badges_earned": {
        const badgeCount = await db.userBadge.count({ where: { userId } });
        return badgeCount >= requirement.threshold;
      }

      default:
        return false;
    }
  }

  /**
   * Get all badges with user's earned/locked status and progress.
   */
  static async getUserBadges(userId: string) {
    const allBadges = await db.badge.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    const earnedBadges = await db.userBadge.findMany({
      where: { userId },
      select: { badgeId: true, earnedAt: true },
    });
    const earnedMap = new Map(earnedBadges.map((b) => [b.badgeId, b.earnedAt]));

    return allBadges
      .filter((badge) => {
        // Show secret badges only if earned
        if (badge.isSecret && !earnedMap.has(badge.id)) return false;
        return true;
      })
      .map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        category: badge.category,
        points: badge.points,
        isSecret: badge.isSecret,
        earned: earnedMap.has(badge.id),
        earnedAt: earnedMap.get(badge.id)?.toISOString() || null,
      }));
  }
}
