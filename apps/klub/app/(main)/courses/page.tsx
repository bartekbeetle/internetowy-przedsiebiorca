// @ts-nocheck
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { CoursesListClient } from "./CoursesListClient";

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

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
      enrollments: userId
        ? { where: { userId }, select: { id: true, completedAt: true } }
        : false,
    },
  });

  let completedSet = new Set<string>();
  if (userId) {
    const lessonIds = courses.flatMap((c) =>
      c.modules.flatMap((m) => m.lessons.map((l) => l.id))
    );
    const completed = await db.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessonIds }, completed: true },
      select: { lessonId: true },
    });
    completedSet = new Set(completed.map((lp) => lp.lessonId));
  }

  const data = courses.map((course) => {
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const completedCount = allLessons.filter((l) => completedSet.has(l.id)).length;
    const totalDuration = allLessons.reduce((sum, l) => sum + (l.duration || 0), 0);
    const enrollments = course.enrollments || [];

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
      isEnrolled: enrollments.length > 0,
      progress: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
    };
  });

  return <CoursesListClient courses={data} />;
}
