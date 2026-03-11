"use client"

import Link from "next/link"
import { articles } from "../data.ts"
import s from "../articles.module.css"
import { ArrowLeft } from "lucide-react"

function groupByCategory(data) {
  const map = {}

  data.forEach((article) => {
    if (!map[article.category]) {
      map[article.category] = []
    }
    map[article.category].push(article)
  })

  return map
}

export default function ArticlesIndexPage() {

  const grouped = groupByCategory(articles)

  return (
    
    <div className={`${s.articlesRoot} min-h-screen`} style={{ background:"#faf8f5" }}>
      
      <div className="max-w-6xl mx-auto px-4 py-12">


 <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">

<Link
  href="/articles"
  className="fixed top-24 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 hover:shadow-lg hover:bg-[#fff3e8]"
  style={{ color: "#d4621a" }}
>
  <ArrowLeft size={18} />
</Link>

 

</div>
        <h1
          className={`${s.fontDisplay} text-3xl font-bold mb-10`}
          style={{ color:"#1a1008" }}
        >
          All Articles
        </h1>

        {Object.entries(grouped).map(([category, items]) => (

          <section key={category} className="mb-14">

            <h2
              className={`${s.fontDisplay} text-xl font-semibold mb-6`}
              style={{ color:"#d4621a" }}
            >
              {category}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {items.map((article) => (

                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="block bg-white rounded-xl overflow-hidden transition hover:shadow-lg"
                >

                  {article.featuredImage && (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-40 object-cover"
                    />
                  )}

                  <div className="p-4">

                    <h3
                      className={`${s.fontBody} text-[16px] font-semibold mb-2`}
                      style={{ color:"#2c1b0f" }}
                    >
                      {article.title}
                    </h3>

                    <p
                      className={`${s.fontBody} text-[13px] mb-3`}
                      style={{ color:"#7a6a5a" }}
                    >
                      {article.excerpt}
                    </p>

                    <div className="flex justify-between text-xs text-[#b0a090]">

                      <span>{article.readTime}</span>

                      <span>
                        {article.views} views · {article.likes} likes
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          </section>

        ))}

      </div>

    </div>
  )
}