// @ts-nocheck
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@repo/database";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit, getIpAddress, RateLimits } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(req: Request) {
  // Rate limiting - 5 requests per 15 minutes per IP
  const ip = getIpAddress(req);
  const rateLimitResult = rateLimit(`register:${ip}`, RateLimits.AUTH);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { email, password, username, name } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, haslo i username sa wymagane" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Haslo musi miec minimum 8 znakow" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username musi miec 3-20 znakow" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username moze zawierac tylko litery, cyfry i _" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? "Email jest juz zajety" : "Username jest juz zajety" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name: name || username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Save token to database
    await db.emailVerificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send verification email (non-blocking - don't fail registration if email fails)
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error("Verification email send error:", emailError);
      // Continue with registration - user can request new verification email later
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Wewnetrzny blad serwera" },
      { status: 500 }
    );
  }
}
