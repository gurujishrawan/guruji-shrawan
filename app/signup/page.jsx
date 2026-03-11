"use client"

import { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { supabase } from "../lib/supabaseClient"

export default function SignUpPage(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [showPassword,setShowPassword] = useState(false)
const [loading,setLoading] = useState(false)

async function handleSignup(e){

e.preventDefault()
setLoading(true)

const { error } = await supabase.auth.signUp({
email,
password
})

setLoading(false)

if(error){
toast.error(error.message)
}else{
toast.success("Account created! Check email.")
}

}

return(

<section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#fff8f3] via-[#fafafa] to-[#fff2e8]">

<motion.div
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.6}}
className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-[#efe4d7] rounded-2xl shadow-xl p-8"

>

<h1 className="text-3xl font-bold text-center mb-2">
Create Account
</h1>

<p className="text-gray-500 text-center mb-6 text-sm">
Start your journey today
</p>

<form onSubmit={handleSignup} className="space-y-5">

<div className="relative">

<Mail size={18} className="absolute left-3 top-3 text-gray-400"/>

<input
type="email"
required
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="peer w-full pl-10 pr-3 py-2 border border-[#e8dfd4] rounded-lg outline-none focus:ring-2 focus:ring-[#d4621a]"
/>

<label className="absolute left-10 top-2 text-sm text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#d4621a] bg-white px-1 transition-all">
Email
</label>

</div>

<div className="relative">

<Lock size={18} className="absolute left-3 top-3 text-gray-400"/>

<input
type={showPassword ? "text":"password"}
required
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="peer w-full pl-10 pr-10 py-2 border border-[#e8dfd4] rounded-lg outline-none focus:ring-2 focus:ring-[#d4621a]"
/>

<label className="absolute left-10 top-2 text-sm text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#d4621a] bg-white px-1 transition-all">
Password
</label>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-2.5 text-gray-400"

>

{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}

</button>

</div>

<button
type="submit"
disabled={loading}
className="w-full py-2 rounded-lg text-white font-semibold hover:scale-[1.02] transition"
style={{background:"linear-gradient(135deg,#d4621a,#c8521a)"}}

>

{loading ? "Creating..." : "Sign Up"}

</button>

</form>

<p className="text-sm text-center mt-6">

Already have an account?{" "}

<Link href="/signin" className="text-[#d4621a] font-semibold hover:underline">
Sign in
</Link>

</p>

</motion.div>

</section>

)
}
