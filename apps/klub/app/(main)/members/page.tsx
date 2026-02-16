// @ts-nocheck
import { db } from "@repo/database";
import { getLevelInfo } from "@/lib/gamification/constants";
import Link from "next/link";
import { Instagram } from "lucide-react";

async function getMembers() {
  const users = await db.user.findMany({
    where: {
      onboardingCompleted: true,
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      bio: true,
      instagramHandle: true,
      points: true,
      level: true,
      totalPosts: true,
      createdAt: true,
    },
    orderBy: {
      points: "desc",
    },
    take: 50,
  });

  return users.map((user) => ({
    ...user,
    levelInfo: getLevelInfo(user.level),
  }));
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Członkowie społeczności</h1>
        <p className="text-slate-400 text-sm mt-1">
          {members.length} {members.length === 1 ? "członek" : "członków"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Link
            key={member.id}
            href={`/members/${member.username}`}
            className="bg-brand-secondary border border-slate-700 rounded-xl p-5 hover:border-orange-500/50 transition-colors group"
          >
            {/* Avatar + Level */}
            <div className="flex items-start gap-4 mb-3">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name || member.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 group-hover:border-orange-500/50 transition-colors"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-700 group-hover:border-orange-500/50 transition-colors">
                  <span className="text-xl font-bold text-slate-400">
                    {member.name?.[0] || member.username?.[0] || "?"}
                  </span>
                </div>
              )}

              {/* Level badge */}
              <div className="flex-1">
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold"
                  style={{
                    backgroundColor: `${member.levelInfo.color}20`,
                    color: member.levelInfo.color,
                  }}
                >
                  <span>{member.levelInfo.icon}</span>
                  <span>Lvl {member.level}</span>
                </div>
              </div>
            </div>

            {/* Name + Username */}
            <div className="mb-2">
              <h3 className="text-white font-semibold group-hover:text-orange-400 transition-colors">
                {member.name || member.username}
              </h3>
              <p className="text-slate-500 text-sm">@{member.username}</p>
            </div>

            {/* Bio */}
            {member.bio && (
              <p className="text-slate-400 text-sm line-clamp-2 mb-3">{member.bio}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-700 pt-3">
              <div>
                <span className="text-orange-400 font-semibold">{member.points}</span> pkt
              </div>
              <div>
                <span className="text-white font-semibold">{member.totalPosts}</span> postów
              </div>
              {member.instagramHandle && (
                <div className="ml-auto">
                  <Instagram className="h-3.5 w-3.5 text-slate-500" />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">Brak członków</p>
        </div>
      )}
    </div>
  );
}
