import type { NextApiRequest, NextApiResponse } from "next";
import { attemptLogin, issueSessionForEmail } from "@/lib/adminAuth";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).end();
    return;
  }

  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (!email || !password) {
    response.status(400).json({ error: "Email and password are required" });
    return;
  }

  const result = await attemptLogin(email, password);
  if (!result.ok) {
    response
      .status(401)
      .json({ error: result.reason === "locked" ? "Too many attempts — try again in a few minutes" : "Invalid credentials" });
    return;
  }

  await issueSessionForEmail(response, email);
  response.status(200).json({ ok: true });
}
