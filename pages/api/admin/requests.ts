import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { requireApiSession } from "@/lib/adminAuth";

const TABLES: Record<string, string> = {
  contact: "contact_requests",
  join: "membership_requests",
  newsletter: "newsletter_subscriptions",
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await requireApiSession(request, response);
  if (!session) return;

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).end();
    return;
  }

  const type = typeof request.query.type === "string" ? request.query.type : "";
  const table = TABLES[type];
  if (!table) {
    response.status(400).json({ error: "type must be one of contact, join, newsletter" });
    return;
  }

  const { rows } = await query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
  response.status(200).json({ docs: rows });
}
