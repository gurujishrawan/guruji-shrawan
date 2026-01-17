import Link from "next/link";
import { articles } from "./data";

export default function ArticlesPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold mb-10">Articles</h1>
      {articles.map(a => (
        <Link key={a.slug} href={`/articles/${a.slug}`}>
          <div className="border-b pb-6 mb-6 hover:opacity-80">
            <h2 className="text-2xl font-bold">{a.title.en}</h2>
            <p className="text-gray-600">{a.excerpt.en}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
