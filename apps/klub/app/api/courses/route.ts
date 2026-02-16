// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { createCourseSchema } from "@/lib/validations";

// GET /api/courses - List all published courses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const courses = await db.course.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true, duration: true },
            },
          },
        },
        enrollments: {
          where: { userId },
          select: { id: true, enrolledAt: true, completedAt: true },
        },
      },
    });

    const lessonIds = courses.flatMap((c) =>
      c.modules.flatMap((m) => m.lessons.map((l) => l.id))
    );

    const completedLessons = await db.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
        completed: true,
      },
      select: { lessonId: true },
    });
    const completedSet = new Set(completedLessons.map((lp) => lp.lessonId));

    return NextResponse.json(
      courses.map((course) => {
        const allLessons = course.modules.flatMap((m) => m.lessons);
        const totalLessons = allLessons.length;
        const completedCount = allLessons.filter((l) =>
          completedSet.has(l.id)
        ).length;
        const totalDuration = allLessons.reduce(
          (sum, l) => sum + (l.duration || 0),
          0
        );

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnail: course.thumbnail,
          difficulty: course.difficulty,
          isPremium: course.isPremium,
          modulesCount: course.modules.length,
          lessonsCount: totalLessons,
          totalDuration,
          isEnrolled: course.enrollments.length > 0,
          isCompleted: course.enrollments[0]?.completedAt != null,
          progress:
            totalLessons > 0
              ? Math.round((completedCount / totalLessons) * 100)
              : 0,
        };
      })
    );
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create course (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createCourseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, difficulty, isPremium } = parsed.data;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const course = await db.course.create({
      data: {
        title,
        slug,
        description,
        difficulty: difficulty || "BEGINNER",
        isPremium: isPremium || false,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("POST /api/courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
