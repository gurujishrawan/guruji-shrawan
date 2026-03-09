"use client"

import { signIn } from "next-auth/react"

export default function GoogleButton({ callbackUrl }: { callbackUrl: string }) {

  return (
    <button
      onClick={() => signIn("google", { callbackUrl })}
      className="w-full flex items-center justify-center gap-3 border rounded-xl py-2.5 hover:bg-gray-50 transition"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />

      Continue with Google
    </button>
  )
}