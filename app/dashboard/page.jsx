"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Dashboard(){

const [user,setUser] = useState(null)

useEffect(()=>{

async function loadUser(){

const { data:{ user } } = await supabase.auth.getUser()

if(!user){
window.location.href="/signin"
return
}

setUser(user)

}

loadUser()

},[])

async function handleLogout(){

await supabase.auth.signOut()
window.location.href="/signin"

}

return(

<div className="p-10">

<h1 className="text-3xl font-bold">
Dashboard
</h1>

<p className="mt-4">
Welcome {user?.email}
</p>

<button
onClick={handleLogout}
className="mt-6 px-4 py-2 bg-black text-white rounded"
>
Logout
</button>

</div>

)

}