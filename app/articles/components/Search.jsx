import { getArticles } from "./data"

import ArticleCard from "./components/ArticleCard"
import FeaturedArticle from "./components/FeaturedArticle"
import Sidebar from "./components/Sidebar"
import TopicNav from "./components/TopicNav"

export default function ArticlesPage(){

const articles = getArticles()

const featured = articles[0]

const trending =
[...articles].sort(
(a,b)=>(b.views*0.7 + b.likes*0.3) -
(a.views*0.7 + a.likes*0.3)
)

return(

<section className="bg-[#f7f7f7] pb-20">

<div className="mx-auto w-[min(1300px,95%)] pt-12 grid lg:grid-cols-[1fr_320px] gap-12">

<div>

<h1 className="text-6xl font-black mb-10">
Articles
</h1>

<TopicNav/>

<FeaturedArticle article={featured}/>

<h2 className="text-3xl font-bold mb-8">
Trending
</h2>

<div className="grid md:grid-cols-2 gap-8">

{trending.slice(0,4).map(article=>(
<ArticleCard key={article.slug} article={article}/>
))}

</div>

<h2 className="text-3xl font-bold mt-16 mb-8">
Latest
</h2>

<div className="space-y-8">

{articles.map(article=>(
<ArticleCard key={article.slug} article={article}/>
))}

</div>

</div>

<Sidebar/>

</div>

</section>

)

}