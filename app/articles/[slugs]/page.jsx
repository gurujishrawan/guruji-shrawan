import Image from "next/image";
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
      <div className="mx-auto w-[min(900px,92%)] py-12 md:py-20">
        <div className="mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#ff6a00]">Article</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{article.title.en}</h1>
          {article.publishedAt && <p className="mt-3 text-sm text-black/50">{article.publishedAt}</p>}
        </div>

        {article.featuredImage && (
          <div className="relative mb-8 h-64 overflow-hidden rounded-2xl shadow-sm md:mb-10 md:h-[420px]">
            <Image src={article.featuredImage} alt={article.title.en} fill className="object-cover" />
          </div>
        )}

        <div
          className="prose prose-sm md:prose-base max-w-none rounded-2xl bg-white p-5 shadow-sm md:p-8"
          dangerouslySetInnerHTML={{ __html: article.content.en }}
        />
      </div>
    </article>
  );
}
