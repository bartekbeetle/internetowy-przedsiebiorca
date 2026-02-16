// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@repo/database";
import { rateLimit, getIpAddress, RateLimits } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limiting - 100 requests per minute per IP (relaxed for verification)
  const ip = getIpAddress(req);
  const rateLimitResult = rateLimit(`verify-email:${ip}`, RateLimits.API);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token jest wymagany" },
        { status: 400 }
      );
    }

    // Find token in database
    const verificationToken = await db.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Check if token exists
    if (!verificationToken) {
      return NextResponse.json(
        { error: "Nieprawidłowy token weryfikacyjny" },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (new Date() > verificationToken.expiresAt) {
      // Delete expired token
      await db.emailVerificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Link weryfikacyjny wygasł. Skontaktuj się z supportem." },
        { status: 400 }
      );
    }

    // Check if email is already verified
    if (verificationToken.user.emailVerified) {
      // Delete token as it's no longer needed
      await db.emailVerificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Email jest już zweryfikowany" },
        { status: 400 }
      );
    }

    // Update user's emailVerified field
    await db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await db.emailVerificationToken.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
      message: "Email został zweryfikowany",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Coś poszło nie tak" },
      { status: 500 }
    );
  }
}
