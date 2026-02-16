// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

// GET /api/admin/stats - Dashboard stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [usersCount, postsCount, coursesCount, reelsCount] =
      await Promise.all([
        db.user.count(),
        db.post.count(),
        db.course.count(),
        db.reelInspiration.count(),
      ]);

    return NextResponse.json({
      users: usersCount,
      posts: postsCount,
      courses: coursesCount,
      reels: reelsCount,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
