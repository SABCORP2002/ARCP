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
  admin: { useAsTitle: "full_name", group: "Demandes reçues", defaultColumns: ["full_name", "organization", "country", "request_status", "createdAt"] },
  access: requestAccess,
  fields: [
    requestStatus(["new", "processed", "rejected", "spam"]),
    { name: "full_name", label: "Nom complet", type: "text", required: true },
    { name: "email", label: "E-mail", type: "email", required: true },
    { name: "phone", label: "Téléphone", type: "text" },
    { name: "organization", label: "Organisation", type: "text", required: true },
    { name: "country", label: "Pays", type: "text", required: true },
    { name: "membership_type", label: "Type d'adhésion", type: "text", required: true },
    { name: "interest", label: "Centre d'intérêt", type: "text", required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
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
