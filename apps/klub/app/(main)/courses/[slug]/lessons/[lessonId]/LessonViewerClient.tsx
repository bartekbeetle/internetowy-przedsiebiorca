"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
} from "lucide-react";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { LessonContent } from "@/components/courses/LessonContent";
import { LessonNotes } from "@/components/courses/LessonNotes";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { CompletionCelebration } from "@/components/courses/CompletionCelebration";

interface Material {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
}

interface LessonData {
  id: string;
  title: string;
  content: string;
  videoUrl?: string | null;
  duration: number;
  type: string;
  module: { id: string; title: string };
  materials: Material[];
  completed: boolean;
  note: string;
}

interface NavLesson {
  id: string;
  title: string;
}

interface SidebarModule {
  id: string;
  title: string;
  lessons: { id: string; title: string; type: string; completed: boolean }[];
}

interface LessonViewerClientProps {
  lesson: LessonData;
  course: { title: string; slug: string };
  modules: SidebarModule[];
  prevLesson: NavLesson | null;
  nextLesson: NavLesson | null;
  currentIndex: number;
  totalLessons: number;
}

export function LessonViewerClient({
  lesson,
  course,
  modules,
  prevLesson,
  nextLesson,
  currentIndex,
  totalLessons,
}: LessonViewerClientProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(lesson.completed);
  const [completing, setCompleting] = useState(false);
  const [celebration, setCelebration] = useState<{
    type: "lesson" | "course";
    show: boolean;
  }>({ type: "lesson", show: false });

  async function handleComplete() {
    if (completed || completing) return;
    setCompleting(true);
    try {
      const res = await fetch(
        `/api/courses/${course.slug}/lessons/${lesson.id}/complete`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        setCompleted(true);
        if (data.courseCompleted) {
          setCelebration({ type: "course", show: true });
        } else {
          setCelebration({ type: "lesson", show: true });
        }
      }
    } catch {
      // silent
    } finally {
      setCompleting(false);
    }
  }

  const handleCelebrationClose = useCallback(() => {
    setCelebration((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <div className="flex min-h-screen">
      <CourseSidebar
        modules={modules}
        courseSlug={course.slug}
        courseTitle={course.title}
        currentLessonId={lesson.id}
        currentIndex={currentIndex}
        totalLessons={totalLessons}
      />

      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="text-xs text-slate-500 mb-4">
            <span>{lesson.module.title}</span>
            <span className="mx-2">›</span>
            <span className="text-slate-300">Lekcja {currentIndex}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-white mb-6">
            {lesson.title}
          </h1>

          {/* Video */}
          {lesson.videoUrl && (
            <div className="mb-8">
              <VideoPlayer url={lesson.videoUrl} onEnded={handleComplete} />
            </div>
          )}

          {/* Content */}
          <div className="mb-8">
            <LessonContent content={lesson.content} />
          </div>

          {/* Materials */}
          {lesson.materials.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-8">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Download className="h-4 w-4 text-orange-400" />
                Materialy do pobrania
              </h3>
              <div className="space-y-2">
                {lesson.materials.map((mat) => (
                  <a
                    key={mat.id}
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{mat.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {mat.fileType}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-8">
            <LessonNotes
              courseSlug={course.slug}
              lessonId={lesson.id}
              initialContent={lesson.note}
            />
          </div>

          {/* Complete button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleComplete}
              disabled={completed || completing}
              className={`inline-flex items-center gap-2 h-11 px-6 rounded-lg font-semibold transition-colors ${
                completed
                  ? "bg-green-600/20 text-green-400 border border-green-600/30 cursor-default"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {completed
                ? "Ukonczona"
                : completing
                ? "Oznaczanie..."
                : "Oznacz jako ukonczone"}
            </button>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between border-t border-slate-700/50 pt-6">
            {prevLesson ? (
              <Link
                href={`/courses/${course.slug}/lessons/${prevLesson.id}`}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <div>
                  <p className="text-[11px] text-slate-500">Poprzednia</p>
                  <p className="line-clamp-1">{prevLesson.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link
                href={`/courses/${course.slug}/lessons/${nextLesson.id}`}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors text-right"
              >
                <div>
                  <p className="text-[11px] text-slate-500">Nastepna</p>
                  <p className="line-clamp-1">{nextLesson.title}</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <CompletionCelebration
        type={celebration.type}
        show={celebration.show}
        onClose={handleCelebrationClose}
        pointsEarned={celebration.type === "course" ? 20 : 5}
      />
    </div>
  );
}
