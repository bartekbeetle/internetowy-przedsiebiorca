import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const mockCourses = [
  { id: "1", title: "Faceless od zera", slug: "faceless-od-zera", isPublished: true, isPremium: false, modulesCount: 5, enrolledCount: 12 },
  { id: "2", title: "Zaawansowane strategie wzrostu", slug: "zaawansowane-strategie", isPublished: false, isPremium: true, modulesCount: 8, enrolledCount: 0 },
];

export default function AdminCoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Kursy</h2>
        <button className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          Nowy kurs
        </button>
      </div>

      <div className="space-y-4">
        {mockCourses.map((course) => (
          <div
            key={course.id}
            className="bg-brand-secondary border border-slate-700 rounded-lg p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{course.title}</h3>
                  {course.isPremium && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500 text-white">
                      PREMIUM
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    course.isPublished
                      ? "bg-green-600/20 text-green-400"
                      : "bg-slate-600/20 text-slate-400"
                  }`}>
                    {course.isPublished ? "Opublikowany" : "Szkic"}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {course.modulesCount} modulow · {course.enrolledCount} zapisanych
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-slate-500 hover:text-white transition-colors" title="Edytuj">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="text-slate-500 hover:text-white transition-colors" title={course.isPublished ? "Ukryj" : "Publikuj"}>
                  {course.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
