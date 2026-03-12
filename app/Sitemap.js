import { getArticles } from "../app/data"

export default function sitemap() {
  const articles = getArticles()
  const BASE = "https://gurujishrawan.com"

  const staticPages = [
    { url: `${BASE}/`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/articles`,lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ]

  const articlePages = articles.map(a => ({
    url:             `${BASE}/articles/${a.slug}`,
    lastModified:    a.updatedAt ? new Date(a.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority:        0.8,
  }))

  return [...staticPages, ...articlePages]
}