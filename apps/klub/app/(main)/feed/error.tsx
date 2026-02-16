"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function FeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Feed error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-4xl mb-4">😵</div>
      <h2 className="text-xl font-bold text-white mb-2">Cos poszlo nie tak</h2>
      <p className="text-slate-400 mb-6">
        Nie udalo sie zaladowac feedu. Sprobuj ponownie.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="h-10 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
        >
          Sprobuj ponownie
        </button>
        <Link
          href="/"
          className="h-10 px-4 inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
        >
          Strona glowna
        </Link>
      </div>
    </div>
  );
}
