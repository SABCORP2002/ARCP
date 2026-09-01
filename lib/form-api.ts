import { createHash } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";

interface Attempt {
  count: number;
  expiresAt: number;
}

const attempts = new Map<string, Attempt>();
const allowedWindow = 10 * 60 * 1000;

function value(body: NextApiRequest["body"], name: string, maximum = 5000) {
  const raw = typeof body?.[name] === "string" ? body[name] : "";
  return raw.trim().slice(0, maximum);
}

function requestHost(request: NextApiRequest) {
  const forwardedHost = request.headers["x-forwarded-host"];
  return (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || request.headers.host || "";
}

function allowedFormOrigins() {
  return new Set(
    (process.env.FORM_ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean),
  );
}

export function guardPublicForm(request: NextApiRequest, response: NextApiResponse, requiresConsent = true) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return false;
  }

  const source = request.headers.origin || request.headers.referer;
  const host = requestHost(request);
  if (!source || !host) {
    response.status(403).json({ error: "Invalid form origin" });
    return false;
  }
  try {
    const sourceUrl = new URL(source);
    const configuredOrigins = allowedFormOrigins();
    const isAllowed = configuredOrigins.size
      ? configuredOrigins.has(sourceUrl.origin)
      : sourceUrl.host === host;
    if (!isAllowed) {
      response.status(403).json({ error: "Invalid form origin" });
      return false;
    }
  } catch {
    response.status(403).json({ error: "Invalid form origin" });
    return false;
  }

  if (value(request.body, "website", 200)) {
    response.status(200).json({ ok: true });
    return false;
  }
  if (requiresConsent && value(request.body, "consent", 10) !== "1") {
    response.status(400).json({ error: "Consent is required" });
    return false;
  }

  const forwarded = request.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]) || request.socket.remoteAddress || "unknown";
  const key = createHash("sha256").update(`${request.url}|${ip}`).digest("hex");
  const now = Date.now();
  if (attempts.size > 1000) {
    attempts.forEach((stored, attemptKey) => {
      if (stored.expiresAt <= now) attempts.delete(attemptKey);
    });
  }
  const attempt = attempts.get(key);
  if (attempt && attempt.expiresAt > now && attempt.count >= 5) {
    response.status(429).json({ error: "Too many requests" });
    return false;
  }
  attempts.set(key, attempt && attempt.expiresAt > now
    ? { count: attempt.count + 1, expiresAt: attempt.expiresAt }
    : { count: 1, expiresAt: now + allowedWindow });
  return true;
}

export function formValue(request: NextApiRequest, name: string, maximum = 5000) {
  return value(request.body, name, maximum);
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}
