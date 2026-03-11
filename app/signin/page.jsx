"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { supabase } from "../lib/supabaseClient"

export default function SignInPage(){

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

if(error){
toast.error(error.message)
}else{
toast.success("Welcome back")
window.location.href="/dashboard"
}

}

async function handleGoogleLogin(){

await supabase.auth.signInWithOAuth({
provider:"google",
options:{
redirectTo:`${location.origin}/dashboard`
}
})

}

return(

<section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">

<motion.div
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.5}}
className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl p-10"

>

<h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
Sign in to your account
</h1>

<p className="text-gray-500 text-center mb-8">
Welcome back to Guruji Shrawan
</p>

<form onSubmit={handleLogin} className="space-y-5">

<div className="relative">

<Mail className="absolute left-3 top-3 text-gray-400" size={18}/>

<input
type="email"
placeholder="Email address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
/>

</div>

<div className="relative">

<Lock className="absolute left-3 top-3 text-gray-400" size={18}/>

<input
type={showPassword ? "text":"password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"

>

{loading ? "Signing in..." : "Sign In"}

</button>

</form>

<div className="flex items-center gap-3 my-6">
<div className="flex-1 h-[1px] bg-gray-200"/>
<span className="text-sm text-gray-400">OR</span>
<div className="flex-1 h-[1px] bg-gray-200"/>
</div>

<button
onClick={handleGoogleLogin}
className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"

>

<img
src="https://www.svgrepo.com/show/475656/google-color.svg"
className="w-5 h-5"
/>

Continue with Google

</button>

<p className="text-sm text-center mt-6 text-gray-600">

Don't have an account?{" "}

<Link href="/signup" className="text-blue-600 font-medium hover:underline">
Sign up
</Link>

</p>

</motion.div>

</section>

)

}
