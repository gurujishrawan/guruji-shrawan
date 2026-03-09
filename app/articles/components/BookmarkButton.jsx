"use client"

import { useState,useEffect } from "react"

export default function BookmarkButton({slug}){

const [saved,setSaved] = useState(false)

useEffect(()=>{

const items =
JSON.parse(localStorage.getItem("bookmarks")||"[]")

setSaved(items.includes(slug))

},[])

function toggle(){

let items =
JSON.parse(localStorage.getItem("bookmarks")||"[]")

if(items.includes(slug)){
items = items.filter(i=>i!==slug)
}else{
items.push(slug)
}

localStorage.setItem("bookmarks",JSON.stringify(items))

setSaved(!saved)

}

return(

<button
onClick={toggle}
className="border px-4 py-2 rounded-lg"
>

{saved ? "Saved" : "Bookmark"}

</button>

)

}