"use client";

import Link from "next/link";
import { Badge } from "@repo/ui";
import { Clock, BookOpen, Star } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail?: string | null;
    difficulty: string;
    isPremium: boolean;
    modulesCount: number;
    lessonsCount: number;
    totalDuration: number;
    isEnrolled: boolean;
    progress: number;
  };
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "Poczatkujacy", color: "bg-green-500/20 text-green-400" },
  INTERMEDIATE: { label: "Sredni", color: "bg-yellow-500/20 text-yellow-400" },
  ADVANCED: { label: "Zaawansowany", color: "bg-red-500/20 text-red-400" },
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function CourseCard({ course }: CourseCardProps) {
  const diff = difficultyConfig[course.difficulty] || difficultyConfig.BEGINNER;

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="bg-brand-primary border border-slate-700/50 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-slate-600" />
            </div>
          )}
          {course.isPremium && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-orange-500 text-white border-0 text-[10px] px-2">
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diff.color}`}>
              {diff.label}
            </span>
          </div>

          <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-2 group-hover:text-orange-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.lessonsCount} lekcji
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(course.totalDuration)}
            </span>
          </div>

          {/* Progress */}
          {course.isEnrolled && (
            <ProgressBar value={course.progress} size="sm" />
          )}
        </div>
      </div>
    </Link>
  );
}
