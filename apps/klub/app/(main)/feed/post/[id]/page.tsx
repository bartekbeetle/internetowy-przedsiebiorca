// @ts-nocheck
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pin, Eye, Share2, Flag } from "lucide-react";
import { LikeButton } from "@/components/feed/LikeButton";
import { CommentSection } from "@/components/feed/CommentSection";

const typeLabels: Record<string, { label: string; color: string }> = {
  DISCUSSION: { label: "Dyskusja", color: "bg-slate-600" },
  WIN: { label: "Win", color: "bg-green-600" },
  QUESTION: { label: "Pytanie", color: "bg-blue-600" },
  RESOURCE: { label: "Zasob", color: "bg-purple-600" },
  PROGRESS_UPDATE: { label: "Update", color: "bg-yellow-600" },
};

function timeAgo(dateStr: string | Date) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "teraz";
  if (minutes < 60) return `${minutes}m temu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h temu`;
  const days = Math.floor(hours / 24);
  return `${days}d temu`;
}

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  const post = await db.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { id: true, username: true, avatar: true, level: true, points: true },
      },
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
      likes: userId ? { where: { userId }, select: { id: true } } : false,
    },
  });

  if (!post) {
    notFound();
  }

  // Increment views
  await db.post.update({
    where: { id: params.id },
    data: { viewsCount: { increment: 1 } },
  });

  // Fetch comments
  const comments = await db.comment.findMany({
    where: { postId: params.id, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { id: true, username: true, avatar: true, level: true },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, username: true, avatar: true, level: true },
          },
        },
      },
    },
  });

  const typeInfo = typeLabels[post.type] || typeLabels.DISCUSSION;
  const isLiked = Array.isArray(post.likes) && post.likes.length > 0;
  const tags = post.tags.map((pt) => pt.tag);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Wroc do feedu
      </Link>

      {/* Post */}
      <article className="bg-brand-secondary border border-slate-700 rounded-lg p-6">
        {/* Author header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-white">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {post.author.username}
              </span>
              <span className="text-xs text-slate-500">
                Lv.{post.author.level}
              </span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">
                {post.author.points} pkt
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {timeAgo(post.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {post.isPinned && (
              <Pin className="h-3.5 w-3.5 text-orange-500" />
            )}
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium text-white ${typeInfo.color}`}
            >
              {typeInfo.label}
            </span>
          </div>
        </div>

        {/* Category */}
        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
          style={{
            backgroundColor: post.subCategory.mainCategory.color + "20",
            color: post.subCategory.mainCategory.color,
          }}
        >
          {post.subCategory.mainCategory.icon} {post.subCategory.name}
        </span>

        {/* Title */}
        <h1 className="text-xl font-bold text-white mb-4">{post.title}</h1>

        {/* Image */}
        {post.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={post.imageUrl} alt="" className="w-full max-h-96 object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/feed?tag=${tag.slug}`}
                className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-700">
          <LikeButton
            postId={post.id}
            initialLiked={isLiked}
            initialCount={post.likesCount}
          />
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <Eye className="h-4 w-4" />
            {post.viewsCount + 1}
          </span>
          <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors ml-auto">
            <Flag className="h-4 w-4" />
            Zglos
          </button>
        </div>
      </article>

      {/* Comments section */}
      <CommentSection
        postId={post.id}
        initialComments={comments}
        initialCount={post.commentsCount}
      />
    </div>
  );
}
