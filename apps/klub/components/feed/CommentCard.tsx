"use client";

import { useState } from "react";
import { Reply } from "lucide-react";
import { LikeButton } from "./LikeButton";
import { CommentForm } from "./CommentForm";

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

interface Comment {
  id: string;
  content: string;
  likesCount: number;
  createdAt: string | Date;
  author: {
    id: string;
    username: string;
    avatar?: string | null;
    level: number;
  };
  replies?: Comment[];
}

interface CommentCardProps {
  comment: Comment;
  postId: string;
  depth?: number;
  onReplyAdded?: (comment: unknown) => void;
}

export function CommentCard({
  comment,
  postId,
  depth = 0,
  onReplyAdded,
}: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const canReply = depth < 1;

  function handleReplyAdded(newReply: unknown) {
    setReplies([...replies, newReply as Comment]);
    setShowReplyForm(false);
    onReplyAdded?.(newReply);
  }

  return (
    <div className={depth > 0 ? "ml-8 mt-3" : ""}>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.username}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold text-white">
              {comment.author.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-white">
              {comment.author.username}
            </span>
            <span className="text-[10px] text-slate-500">
              Lv.{comment.author.level}
            </span>
            <span className="text-[10px] text-slate-600">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <LikeButton
              postId={comment.id}
              initialLiked={false}
              initialCount={comment.likesCount}
              size="sm"
            />
            {canReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Reply className="h-3 w-3" />
                Odpowiedz
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-2">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCommentAdded={handleReplyAdded}
                placeholder="Napisz odpowiedz..."
                compact
              />
            </div>
          )}

          {/* Nested replies */}
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
