import Link from "next/link"

export default function SignUpPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        <h1 className="text-2xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-6 text-sm">
          Account system coming soon.
        </p>

        <form className="space-y-4">

          <input
            type="text"
            placeholder="Full name"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="button"
            className="w-full bg-black text-white rounded-lg py-2"
          >
            Create Account
          </button>

        </form>

        <p className="text-sm mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="underline font-medium">
            Sign in
          </Link>
        </p>

      </div>

    </section>
  )
}