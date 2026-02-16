// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { BadgeService } from "@/lib/gamification/badge-service";

// POST /api/courses/[slug]/enroll - Enroll in a course
export async function POST(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const course = await db.course.findUnique({
      where: { slug: params.slug },
      select: { id: true, isPublished: true },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Idempotent: return existing enrollment if already enrolled
    const existing = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: course.id },
      },
    });

    if (existing) {
      return NextResponse.json({
        enrolled: true,
        enrolledAt: existing.enrolledAt,
      });
    }

    const enrollment = await db.courseEnrollment.create({
      data: {
        userId,
        courseId: course.id,
      },
    });

    // Check badges (e.g. "student" badge for first enrollment)
    await BadgeService.checkAndAwardBadges(userId);

    return NextResponse.json(
      { enrolled: true, enrolledAt: enrollment.enrolledAt },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/courses/[slug]/enroll error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
