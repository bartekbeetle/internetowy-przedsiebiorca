// @ts-nocheck
import { db } from "@repo/database";
import { redirect, notFound } from "next/navigation";

// Redirect old module URLs to the first lesson of that module
export default async function ModuleRedirectPage({
  params,
}: {
  params: { slug: string; moduleId: string };
}) {
  const mod = await db.module.findUnique({
    where: { id: params.moduleId },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        take: 1,
        select: { id: true },
      },
      course: { select: { slug: true } },
    },
  });

  if (!mod || mod.course.slug !== params.slug) {
    notFound();
  }

  if (mod.lessons.length > 0) {
    redirect(`/courses/${params.slug}/lessons/${mod.lessons[0].id}`);
  }

  redirect(`/courses/${params.slug}`);
}
