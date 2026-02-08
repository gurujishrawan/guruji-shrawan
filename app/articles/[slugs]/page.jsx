import { notFound } from "next/navigation";
import { getArticleBySlug } from "../data";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-24 prose">
      <div className="flex flex-col gap-2 mb-6">
        <h1>{article.title.en}</h1>
        {article.publishedAt && (
          <p className="text-sm text-gray-500">{article.publishedAt}</p>
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: article.content.en }} />
    </article>
  );
}
