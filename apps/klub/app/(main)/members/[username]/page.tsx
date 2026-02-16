// @ts-nocheck
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, MessageSquare, Award, Calendar, ExternalLink, FileText, GraduationCap } from "lucide-react";
import { db } from "@repo/database";
import { getLevelInfo } from "@/lib/gamification/constants";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { BadgeShowcase } from "@/components/gamification/BadgeShowcase";
import { StreakCounter } from "@/components/gamification/StreakCounter";

export default async function MemberProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      bio: true,
      instagramHandle: true,
      points: true,
      level: true,
      streak: true,
      totalPosts: true,
      totalComments: true,
      totalLikes: true,
      completedCourses: true,
      createdAt: true,
      badges: {
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
        take: 6,
      },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          likesCount: true,
          commentsCount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) notFound();

  const levelInfo = getLevelInfo(user.level);

  const typeLabels: Record<string, { label: string; color: string }> = {
    DISCUSSION: { label: "Dyskusja", color: "bg-slate-600" },
    WIN: { label: "Win", color: "bg-green-600" },
    QUESTION: { label: "Pytanie", color: "bg-blue-600" },
    RESOURCE: { label: "Zasob", color: "bg-purple-600" },
    PROGRESS_UPDATE: { label: "Update", color: "bg-yellow-600" },
  };

  const badges = user.badges.map((ub) => ({
    id: ub.badge.id,
    name: ub.badge.name,
    iconUrl: ub.badge.iconUrl,
    category: ub.badge.category,
    earnedAt: ub.earnedAt.toISOString(),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/members"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Wszyscy czlonkowie
      </Link>

      {/* Profile card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white">
                {user.name || user.username}
              </h1>
              <LevelBadge level={user.level} size="sm" showName />
            </div>
            <p className="text-sm text-slate-500">@{user.username}</p>
            {user.bio && (
              <p className="text-sm text-slate-300 mt-2">{user.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                {user.points} punktow
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Dolaczyl {new Date(user.createdAt).toLocaleDateString("pl-PL", { month: "long", year: "numeric" })}
              </span>
              {user.instagramHandle && (
                <a
                  href={`https://instagram.com/${user.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  @{user.instagramHandle}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/50">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user.totalPosts}</p>
            <p className="text-xs text-slate-500">Postow</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user.totalComments}</p>
            <p className="text-xs text-slate-500">Komentarzy</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user.totalLikes}</p>
            <p className="text-xs text-slate-500">Polubien</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user.completedCourses}</p>
            <p className="text-xs text-slate-500">Kursow</p>
          </div>
        </div>
      </div>

      {/* Streak + Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StreakCounter streak={user.streak} />
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <BadgeShowcase badges={badges} />
        </div>
      </div>

      {/* Recent posts */}
      {user.posts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Ostatnie posty</h2>
          <div className="space-y-3">
            {user.posts.map((post) => {
              const typeInfo = typeLabels[post.type] || typeLabels.DISCUSSION;
              return (
                <Link
                  key={post.id}
                  href={`/feed/post/${post.slug}`}
                  className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.commentsCount}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
