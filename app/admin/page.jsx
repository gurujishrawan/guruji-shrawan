import { promises as fs } from "fs";
import path from "path";
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

const uploadsDir = path.join(process.cwd(), "public", "uploads");

async function saveCoverImage(file) {
  if (!file || file.size === 0) {
    return "";
  }

  const ext = path.extname(file.name || "") || ".jpg";
  const filename = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}${ext}`;

  await fs.mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

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
  const existingImage = String(formData.get("existingImage") || "").trim();
  const coverImage = formData.get("coverImage");

  const slug = normalizeSlug(slugInput || titleEn);

  if (!slug || !titleEn || !excerptEn || !contentEn) {
    redirect("/admin?status=missing");
  }

  const uploadedImage =
    coverImage && typeof coverImage.arrayBuffer === "function"
      ? await saveCoverImage(coverImage)
      : "";

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
    featuredImage: uploadedImage || featuredImage || existingImage || undefined,
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
    <section className="bg-[#f7f5f2] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
              Admin Console
            </p>
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

        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div>
            <form
              action={createArticle}
              className="space-y-8 rounded-2xl bg-white p-8 shadow-sm"
            >
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

              <input
                type="hidden"
                name="existingImage"
                value={editArticle?.featuredImage || ""}
              />

              <label className="flex flex-col gap-2 text-sm font-medium">
                Upload cover image (recommended 1600×900)
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  className="rounded border px-3 py-2 text-sm"
                />
                <span className="text-xs text-gray-500">
                  Uploading will override the featured image URL.
                </span>
              </label>

              {editArticle?.featuredImage && (
                <div className="rounded border p-3">
                  <p className="text-xs text-gray-500 mb-2">Current cover</p>
                  <img
                    src={editArticle.featuredImage}
                    alt={editArticle.title?.en || "Cover image"}
                    className="h-40 w-full rounded object-cover"
                  />
                </div>
              )}

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
                className="bg-black text-white px-6 py-3 text-sm rounded-full w-fit"
              >
                {editArticle ? "Update article" : "Save article"}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Existing articles
              </h2>
              <div className="space-y-4">
                {articles.map(article => (
                  <div
                    key={article.slug}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="font-semibold">{article.title.en}</p>
                        <p className="text-xs text-gray-500">{article.slug}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <Link
                          className="text-[#e4572e] underline"
                          href={`/admin?edit=${article.slug}`}
                        >
                          Edit
                        </Link>
                        <Link
                          className="text-[#e4572e] underline"
                          href={`/articles/${article.slug}`}
                        >
                          View
                        </Link>
                        <form action={removeArticle}>
                          <input
                            type="hidden"
                            name="slug"
                            value={article.slug}
                          />
                          <button
                            type="submit"
                            className="text-red-600 underline"
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

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-6 text-sm text-gray-600">
              Tip: Use high-quality cover images and keep excerpts under 160
              characters for a clean listing layout.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
