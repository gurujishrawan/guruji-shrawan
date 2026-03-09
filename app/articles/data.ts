export type Article = {
  slug: string
  category: string
  title: string
  excerpt: string
  featuredImage?: string
  readTime: string
  views: number
  likes: number
  publishedAt: string
  content: string
  tags: string[]
}

export const articles: Article[] = [
{
slug: "who-controls-your-mood",
category: "Mind",
title: "Who Controls Your Mood?",
excerpt:
"Our mood often depends on situations and people. But can we reclaim emotional independence?",
featuredImage: "/images/mood.jpg",
readTime: "4 min",
views: 7400,
likes: 320,
publishedAt: "2026-03-08",
tags:["mind"],
content: `
<h2>Why Mood Depends on Others</h2>
<p>Most people think happiness depends on situations. Praise makes us happy, criticism makes us miserable.</p>

<h2>The Problem of Dependency</h2>
<p>When emotions depend on others we lose inner stability.</p>

<h3>Observe Yourself</h3>
<p>Notice how your emotional state constantly shifts depending on others.</p>

<h2>Real Freedom</h2>
<p>Freedom begins when your inner state stops reacting automatically.</p>
`
},

{
slug: "modern-life-creates-anxiety",
category: "Society",
title: "Why Modern Life Creates Anxiety",
excerpt:
"Despite technological progress anxiety keeps increasing in modern civilization.",
featuredImage: "/images/social.jpg",
readTime: "5 min",
views: 5200,
likes: 210,
publishedAt: "2026-03-06",
tags:["society"],
content: `
<h2>The Speed of Modern Life</h2>
<p>Technology accelerates life but also increases pressure.</p>

<h2>Comparison Culture</h2>
<p>Social media constantly compares lives.</p>

<h3>The Result</h3>
<p>Anxiety becomes normal.</p>

<h2>Returning to Clarity</h2>
<p>Real peace requires psychological independence.</p>
`
},

{
slug:"freedom-from-fear",
category:"Freedom",
title:"Freedom From Fear",
excerpt:"Fear shapes most human decisions but rarely solves problems.",
featuredImage:"/images/fear.jpg",
readTime:"6 min",
views:4300,
likes:190,
publishedAt:"2026-03-04",
tags:["freedom"],
content:`
<h2>The Psychology of Fear</h2>
<p>Fear appears whenever security feels threatened.</p>

<h2>False Protection</h2>
<p>Fear promises safety but creates limitation.</p>

<h2>Seeing Fear Clearly</h2>
<p>Observation dissolves psychological fear.</p>
`
},

{
slug:"understanding-the-mind",
category:"Mind",
title:"Understanding The Mind",
excerpt:"The human mind constantly reacts to memory, conditioning and desire.",
featuredImage:"/images/mind-control.jpg",
readTime:"7 min",
views:3900,
likes:150,
publishedAt:"2026-03-02",
tags:["mind"],
content:`
<h2>The Nature of Thought</h2>
<p>Thought is memory in motion.</p>

<h2>Conditioning</h2>
<p>Society shapes how we think.</p>

<h2>Awareness</h2>
<p>Observation reveals the movement of thought.</p>
`
},

{
slug:"the-meaning-of-freedom",
category:"Freedom",
title:"The Meaning Of Freedom",
excerpt:"Freedom is not doing whatever you want but understanding yourself deeply.",
featuredImage:"/images/freedom.jpg",
readTime:"5 min",
views:3100,
likes:120,
publishedAt:"2026-03-01",
tags:["freedom"],
content:`
<h2>Freedom Misunderstood</h2>
<p>People think freedom means unlimited choice.</p>

<h2>Psychological Freedom</h2>
<p>True freedom appears when conditioning ends.</p>

<h2>Inner Clarity</h2>
<p>Freedom begins with understanding the mind.</p>
`
}

]

export function getArticles(): Article[] {
return articles
}

export function getArticleBySlug(
slug: string | string[] | undefined
): Article | undefined {

if (!slug) return undefined

const cleanSlug =
Array.isArray(slug)
? slug[0].trim().toLowerCase()
: slug.trim().toLowerCase()

return articles.find(
(article) => article.slug.trim().toLowerCase() === cleanSlug
)

}