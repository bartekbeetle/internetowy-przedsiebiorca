// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

// GET /api/tags?search=cap - autocomplete tags
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where = search
      ? { name: { contains: search.toLowerCase() } }
      : {};

    const tags = await db.tag.findMany({
      where,
      orderBy: { usageCount: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        usageCount: true,
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
