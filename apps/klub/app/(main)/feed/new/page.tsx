"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TagInput } from "@/components/feed/TagInput";
import { ImageUpload } from "@/components/feed/ImageUpload";

const postTypes = [
  { value: "DISCUSSION", label: "Dyskusja", color: "bg-slate-600" },
  { value: "WIN", label: "Win / Sukces", color: "bg-green-600" },
  { value: "QUESTION", label: "Pytanie", color: "bg-blue-600" },
  { value: "RESOURCE", label: "Zasob", color: "bg-purple-600" },
  { value: "PROGRESS_UPDATE", label: "Update postepu", color: "bg-yellow-600" },
];

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

interface MainCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  subCategories: SubCategory[];
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount?: number;
}

export default function NewPostPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("DISCUSSION");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<MainCategory[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !subCategoryId) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          subCategoryId,
          title: title.trim(),
          content: content.trim(),
          tagIds: tags.map((t) => t.id),
          imageUrl: imageUrl || undefined,
        }),
      });
      if (res.ok) {
        router.push("/feed");
      } else {
        const data = await res.json();
        setError(data.error || "Blad podczas tworzenia posta");
      }
    } catch {
      setError("Blad polaczenia");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Wroc do feedu
      </Link>

      <h1 className="text-2xl font-bold text-white mb-8">Nowy post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Typ posta
          </label>
          <div className="flex flex-wrap gap-2">
            {postTypes.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setType(pt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  type === pt.value
                    ? `${pt.color} text-white`
                    : "bg-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category - hierarchical */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Kategoria
          </label>
          <select
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
            required
            className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Wybierz kategorie...</option>
            {categories.map((main) => (
              <optgroup key={main.id} label={`${main.icon} ${main.name}`}>
                {main.subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Tytul
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={200}
            placeholder="O czym chcesz napisac?"
            className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Tresc
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
            rows={8}
            placeholder="Podziel sie swoimi myslami..."
            className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Tagi
          </label>
          <TagInput selectedTags={tags} onTagsChange={setTags} />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Zdjecie (opcjonalne)
          </label>
          <ImageUpload imageUrl={imageUrl} onImageChange={setImageUrl} />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/feed"
            className="h-10 px-4 inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim() || !subCategoryId}
            className="h-10 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            {submitting ? "Publikowanie..." : "Opublikuj"}
          </button>
        </div>
      </form>
    </div>
  );
}
