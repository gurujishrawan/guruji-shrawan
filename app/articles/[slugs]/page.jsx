import { notFound } from "next/navigation";
import { getArticleBySlug } from "../data";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slugs);
  if (!article) {
    notFound();
  }

  return (
    <article className="bg-[#f7f5f2]">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex flex-col gap-3 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Article
          </p>
          <h1 className="text-4xl font-extrabold">{article.title.en}</h1>
          {article.publishedAt && (
            <p className="text-sm text-gray-500">{article.publishedAt}</p>
          )}
        </div>

        {article.featuredImage && (
          <div className="mb-10 overflow-hidden rounded-2xl shadow-sm">
            <img
              src={article.featuredImage}
              alt={article.title.en}
              className="h-[360px] w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose max-w-none bg-white p-8 rounded-2xl shadow-sm"
          dangerouslySetInnerHTML={{ __html: article.content.en }}
        />
      </div>
    </article>
  );
}
