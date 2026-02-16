"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Check, Loader2 } from "lucide-react";

interface LessonNotesProps {
  courseSlug: string;
  lessonId: string;
  initialContent: string;
}

export function LessonNotes({
  courseSlug,
  lessonId,
  initialContent,
}: LessonNotesProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    async (text: string) => {
      if (text === initialContent && !content) return;
      setSaving(true);
      setSaved(false);
      try {
        await fetch(
          `/api/courses/${courseSlug}/lessons/${lessonId}/notes`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: text }),
          }
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        // silent
      } finally {
        setSaving(false);
      }
    },
    [courseSlug, lessonId, initialContent, content]
  );

  function handleChange(value: string) {
    setContent(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(value), 2000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-orange-400" />
          Twoje notatki
        </h3>
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          {saving && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Zapisywanie...
            </>
          )}
          {saved && (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Zapisano</span>
            </>
          )}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Zapisz swoje notatki z tej lekcji..."
        rows={5}
        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
      />
    </div>
  );
}
