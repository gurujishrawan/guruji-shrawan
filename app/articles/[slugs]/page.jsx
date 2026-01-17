import { articles } from "../data";

export default function ArticlePage({ params }) {
  const article = articles.find(a => a.slug === params.slug);
  if (!article) return null;

  return (
    <article className="max-w-3xl mx-auto px-6 py-24 prose">
      <h1>{article.title.en}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content.en }} />
    </article>
  );
}
