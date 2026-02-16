import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Praktyczna wiedza o faceless content",
  description:
    "Artykuly, poradniki i case studies o tworzeniu tresci bez twarzy, zarabianiu online i budowaniu marki.",
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: { kategoria?: string };
}) {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const activeCategory = searchParams.kategoria;

  const filteredPosts = activeCategory
    ? posts.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      )
    : posts;

  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-16 bg-brand-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-black uppercase text-white">
              Blog
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Praktyczna wiedza o faceless content. Bez bullshitu.
            </p>
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !activeCategory
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-orange-300"
                }`}
              >
                Wszystkie
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?kategoria=${cat.toLowerCase()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory?.toLowerCase() === cat.toLowerCase()
                      ? "bg-orange-500 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-orange-300"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <p className="text-center text-slate-500 py-12">
                Brak artykulow w tej kategorii.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
