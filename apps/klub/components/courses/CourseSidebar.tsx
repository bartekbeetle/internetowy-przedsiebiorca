"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Play,
  FileText,
  Video,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  type: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseSidebarProps {
  modules: Module[];
  courseSlug: string;
  courseTitle: string;
  currentLessonId: string;
  currentIndex: number;
  totalLessons: number;
}

function LessonTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "VIDEO":
      return <Video className="h-3 w-3" />;
    case "TEXT":
      return <FileText className="h-3 w-3" />;
    default:
      return <Play className="h-3 w-3" />;
  }
}

export function CourseSidebar({
  modules,
  courseSlug,
  courseTitle,
  currentLessonId,
  currentIndex,
  totalLessons,
}: CourseSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="h-full flex flex-col bg-brand-primary border-r border-slate-700/50">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <Link
          href={`/courses/${courseSlug}`}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ChevronLeft className="h-3 w-3" />
          Powrot do kursu
        </Link>
        <h2 className="text-sm font-semibold text-white line-clamp-2">
          {courseTitle}
        </h2>
        <p className="text-[11px] text-slate-500 mt-1">
          Lekcja {currentIndex} z {totalLessons}
        </p>
      </div>

      {/* Modules & Lessons */}
      <div className="flex-1 overflow-y-auto">
        {modules.map((mod) => (
          <div key={mod.id}>
            <div className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-800/30">
              {mod.title}
            </div>
            {mod.lessons.map((lesson) => {
              const isCurrent = lesson.id === currentLessonId;
              return (
                <Link
                  key={lesson.id}
                  href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors ${
                    isCurrent
                      ? "bg-orange-500/10 text-orange-400 border-l-2 border-orange-500"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent"
                  }`}
                >
                  <span className="flex-shrink-0">
                    {lesson.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <LessonTypeIcon type={lesson.type} />
                    )}
                  </span>
                  <span className="line-clamp-2">{lesson.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-40 p-3 rounded-full bg-orange-500 text-white shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 p-1 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">{sidebar}</div>
    </>
  );
}
