"use client";

import Link from "next/link";
import { Award } from "lucide-react";

interface BadgeShowcaseProps {
  badges: {
    id: string;
    name: string;
    iconUrl: string;
    category: string;
    earnedAt?: string | Date;
  }[];
  maxDisplay?: number;
  totalBadges?: number;
}

export function BadgeShowcase({ badges, maxDisplay = 6, totalBadges }: BadgeShowcaseProps) {
  const displayBadges = badges.slice(0, maxDisplay);

  if (badges.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
        <Award className="h-8 w-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400">Brak odznak</p>
        <Link href="/badges" className="text-xs text-orange-400 hover:text-orange-300 mt-1 inline-block">
          Sprawdz dostepne odznaki
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Award className="h-4 w-4 text-orange-400" />
          Odznaki ({badges.length}{totalBadges ? `/${totalBadges}` : ""})
        </h3>
        <Link href="/badges" className="text-xs text-orange-400 hover:text-orange-300">
          Zobacz wszystkie
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {displayBadges.map((badge) => (
          <div
            key={badge.id}
            className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-xl hover:bg-slate-700 transition-colors cursor-default"
            title={badge.name}
          >
            {badge.iconUrl}
          </div>
        ))}
        {badges.length > maxDisplay && (
          <Link
            href="/badges"
            className="w-10 h-10 rounded-lg bg-slate-700/30 flex items-center justify-center text-xs text-slate-400 hover:bg-slate-700/50 transition-colors"
          >
            +{badges.length - maxDisplay}
          </Link>
        )}
      </div>
    </div>
  );
}
