import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).end();
    return;
  }

  let cms: "ok" | "unavailable" | "not-configured" = "not-configured";
  const cmsUrl = process.env.CMS_URL?.replace(/\/$/, "");
  if (cmsUrl) {
    try {
      const upstream = await fetch(`${cmsUrl}/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      cms = upstream.ok ? "ok" : "unavailable";
    } catch {
      cms = "unavailable";
    }
  }

  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({
    status: cms === "ok" ? "ok" : "degraded",
    service: "arcp-public",
    cms,
  });
}
