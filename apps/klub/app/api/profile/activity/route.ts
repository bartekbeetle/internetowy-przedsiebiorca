// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      db.activityLog.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        select: {
          id: true,
          type: true,
          pointsEarned: true,
          metadata: true,
          createdAt: true,
        },
      }),
      db.activityLog.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      activities: activities.map((a) => ({
        ...a,
        metadata: a.metadata ? JSON.parse(a.metadata) : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Activity error:", error);
    return NextResponse.json(
      { error: "Nie udalo sie pobrac aktywnosci" },
      { status: 500 }
    );
  }
}
