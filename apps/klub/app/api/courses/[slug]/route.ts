// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

// GET /api/courses/[slug] - Full course detail
export async function GET(
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
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                slug: true,
                duration: true,
                order: true,
                type: true,
                videoUrl: true,
              },
            },
          },
        },
        enrollments: {
          where: { userId },
          select: { id: true, enrolledAt: true, completedAt: true },
        },
      },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get user's lesson progress for this course
    const allLessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );

    const lessonProgress = await db.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: allLessonIds },
      },
      select: { lessonId: true, completed: true },
    });
    const progressMap = new Map(
      lessonProgress.map((lp) => [lp.lessonId, lp.completed])
    );

    const totalLessons = allLessonIds.length;
    const completedLessons = lessonProgress.filter((lp) => lp.completed).length;
    const totalDuration = course.modules
      .flatMap((m) => m.lessons)
      .reduce((sum, l) => sum + (l.duration || 0), 0);

    const enrollment = course.enrollments[0] || null;

    return NextResponse.json({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnail: course.thumbnail,
      difficulty: course.difficulty,
      isPremium: course.isPremium,
      totalLessons,
      completedLessons,
      totalDuration,
      progress:
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0,
      isEnrolled: enrollment != null,
      isCompleted: enrollment?.completedAt != null,
      enrolledAt: enrollment?.enrolledAt || null,
      modules: course.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons: mod.lessons.map((lesson) => ({
          ...lesson,
          completed: progressMap.get(lesson.id) || false,
        })),
      })),
    });
  } catch (error) {
    console.error("GET /api/courses/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
