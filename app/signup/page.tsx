import Link from "next/link";
import { registerUser, signIn } from "../lib/auth";

type SignUpPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

const errorMessage: Record<string, string> = {
  InvalidInput:
    "Please provide name, username, and a password of at least 6 characters.",
  UsernameTaken: "That username is already taken.",
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = (await searchParams) ?? {};
  const callbackUrl = params.callbackUrl || "/profile";
  const error = params.error
    ? errorMessage[params.error] || "Unable to create account."
    : "";

  async function register(formData: FormData) {
    "use server";

    const name = String(formData.get("name") || "");
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");
    const redirectTo = String(formData.get("callbackUrl") || "/profile");

    await registerUser({
      name,
      username,
      password,
      redirectTo,
    });
  }

  async function googleSignup() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">

      <div className="grid md:grid-cols-2 max-w-6xl w-full bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* LEFT SIDE */}

        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-gray-50 to-gray-100">

          <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Join Guruji Shrawan
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Create an account to save articles, follow teachings,
            and continue your learning journey.
          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-10">

          <h1 className="text-2xl font-bold text-gray-900">
            Create account
          </h1>

          <p className="text-gray-500 text-sm mt-1 mb-6">
            Start your journey today
          </p>

          {error && (
            <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* GOOGLE SIGNUP */}

          <form action={googleSignup}>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 border rounded-xl py-2.5 hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />

              Continue with Google

            </button>

          </form>

          {/* Divider */}

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* REGISTER FORM */}

          <form action={register} className="space-y-4">

            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <label className="block text-sm font-medium text-gray-700">
              Full name
              <input
                name="name"
                required
                type="text"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </label>

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
                minLength={6}
                type="password"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-gray-800 transition"
            >
              Create account
            </button>

          </form>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold underline">
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </section>
  );
}