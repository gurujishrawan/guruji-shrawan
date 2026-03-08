import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const sourcePath = path.join(repoRoot, "data", "seo-articles-pack.txt");
const targetPath = path.join(repoRoot, "data", "articles.json");

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toParagraphHtml(text) {
  return text
    .split(/\n\s*\n/)
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => `<p>${part}</p>`)
    .join("\n");
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.min(6, Math.round(words / 180)));
  return `${minutes} min`;
}

function extractLineField(block, label) {
  const match = block.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function extractArticleBody(block) {
  const match = block.match(/ARTICLE:\s*([\s\S]*)$/);
  return match ? match[1].trim() : "";
}

function parseArticles(raw) {
  const blocks = raw
    .trim()
    .split(/\n(?=TITLE:\s*)/)
    .map(item => item.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const title = extractLineField(block, "TITLE");
    const category = extractLineField(block, "CATEGORY");
    const metaDescription = extractLineField(block, "META DESCRIPTION");
    const imagePrompt = extractLineField(block, "IMAGE PROMPT");
    const articleBody = extractArticleBody(block);

    if (!title || !category || !articleBody) {
      throw new Error(`Invalid article block at index ${index}`);
    }

    return {
      slug: slugify(title),
      title: { en: title, hi: title },
      excerpt: {
        en: metaDescription || `${articleBody.split(".")[0]}.`,
        hi: metaDescription || `${articleBody.split(".")[0]}.`,
      },
      content: {
        en: toParagraphHtml(articleBody),
        hi: toParagraphHtml(articleBody),
      },
      publishedAt: new Date(Date.now() - index * 86400000).toISOString().slice(0, 10),
      featuredImage: `/images/hero${(index % 3) + 1}.jpg`,
      category,
      readTime: estimateReadTime(articleBody),
      metaDescription,
      keywords: [],
      imagePrompt,
    };
  });
}

async function main() {
  const source = await readFile(sourcePath, "utf-8");
  const parsed = parseArticles(source);
  await writeFile(targetPath, `${JSON.stringify(parsed, null, 2)}\n`);
  console.log(`Imported ${parsed.length} articles to data/articles.json`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
