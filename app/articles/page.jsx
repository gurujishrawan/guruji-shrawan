"use client"

import TopicNav from "./components/TopicNav"
import TrendingSection from "./components/TrendingSection"
import ArticleCard from "./components/ArticleCard"
import Sidebar from "./components/Sidebar"

import { getArticles } from "./data"

export default function ArticlesPage(){

const articles = getArticles()

const featured = articles[0]
const trending = articles.slice(1,3)
const feed = articles.slice(3)

return(

<div className="bg-[#fafafa] min-h-screen">

<div className="max-w-7xl mx-auto px-6">

{/* PAGE HEADER */}

<div className="mt-10 mb-12">

<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
Articles
</h1>

<p className="text-gray-500 mt-3 text-lg">
10000+ Wisdom Articles
</p>

</div>

{/* TOPIC NAV */}

<TopicNav/>

{/* MAIN GRID */}

<div className="grid lg:grid-cols-[1fr_320px] gap-16 mt-12">

<div>

{/* HERO ARTICLE */}

<section className="grid md:grid-cols-2 gap-12 items-center mb-20">

<div>

<p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
{featured.category}
</p>

<h2 className="text-4xl font-bold leading-tight">
{featured.title}
</h2>

<p className="text-gray-600 mt-4 leading-relaxed">
{featured.excerpt}
</p>

<button className="mt-6 bg-black text-white px-6 py-3 rounded-lg text-sm">
Read Article
</button>

</div>

<div className="relative h-[380px] rounded-xl overflow-hidden">

<img
src={featured.featuredImage}
className="object-cover w-full h-full"
/>

</div>

</section>

{/* TRENDING */}

<TrendingSection articles={trending}/>

{/* ARTICLE FEED */}

<section className="mt-20 space-y-16">

<h2 className="text-2xl font-semibold">
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

<Sidebar/>

</div>

</div>

</div>

)

}