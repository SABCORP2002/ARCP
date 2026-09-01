import type { CollectionConfig, Field } from "payload";
import { ownerOnly, ownerOrWebsite } from "../access";

const publicContentAccess = {
  create: ownerOnly,
  read: ownerOrWebsite,
  update: ownerOnly,
  delete: ownerOnly,
};

function statusField(): Field {
  return {
    name: "status",
    label: "Statut de publication",
    type: "select",
    required: true,
    defaultValue: "draft",
    options: [
      { label: "Brouillon", value: "draft" },
      { label: "Publié", value: "published" },
      { label: "Archivé", value: "archived" },
    ],
    admin: { position: "sidebar" },
  };
}

function sortField(): Field {
  return {
    name: "sort",
    label: "Ordre d'affichage",
    type: "number",
    defaultValue: 0,
    admin: { position: "sidebar", step: 1 },
  };
}

export const Articles: CollectionConfig = {
  slug: "articles",
  labels: { singular: "Article", plural: "Articles" },
  admin: { useAsTitle: "title_fr", group: "Contenu public", defaultColumns: ["title_fr", "category", "status", "published_at"] },
  access: publicContentAccess,
  defaultSort: "sort",
  fields: [
    statusField(), sortField(),
    { name: "title_en", label: "Titre anglais", type: "text", required: true },
    { name: "title_fr", label: "Titre français", type: "text", required: true },
    { name: "excerpt_en", label: "Résumé anglais", type: "textarea", required: true },
    { name: "excerpt_fr", label: "Résumé français", type: "textarea", required: true },
    { name: "content_en", label: "Contenu anglais", type: "textarea", required: true },
    { name: "content_fr", label: "Contenu français", type: "textarea", required: true },
    {
      name: "category", label: "Catégorie", type: "select", required: true,
      options: ["Innovation", "Climate & Tech", "Inclusion", "Tech & Society"],
    },
    { name: "author", label: "Auteur", type: "text", required: true },
    { name: "published_at", label: "Date de publication", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "image", label: "Image", type: "upload", relationTo: "media" },
    { name: "local_image", label: "Image locale initiale", type: "text", admin: { description: "Utilisée uniquement tant qu'aucun média n'est téléversé." } },
    { name: "source_url", label: "Lien de la source", type: "text", required: true },
  ],
};

export const Members: CollectionConfig = {
  slug: "members",
  labels: { singular: "Pays membre", plural: "Pays membres" },
  admin: { useAsTitle: "name_fr", group: "Contenu public", defaultColumns: ["name_fr", "member_status", "status", "sort"] },
  access: publicContentAccess,
  defaultSort: "sort",
  fields: [
    statusField(), sortField(),
    { name: "slug", label: "Identifiant URL", type: "text", required: true, unique: true, index: true },
    { name: "code", label: "Code pays ISO à deux lettres", type: "text", required: true, maxLength: 2 },
    { name: "name_en", label: "Nom anglais", type: "text", required: true },
    { name: "name_fr", label: "Nom français", type: "text", required: true },
    {
      name: "member_status", label: "Statut du membre", type: "select", required: true,
      options: [{ label: "Vérifié", value: "verified" }, { label: "En intégration", value: "onboarding" }],
    },
    { name: "focus_en", label: "Spécialité anglaise", type: "text", required: true },
    { name: "focus_fr", label: "Spécialité française", type: "text", required: true },
    { name: "description_en", label: "Description anglaise", type: "textarea" },
    { name: "description_fr", label: "Description française", type: "textarea" },
    { name: "about_en", label: "Présentation anglaise", type: "textarea" },
    { name: "about_fr", label: "Présentation française", type: "textarea" },
    { name: "association_name_en", label: "Association anglaise", type: "text" },
    { name: "association_name_fr", label: "Association française", type: "text" },
    { name: "website_url", label: "Site web", type: "text" },
  ],
};

export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Événement", plural: "Événements" },
  admin: { useAsTitle: "title_fr", group: "Contenu public", defaultColumns: ["title_fr", "starts_at", "status"] },
  access: publicContentAccess,
  defaultSort: "sort",
  fields: [
    statusField(), sortField(),
    { name: "key", label: "Identifiant interne", type: "text", required: true, unique: true },
    { name: "title_en", label: "Titre anglais", type: "text", required: true },
    { name: "title_fr", label: "Titre français", type: "text", required: true },
    { name: "starts_at", label: "Début", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "ends_at", label: "Fin", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "location_en", label: "Lieu anglais", type: "text", required: true },
    { name: "location_fr", label: "Lieu français", type: "text", required: true },
    { name: "description_en", label: "Description anglaise", type: "textarea", required: true },
    { name: "description_fr", label: "Description française", type: "textarea", required: true },
    { name: "link", label: "Lien", type: "text", required: true },
  ],
};

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Partenaire", plural: "Partenaires" },
  admin: { useAsTitle: "name", group: "Contenu public", defaultColumns: ["name", "status", "sort"] },
  access: publicContentAccess,
  defaultSort: "sort",
  fields: [
    statusField(), sortField(),
    { name: "name", label: "Nom", type: "text", required: true },
    { name: "website_url", label: "Site web", type: "text" },
    { name: "logo", label: "Logo", type: "upload", relationTo: "media" },
    { name: "local_image", label: "Logo local initial", type: "text", admin: { description: "Utilisé uniquement tant qu'aucun logo n'est téléversé." } },
  ],
};
