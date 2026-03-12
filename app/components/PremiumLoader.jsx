"use client"

import { useEffect, useState } from "react"
import Loader from "./Loader"

export default function Page() {

  const [data,setData] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    async function loadData(){

      const res = await fetch("/api/data")
      const result = await res.json()

      setData(result)
      setLoading(false)

    }

    loadData()

  },[])

  if(loading){
    return <Loader/>
  }

  return (
    <div>
      <h1>Page Loaded</h1>
    </div>
  )
}