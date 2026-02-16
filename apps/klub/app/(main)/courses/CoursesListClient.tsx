"use client";

import { useState, useMemo } from "react";
import { GraduationCap } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { CoursesFilter } from "@/components/courses/CoursesFilter";

interface Course {
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
}

interface CoursesListClientProps {
  courses: Course[];
}

export function CoursesListClient({ courses }: CoursesListClientProps) {
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "ALL",
    premium: "ALL",
  });

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (
        filters.search &&
        !c.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !c.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.difficulty !== "ALL" && c.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.premium === "FREE" && c.isPremium) return false;
      if (filters.premium === "PREMIUM" && !c.isPremium) return false;
      return true;
    });
  }, [courses, filters]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Kursy</h1>
          <p className="text-sm text-slate-400">
            Ucz sie krok po kroku i zdobywaj punkty
          </p>
        </div>
      </div>

      <CoursesFilter onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <GraduationCap className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">Brak kursow pasujacych do filtrow</p>
        </div>
      )}
    </div>
  );
}
