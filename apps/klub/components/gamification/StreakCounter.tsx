"use client";

import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  longestStreak?: number;
  compact?: boolean;
}

export function StreakCounter({ streak, longestStreak, compact = false }: StreakCounterProps) {
  const isActive = streak > 0;

  if (compact) {
    return (
      <div className="flex items-center gap-1" title={`Streak: ${streak} dni`}>
        <Flame className={`h-4 w-4 ${isActive ? "text-orange-400" : "text-slate-600"}`} />
        <span className={`text-sm font-medium ${isActive ? "text-orange-400" : "text-slate-600"}`}>
          {streak}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isActive ? "bg-orange-500/20" : "bg-slate-700/50"
        }`}>
          <Flame className={`h-5 w-5 ${isActive ? "text-orange-400" : "text-slate-600"}`} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{streak}</div>
          <div className="text-xs text-slate-400">
            {streak === 1 ? "dzien z rzedu" : "dni z rzedu"}
          </div>
        </div>
      </div>
      {longestStreak !== undefined && (
        <div className="text-xs text-slate-500">
          Najdluzszy streak: <span className="text-slate-400 font-medium">{longestStreak} dni</span>
        </div>
      )}
    </div>
  );
}
