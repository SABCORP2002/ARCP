import type { GlobalConfig } from "payload";
import { ownerOnly, ownerOrWebsite } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Réglages du site",
  admin: { group: "Configuration" },
  access: { read: ownerOrWebsite, update: ownerOnly },
  fields: [
    { name: "hero_eyebrow_en", label: "Surtitre anglais", type: "text", required: true },
    { name: "hero_eyebrow_fr", label: "Surtitre français", type: "text", required: true },
    { name: "hero_title_en", label: "Titre anglais", type: "text", required: true },
    { name: "hero_title_fr", label: "Titre français", type: "text", required: true },
    { name: "hero_description_en", label: "Introduction anglaise", type: "textarea", required: true },
    { name: "hero_description_fr", label: "Introduction française", type: "textarea", required: true },
    { name: "contact_email", label: "E-mail de contact", type: "email", required: true },
    { name: "secretariat_email", label: "E-mail du secrétariat", type: "email", required: true },
    { name: "phone", label: "Téléphone", type: "text", required: true },
    { name: "address", label: "Adresse", type: "textarea", required: true },
  ],
};
