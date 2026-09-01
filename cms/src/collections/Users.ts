import type { CollectionConfig } from "payload";
import { ownerOnly } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Administrateur", plural: "Administrateurs" },
  admin: { useAsTitle: "email", group: "Sécurité" },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: ownerOnly,
    read: ownerOnly,
    update: ownerOnly,
    delete: ownerOnly,
  },
  fields: [
    { name: "name", label: "Nom", type: "text", required: true },
  ],
};
