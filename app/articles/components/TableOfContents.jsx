"use client"

import { useEffect, useState } from "react"

export default function TableOfContents({content}){

const [headings,setHeadings] = useState([])

useEffect(()=>{

const parser = new DOMParser()

const doc = parser.parseFromString(content,"text/html")

const h2 = doc.querySelectorAll("h2")

const list = [...h2].map(h => ({
text: h.textContent,
id: h.id
}))

setHeadings(list)

},[content])

if(!headings.length) return null

return(

<div className="border rounded-xl p-4 bg-white">

<h4 className="font-semibold mb-3">

Contents

</h4>

<ul className="space-y-2 text-sm">

{headings.map(h=>(
<li key={h.id}>
<a href={`#${h.id}`} className="text-gray-600 hover:text-black">
{h.text}
</a>
</li>
))}

</ul>

</div>

)

}