"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { supabase } from "../lib/supabaseClient"
import AuthLayout from "../components/AuthLayout"
export const dynamic = "force-dynamic"
export default function SignIn(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [showPassword,setShowPassword] = useState(false)
const [loading,setLoading] = useState(false)

async function handleLogin(e){

e.preventDefault()
setLoading(true)

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

setLoading(false)

if(!error){
window.location.href="/dashboard"
}

}

async function googleLogin(){

await supabase.auth.signInWithOAuth({
provider:"google"
})

}

return (

<AuthLayout activeTab="signin">

<h2 className="text-2xl font-semibold mb-2">
Welcome 
</h2>

<p className="text-gray-500 text-sm mb-6">
Enter your details to sign up.
</p>

<form onSubmit={handleLogin} className="space-y-4">

<input
type="email"
placeholder="Email address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
/>

<div className="relative">

<input
type={showPassword ? "text":"password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-2.5 text-gray-400"

>

{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>} </button>

</div>

<button
type="submit"
className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"

>

{loading ? "Signing up..." : "Sign Up"} </button>

</form>

<div className="flex items-center gap-3 my-6">
<div className="flex-1 h-px bg-gray-200"/>
<span className="text-xs text-gray-400">OR</span>
<div className="flex-1 h-px bg-gray-200"/>
</div>

<button
onClick={googleLogin}
className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"

>

<img
src="https://www.svgrepo.com/show/475656/google-color.svg"
className="w-5"
/>

Continue with Google

</button>

</AuthLayout>

)

}
