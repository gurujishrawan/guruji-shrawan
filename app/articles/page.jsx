import Image from "next/image";
import Link from "next/link";
import { getArticles } from "./data";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <section className="mx-auto w-[min(1120px,92%)] py-14 md:py-20">
      <div className="mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-[0.24em] text-[#ff6a00]">Insights</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">Articles</h1>
        <p className="mt-4 max-w-2xl text-sm text-black/65 md:text-base">
          Long-form reflections on philosophy, spirituality, and inner clarity for modern life.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map(article => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="group">
            <article className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              {article.featuredImage && (
                <div className="relative h-52 overflow-hidden md:h-56">
                  <Image
                    src={article.featuredImage}
                    alt={article.title.en}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-5 md:p-6">
                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-black/50">
                  <span>Featured</span>
                  {article.publishedAt && <span>{article.publishedAt}</span>}
                </div>
                <h2 className="text-xl font-semibold md:text-2xl">{article.title.en}</h2>
                <p className="mt-3 text-sm leading-relaxed text-black/65 md:text-base">{article.excerpt.en}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
