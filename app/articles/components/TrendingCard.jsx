"use client"

import Image from "next/image"
import Link from "next/link"

export default function TrendingCard({article}){

return(

<article className="space-y-4 group">

<div className="relative h-60 rounded-xl overflow-hidden">

<Image
src={article.featuredImage}
fill
alt=""
className="object-cover group-hover:scale-105 transition"
/>

</div>

<p className="text-xs uppercase text-orange-500 font-semibold">
{article.category}
</p>

<Link href={`/articles/${article.slug}`}>

<h3 className="text-xl font-semibold group-hover:text-orange-600 transition">
{article.title}
</h3>

</Link>

<p className="text-gray-600 text-sm">
{article.excerpt}
</p>

<div className="flex gap-5 text-sm text-gray-500">

<span>{article.readTime}</span>
<span>{article.views}</span>

</div>

</article>

)

}