"use client"

import Link from "next/link"
import Image from "next/image"

export default function ArticleCard({article}){

const img = article.featuredImage || "/images/default.jpg"

return(

<article className="grid md:grid-cols-[1fr_320px] gap-10 items-start border-b pb-12">

<div>

<p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-2">
{article.category}
</p>

<Link href={`/articles/${article.slug}`}>

<h3 className="text-2xl font-semibold leading-snug hover:text-orange-600 transition">
{article.title}
</h3>

</Link>

<p className="text-gray-600 mt-4 leading-relaxed text-[15px]">
{article.excerpt}
</p>

<div className="flex gap-6 mt-4 text-sm text-gray-500">

<span>{article.readTime}</span>

<span>{article.views} views</span>

<span>{article.likes} likes</span>

</div>

</div>

<div className="relative h-[200px] rounded-xl overflow-hidden">

<Image
src={img}
fill
alt=""
className="object-cover"
/>

</div>

</article>

)

}