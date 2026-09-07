import type { CollectionConfig } from "payload";
import { ownerOnly, ownerOrWebsite } from "../access";

const requestAccess = {
  create: ownerOrWebsite,
  read: ownerOnly,
  update: ownerOnly,
  delete: ownerOnly,
};

const requestStatus = (options: string[]) => ({
  name: "request_status",
  label: "Traitement",
  type: "select" as const,
  required: true,
  defaultValue: "new",
  options,
  admin: { position: "sidebar" as const },
});

export const ContactRequests: CollectionConfig = {
  slug: "contact_requests",
  labels: { singular: "Message de contact", plural: "Messages de contact" },
  admin: { useAsTitle: "subject", group: "Demandes reçues", defaultColumns: ["full_name", "email", "subject", "request_status", "createdAt"] },
  access: requestAccess,
  fields: [
    requestStatus(["new", "processed", "spam"]),
    { name: "full_name", label: "Nom complet", type: "text", required: true },
    { name: "email", label: "E-mail", type: "email", required: true },
    { name: "phone", label: "Téléphone", type: "text" },
    { name: "subject", label: "Objet", type: "text", required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
  ],
};

export const MembershipRequests: CollectionConfig = {
  slug: "membership_requests",
  labels: { singular: "Demande d'adhésion", plural: "Demandes d'adhésion" },
  admin: {
    useAsTitle: "full_name",
    group: "Demandes reçues",
    defaultColumns: ["full_name", "membership_type", "organization", "country", "request_status", "createdAt"],
  },
  access: requestAccess,
  fields: [
    requestStatus(["new", "processed", "rejected", "spam"]),
    {
      name: "membership_type",
      label: "Type de candidature",
      type: "select",
      required: true,
      options: [
        { label: "Écosystème national", value: "National ecosystem" },
        { label: "Organisation partenaire", value: "Partner organization" },
        { label: "Particulier", value: "Individual supporter" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "full_name", label: "Nom complet", type: "text", required: true },
    { name: "email", label: "E-mail", type: "email", required: true },
    { name: "phone", label: "Téléphone", type: "text" },
    { name: "applicant_role", label: "Fonction du demandeur", type: "text" },
    { name: "country", label: "Pays", type: "text", required: true },
    { name: "organization", label: "Organisation / affiliation", type: "text", required: true },
    { name: "organization_type", label: "Type d'organisation / profil", type: "text" },
    { name: "org_website", label: "Site web", type: "text" },
    { name: "community_size", label: "Taille de la communauté", type: "text" },
    { name: "focus_area", label: "Axe / domaine d'intérêt", type: "text" },
    { name: "contributions", label: "Contributions envisagées", type: "text" },
    { name: "interest", label: "Résumé (centre d'intérêt)", type: "text", required: true },
    { name: "message", label: "Message complet", type: "textarea", required: true },
  ],
};

export const NewsletterSubscriptions: CollectionConfig = {
  slug: "newsletter_subscriptions",
  labels: { singular: "Inscription newsletter", plural: "Inscriptions newsletter" },
  admin: { useAsTitle: "email", group: "Demandes reçues", defaultColumns: ["email", "request_status", "createdAt"] },
  access: requestAccess,
  fields: [
    requestStatus(["new", "subscribed", "unsubscribed"]),
    { name: "email", label: "E-mail", type: "email", required: true },
  ],
};
