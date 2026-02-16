"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, BookOpen } from "lucide-react";
import { CourseHero } from "@/components/courses/CourseHero";
import { CourseModuleAccordion } from "@/components/courses/CourseModuleAccordion";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  duration: number;
  order: number;
  type: string;
  videoUrl?: string | null;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string | null;
  difficulty: string;
  isPremium: boolean;
  totalLessons: number;
  completedLessons: number;
  totalDuration: number;
  progress: number;
  isEnrolled: boolean;
  isCompleted: boolean;
  modules: Module[];
}

interface CourseDetailClientProps {
  course: CourseData;
  firstIncompleteLessonId: string | null;
  firstLessonId: string | null;
}

export function CourseDetailClient({
  course,
  firstIncompleteLessonId,
  firstLessonId,
}: CourseDetailClientProps) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${course.slug}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        // Navigate to first lesson
        const targetLesson = firstLessonId;
        if (targetLesson) {
          router.push(`/courses/${course.slug}/lessons/${targetLesson}`);
        } else {
          router.refresh();
        }
      }
    } catch {
      // silent
    } finally {
      setEnrolling(false);
    }
  }

  function handleContinue() {
    const target = firstIncompleteLessonId || firstLessonId;
    if (target) {
      router.push(`/courses/${course.slug}/lessons/${target}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Wszystkie kursy
      </Link>

      <CourseHero course={course} />

      {/* CTA Button */}
      <div className="mt-6 mb-8">
        {!course.isEnrolled ? (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white transition-colors"
          >
            <Play className="h-4 w-4" />
            {enrolling ? "Zapisywanie..." : "Rozpocznij kurs"}
          </button>
        ) : !course.isCompleted ? (
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Kontynuuj nauke
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Przejrzyj ponownie
          </button>
        )}
      </div>

      {/* Modules */}
      <h2 className="text-lg font-semibold text-white mb-4">
        Program kursu
      </h2>
      <CourseModuleAccordion
        modules={course.modules}
        courseSlug={course.slug}
        isEnrolled={course.isEnrolled}
      />
    </div>
  );
}
