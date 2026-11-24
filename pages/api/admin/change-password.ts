import type { NextApiRequest, NextApiResponse } from "next";
import { changePassword, issueSessionForEmail, requireApiSession } from "@/lib/adminAuth";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).end();
    return;
  }

  const session = await requireApiSession(request, response);
  if (!session) return;

  const currentPassword = typeof request.body?.currentPassword === "string" ? request.body.currentPassword : "";
  const newPassword = typeof request.body?.newPassword === "string" ? request.body.newPassword : "";
  if (!currentPassword || !newPassword) {
    response.status(400).json({ error: "Current and new password are required" });
    return;
  }

  try {
    await changePassword(session.email, currentPassword, newPassword);
    // Re-issue the cookie: the password (and its fingerprint) just changed.
    await issueSessionForEmail(response, session.email);
    response.status(200).json({ ok: true });
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : "Could not change password" });
  }
}
