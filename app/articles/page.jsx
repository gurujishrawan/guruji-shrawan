import Link from "next/link";
import { getArticles } from "./data";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex flex-col gap-3 mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Insights
        </p>
        <h1 className="text-4xl font-extrabold">Articles</h1>
        <p className="text-gray-600 max-w-2xl">
          Long-form reflections on philosophy, activism, and inner clarity.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {articles.map(article => (
          <Link key={article.slug} href={`/articles/${article.slug}`}>
            <article className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              {article.featuredImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title.en}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between gap-4 text-xs text-gray-500 mb-3">
                  <span>Featured</span>
                  {article.publishedAt && <span>{article.publishedAt}</span>}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {article.title.en}
                </h2>
                <p className="text-gray-600">{article.excerpt.en}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
