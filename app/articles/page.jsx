import Link from "next/link";
import { getArticles } from "./data";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-4xl font-extrabold">Articles</h1>
        <Link
          href="/admin"
          className="text-sm font-semibold text-[#e4572e] underline"
        >
          Open CMS →
        </Link>
      </div>

      {articles.map(article => (
        <Link key={article.slug} href={`/articles/${article.slug}`}>
          <div className="border-b pb-6 mb-6 hover:opacity-80">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">{article.title.en}</h2>
              {article.publishedAt && (
                <span className="text-xs text-gray-500">
                  {article.publishedAt}
                </span>
              )}
            </div>
            <p className="text-gray-600">{article.excerpt.en}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
