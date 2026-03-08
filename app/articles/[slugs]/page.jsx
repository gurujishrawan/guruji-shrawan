import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "../data";

export const dynamic = "force-dynamic";

function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slugs);
  if (!article) {
    notFound();
  }

  const related = (await getArticles())
    .filter(item => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <article className="bg-[#f7f5f2] pb-16">
      <div className="mx-auto w-[min(1120px,94%)] py-10 md:py-14">
        <Link href="/articles" className="text-sm font-semibold text-[#e4572e]">← Back to all articles</Link>
        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e4572e]">{article.category || "Wisdom"}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-[#101820] md:text-5xl">{article.title.en}</h1>
          <p className="mt-3 text-sm text-black/50">◷ {article.readTime || "4 min"} · {formatDate(article.publishedAt)}</p>

          {article.featuredImage && (
            <div className="relative mt-7 h-64 overflow-hidden rounded-2xl md:h-[460px]">
              <Image src={article.featuredImage} alt={article.title.en} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-sm mt-8 max-w-none rounded-2xl border border-black/10 bg-[#fdfdfd] p-5 md:prose-base md:p-8" dangerouslySetInnerHTML={{ __html: article.content.en }} />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#101820]">Related Articles</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map(item => (
              <Link key={item.slug} href={`/articles/${item.slug}`} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-1">
                <p className="text-xs uppercase tracking-[0.12em] text-[#e4572e]">{item.category || "Wisdom"}</p>
                <p className="mt-2 text-lg font-semibold text-[#101820]">{item.title.en}</p>
                <p className="mt-2 text-sm text-black/60">{item.readTime || "4 min"} · {formatDate(item.publishedAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
