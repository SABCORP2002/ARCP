import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

const COOKIE_NAME = "arcp_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12h, renewed on each authenticated request
const MAX_FAILED_ATTEMPTS = 8;
const LOCK_MINUTES = 15;

interface AdminUserRow {
  id: number;
  email: string;
  password_hash: string;
  failed_attempts: number;
  locked_until: string | null;
}

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to a random string of at least 32 characters.");
  }
  return secret;
}

function pwdFingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function setSessionCookie(response: NextApiResponse, value: string, maxAgeSeconds: number) {
  const attributes = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === "production") attributes.push("Secure");
  response.setHeader("Set-Cookie", attributes.join("; "));
}

export function clearSessionCookie(response: NextApiResponse) {
  setSessionCookie(response, "", 0);
}

function issueSession(response: NextApiResponse, email: string, passwordHash: string) {
  const payload = JSON.stringify({ email, fp: pwdFingerprint(passwordHash), iat: Date.now() });
  const encodedPayload = Buffer.from(payload, "utf8").toString("base64url");
  const signature = sign(encodedPayload);
  setSessionCookie(response, `${encodedPayload}.${signature}`, SESSION_MAX_AGE_SECONDS);
}

interface AdminSession {
  email: string;
}

async function readSession(request: NextApiRequest): Promise<AdminSession | null> {
  const cookies = parseCookies(request.headers.cookie);
  const raw = cookies[COOKIE_NAME];
  if (!raw) return null;

  const [encodedPayload, signature] = raw.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  let payload: { email?: string; fp?: string; iat?: number };
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!payload.email || !payload.fp || !payload.iat) return null;
  if (Date.now() - payload.iat > SESSION_MAX_AGE_SECONDS * 1000) return null;

  const { rows } = await query<AdminUserRow>("SELECT id, email, password_hash, failed_attempts, locked_until FROM admin_users WHERE email = $1", [
    payload.email,
  ]);
  const user = rows[0];
  if (!user) return null;
  // Rotating the password changes its fingerprint, which invalidates every
  // previously issued cookie without needing a server-side session store.
  if (pwdFingerprint(user.password_hash) !== payload.fp) return null;

  return { email: user.email };
}

/** Use inside every `/api/admin/*` route handler. Writes a 401 JSON response and returns null when there is no valid session. */
export async function requireApiSession(request: NextApiRequest, response: NextApiResponse): Promise<AdminSession | null> {
  const session = await readSession(request);
  if (!session) {
    response.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return session;
}

/** Use inside every `pages/admin/*` page's getServerSideProps. */
export async function requirePageSession(request: NextApiRequest): Promise<AdminSession | null> {
  return readSession(request);
}

export async function attemptLogin(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; reason: "invalid" | "locked" }> {
  const { rows } = await query<AdminUserRow>(
    "SELECT id, email, password_hash, failed_attempts, locked_until FROM admin_users WHERE email = $1",
    [email],
  );
  const user = rows[0];
  if (!user) {
    // Still run a hash comparison against a dummy value so a non-existent
    // email doesn't respond measurably faster than a wrong password.
    await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinval");
    return { ok: false, reason: "invalid" };
  }

  if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    return { ok: false, reason: "locked" };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const nextAttempts = user.failed_attempts + 1;
    const lockedUntil = nextAttempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null;
    await query("UPDATE admin_users SET failed_attempts = $1, locked_until = $2 WHERE id = $3", [
      nextAttempts,
      lockedUntil,
      user.id,
    ]);
    return { ok: false, reason: lockedUntil ? "locked" : "invalid" };
  }

  await query("UPDATE admin_users SET failed_attempts = 0, locked_until = NULL WHERE id = $1", [user.id]);
  return { ok: true };
}

export async function issueSessionForEmail(response: NextApiResponse, email: string) {
  const { rows } = await query<AdminUserRow>("SELECT password_hash FROM admin_users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user) throw new Error("Unknown admin account");
  issueSession(response, email, user.password_hash);
}

export async function changePassword(email: string, currentPassword: string, newPassword: string) {
  const { rows } = await query<AdminUserRow>("SELECT id, password_hash FROM admin_users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user) throw new Error("Unknown admin account");
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) throw new Error("Current password is incorrect");
  if (newPassword.length < 14) throw new Error("New password must be at least 14 characters");
  const nextHash = await bcrypt.hash(newPassword, 12);
  await query("UPDATE admin_users SET password_hash = $1 WHERE id = $2", [nextHash, user.id]);
  return nextHash;
}
