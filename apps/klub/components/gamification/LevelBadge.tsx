"use client";

import { getLevelInfo } from "@/lib/gamification/constants";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function LevelBadge({ level, size = "md", showName = false }: LevelBadgeProps) {
  const info = getLevelInfo(level);

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold border-2`}
        style={{ borderColor: info.color, color: info.color, backgroundColor: `${info.color}15` }}
        title={`Poziom ${level} - ${info.name}`}
      >
        {level}
      </div>
      {showName && (
        <span className="text-sm font-medium" style={{ color: info.color }}>
          {info.name}
        </span>
      )}
    </div>
  );
}
