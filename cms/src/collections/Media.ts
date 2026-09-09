import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { ownerOnly, ownerOrWebsite } from "../access";

const directory = path.dirname(fileURLToPath(import.meta.url));

// On a host with a persistent disk (Render, Fly, a VPS…), point PAYLOAD_MEDIA_DIR
// at that mount so uploads survive redeploys. Defaults to cms/media for local use.
const mediaDir = process.env.PAYLOAD_MEDIA_DIR
  ? path.resolve(process.env.PAYLOAD_MEDIA_DIR)
  : path.resolve(directory, "../../media");

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Média / document", plural: "Médias & documents" },
  admin: { useAsTitle: "filename", group: "Contenu public" },
  access: {
    create: ownerOnly,
    read: ownerOrWebsite,
    update: ownerOnly,
    delete: ownerOnly,
  },
  upload: {
    staticDir: mediaDir,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "application/pdf"],
    imageSizes: [
      { name: "card", width: 800, height: 500, position: "centre", formatOptions: { format: "webp", options: { quality: 82 } } },
      { name: "large", width: 1600, height: 1000, position: "centre", formatOptions: { format: "webp", options: { quality: 85 } } },
    ],
  },
  fields: [
    { name: "alt", label: "Texte alternatif", type: "text", required: true },
  ],
};
