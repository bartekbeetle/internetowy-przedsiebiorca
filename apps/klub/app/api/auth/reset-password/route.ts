// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@repo/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token i hasło są wymagane" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Hasło musi mieć minimum 8 znaków" },
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
        { error: "Nieprawidłowy lub wygasły token" },
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
        { error: "Link wygasł. Wygeneruj nowy link." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete used token
    await db.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
      message: "Hasło zostało zmienione",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Coś poszło nie tak" },
      { status: 500 }
    );
  }
}
