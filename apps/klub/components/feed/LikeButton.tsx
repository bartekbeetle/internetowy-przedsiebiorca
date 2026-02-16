"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  size?: "sm" | "md";
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  size = "md",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const wasLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    if (!wasLiked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    }

    try {
      const res = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
      });
      if (!res.ok) {
        // Revert on error
        setLiked(wasLiked);
        setCount(prevCount);
        return;
      }
      const data = await res.json();
      setCount(data.likesCount);
      setLiked(data.liked);
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setCount(prevCount);
    }
  }

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1 transition-colors ${
        liked
          ? "text-red-500 hover:text-red-400"
          : "text-slate-500 hover:text-slate-300"
      }`}
    >
      <Heart
        className={`${iconSize} transition-transform ${
          animating ? "scale-125" : "scale-100"
        } ${liked ? "fill-current" : ""}`}
      />
      <span className="text-sm">{count}</span>
    </button>
  );
}
