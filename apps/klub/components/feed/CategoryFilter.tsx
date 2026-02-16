"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

interface CategoryFilterProps {
  initialCategories?: MainCategory[];
}

export function CategoryFilter({ initialCategories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<MainCategory[]>(initialCategories || []);
  const [activeMain, setActiveMain] = useState<string | null>(
    searchParams.get("mainCategory")
  );
  const [activeSub, setActiveSub] = useState<string | null>(
    searchParams.get("subCategoryId")
  );

  useEffect(() => {
    if (!initialCategories) {
      fetch("/api/categories")
        .then((r) => r.json())
        .then(setCategories)
        .catch(() => {});
    }
  }, [initialCategories]);

  function selectMainCategory(slug: string | null) {
    if (slug === activeMain) {
      // Deselect
      setActiveMain(null);
      setActiveSub(null);
      router.push("/feed");
    } else {
      setActiveMain(slug);
      setActiveSub(null);
      if (slug) {
        router.push(`/feed?mainCategory=${slug}`);
      } else {
        router.push("/feed");
      }
    }
  }

  function selectSubCategory(id: string | null) {
    if (id === activeSub) {
      setActiveSub(null);
      if (activeMain) {
        router.push(`/feed?mainCategory=${activeMain}`);
      } else {
        router.push("/feed");
      }
    } else {
      setActiveSub(id);
      const params = new URLSearchParams();
      if (activeMain) params.set("mainCategory", activeMain);
      if (id) params.set("subCategoryId", id);
      router.push(`/feed?${params.toString()}`);
    }
  }

  const activeMainCat = categories.find((c) => c.slug === activeMain);

  return (
    <div className="space-y-2">
      {/* Main categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => selectMainCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeMain
              ? "bg-orange-500 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          Wszystkie
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectMainCategory(cat.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeMain === cat.slug
                ? "text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
            style={
              activeMain === cat.slug
                ? { backgroundColor: cat.color }
                : undefined
            }
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Sub categories */}
      {activeMainCat && activeMainCat.subCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-2">
          {activeMainCat.subCategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => selectSubCategory(sub.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                activeSub === sub.id
                  ? "bg-slate-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
              }`}
            >
              {sub.name}
              {sub._count?.posts !== undefined && (
                <span className="ml-1 text-slate-500">({sub._count.posts})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
