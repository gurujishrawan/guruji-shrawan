import Link from "next/link"
import { signIn } from "../lib/auth"
import GoogleButton from "./GoogleButton"

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string
    error?: string
  }>
}

const errorMessage: Record<string, string> = {
  CredentialsSignin: "Invalid username or password."
}

export default async function SignInPage({ searchParams }: SignInPageProps) {

  const params = (await searchParams) ?? {}
  const callbackUrl = params.callbackUrl || "/profile"
  const error = params.error ? errorMessage[params.error] || "Unable to sign in." : ""

  async function authenticate(formData: FormData) {
    "use server"

    const username = String(formData.get("username") || "")
    const password = String(formData.get("password") || "")
    const redirectTo = String(formData.get("callbackUrl") || "/profile")

    await signIn("credentials", {
      username,
      password,
      redirectTo
    })
  }

  async function googleLogin() {
    "use server"
    await signIn("google", { redirectTo: callbackUrl })
  }

  return (

    <section className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">

      <div className="grid md:grid-cols-2 max-w-6xl w-full bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* LEFT SIDE */}

        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-gray-50 to-gray-100">

          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome back to
            <br />
            Guruji Shrawan
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Sign in to continue reading wisdom articles, save your favorites,
            and access your personal reading journey.
          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-10">

          <h1 className="text-2xl font-bold text-gray-900">
            Sign in
          </h1>

          <p className="text-gray-500 text-sm mt-1 mb-6">
            Continue to your account
          </p>

          {error && (
            <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* GOOGLE LOGIN */}

{/* GOOGLE LOGIN */}

<GoogleButton callbackUrl={callbackUrl} />

{/* Divider */}

<div className="flex items-center my-6">
  <div className="flex-1 h-px bg-gray-200" />
  <span className="px-3 text-gray-400 text-sm">or</span>
  <div className="flex-1 h-px bg-gray-200" />
</div>

 
          {/* Credentials Login */}

          <form action={authenticate} className="space-y-4">

            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <label className="block text-sm font-medium text-gray-700">

              Username

              <input
                name="username"
                required
                type="text"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
              />

            </label>

            <label className="block text-sm font-medium text-gray-700">

              Password

              <input
                name="password"
                required
                type="password"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
              />

            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-gray-800 transition"
            >
              Sign in
            </button>

          </form>

          <p className="mt-6 text-sm text-gray-600">

            New here?{" "}

            <Link href="/signup" className="font-semibold underline">
              Create an account
            </Link>

          </p>

        </div>

      </div>

    </section>

  )
}