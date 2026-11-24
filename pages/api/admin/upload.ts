import type { NextApiRequest, NextApiResponse } from "next";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireApiSession } from "@/lib/adminAuth";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "application/pdf"];
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).end();
    return;
  }

  const session = await requireApiSession(request, response);
  if (!session) return;

  const body = request.body as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
    });
    response.status(200).json(result);
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : "Upload failed" });
  }
}
