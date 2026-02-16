// @ts-nocheck
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import Link from "next/link";
import { Plus, Trophy, TrendingUp } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { CategoryFilter } from "@/components/feed/CategoryFilter";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { mainCategory?: string; subCategoryId?: string; sort?: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  // Build filters
  const where: Record<string, unknown> = {};
  if (searchParams.mainCategory) {
    where.subCategory = {
      mainCategory: { slug: searchParams.mainCategory },
    };
  }
  if (searchParams.subCategoryId) {
    where.subCategoryId = searchParams.subCategoryId;
  }

  const orderBy =
    searchParams.sort === "popular"
      ? { likesCount: "desc" as const }
      : { createdAt: "desc" as const };

  // Fetch data in parallel
  const [posts, categories, topUsers, trendingTags] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, orderBy],
      take: 20,
      include: {
        author: { select: { id: true, username: true, avatar: true, level: true } },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
            mainCategory: {
              select: { id: true, name: true, slug: true, icon: true, color: true },
            },
          },
        },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: { select: { comments: true } },
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    }),
    db.mainCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        subCategories: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            order: true,
            _count: { select: { posts: true } },
          },
        },
      },
    }),
    db.user.findMany({
      orderBy: { points: "desc" },
      take: 5,
      select: { id: true, username: true, avatar: true, points: true, level: true },
    }),
    db.tag.findMany({
      where: { usageCount: { gt: 0 } },
      orderBy: { usageCount: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, usageCount: true },
    }),
  ]);

  const currentUser = session?.user as { id?: string; username?: string; points?: number; level?: number } | undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Spolecznosc</h1>
              <p className="text-sm text-slate-400 mt-1">
                Witaj, {currentUser?.username || session?.user?.name || "Uzytkownik"}
              </p>
            </div>
            <Link
              href="/feed/new"
              className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nowy post
            </Link>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <CategoryFilter initialCategories={categories} />
          </div>

          {/* Sort tabs */}
          <div className="flex gap-2 mb-6">
            <Link
              href="/feed"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !searchParams.sort || searchParams.sort === "newest"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Najnowsze
            </Link>
            <Link
              href="/feed?sort=popular"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                searchParams.sort === "popular"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Popularne
            </Link>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">Brak postow</p>
                <p className="text-sm mt-1">Badz pierwszy - dodaj nowy post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    tags: post.tags.map((pt) => pt.tag),
                    isLiked: Array.isArray(post.likes) && post.likes.length > 0,
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Right sidebar - desktop only */}
        <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
          {/* Mini profile */}
          {currentUser && (
            <div className="bg-brand-secondary border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {(currentUser.username || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{currentUser.username}</p>
                  <p className="text-xs text-slate-500">Lv.{currentUser.level || 1}</p>
                </div>
              </div>
              <div className="text-center py-2 bg-slate-800 rounded-lg">
                <span className="text-lg font-bold text-orange-500">{currentUser.points || 0}</span>
                <span className="text-xs text-slate-400 ml-1">punktow</span>
              </div>
            </div>
          )}

          {/* Mini leaderboard */}
          <div className="bg-brand-secondary border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-white">Top 5</h3>
            </div>
            <div className="space-y-2">
              {topUsers.map((user, i) => (
                <div key={user.id} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 w-4">{i + 1}.</span>
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300 flex-1 truncate">{user.username}</span>
                  <span className="text-xs text-orange-500 font-medium">{user.points}</span>
                </div>
              ))}
            </div>
            <Link
              href="/leaderboard"
              className="block text-center text-xs text-orange-500 hover:text-orange-400 mt-3 transition-colors"
            >
              Zobacz caly ranking
            </Link>
          </div>

          {/* Trending tags */}
          {trendingTags.length > 0 && (
            <div className="bg-brand-secondary border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-white">Popularne tagi</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/feed?tag=${tag.slug}`}
                    className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    #{tag.name}
                    <span className="ml-1 text-slate-500">{tag.usageCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
