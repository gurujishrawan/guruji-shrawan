import Image from "next/image";
import Link from "next/link";
import { getArticles } from "./data";

export const dynamic = "force-dynamic";

function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getTopicMap(articles) {
  return articles.reduce((acc, article) => {
    const key = article.category || "Wisdom";
    if (!acc[key]) acc[key] = [];
    acc[key].push(article);
    return acc;
  }, {});
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  const topics = getTopicMap(articles);
  const topicEntries = Object.entries(topics);
  const featured = articles[0];

  return (
    <section className="bg-[#f7f7f7] pb-16">
      <div className="mx-auto w-[min(1320px,95%)] border-b border-black/10 py-10 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#e4572e]">10000+ wisdom articles</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-[#101820] md:text-6xl">Articles</h1>
            <p className="mt-4 max-w-3xl text-sm text-black/65 md:text-base">
              Explore bold writing on life, relationship, spirituality, and self-inquiry. Every article on this page is powered from the same source used on the homepage.
            </p>
          </div>
          <Link
            href="/admin"
            className="w-fit rounded-full border border-[#e4572e]/20 bg-white px-5 py-2 text-sm font-semibold text-[#e4572e] transition hover:bg-[#fff4ef]"
          >
            Publish New Article
          </Link>
        </div>
      </div>

      <div className="mx-auto grid w-[min(1320px,95%)] gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {featured && (
            <article className="grid gap-6 border-b border-black/10 pb-10 md:grid-cols-[1.05fr,0.95fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#e4572e]">{featured.category || "Wisdom"}</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-[#101820] md:text-5xl">
                  <Link href={`/articles/${featured.slug}`} className="hover:text-[#e4572e]">
                    {featured.title.en}
                  </Link>
                </h2>
                <p className="mt-3 text-sm text-black/50">◷ {featured.readTime || "4 min"} · {formatDate(featured.publishedAt)}</p>
                <p className="mt-4 text-lg leading-relaxed text-black/80">{featured.excerpt.en}</p>
                <Link href={`/articles/${featured.slug}`} className="mt-6 inline-flex text-xl font-semibold text-[#101820] hover:text-[#e4572e]">
                  Read Full Article →
                </Link>
              </div>

              <Link href={`/articles/${featured.slug}`} className="relative block min-h-[260px] overflow-hidden rounded-2xl">
                <Image
                  src={featured.featuredImage || "/images/hero1.jpg"}
                  alt={featured.title.en}
                  fill
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </Link>
            </article>
          )}

          {topicEntries.map(([topicName, items]) => (
            <section key={topicName} className="border-b border-black/10 py-10">
              <div className="mb-7 flex items-center justify-between">
                <h3 className="text-4xl font-black uppercase tracking-tight text-[#27374d]">{topicName}</h3>
                <span className="text-3xl font-semibold text-[#e4572e]">See All</span>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {items.slice(0, 4).map(article => (
                  <article key={article.slug} className="grid gap-4 sm:grid-cols-[1fr,180px]">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#e4572e]">{article.category || "Wisdom"}</p>
                      <h4 className="mt-2 text-4xl font-bold leading-tight text-[#101820] sm:text-[2rem]">
                        <Link href={`/articles/${article.slug}`} className="hover:text-[#e4572e]">
                          {article.title.en}
                        </Link>
                      </h4>
                      <p className="mt-2 text-sm text-black/50">◷ {article.readTime || "4 min"} · {formatDate(article.publishedAt)}</p>
                      <p className="mt-3 text-lg leading-relaxed text-black/80">{article.excerpt.en}</p>
                      <Link href={`/articles/${article.slug}`} className="mt-3 inline-flex text-xl font-medium text-[#101820] hover:text-[#e4572e]">
                        Share
                      </Link>
                    </div>
                    <Link href={`/articles/${article.slug}`} className="relative hidden h-[130px] overflow-hidden rounded-xl sm:block">
                      <Image
                        src={article.featuredImage || "/images/hero2.jpg"}
                        alt={article.title.en}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text-3xl font-black uppercase text-[#27374d]">Search</h3>
            <div className="mt-4 flex overflow-hidden rounded-xl border border-black/15">
              <input type="text" placeholder="Find by keyword" className="w-full px-4 py-3 text-sm outline-none" readOnly />
              <span className="grid w-12 place-items-center bg-[#e4572e] text-white">⌕</span>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text-3xl font-black uppercase text-[#27374d]">Topics</h3>
            <div className="mt-3 space-y-2">
              {topicEntries.map(([topicName, topicArticles]) => (
                <div key={topicName} className="flex items-center justify-between border-b border-black/10 py-3 text-sm">
                  <span>{topicName}</span>
                  <span className="rounded-full bg-[#fff1ea] px-2 py-0.5 text-xs text-[#e4572e]">{topicArticles.length}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
