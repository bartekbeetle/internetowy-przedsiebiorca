// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

// GET /api/tags/trending - top tags by usage
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await db.tag.findMany({
      where: { usageCount: { gt: 0 } },
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
    console.error("GET /api/tags/trending error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
