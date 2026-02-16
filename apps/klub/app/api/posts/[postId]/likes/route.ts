// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { PointsService } from "@/lib/points";
import { BadgeService } from "@/lib/gamification/badge-service";
import { ChallengeService } from "@/lib/gamification/challenge-service";

// POST /api/posts/[postId]/likes - Toggle like on a post
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Verify post exists
    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { id: true, authorId: true, likesCount: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await db.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: params.postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await db.like.delete({ where: { id: existingLike.id } });
      const updated = await db.post.update({
        where: { id: params.postId },
        data: { likesCount: { decrement: 1 } },
        select: { likesCount: true },
      });

      // Remove points from post author
      if (post.authorId !== userId) {
        await db.user.update({
          where: { id: post.authorId },
          data: { points: { decrement: 3 } },
        });
      }

      return NextResponse.json({ liked: false, likesCount: updated.likesCount });
    } else {
      // Like
      await db.like.create({
        data: {
          userId,
          postId: params.postId,
        },
      });
      const updated = await db.post.update({
        where: { id: params.postId },
        data: { likesCount: { increment: 1 } },
        select: { likesCount: true },
      });

      // Award points + gamification
      if (post.authorId !== userId) {
        await PointsService.awardPoints(post.authorId, "LIKE_RECEIVED", { postId: params.postId });
        await PointsService.awardPoints(userId, "LIKE_GIVEN", { postId: params.postId });
        await db.user.update({ where: { id: post.authorId }, data: { totalLikes: { increment: 1 } } });
        await BadgeService.checkAndAwardBadges(post.authorId);
      }
      await ChallengeService.updateProgress(userId, "LIKE_GIVEN");
      await BadgeService.checkAndAwardBadges(userId);

      // Check milestones and engagement
      const milestone = await PointsService.checkMilestones(params.postId);
      await PointsService.checkEngagementBonus(params.postId);

      return NextResponse.json({
        liked: true,
        likesCount: updated.likesCount,
        milestone: milestone || null,
      });
    }
  } catch (error) {
    console.error("POST /api/posts/[postId]/likes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
