// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatar, bio } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Imię jest wymagane (min. 2 znaki)" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        avatar: avatar || null,
        bio: bio?.trim() || null,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
