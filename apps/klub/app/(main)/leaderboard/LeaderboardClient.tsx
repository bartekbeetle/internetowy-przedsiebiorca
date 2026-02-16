"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Flame } from "lucide-react";
import { LevelBadge } from "@/components/gamification/LevelBadge";

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  points: number;
  level: number;
  streak: number;
  levelInfo: { name: string; color: string; icon: string };
  isCurrentUser: boolean;
}

interface LeaderboardClientProps {
  entries: LeaderboardEntry[];
}

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
};

export function LeaderboardClient({ entries }: LeaderboardClientProps) {
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");

  const periods = [
    { key: "all" as const, label: "Wszech czasow" },
    { key: "month" as const, label: "Miesiac" },
    { key: "week" as const, label: "Tydzien" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="h-7 w-7 text-orange-500" />
        <h1 className="text-2xl font-bold text-white">Ranking</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p.key
                ? "bg-orange-500 text-white"
                : "bg-brand-secondary text-slate-300 border border-slate-700 hover:border-slate-600"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Leaderboard table */}
      <div className="bg-brand-secondary border border-slate-700 rounded-lg overflow-hidden">
        {entries.length === 0 && (
          <div className="px-5 py-8 text-center text-slate-500 text-sm">
            Brak uzytkownikow w rankingu
          </div>
        )}
        {entries.map((entry, idx) => (
          <Link
            key={entry.id}
            href={`/members/${entry.username}`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors ${
              idx < entries.length - 1 ? "border-b border-slate-700" : ""
            } ${entry.rank <= 3 ? "bg-slate-800/20" : ""} ${
              entry.isCurrentUser ? "ring-1 ring-inset ring-orange-500/30 bg-orange-500/5" : ""
            }`}
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {entry.rank <= 3 ? (
                <span className={`text-xl font-black ${rankColors[entry.rank]}`}>
                  {entry.rank}
                </span>
              ) : (
                <span className="text-sm text-slate-500 font-medium">
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
              {entry.avatar ? (
                <img src={entry.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-white">
                  {entry.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white truncate">
                  {entry.name || entry.username}
                </span>
                <LevelBadge level={entry.level} size="sm" />
              </div>
              <span className="text-xs text-slate-500">
                @{entry.username}
              </span>
            </div>

            {/* Streak */}
            {entry.streak > 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-400">
                <Flame className="h-3.5 w-3.5" />
                {entry.streak}
              </div>
            )}

            {/* Points */}
            <div className="text-right">
              <span className="text-lg font-bold text-white">
                {entry.points.toLocaleString()}
              </span>
              <p className="text-xs text-slate-500">pkt</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
