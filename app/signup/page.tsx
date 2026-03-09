import Link from "next/link";
import { registerUser } from "../auth";

type SignUpPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

const errorMessage: Record<string, string> = {
  InvalidInput: "Please provide name, username, and a password of at least 6 characters.",
  UsernameTaken: "That username is already taken.",
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = (await searchParams) ?? {};
  const callbackUrl = params.callbackUrl || "/profile";
  const error = params.error ? (errorMessage[params.error] || "Unable to create account.") : "";

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

  return (
    <section className="min-h-screen bg-[#f7f5f2] px-6 py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#1c1c1c]">Create account</h1>
        <p className="mb-6 text-sm text-gray-600">Create a user account for a personalized experience.</p>
        {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form action={register} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <label className="block text-sm font-medium text-gray-700">
            Full name
            <input
              name="name"
              type="text"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Username
            <input
              name="username"
              type="text"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Password
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded bg-[#1c1c1c] px-4 py-2 text-sm font-semibold text-white"
          >
            Create account
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          Already have an account? <Link href="/signin" className="font-semibold underline">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
