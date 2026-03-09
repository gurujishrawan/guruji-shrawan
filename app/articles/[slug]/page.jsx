import { getArticles } from "../data"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ReadingProgress from "../components/ReadingProgress"

export default async function ArticlePage({ params }) {

const resolvedParams = await params
const slug = resolvedParams.slug

const articles = getArticles()

const article = articles.find(a => a.slug === slug)

if (!article) {
return notFound()
}

const related =
articles
.filter(a => a.slug !== article.slug)
.slice(0,3)

return (

<article className="bg-[#f7f7f7] pb-20">
<ReadingProgress/>
{/* HERO */}

<div className="relative h-[420px] overflow-hidden">

<Image
src={article.featuredImage}
alt={article.title}
fill
className="object-cover"
/>

<div className="absolute inset-0 bg-black/40"/>

<div className="absolute bottom-12 left-12 text-white">

<p className="text-sm uppercase text-orange-400">
{article.category}
</p>

<h1 className="text-4xl font-bold">
{article.title}
</h1>

<p className="text-sm mt-2 opacity-80">
{article.readTime} • {article.views} reads
</p>

</div>

</div>

{/* CONTENT */}

<div className="max-w-4xl mx-auto mt-12 bg-white p-10 rounded-2xl shadow-sm">

<div
className="prose max-w-none"
dangerouslySetInnerHTML={{ __html: article.content }}
/>

</div>

{/* RELATED */}

<div className="max-w-5xl mx-auto mt-16">

<h2 className="text-2xl font-bold mb-6">
Related Articles
</h2>

<div className="grid md:grid-cols-3 gap-6">

{related.map(a => (

<Link
key={a.slug}
href={`/articles/${a.slug}`}
className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
>

<p className="text-xs uppercase text-orange-500">
{a.category}
</p>

<p className="font-semibold mt-1">
{a.title}
</p>

</Link>

))}

</div>

</div>

</article>

)
}