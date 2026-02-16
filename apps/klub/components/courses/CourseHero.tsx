import { Badge } from "@repo/ui";
import { Clock, BookOpen, BarChart3, Star, Users } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface CourseHeroProps {
  course: {
    title: string;
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
  };
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "Poczatkujacy", color: "bg-green-500/20 text-green-400" },
  INTERMEDIATE: { label: "Sredni", color: "bg-yellow-500/20 text-yellow-400" },
  ADVANCED: { label: "Zaawansowany", color: "bg-red-500/20 text-red-400" },
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function CourseHero({ course }: CourseHeroProps) {
  const diff = difficultyConfig[course.difficulty] || difficultyConfig.BEGINNER;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/50">
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${diff.color}`}>
            <BarChart3 className="h-3 w-3 inline mr-1" />
            {diff.label}
          </span>
          {course.isPremium && (
            <Badge className="bg-orange-500 text-white border-0 text-xs">
              <Star className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          {course.isCompleted && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Ukonczony
            </Badge>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {course.title}
        </h1>

        <p className="text-slate-400 text-sm md:text-base mb-6 max-w-2xl">
          {course.description}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-orange-400" />
            {course.totalLessons} lekcji
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-orange-400" />
            {formatDuration(course.totalDuration)}
          </span>
        </div>

        {/* Progress */}
        {course.isEnrolled && (
          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Postep</span>
              <span>
                {course.completedLessons}/{course.totalLessons} lekcji
              </span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        )}
      </div>
    </div>
  );
}
