"use client";

import { motion } from "framer-motion";
import { getLevelInfo, LEVEL_THRESHOLDS } from "@/lib/gamification/constants";

interface LevelProgressProps {
  level: number;
  points: number;
  showDetails?: boolean;
}

export function LevelProgress({ level, points, showDetails = true }: LevelProgressProps) {
  const info = getLevelInfo(level);
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)];
  const isMaxLevel = level >= 10;

  const progress = isMaxLevel
    ? 100
    : Math.round(((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  return (
    <div className="space-y-2">
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{info.icon}</span>
            <div>
              <span className="text-sm font-semibold text-white">
                Poziom {level}
              </span>
              <span className="text-sm text-slate-400 ml-1">
                - {info.name}
              </span>
            </div>
          </div>
          <span className="text-sm text-slate-400">
            {isMaxLevel ? "MAX" : `${points} / ${nextThreshold} XP`}
          </span>
        </div>
      )}
      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: info.color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showDetails && !isMaxLevel && (
        <p className="text-xs text-slate-500">
          Jeszcze {nextThreshold - points} pkt do poziomu {level + 1}
        </p>
      )}
    </div>
  );
}
