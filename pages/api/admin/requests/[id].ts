import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { requireApiSession } from "@/lib/adminAuth";

const TABLES: Record<string, string> = {
  contact: "contact_requests",
  join: "membership_requests",
  newsletter: "newsletter_subscriptions",
};

const STATUS_BY_TYPE: Record<string, string[]> = {
  contact: ["new", "processed", "spam"],
  join: ["new", "processed", "rejected", "spam"],
  newsletter: ["new", "subscribed", "unsubscribed"],
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await requireApiSession(request, response);
  if (!session) return;

  const type = typeof request.query.type === "string" ? request.query.type : "";
  const table = TABLES[type];
  if (!table) {
    response.status(400).json({ error: "type must be one of contact, join, newsletter" });
    return;
  }

  const id = Number(request.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ error: "Invalid id" });
    return;
  }

  if (request.method === "PATCH") {
    const status = typeof request.body?.request_status === "string" ? request.body.request_status : "";
    if (!STATUS_BY_TYPE[type].includes(status)) {
      response.status(400).json({ error: `request_status must be one of ${STATUS_BY_TYPE[type].join(", ")}` });
      return;
    }
    const { rows } = await query(`UPDATE ${table} SET request_status = $1 WHERE id = $2 RETURNING *`, [status, id]);
    if (!rows[0]) {
      response.status(404).json({ error: "Not found" });
      return;
    }
    response.status(200).json({ doc: rows[0] });
    return;
  }

  if (request.method === "DELETE") {
    await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    response.status(204).end();
    return;
  }

  response.setHeader("Allow", "PATCH, DELETE");
  response.status(405).end();
}
