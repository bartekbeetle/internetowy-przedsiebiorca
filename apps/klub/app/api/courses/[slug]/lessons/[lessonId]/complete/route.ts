// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { PointsService } from "@/lib/points";
import { BadgeService } from "@/lib/gamification/badge-service";
import { ChallengeService } from "@/lib/gamification/challenge-service";

// POST /api/courses/[slug]/lessons/[lessonId]/complete - Mark lesson as completed
export async function POST(
  _req: Request,
  { params }: { params: { slug: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Verify course + enrollment
    const course = await db.course.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        enrollments: {
          where: { userId },
          select: { id: true, completedAt: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.enrollments.length === 0) {
      return NextResponse.json(
        { error: "Not enrolled" },
        { status: 403 }
      );
    }

    // Verify lesson belongs to course
    const lesson = await db.lesson.findUnique({
      where: { id: params.lessonId },
      select: {
        id: true,
        module: { select: { courseId: true } },
      },
    });

    if (!lesson || lesson.module.courseId !== course.id) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Upsert lesson progress
    const progress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId: lesson.id },
      },
      create: {
        userId,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
    });

    // Award points for lesson completion (only if first time)
    const existingLog = await db.activityLog.findFirst({
      where: {
        userId,
        type: "LESSON_COMPLETED",
        metadata: { contains: `"lessonId":"${lesson.id}"` },
      },
    });

    if (!existingLog) {
      await PointsService.awardPoints(userId, "LESSON_COMPLETED", {
        lessonId: lesson.id,
      });
      await ChallengeService.updateProgress(userId, "LESSON_COMPLETED");
      await BadgeService.checkAndAwardBadges(userId);
    }

    // Check if entire course is now completed
    const allLessons = await db.lesson.findMany({
      where: {
        isPublished: true,
        module: { courseId: course.id },
      },
      select: { id: true },
    });

    const completedLessons = await db.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: allLessons.map((l) => l.id) },
        completed: true,
      },
    });

    let courseCompleted = false;
    if (completedLessons.length === allLessons.length) {
      // All lessons completed - mark course as completed
      const enrollment = course.enrollments[0];
      if (!enrollment.completedAt) {
        await db.courseEnrollment.update({
          where: { id: enrollment.id },
          data: { completedAt: new Date() },
        });

        await PointsService.awardPoints(userId, "COURSE_COMPLETED", {
          courseId: course.id,
        });
        await db.user.update({ where: { id: userId }, data: { completedCourses: { increment: 1 } } });
        await ChallengeService.updateProgress(userId, "COURSE_COMPLETED");
        await BadgeService.checkAndAwardBadges(userId);

        courseCompleted = true;
      }
    }

    return NextResponse.json({
      completed: true,
      completedAt: progress.completedAt,
      courseCompleted,
      progressCount: completedLessons.length,
      totalLessons: allLessons.length,
    });
  } catch (error) {
    console.error("POST lesson complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
