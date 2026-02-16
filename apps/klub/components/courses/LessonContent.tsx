"use client";

import ReactMarkdown from "react-markdown";

interface LessonContentProps {
  content: string;
}

export function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-white prose-headings:font-semibold
      prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
      prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
      prose-p:text-slate-300 prose-p:leading-relaxed
      prose-strong:text-white
      prose-ul:text-slate-300 prose-ol:text-slate-300
      prose-li:marker:text-orange-400
      prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
      prose-code:text-orange-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
      prose-blockquote:border-orange-500 prose-blockquote:text-slate-400
      prose-hr:border-slate-700
    ">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
