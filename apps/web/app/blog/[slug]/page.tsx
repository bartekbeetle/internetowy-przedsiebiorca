import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Nie znaleziono artykulu" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Article header */}
        <section className="py-16 bg-brand-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Wrocdo bloga
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-orange-500/20 text-orange-400">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-slate-400">
              {new Date(post.date).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </section>

        {/* Article content */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-orange-600 prose-strong:text-slate-900">
              {post.content.split("\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={i} className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- **")) {
                  const text = paragraph.replace("- **", "").replace("**", "");
                  const [bold, ...rest] = text.split(" - ");
                  return (
                    <li key={i} className="text-slate-700 mb-2">
                      <strong>{bold}</strong>
                      {rest.length > 0 ? ` - ${rest.join(" - ")}` : ""}
                    </li>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={i} className="text-slate-700 mb-2">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }
                if (paragraph.match(/^\d+\. \*\*/)) {
                  const text = paragraph.replace(/^\d+\. \*\*/, "").replace("**", "");
                  const [bold, ...rest] = text.split(" - ");
                  return (
                    <li key={i} className="text-slate-700 mb-2 list-decimal">
                      <strong>{bold}</strong>
                      {rest.length > 0 ? ` - ${rest.join(" - ")}` : ""}
                    </li>
                  );
                }
                if (paragraph.match(/^\d+\. /)) {
                  return (
                    <li key={i} className="text-slate-700 mb-2 list-decimal">
                      {paragraph.replace(/^\d+\. /, "")}
                    </li>
                  );
                }
                if (paragraph.trim() === "") return null;
                return (
                  <p key={i} className="text-slate-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </article>

            {/* CTA box */}
            <div className="mt-12 p-8 rounded-lg bg-brand-primary border border-slate-700 text-center">
              <h3 className="text-xl font-bold text-white">
                Chcesz zaczac tworzyc faceless content?
              </h3>
              <p className="mt-2 text-slate-400">
                Pobierz darmowy poradnik i stworz pierwsza rolke w 24h.
              </p>
              <Link
                href="/pierwsza-rolka"
                className="mt-4 inline-flex items-center justify-center h-12 px-8 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors gap-2"
              >
                Pobierz za darmo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Powiazane artykuly
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
