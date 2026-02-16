// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@repo/database";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token jest wymagany" },
        { status: 400 }
      );
    }

    // Find token in database
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Check if token exists
    if (!resetToken) {
      return NextResponse.json(
        { error: "Nieprawidłowy token" },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      // Delete expired token
      await db.passwordResetToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Token wygasł" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Coś poszło nie tak" },
      { status: 500 }
    );
  }
}
