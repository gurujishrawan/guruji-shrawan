import Link from "next/link";
import { signIn } from "../auth";

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

const errorMessage: Record<string, string> = {
  CredentialsSignin: "Invalid username or password.",
  MissingAdminEnv: "Admin credentials are not configured yet.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {};
  const callbackUrl = params.callbackUrl || "/profile";
  const error = params.error ? (errorMessage[params.error] || "Unable to sign in.") : "";

  async function authenticate(formData: FormData) {
    "use server";

    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");
    const redirectTo = String(formData.get("callbackUrl") || "/profile");

    await signIn("credentials", {
      username,
      password,
      redirectTo,
    });
  }

  return (
    <section className="min-h-screen bg-[#f7f5f2] px-6 py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#1c1c1c]">Sign in</h1>
        <p className="mb-6 text-sm text-gray-600">Sign in as an admin or a registered user.</p>
        {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form action={authenticate} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

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
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded bg-[#1c1c1c] px-4 py-2 text-sm font-semibold text-white"
          >
            Sign in
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          New here? <Link href="/signup" className="font-semibold underline">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
