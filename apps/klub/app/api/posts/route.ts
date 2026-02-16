// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { createPostSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/slug";
import { PointsService } from "@/lib/points";
import { BadgeService } from "@/lib/gamification/badge-service";
import { ChallengeService } from "@/lib/gamification/challenge-service";

// GET /api/posts - List posts with pagination and filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const subCategoryId = searchParams.get("subCategoryId");
    const mainCategorySlug = searchParams.get("mainCategory");
    const tagSlug = searchParams.get("tag");
    const sort = searchParams.get("sort") || "newest";
    const userId = (session.user as { id?: string }).id;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (subCategoryId) where.subCategoryId = subCategoryId;
    if (mainCategorySlug) {
      where.subCategory = {
        mainCategory: { slug: mainCategorySlug },
      };
    }
    if (tagSlug) {
      where.tags = {
        some: { tag: { slug: tagSlug } },
      };
    }

    const orderBy =
      sort === "popular"
        ? { likesCount: "desc" as const }
        : { createdAt: "desc" as const };

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, orderBy],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { id: true, username: true, avatar: true, level: true },
          },
          subCategory: {
            select: {
              id: true,
              name: true,
              slug: true,
              mainCategory: {
                select: { id: true, name: true, slug: true, icon: true, color: true },
              },
            },
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: { select: { comments: true } },
          likes: userId ? { where: { userId }, select: { id: true } } : false,
        },
      }),
      db.post.count({ where }),
    ]);

    return NextResponse.json({
      posts: posts.map((post) => ({
        ...post,
        tags: post.tags.map((pt) => pt.tag),
        isLiked: Array.isArray(post.likes) && post.likes.length > 0,
        likes: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, content, type, subCategoryId, tagIds, imageUrl } = parsed.data;
    const userId = (session.user as { id: string }).id;
    const slug = generateSlug(title);

    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        type,
        subCategoryId,
        authorId: userId,
        imageUrl: imageUrl || null,
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true, level: true },
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            mainCategory: {
              select: { id: true, name: true, slug: true, icon: true, color: true },
            },
          },
        },
      },
    });

    // Create tag associations
    if (tagIds && tagIds.length > 0) {
      await db.postTag.createMany({
        data: tagIds.map((tagId) => ({ postId: post.id, tagId })),
      });
      for (const tagId of tagIds) {
        await db.tag.update({
          where: { id: tagId },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    // Award points + gamification
    await PointsService.awardPoints(userId, "POST_CREATED", { postId: post.id });
    await db.user.update({ where: { id: userId }, data: { totalPosts: { increment: 1 } } });
    await ChallengeService.updateProgress(userId, "POST_CREATED");
    await BadgeService.checkAndAwardBadges(userId);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
