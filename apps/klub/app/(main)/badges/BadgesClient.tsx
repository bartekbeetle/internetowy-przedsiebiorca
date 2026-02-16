"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { BadgeCard } from "@/components/gamification/BadgeCard";

interface BadgesClientProps {
  badges: any[];
  earnedCount: number;
  totalCount: number;
  categories: Record<string, { label: string; color: string; icon: string }>;
}

export function BadgesClient({ badges, earnedCount, totalCount, categories }: BadgesClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredBadges = activeCategory === "all"
    ? badges
    : badges.filter((b) => b.category === activeCategory);

  const categoryKeys = ["all", ...Object.keys(categories)];
  const categoryLabels: Record<string, string> = {
    all: "Wszystkie",
    ...Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, v.label])),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Award className="h-7 w-7 text-orange-500" />
        <h1 className="text-2xl font-bold text-white">Odznaki</h1>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Zdobyto {earnedCount} z {totalCount} odznak
      </p>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-orange-500 rounded-full transition-all"
          style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === key
                ? "bg-orange-500 text-white"
                : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            {key !== "all" && (
              <span className="mr-1">{categories[key]?.icon}</span>
            )}
            {categoryLabels[key]}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            name={badge.name}
            description={badge.description}
            iconUrl={badge.iconUrl}
            category={badge.category}
            earned={badge.earned}
            earnedAt={badge.earnedAt}
            isSecret={badge.isSecret}
            points={badge.points}
          />
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Brak odznak w tej kategorii</p>
        </div>
      )}
    </div>
  );
}
