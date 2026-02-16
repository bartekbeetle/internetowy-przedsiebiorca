// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@repo/database";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit, getIpAddress, RateLimits } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(req: Request) {
  // Rate limiting - 3 requests per hour per IP
  const ip = getIpAddress(req);
  const rateLimitResult = rateLimit(`forgot-password:${ip}`, RateLimits.PASSWORD_RESET);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { email } = await req.json();

    // Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email jest wymagany" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // SECURITY: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Jeśli konto istnieje, email został wysłany"
      });
    }

    // Delete any existing reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Save token to database
    await db.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send email with reset link
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Delete the token if email fails
      await db.passwordResetToken.delete({
        where: { token: resetToken },
      });
      return NextResponse.json(
        { error: "Nie udało się wysłać emaila. Spróbuj ponownie." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email z linkiem resetującym został wysłany",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Coś poszło nie tak" },
      { status: 500 }
    );
  }
}
