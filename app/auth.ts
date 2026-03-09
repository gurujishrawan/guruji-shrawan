import { randomUUID, scryptSync, timingSafeEqual, createHmac } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "site_session";
const DEFAULT_REDIRECT = "/profile";
const USERS_FILE = path.join(process.cwd(), "data", "users.json");

type UserRole = "admin" | "user";

type SessionUser = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
};

type Session = {
  user: SessionUser;
};

type StoredUser = {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

type SignInOptions = {
  username?: string;
  password?: string;
  redirectTo?: string;
};

type RegisterOptions = {
  name?: string;
  username?: string;
  password?: string;
  redirectTo?: string;
};

type AuthenticatedRequest = NextRequest & {
  auth: Session | null;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

function toBase64Url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function createSignature(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

function createSessionToken(user: SessionUser) {
  const payload = toBase64Url(JSON.stringify(user));
  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}

function parseSessionToken(token: string | undefined): Session | null {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  const expected = createSignature(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length != expectedBuffer.length) {
    return null;
  }

  const valid = timingSafeEqual(signatureBuffer, expectedBuffer);
  if (!valid) {
    return null;
  }

  try {
    const user = JSON.parse(fromBase64Url(payload)) as SessionUser;
    if (!user?.id || !user?.username || !user?.role) {
      return null;
    }
    return { user };
  } catch {
    return null;
  }
}

async function ensureUsersFile() {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf8");
  }
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureUsersFile();
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await ensureUsersFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: "user",
  };
}

async function getSessionFromRequest(request: Request): Promise<Session | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`));

  const token = sessionCookie?.slice(SESSION_COOKIE.length + 1);
  return parseSessionToken(token);
}

async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: createSessionToken(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function signIn(_provider: "credentials", options: SignInOptions = {}) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const username = String(options.username || "").trim().toLowerCase();
  const password = String(options.password || "");
  const redirectTo = options.redirectTo || DEFAULT_REDIRECT;

  if (adminUsername && adminPassword && username === adminUsername.toLowerCase() && password === adminPassword) {
    await setSession({ id: "admin", name: "Admin", username, role: "admin" });
    redirect(redirectTo === "/" ? "/admin" : redirectTo);
  }

  const users = await readUsers();
  const user = users.find((item) => item.username === username);
  if (!user) {
    redirect("/signin?error=CredentialsSignin");
  }

  const inputHash = hashPassword(password, user.salt);
  if (inputHash !== user.passwordHash) {
    redirect("/signin?error=CredentialsSignin");
  }

  await setSession(toSessionUser(user));
  redirect(redirectTo);
}

export async function registerUser(options: RegisterOptions = {}) {
  const name = String(options.name || "").trim();
  const username = String(options.username || "").trim().toLowerCase();
  const password = String(options.password || "");
  const redirectTo = options.redirectTo || DEFAULT_REDIRECT;

  if (!name || !username || !password || password.length < 6) {
    redirect("/signup?error=InvalidInput");
  }

  const users = await readUsers();
  if (users.some((item) => item.username === username)) {
    redirect("/signup?error=UsernameTaken");
  }

  const salt = randomUUID();
  const storedUser: StoredUser = {
    id: randomUUID(),
    name,
    username,
    passwordHash: hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
  };

  users.push(storedUser);
  await writeUsers(users);
  await setSession(toSessionUser(storedUser));
  redirect(redirectTo);
}

export async function signOut(options: { redirectTo?: string } = {}) {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect(options.redirectTo || "/");
}

export function auth(callback: (request: AuthenticatedRequest) => Response | Promise<Response>) {
  return async (request: NextRequest) => {
    const session = await getSessionFromRequest(request);
    const enriched = request as AuthenticatedRequest;
    enriched.auth = session;
    return callback(enriched);
  };
}

export const handlers = {
  GET: async (request: Request) => {
    const pathname = new URL(request.url).pathname;

    if (pathname.endsWith("/session")) {
      const session = await getSessionFromRequest(request);
      return Response.json(session);
    }

    if (pathname.endsWith("/signout")) {
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE);
      return Response.json({ ok: true });
    }

    return new Response("Not Found", { status: 404 });
  },
  POST: async () => new Response("Not Found", { status: 404 }),
};
