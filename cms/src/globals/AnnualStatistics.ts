import type { GlobalConfig } from "payload";
import { ownerOnly, ownerOrWebsite } from "../access";

export const AnnualStatistics: GlobalConfig = {
  slug: "annual-statistics",
  label: "Statistiques annuelles",
  admin: {
    group: "Contenu public",
    description:
      "Synthèse annuelle de l'avancement de la robotique en Afrique. Le site public l'affiche sur /statistics et propose le PDF au téléchargement.",
  },
  access: { read: ownerOrWebsite, update: ownerOnly },
  fields: [
    { name: "year", label: "Année", type: "number", required: true, min: 2024, admin: { step: 1 } },
    {
      name: "updated_at",
      label: "Date de consolidation",
      type: "date",
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    { name: "summary_en", label: "Résumé anglais", type: "textarea", required: true },
    { name: "summary_fr", label: "Résumé français", type: "textarea", required: true },
    { name: "methodology_en", label: "Méthodologie anglaise", type: "textarea", required: true },
    { name: "methodology_fr", label: "Méthodologie française", type: "textarea", required: true },
    {
      name: "report",
      label: "Rapport PDF",
      type: "upload",
      relationTo: "media",
      admin: { description: "Téléverser le PDF du rapport annuel (facultatif tant qu'il n'est pas prêt)." },
    },
    {
      name: "categories",
      label: "Catégories",
      type: "array",
      minRows: 1,
      labels: { singular: "Catégorie", plural: "Catégories" },
      admin: { description: "Un indicateur par ligne (associations, éducation, recherche, entreprises, événements, industrie, financement, politiques…)." },
      fields: [
        { name: "key", label: "Identifiant court", type: "text", required: true },
        { name: "label_en", label: "Libellé anglais", type: "text", required: true },
        { name: "label_fr", label: "Libellé français", type: "text", required: true },
        { name: "value", label: "Valeur", type: "text", required: true, admin: { description: "Ex. « 20 », « 140+ », « US$18M »." } },
        { name: "delta_en", label: "Tendance anglaise", type: "text" },
        { name: "delta_fr", label: "Tendance française", type: "text" },
        { name: "description_en", label: "Description anglaise", type: "textarea", required: true },
        { name: "description_fr", label: "Description française", type: "textarea", required: true },
      ],
    },
  ],
};
