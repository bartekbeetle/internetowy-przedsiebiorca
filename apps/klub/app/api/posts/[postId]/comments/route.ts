// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { createCommentSchema } from "@/lib/validations";
import { PointsService } from "@/lib/points";
import { BadgeService } from "@/lib/gamification/badge-service";
import { ChallengeService } from "@/lib/gamification/challenge-service";

// GET /api/posts/[postId]/comments - List comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await db.comment.findMany({
      where: { postId: params.postId, parentId: null },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, username: true, avatar: true, level: true },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, username: true, avatar: true, level: true },
            },
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET /api/posts/[postId]/comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts/[postId]/comments - Create a comment
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { content, parentId } = parsed.data;

    // Verify post exists
    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { id: true, authorId: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If replying, verify parent and limit nesting
    if (parentId) {
      const parent = await db.comment.findUnique({
        where: { id: parentId },
        select: { parentId: true },
      });
      if (!parent) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
      if (parent.parentId) {
        return NextResponse.json(
          { error: "Cannot nest replies more than 2 levels" },
          { status: 400 }
        );
      }
    }

    const userId = (session.user as { id: string }).id;

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        postId: params.postId,
        authorId: userId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true, level: true },
        },
      },
    });

    // Increment post comments count
    await db.post.update({
      where: { id: params.postId },
      data: { commentsCount: { increment: 1 } },
    });

    // Award points + gamification
    await PointsService.awardPoints(userId, "COMMENT_CREATED", { postId: params.postId });
    await db.user.update({ where: { id: userId }, data: { totalComments: { increment: 1 } } });
    await ChallengeService.updateProgress(userId, "COMMENT_CREATED");
    await BadgeService.checkAndAwardBadges(userId);

    // Check engagement bonus
    await PointsService.checkEngagementBonus(params.postId);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts/[postId]/comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
