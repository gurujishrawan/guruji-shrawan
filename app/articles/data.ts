import { promises as fs } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "articles.json");

const fallbackArticles = [
  {
    slug: "what-is-clarity",
    title: { en: "What Is Clarity?", hi: "स्पष्टता क्या है?" },
    excerpt: {
      en: "Clarity is not comfort. It is the end of confusion.",
      hi: "स्पष्टता आराम नहीं है, यह भ्रम का अंत है।",
    },
    content: {
      en: "<p>Clarity begins where belief ends.</p>",
      hi: "<p>स्पष्टता वहीं शुरू होती है जहाँ विश्वास समाप्त होता है।</p>",
    },
    publishedAt: "2024-01-10",
  },
];

async function readArticlesFile() {
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : fallbackArticles;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return fallbackArticles;
    }
    throw error;
  }
}

async function writeArticlesFile(articles: typeof fallbackArticles) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(articles, null, 2));
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getArticles() {
  return readArticlesFile();
}

export async function getArticleBySlug(slug: string) {
  const articles = await readArticlesFile();
  return articles.find(article => article.slug === slug);
}

export async function addOrUpdateArticle(input: {
  slug: string;
  title: { en: string; hi: string };
  excerpt: { en: string; hi: string };
  content: { en: string; hi: string };
  publishedAt?: string;
}) {
  const articles = await readArticlesFile();
  const slug = normalizeSlug(input.slug || input.title.en || "");
  if (!slug) {
    throw new Error("Slug or title is required.");
  }

  const now = new Date();
  const publishedAt =
    input.publishedAt || now.toISOString().slice(0, 10);

  const payload = {
    ...input,
    slug,
    publishedAt,
  };

  const existingIndex = articles.findIndex(
    article => article.slug === slug,
  );

  if (existingIndex >= 0) {
    articles[existingIndex] = payload;
  } else {
    articles.unshift(payload);
  }

  await writeArticlesFile(articles);
  return payload;
}

export { normalizeSlug };
