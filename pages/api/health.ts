import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).end();
    return;
  }

  let database: "ok" | "unavailable" | "not-configured" = "not-configured";
  const configured = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);
  if (configured) {
    try {
      await query("SELECT 1");
      database = "ok";
    } catch {
      database = "unavailable";
    }
  }

  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({
    status: database === "ok" ? "ok" : "degraded",
    service: "arcp-public",
    database,
  });
}
