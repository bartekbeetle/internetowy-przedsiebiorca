// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

// GET /api/reels - List reels with filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const niche = searchParams.get("niche");
    const search = searchParams.get("search");
    const saved = searchParams.get("saved") === "true";
    const userId = (session.user as { id: string }).id;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (niche) where.niche = { contains: niche };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }
    if (saved) {
      where.savedBy = { some: { userId } };
    }

    const reels = await db.reelInspiration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        savedBy: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    return NextResponse.json(
      reels.map((reel) => ({
        ...reel,
        isSaved: reel.savedBy.length > 0,
        savedBy: undefined,
      }))
    );
  } catch (error) {
    console.error("GET /api/reels error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/reels - Create reel (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, thumbnail, sourceUrl, category, niche, script, tags } =
      body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const reel = await db.reelInspiration.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        thumbnailUrl: thumbnail || "/placeholder.jpg",
        videoUrl: sourceUrl,
        category: category || "EDUCATIONAL",
        niche: niche?.trim() || "",
        script: script?.trim() || "",
        tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
      },
    });

    return NextResponse.json(reel, { status: 201 });
  } catch (error) {
    console.error("POST /api/reels error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
