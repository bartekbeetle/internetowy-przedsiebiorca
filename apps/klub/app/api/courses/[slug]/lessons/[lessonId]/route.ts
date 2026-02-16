// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";

// GET /api/courses/[slug]/lessons/[lessonId] - Full lesson detail
export async function GET(
  _req: Request,
  { params }: { params: { slug: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Verify the course exists and user is enrolled
    const course = await db.course.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        isPublished: true,
        title: true,
        slug: true,
        enrollments: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.enrollments.length === 0) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      );
    }

    // Get the lesson
    const lesson = await db.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        materials: { orderBy: { order: "asc" } },
        module: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
    });

    if (!lesson || !lesson.isPublished || lesson.module.courseId !== course.id) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Get user progress for this lesson
    const progress = await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId: lesson.id },
      },
      select: { completed: true, completedAt: true },
    });

    // Get user note for this lesson
    const note = await db.lessonNote.findUnique({
      where: {
        userId_lessonId: { userId, lessonId: lesson.id },
      },
      select: { content: true, updatedAt: true },
    });

    // Get all lessons in the course for prev/next navigation
    const allLessons = await db.lesson.findMany({
      where: {
        isPublished: true,
        module: { courseId: course.id },
      },
      orderBy: [
        { module: { order: "asc" } },
        { order: "asc" },
      ],
      select: { id: true, title: true, slug: true },
    });

    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;

    return NextResponse.json({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      type: lesson.type,
      order: lesson.order,
      module: lesson.module,
      materials: lesson.materials,
      completed: progress?.completed || false,
      completedAt: progress?.completedAt || null,
      note: note?.content || "",
      noteUpdatedAt: note?.updatedAt || null,
      course: { title: course.title, slug: course.slug },
      prevLesson,
      nextLesson,
      currentIndex: currentIndex + 1,
      totalLessons: allLessons.length,
    });
  } catch (error) {
    console.error("GET /api/courses/[slug]/lessons/[lessonId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
