import Image from "next/image"
import Link from "next/link"

export default function FeaturedArticle({article}){

return(

<Link
href={`/articles/${article.slug}`}
className="relative block h-[420px] rounded-3xl overflow-hidden mb-12"
>

<Image
src={article.featuredImage}
alt={article.title}
fill
className="object-cover"
/>

<div className="absolute inset-0 bg-black/40"/>

<div className="absolute bottom-10 left-10 text-white max-w-xl">

<p className="uppercase text-sm text-orange-400">
{article.category}
</p>

<h2 className="text-4xl font-bold mt-2">
{article.title}
</h2>

<p className="text-sm mt-2 opacity-80">
{article.readTime} • {article.views} reads
</p>

</div>

</Link>

)

}