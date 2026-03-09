import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";
const USER_PATH_PREFIX = "/profile";

function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get("site_session")?.value;
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload] = token.split(".");
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const user = JSON.parse(json) as { role?: "admin" | "user" };
    if (!user.role) {
      return null;
    }
    return { user };
  } catch {
    return null;
  }
}

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = getSessionFromRequest(request);

  if (pathname.startsWith(ADMIN_PATH_PREFIX)) {
    if (session?.user?.role === "admin") {
      return NextResponse.next();
    }

    const callbackUrl = `${pathname}${search}`;
    const signInUrl = new URL("/signin", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.startsWith(USER_PATH_PREFIX) && !session?.user) {
    const callbackUrl = `${pathname}${search}`;
    const signInUrl = new URL("/signin", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
