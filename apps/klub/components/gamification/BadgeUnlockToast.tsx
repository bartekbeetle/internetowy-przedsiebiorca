"use client";

import toast from "react-hot-toast";

interface BadgeToastData {
  name: string;
  description: string;
  iconUrl: string;
  points: number;
}

export function showBadgeUnlockToast(badge: BadgeToastData) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-slate-800 border border-slate-600/50 shadow-lg shadow-purple-500/10 rounded-xl pointer-events-auto`}
      >
        <div className="flex items-start gap-3 p-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
            {badge.iconUrl}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-purple-400 font-medium mb-0.5">
              Nowa odznaka!
            </p>
            <p className="text-sm font-semibold text-white">{badge.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{badge.description}</p>
            {badge.points > 0 && (
              <p className="text-xs text-orange-400 font-medium mt-1">
                +{badge.points} pkt
              </p>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-slate-500 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
}
