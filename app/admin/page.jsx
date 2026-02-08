import Link from "next/link";
import { redirect } from "next/navigation";
import {
  addOrUpdateArticle,
  deleteArticle,
  getArticleBySlug,
  getArticles,
  normalizeSlug,
} from "../articles/data";

export const dynamic = "force-dynamic";

async function createArticle(formData) {
  "use server";

  const titleEn = String(formData.get("titleEn") || "").trim();
  const titleHi = String(formData.get("titleHi") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const excerptEn = String(formData.get("excerptEn") || "").trim();
  const excerptHi = String(formData.get("excerptHi") || "").trim();
  const contentEn = String(formData.get("contentEn") || "").trim();
  const contentHi = String(formData.get("contentHi") || "").trim();
  const publishedAt = String(formData.get("publishedAt") || "").trim();
  const featuredImage = String(formData.get("featuredImage") || "").trim();

  const slug = normalizeSlug(slugInput || titleEn);

  if (!slug || !titleEn || !excerptEn || !contentEn) {
    redirect("/admin?status=missing");
  }

  await addOrUpdateArticle({
    slug,
    title: {
      en: titleEn,
      hi: titleHi || titleEn,
    },
    excerpt: {
      en: excerptEn,
      hi: excerptHi || excerptEn,
    },
    content: {
      en: contentEn,
      hi: contentHi || contentEn,
    },
    publishedAt: publishedAt || undefined,
    featuredImage: featuredImage || undefined,
  });

  redirect(`/admin?status=saved&slug=${slug}`);
}

async function removeArticle(formData) {
  "use server";

  const slug = String(formData.get("slug") || "").trim();
  if (!slug) {
    redirect("/admin?status=missing");
  }
  await deleteArticle(slug);
  redirect("/admin?status=deleted");
}

export default async function AdminPage({ searchParams }) {
  const articles = await getArticles();
  const resolvedParams = await searchParams;
  const status = resolvedParams?.status;
  const slug = resolvedParams?.slug;
  const editSlug = resolvedParams?.edit;
  const editArticle = editSlug
    ? await getArticleBySlug(editSlug)
    : null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold">Articles CMS</h1>
          <p className="text-sm text-gray-600">
            Publish and manage philosophy or activism articles.
          </p>
        </div>
        <Link href="/articles" className="text-sm underline">
          ← Back to articles
        </Link>
      </div>

      {status === "saved" && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Article saved successfully. {slug && (
            <Link className="underline" href={`/articles/${slug}`}>
              View it here.
            </Link>
          )}
        </div>
      )}
      {status === "deleted" && (
        <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Article deleted.
        </div>
      )}
      {status === "missing" && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Please complete the required fields (slug or title, excerpt, and content).
        </div>
      )}

      <form action={createArticle} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editArticle ? "Edit article" : "Create new article"}
          </h2>
          {editArticle && (
            <Link href="/admin" className="text-xs underline">
              Clear edit
            </Link>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Slug (optional)
            <input
              name="slug"
              defaultValue={editArticle?.slug}
              placeholder="living-with-clarity"
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Publish date (YYYY-MM-DD)
            <input
              name="publishedAt"
              defaultValue={editArticle?.publishedAt}
              placeholder="2024-01-10"
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Featured image URL
          <input
            name="featuredImage"
            defaultValue={editArticle?.featuredImage}
            placeholder="/images/hero1.jpg"
            className="rounded border px-3 py-2 text-sm"
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Title (English)*
            <input
              name="titleEn"
              required
              defaultValue={editArticle?.title?.en}
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Title (Hindi)
            <input
              name="titleHi"
              defaultValue={editArticle?.title?.hi}
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Excerpt (English)*
            <textarea
              name="excerptEn"
              rows={3}
              required
              defaultValue={editArticle?.excerpt?.en}
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Excerpt (Hindi)
            <textarea
              name="excerptHi"
              rows={3}
              defaultValue={editArticle?.excerpt?.hi}
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Content (English)*
            <textarea
              name="contentEn"
              rows={10}
              required
              defaultValue={editArticle?.content?.en}
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Content (Hindi)
            <textarea
              name="contentHi"
              rows={10}
              defaultValue={editArticle?.content?.hi}
              className="rounded border px-3 py-2 text-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 text-sm"
        >
          {editArticle ? "Update article" : "Save article"}
        </button>
      </form>

      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Existing articles</h2>
        <div className="space-y-4">
          {articles.map(article => (
            <div key={article.slug} className="rounded border px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{article.title.en}</p>
                  <p className="text-xs text-gray-500">{article.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    className="text-sm text-[#e4572e] underline"
                    href={`/admin?edit=${article.slug}`}
                  >
                    Edit
                  </Link>
                  <Link
                    className="text-sm text-[#e4572e] underline"
                    href={`/articles/${article.slug}`}
                  >
                    View
                  </Link>
                  <form action={removeArticle}>
                    <input type="hidden" name="slug" value={article.slug} />
                    <button
                      type="submit"
                      className="text-sm text-red-600 underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
