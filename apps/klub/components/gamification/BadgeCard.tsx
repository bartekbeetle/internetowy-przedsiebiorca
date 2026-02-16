"use client";

import { Lock } from "lucide-react";

interface BadgeCardProps {
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  earned: boolean;
  earnedAt?: string | null;
  isSecret?: boolean;
  points?: number;
}

export function BadgeCard({
  name,
  description,
  iconUrl,
  earned,
  earnedAt,
  isSecret,
  points,
}: BadgeCardProps) {
  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        earned
          ? "border-slate-600/50 bg-slate-800/50 hover:border-slate-500/50"
          : "border-slate-700/30 bg-slate-800/20 opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            earned ? "bg-slate-700/50" : "bg-slate-800/50"
          }`}
        >
          {earned ? iconUrl : <Lock className="h-5 w-5 text-slate-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-semibold truncate ${earned ? "text-white" : "text-slate-500"}`}>
              {name}
            </h3>
            {isSecret && earned && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                SEKRET
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 ${earned ? "text-slate-400" : "text-slate-600"}`}>
            {description}
          </p>
          {earned && earnedAt && (
            <p className="text-[10px] text-slate-500 mt-1">
              Zdobyto: {new Date(earnedAt).toLocaleDateString("pl-PL")}
            </p>
          )}
          {points && points > 0 && (
            <span className="text-[10px] text-orange-400 font-medium">+{points} pkt</span>
          )}
        </div>
      </div>
    </div>
  );
}
