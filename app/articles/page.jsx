"use client"

import TopicNav from "./components/TopicNav"
import TrendingSection from "./components/TrendingSection"
import ArticleCard from "./components/ArticleCard"
import Sidebar from "./components/Sidebar"
import Link from "next/link"
import { getArticles } from "./data"

export default function ArticlesPage(){

const articles = getArticles()

const featured = articles[0]
const trending = articles.slice(1,3)
const feed = articles.slice(3)

return(

<div className="bg-[#fafafa] min-h-screen">

<div className="max-w-7xl mx-auto px-4 sm:px-6">

{/* PAGE HEADER */}

<div className="mt-8 sm:mt-10 mb-10 sm:mb-12">

<h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
Articles
</h1>

<p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-lg">
10000+ Wisdom Articles
</p>

</div>

{/* TOPIC NAV */}

<TopicNav/>

{/* MAIN GRID */}

<div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 mt-10 sm:mt-12">

<div>

{/* HERO ARTICLE */}

<section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 sm:mb-20">

<div>

<p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
{featured.category}
</p>

<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
{featured.title}
</h2>

<p className="text-gray-600 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
{featured.excerpt}
</p>

<Link
href={`/articles/${featured.slug}`}
className="inline-block mt-5 sm:mt-6 bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm hover:bg-gray-800 transition"
>
Read Article
</Link>

</div>

<div className="relative h-[220px] sm:h-[300px] md:h-[380px] rounded-xl overflow-hidden">

<img
src={featured.featuredImage}
className="object-cover w-full h-full"
/>

</div>

</section>

{/* TRENDING */}

<TrendingSection articles={trending}/>

{/* ARTICLE FEED */}

<section className="mt-16 sm:mt-20 space-y-12 sm:space-y-16">

<h2 className="text-xl sm:text-2xl font-semibold">
Latest Articles
</h2>

{feed.map(article => (

<ArticleCard
key={article.slug}
article={article}
/>

))}

</section>

</div>

{/* SIDEBAR */}

<div className="hidden lg:block">
<Sidebar/>
</div>

</div>

</div>

</div>

)

}