"use client"

import { useEffect,useState } from "react"

export default function ReadingProgress(){

const [progress,setProgress] = useState(0)

useEffect(()=>{

function update(){

const scroll = window.scrollY
const height = document.body.scrollHeight - window.innerHeight

setProgress((scroll/height)*100)

}

window.addEventListener("scroll",update)

return ()=>window.removeEventListener("scroll",update)

},[])

return(

<div
className="fixed top-0 left-0 h-[4px] bg-orange-500 z-50"
style={{width:`${progress}%`}}
/>

)

}