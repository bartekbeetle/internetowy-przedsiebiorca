// @ts-nocheck
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { notFound, redirect } from "next/navigation";
import { LessonViewerClient } from "./LessonViewerClient";

export default async function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

  if (!userId) redirect("/login");

  // Get course + verify enrollment
  const course = await db.course.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
      enrollments: {
        where: { userId },
        select: { id: true },
      },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { order: "asc" },
            select: { id: true, title: true, type: true },
          },
        },
      },
    },
  });

  if (!course || !course.isPublished) notFound();

  // If not enrolled, redirect to course page
  if (course.enrollments.length === 0) {
    redirect(`/courses/${params.slug}`);
  }

  // Get the lesson
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      materials: { orderBy: { order: "asc" } },
      module: { select: { id: true, title: true, courseId: true } },
    },
  });

  if (!lesson || !lesson.isPublished || lesson.module.courseId !== course.id) {
    notFound();
  }

  // Get progress + note
  const [progress, note] = await Promise.all([
    db.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      select: { completed: true },
    }),
    db.lessonNote.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      select: { content: true },
    }),
  ]);

  // Build flat lesson list for navigation + progress
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Get completion status for all lessons (for sidebar)
  const allProgress = await db.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessons.map((l) => l.id) },
      completed: true,
    },
    select: { lessonId: true },
  });
  const completedSet = new Set(allProgress.map((p) => p.lessonId));

  // Build modules with completion for sidebar
  const sidebarModules = course.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    lessons: mod.lessons.map((l) => ({
      ...l,
      completed: completedSet.has(l.id),
    })),
  }));

  return (
    <LessonViewerClient
      lesson={{
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        type: lesson.type,
        module: lesson.module,
        materials: lesson.materials,
        completed: progress?.completed || false,
        note: note?.content || "",
      }}
      course={{ title: course.title, slug: course.slug }}
      modules={sidebarModules}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      currentIndex={currentIndex + 1}
      totalLessons={allLessons.length}
    />
  );
}
