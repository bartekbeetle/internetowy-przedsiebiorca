"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Play, CheckCircle2, Clock, FileText, Video } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  duration: number;
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

interface CourseModuleAccordionProps {
  modules: Module[];
  courseSlug: string;
  isEnrolled: boolean;
}

function LessonTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "VIDEO":
      return <Video className="h-3.5 w-3.5" />;
    case "TEXT":
      return <FileText className="h-3.5 w-3.5" />;
    default:
      return <Play className="h-3.5 w-3.5" />;
  }
}

export function CourseModuleAccordion({
  modules,
  courseSlug,
  isEnrolled,
}: CourseModuleAccordionProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(modules.length > 0 ? [modules[0].id] : [])
  );

  function toggle(moduleId: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {modules.map((mod, idx) => {
        const isOpen = openModules.has(mod.id);
        const completedCount = mod.lessons.filter((l) => l.completed).length;
        const allCompleted = completedCount === mod.lessons.length && mod.lessons.length > 0;

        return (
          <div
            key={mod.id}
            className="border border-slate-700/50 rounded-lg overflow-hidden bg-brand-primary"
          >
            {/* Module header */}
            <button
              onClick={() => toggle(mod.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    allCompleted
                      ? "bg-green-500/20 text-green-400"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {allCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {completedCount}/{mod.lessons.length} lekcji
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Lessons list */}
            {isOpen && (
              <div className="border-t border-slate-700/50">
                {mod.lessons.map((lesson) => {
                  const content = (
                    <div
                      className={`flex items-center gap-3 px-4 py-3 text-sm ${
                        isEnrolled
                          ? "hover:bg-slate-800/50 cursor-pointer"
                          : "opacity-70"
                      } transition-colors`}
                    >
                      <span
                        className={`flex-shrink-0 ${
                          lesson.completed
                            ? "text-green-400"
                            : "text-slate-500"
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <LessonTypeIcon type={lesson.type} />
                        )}
                      </span>
                      <span
                        className={`flex-1 ${
                          lesson.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-300"
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {lesson.duration > 0 && (
                        <span className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}min
                        </span>
                      )}
                    </div>
                  );

                  if (isEnrolled) {
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return <div key={lesson.id}>{content}</div>;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
