"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface CoursesFilterProps {
  onFilterChange: (filters: {
    search: string;
    difficulty: string;
    premium: string;
  }) => void;
}

export function CoursesFilter({ onFilterChange }: CoursesFilterProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [premium, setPremium] = useState("ALL");

  function update(
    newSearch?: string,
    newDifficulty?: string,
    newPremium?: string
  ) {
    const s = newSearch ?? search;
    const d = newDifficulty ?? difficulty;
    const p = newPremium ?? premium;
    setSearch(s);
    setDifficulty(d);
    setPremium(p);
    onFilterChange({ search: s, difficulty: d, premium: p });
  }

  const btnClass = (active: boolean) =>
    `px-3 py-1.5 text-xs rounded-lg transition-colors ${
      active
        ? "bg-orange-500 text-white"
        : "bg-slate-800 text-slate-400 hover:text-white"
    }`;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Szukaj kursu..."
          value={search}
          onChange={(e) => update(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Difficulty filter */}
        <button className={btnClass(difficulty === "ALL")} onClick={() => update(undefined, "ALL")}>
          Wszystkie
        </button>
        <button className={btnClass(difficulty === "BEGINNER")} onClick={() => update(undefined, "BEGINNER")}>
          Poczatkujacy
        </button>
        <button className={btnClass(difficulty === "INTERMEDIATE")} onClick={() => update(undefined, "INTERMEDIATE")}>
          Sredni
        </button>
        <button className={btnClass(difficulty === "ADVANCED")} onClick={() => update(undefined, "ADVANCED")}>
          Zaawansowany
        </button>

        <div className="w-px h-6 bg-slate-700 self-center mx-1" />

        {/* Premium filter */}
        <button className={btnClass(premium === "ALL")} onClick={() => update(undefined, undefined, "ALL")}>
          Wszystkie
        </button>
        <button className={btnClass(premium === "FREE")} onClick={() => update(undefined, undefined, "FREE")}>
          Darmowe
        </button>
        <button className={btnClass(premium === "PREMIUM")} onClick={() => update(undefined, undefined, "PREMIUM")}>
          Premium
        </button>
      </div>
    </div>
  );
}
