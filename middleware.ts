import { NextResponse } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";

export function middleware(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse(
      "Missing ADMIN_PASSWORD. Set it to protect /admin.",
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic realm=CMS",
      },
    });
  }

  const base64Credentials = authHeader.split(" ")[1] || "";
  const decoded = atob(base64Credentials);
  const [, passwordValue] = decoded.split(":");

  if (passwordValue !== password) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic realm=CMS",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
