"use client";

import Link from "next/link";
import { Heart, MessageSquare, Eye, Pin } from "lucide-react";
import { LikeButton } from "./LikeButton";

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

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    type: string;
    imageUrl?: string | null;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    isPinned: boolean;
    isLiked?: boolean;
    createdAt: string | Date;
    author: {
      id: string;
      username: string;
      avatar?: string | null;
      level: number;
    };
    subCategory: {
      id: string;
      name: string;
      slug: string;
      mainCategory: {
        name: string;
        icon: string;
        color: string;
      };
    };
    tags?: { id: string; name: string; slug: string }[];
    _count?: { comments: number };
  };
}

export function PostCard({ post }: PostCardProps) {
  const typeInfo = typeLabels[post.type] || typeLabels.DISCUSSION;
  const commentCount = post.commentsCount || post._count?.comments || 0;

  return (
    <div className="bg-brand-secondary border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-white">
              {post.author.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {post.author.username}
            </span>
            <span className="text-xs text-slate-500">
              Lv.{post.author.level}
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

      {/* Content */}
      <Link href={`/feed/post/${post.id}`}>
        <h2 className="text-lg font-semibold text-white mb-1 hover:text-orange-400 transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-sm text-slate-400 line-clamp-2 mb-3">
        {post.content}
      </p>

      {/* Image */}
      {post.imageUrl && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img
            src={post.imageUrl}
            alt=""
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <LikeButton
          postId={post.id}
          initialLiked={post.isLiked || false}
          initialCount={post.likesCount}
        />
        <Link
          href={`/feed/post/${post.id}`}
          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          {commentCount}
        </Link>
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {post.viewsCount}
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: post.subCategory.mainCategory.color + "20",
            color: post.subCategory.mainCategory.color,
          }}
        >
          {post.subCategory.mainCategory.icon} {post.subCategory.name}
        </span>
      </div>
    </div>
  );
}
