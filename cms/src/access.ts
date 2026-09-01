import { timingSafeEqual } from "node:crypto";
import type { Access } from "payload";

function hasApiToken(authorization: string | null) {
  const expected = process.env.CMS_API_TOKEN;
  const provided = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!expected || !provided) return false;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
}

export const ownerOnly: Access = ({ req }) => Boolean(req.user);

export const ownerOrWebsite: Access = ({ req }) => {
  if (req.user) return true;
  return hasApiToken(req.headers.get("authorization"));
};
