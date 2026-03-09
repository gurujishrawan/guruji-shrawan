import TrendingCard from "./TrendingCard"

export default function TrendingSection({articles}){

return(

<section className="mt-16">

<h2 className="text-2xl font-semibold mb-8">
Trending
</h2>

<div className="grid md:grid-cols-2 gap-12">

{articles.map(article =>(

<TrendingCard
key={article.slug}
article={article}
/>

))}

</div>

</section>

)

}