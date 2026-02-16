// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

// POST /api/reels/[reelId]/save - Toggle save on a reel
export async function POST(
  req: NextRequest,
  { params }: { params: { reelId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const reel = await db.reelInspiration.findUnique({
      where: { id: params.reelId },
      select: { id: true },
    });
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    const existingSave = await db.savedReel.findUnique({
      where: {
        userId_reelId: {
          userId,
          reelId: params.reelId,
        },
      },
    });

    if (existingSave) {
      await db.savedReel.delete({ where: { id: existingSave.id } });
      return NextResponse.json({ saved: false });
    } else {
      await db.savedReel.create({
        data: { userId, reelId: params.reelId },
      });

      // Award point for saving a reel
      await db.user.update({
        where: { id: userId },
        data: { points: { increment: 1 } },
      });

      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("POST /api/reels/[reelId]/save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
