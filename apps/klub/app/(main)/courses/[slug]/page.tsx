// @ts-nocheck
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { notFound } from "next/navigation";
import { CourseDetailClient } from "./CourseDetailClient";

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

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
      enrollments: userId
        ? { where: { userId }, select: { id: true, enrolledAt: true, completedAt: true } }
        : false,
    },
  });

  if (!course || !course.isPublished) {
    notFound();
  }

  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  let progressMap = new Map<string, boolean>();

  if (userId) {
    const progress = await db.lessonProgress.findMany({
      where: { userId, lessonId: { in: allLessonIds } },
      select: { lessonId: true, completed: true },
    });
    progressMap = new Map(progress.map((p) => [p.lessonId, p.completed]));
  }

  const totalLessons = allLessonIds.length;
  const completedLessons = Array.from(progressMap.values()).filter(Boolean).length;
  const enrollments = course.enrollments || [];
  const enrollment = enrollments[0] || null;

  const data = {
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnail: course.thumbnail,
    difficulty: course.difficulty,
    isPremium: course.isPremium,
    totalLessons,
    completedLessons,
    totalDuration: course.modules
      .flatMap((m) => m.lessons)
      .reduce((sum, l) => sum + (l.duration || 0), 0),
    progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    isEnrolled: enrollment != null,
    isCompleted: enrollment?.completedAt != null,
    modules: course.modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      order: mod.order,
      lessons: mod.lessons.map((l) => ({
        ...l,
        completed: progressMap.get(l.id) || false,
      })),
    })),
  };

  // Find first incomplete lesson for "Continue" button
  let firstIncompleteLessonId: string | null = null;
  for (const mod of data.modules) {
    for (const lesson of mod.lessons) {
      if (!lesson.completed) {
        firstIncompleteLessonId = lesson.id;
        break;
      }
    }
    if (firstIncompleteLessonId) break;
  }

  // Fallback: first lesson
  const firstLessonId = data.modules[0]?.lessons[0]?.id || null;

  return (
    <CourseDetailClient
      course={data}
      firstIncompleteLessonId={firstIncompleteLessonId}
      firstLessonId={firstLessonId}
    />
  );
}
