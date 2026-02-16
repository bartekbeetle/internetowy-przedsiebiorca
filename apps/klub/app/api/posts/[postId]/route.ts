// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { updatePostSchema } from "@/lib/validations";

// GET /api/posts/[postId] - Get single post
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const post = await db.post.findUnique({
      where: { id: params.postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            level: true,
            points: true,
          },
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
        likes: { where: { userId }, select: { id: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count
    await db.post.update({
      where: { id: params.postId },
      data: { viewsCount: { increment: 1 } },
    });

    return NextResponse.json({
      ...post,
      tags: post.tags.map((pt) => pt.tag),
      viewsCount: post.viewsCount + 1,
      isLiked: post.likes.length > 0,
      likes: undefined,
    });
  } catch (error) {
    console.error("GET /api/posts/[postId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[postId] - Update post
export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const userRole = (session.user as { role?: string }).role;

    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updatePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, content, type, subCategoryId, tagIds, imageUrl } = parsed.data;

    const updated = await db.post.update({
      where: { id: params.postId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(type && { type }),
        ...(subCategoryId && { subCategoryId }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      },
    });

    // Update tags if provided
    if (tagIds) {
      await db.postTag.deleteMany({ where: { postId: params.postId } });
      if (tagIds.length > 0) {
        await db.postTag.createMany({
          data: tagIds.map((tagId) => ({ postId: params.postId, tagId })),
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/posts/[postId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[postId] - Delete post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const userRole = (session.user as { role?: string }).role;

    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.post.delete({ where: { id: params.postId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/posts/[postId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
