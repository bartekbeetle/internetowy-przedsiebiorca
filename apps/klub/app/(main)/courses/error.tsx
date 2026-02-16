"use client";

import { AlertTriangle } from "lucide-react";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">
        Cos poszlo nie tak
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Nie udalo sie zaladowac kursow. Sprobuj ponownie.
      </p>
      <button
        onClick={reset}
        className="h-10 px-6 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
      >
        Sprobuj ponownie
      </button>
    </div>
  );
}
