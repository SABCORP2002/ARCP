import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { ownerOnly, ownerOrWebsite } from "../access";

const directory = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Média", plural: "Médias" },
  admin: { useAsTitle: "filename", group: "Contenu public" },
  access: {
    create: ownerOnly,
    read: ownerOrWebsite,
    update: ownerOnly,
    delete: ownerOnly,
  },
  upload: {
    staticDir: path.resolve(directory, "../../media"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
    imageSizes: [
      { name: "card", width: 800, height: 500, position: "centre", formatOptions: { format: "webp", options: { quality: 82 } } },
      { name: "large", width: 1600, height: 1000, position: "centre", formatOptions: { format: "webp", options: { quality: 85 } } },
    ],
  },
  fields: [
    { name: "alt", label: "Texte alternatif", type: "text", required: true },
  ],
};
