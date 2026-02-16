"use client";

import { useState } from "react";
import { Trophy, Clock, Users, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  reward: number;
  endDate: string;
  requirement: { type: string; target: number };
  badgeName?: string | null;
  badgeIcon?: string | null;
  participantCount: number;
  participation?: {
    progress: number;
    completed: boolean;
    completedAt?: string | null;
  } | null;
}

export function ChallengeCard({
  id,
  title,
  description,
  type,
  reward,
  endDate,
  requirement,
  badgeIcon,
  participantCount,
  participation,
}: ChallengeCardProps) {
  const [joining, setJoining] = useState(false);
  const [localParticipation, setLocalParticipation] = useState(participation);

  const isJoined = !!localParticipation;
  const isCompleted = localParticipation?.completed;
  const progress = localParticipation?.progress || 0;
  const progressPercent = Math.min(100, Math.round((progress / requirement.target) * 100));

  const typeColors: Record<string, string> = {
    DAILY: "text-green-400 bg-green-400/10",
    WEEKLY: "text-blue-400 bg-blue-400/10",
    MONTHLY: "text-purple-400 bg-purple-400/10",
    SPECIAL: "text-yellow-400 bg-yellow-400/10",
  };

  const typeLabels: Record<string, string> = {
    DAILY: "Dzienne",
    WEEKLY: "Tygodniowe",
    MONTHLY: "Miesieczne",
    SPECIAL: "Specjalne",
  };

  async function handleJoin() {
    setJoining(true);
    try {
      const res = await fetch(`/api/challenges/${id}/join`, { method: "POST" });
      if (res.ok) {
        setLocalParticipation({ progress: 0, completed: false });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className={`rounded-xl border p-5 transition-all ${
      isCompleted
        ? "border-green-500/30 bg-green-500/5"
        : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className={`h-5 w-5 ${isCompleted ? "text-green-400" : "text-orange-400"}`} />
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${typeColors[type] || "text-slate-400 bg-slate-700"}`}>
            {typeLabels[type] || type}
          </span>
        </div>
        {badgeIcon && (
          <span className="text-xl" title="Nagroda: odznaka">
            {badgeIcon}
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>

      {isJoined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">
              {progress} / {requirement.target}
            </span>
            <span className={isCompleted ? "text-green-400 font-medium" : "text-slate-500"}>
              {isCompleted ? "Ukonczone!" : `${progressPercent}%`}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? "bg-green-500" : "bg-orange-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(endDate), { locale: pl, addSuffix: false })}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participantCount}
          </span>
          <span className="text-orange-400 font-medium">+{reward} pkt</span>
        </div>

        {!isJoined && (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="h-8 px-4 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-50"
          >
            {joining ? "..." : "Dolacz"}
          </button>
        )}
        {isCompleted && (
          <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
            <Check className="h-3.5 w-3.5" />
            Ukonczone
          </div>
        )}
      </div>
    </div>
  );
}
