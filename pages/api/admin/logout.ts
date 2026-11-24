import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "@/lib/adminAuth";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).end();
    return;
  }
  clearSessionCookie(response);
  response.status(200).json({ ok: true });
}
