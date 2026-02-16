import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-lg border border-slate-200 bg-white hover:border-orange-300 transition-colors overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-orange-100 text-orange-700">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 leading-snug">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
          {post.excerpt}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          {new Date(post.date).toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}
