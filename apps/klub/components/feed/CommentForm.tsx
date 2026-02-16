"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded?: (comment: unknown) => void;
  placeholder?: string;
  compact?: boolean;
}

export function CommentForm({
  postId,
  parentId,
  onCommentAdded,
  placeholder = "Napisz komentarz...",
  compact = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          parentId: parentId || undefined,
        }),
      });

      if (res.ok) {
        const comment = await res.json();
        setContent("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
        onCommentAdded?.(comment);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          autoResize();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className={`flex-1 px-3 py-2 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
          compact ? "text-sm" : ""
        }`}
      />
      <button
        type="submit"
        disabled={!content.trim() || loading}
        className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors flex-shrink-0"
      >
        <Send className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </form>
  );
}
