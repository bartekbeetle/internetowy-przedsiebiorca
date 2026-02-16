"use client";

import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { CommentCard } from "./CommentCard";

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

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  initialCount: number;
}

export function CommentSection({
  postId,
  initialComments,
  initialCount,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [count, setCount] = useState(initialCount);

  function handleCommentAdded(newComment: unknown) {
    const comment = newComment as Comment;
    setComments((prev) => [...prev, comment]);
    setCount((c) => c + 1);
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-white mb-4">
        Komentarze ({count})
      </h2>

      <div className="mb-6">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            postId={postId}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-8">
            Brak komentarzy. Badz pierwszy!
          </p>
        )}
      </div>
    </div>
  );
}
