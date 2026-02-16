"use client";

import { useState } from "react";
import { Trophy, Zap } from "lucide-react";
import { ChallengeCard } from "@/components/gamification/ChallengeCard";

interface ChallengesClientProps {
  challenges: any[];
  isLoggedIn: boolean;
}

export function ChallengesClient({ challenges, isLoggedIn }: ChallengesClientProps) {
  const [filter, setFilter] = useState<string>("all");

  const types = [
    { key: "all", label: "Wszystkie" },
    { key: "DAILY", label: "Dzienne" },
    { key: "WEEKLY", label: "Tygodniowe" },
    { key: "MONTHLY", label: "Miesieczne" },
    { key: "SPECIAL", label: "Specjalne" },
  ];

  const filtered = filter === "all"
    ? challenges
    : challenges.filter((c) => c.type === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="h-7 w-7 text-orange-500" />
        <h1 className="text-2xl font-bold text-white">Wyzwania</h1>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Podejmij wyzwania, zdobywaj punkty i odznaki!
      </p>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === t.key
                ? "bg-orange-500 text-white"
                : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Brak aktywnych wyzwan</p>
          <p className="text-sm text-slate-500 mt-1">Sprawdz ponownie pozniej!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((challenge) => (
            <ChallengeCard key={challenge.id} {...challenge} />
          ))}
        </div>
      )}
    </div>
  );
}
