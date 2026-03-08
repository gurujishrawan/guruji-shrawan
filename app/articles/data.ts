import { promises as fs } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "articles.json");

type LocalizedText = { en: string; hi: string };

type Article = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  publishedAt: string;
  featuredImage: string;
  category?: string;
  readTime?: string;
  metaDescription?: string;
  keywords?: string[];
  imagePrompt?: string;
};

const fallbackArticles: Article[] = [
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
    featuredImage: "/images/hero1.jpg",
    category: "Mind",
    readTime: "4 min",
  },
];

async function readArticlesFile() {
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    const parsed = JSON.parse(file);
    if (!Array.isArray(parsed)) {
      return fallbackArticles;
    }
    return parsed.map(normalizeArticle);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return fallbackArticles;
    }
    throw error;
  }
}

async function writeArticlesFile(articles: Article[]) {
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

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.round(words / 200));
  return `${minutes} min`;
}

function normalizeArticle(article: Partial<Article>): Article {
  const category = typeof article.category === "string" && article.category.trim() ? article.category.trim() : "Wisdom";
  const contentEn = article.content?.en || "";

  return {
    slug: article.slug || "",
    title: {
      en: article.title?.en || "Untitled",
      hi: article.title?.hi || article.title?.en || "Untitled",
    },
    excerpt: {
      en: article.excerpt?.en || "",
      hi: article.excerpt?.hi || article.excerpt?.en || "",
    },
    content: {
      en: contentEn,
      hi: article.content?.hi || contentEn,
    },
    publishedAt: article.publishedAt || new Date().toISOString().slice(0, 10),
    featuredImage: article.featuredImage || "",
    category,
    readTime: article.readTime || estimateReadTime(contentEn),
    metaDescription: article.metaDescription || article.excerpt?.en || "",
    keywords: Array.isArray(article.keywords) ? article.keywords : [],
    imagePrompt: article.imagePrompt || "",
  };
}

export async function getArticles() {
  const articles = await readArticlesFile();
  return articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
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
  featuredImage?: string;
  category?: string;
  readTime?: string;
  metaDescription?: string;
  keywords?: string[];
  imagePrompt?: string;
}) {
  const articles = await readArticlesFile();
  const slug = normalizeSlug(input.slug || input.title.en || "");
  if (!slug) {
    throw new Error("Slug or title is required.");
  }

  const now = new Date();
  const publishedAt = input.publishedAt || now.toISOString().slice(0, 10);

  const payload = normalizeArticle({
    ...input,
    slug,
    publishedAt,
    featuredImage: input.featuredImage || "",
  });

  const existingIndex = articles.findIndex(article => article.slug === slug);

  if (existingIndex >= 0) {
    articles[existingIndex] = payload;
  } else {
    articles.unshift(payload);
  }

  await writeArticlesFile(articles);
  return payload;
}

export async function deleteArticle(slug: string) {
  const articles = await readArticlesFile();
  const nextArticles = articles.filter(article => article.slug !== slug);
  await writeArticlesFile(nextArticles);
  return nextArticles;
}

export { normalizeSlug };
