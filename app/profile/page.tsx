import Link from "next/link";
import { cookies } from "next/headers";

function decodeUserFromSessionCookie(raw: string | undefined) {
  if (!raw || !raw.includes(".")) {
    return null;
  }

  const [payload] = raw.split(".");
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      name: string;
      username: string;
      role: "admin" | "user";
    };
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const user = decodeUserFromSessionCookie(cookieStore.get("site_session")?.value);

  return (
    <section className="min-h-screen bg-[#f7f5f2] px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Personalized dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-[#1c1c1c]">Welcome, {user?.name || "friend"}</h1>
        <p className="mt-4 text-sm text-gray-700">
          Signed in as <strong>{user?.username}</strong> ({user?.role}).
        </p>
        <p className="mt-2 text-sm text-gray-600">
          We can now personalize your content journey based on your profile and preferences.
        </p>
        <Link href="/articles" className="mt-6 inline-block rounded bg-[#1c1c1c] px-4 py-2 text-sm font-semibold text-white">
          Explore articles
        </Link>
      </div>
    </section>
  );
}
