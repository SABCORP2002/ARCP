import type { NextApiRequest, NextApiResponse } from "next";
import { getCmsConfiguration } from "@/lib/cms-server";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).end();
    return;
  }
  const id = String(request.query.id || "");
  if (!/^\d+$/.test(id)) {
    response.status(400).end();
    return;
  }
  try {
    const config = getCmsConfiguration();
    const metadataResponse = await fetch(`${config.url}/api/media/${id}?depth=0`, {
      headers: { Authorization: `Bearer ${config.token}` },
      signal: AbortSignal.timeout(7000),
    });
    if (!metadataResponse.ok) {
      response.status(metadataResponse.status === 404 ? 404 : 502).end();
      return;
    }
    const metadata = await metadataResponse.json() as { mimeType?: string; url?: string };
    if (!metadata.mimeType?.startsWith("image/") || !metadata.url) {
      response.status(415).end();
      return;
    }
    const assetUrl = new URL(metadata.url, `${config.url}/`);
    if (assetUrl.origin !== new URL(config.url).origin) {
      response.status(502).end();
      return;
    }
    const upstream = await fetch(assetUrl, {
      headers: { Authorization: `Bearer ${config.token}` },
      signal: AbortSignal.timeout(7000),
    });
    if (!upstream.ok) {
      response.status(upstream.status === 404 ? 404 : 502).end();
      return;
    }
    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    if (!contentType.startsWith("image/")) {
      response.status(415).end();
      return;
    }
    const declaredSize = Number(upstream.headers.get("content-length") || 0);
    if (declaredSize > 10 * 1024 * 1024) {
      response.status(413).end();
      return;
    }
    const payload = Buffer.from(await upstream.arrayBuffer());
    if (payload.byteLength > 10 * 1024 * 1024) {
      response.status(413).end();
      return;
    }
    response.setHeader("Content-Type", contentType);
    response.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
    response.send(payload);
  } catch {
    response.status(503).end();
  }
}
