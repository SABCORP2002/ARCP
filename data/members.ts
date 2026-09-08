export type MemberStatus = "verified" | "onboarding";

export interface MemberNation {
  slug: string;
  code: string;
  nameEn: string;
  nameFr: string;
  status: MemberStatus;
  focusEn: string;
  focusFr: string;
  descriptionEn?: string;
  descriptionFr?: string;
  aboutEn?: string;
  aboutFr?: string;
  associationNameEn?: string;
  associationNameFr?: string;
  websiteUrl?: string;
}

export const memberNations: MemberNation[] = [
  { slug: "cameroon", code: "cm", nameEn: "Cameroon", nameFr: "Cameroun", status: "verified", focusEn: "Verified national association", focusFr: "Association nationale vérifiée" },
  { slug: "ivory-coast", code: "ci", nameEn: "Côte d'Ivoire", nameFr: "Côte d'Ivoire", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "nigeria", code: "ng", nameEn: "Nigeria", nameFr: "Nigéria", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "morocco", code: "ma", nameEn: "Morocco", nameFr: "Maroc", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "south-africa", code: "za", nameEn: "South Africa", nameFr: "Afrique du Sud", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "gabon", code: "ga", nameEn: "Gabon", nameFr: "Gabon", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "equatorial-guinea", code: "gq", nameEn: "Equatorial Guinea", nameFr: "Guinée équatoriale", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "chad", code: "td", nameEn: "Chad", nameFr: "Tchad", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "central-african-republic", code: "cf", nameEn: "Central African Republic", nameFr: "République centrafricaine", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "kenya", code: "ke", nameEn: "Kenya", nameFr: "Kenya", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "ghana", code: "gh", nameEn: "Ghana", nameFr: "Ghana", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "egypt", code: "eg", nameEn: "Egypt", nameFr: "Égypte", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "ethiopia", code: "et", nameEn: "Ethiopia", nameFr: "Éthiopie", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "senegal", code: "sn", nameEn: "Senegal", nameFr: "Sénégal", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "rwanda", code: "rw", nameEn: "Rwanda", nameFr: "Rwanda", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "tunisia", code: "tn", nameEn: "Tunisia", nameFr: "Tunisie", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "algeria", code: "dz", nameEn: "Algeria", nameFr: "Algérie", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "uganda", code: "ug", nameEn: "Uganda", nameFr: "Ouganda", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "tanzania", code: "tz", nameEn: "Tanzania", nameFr: "Tanzanie", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
  { slug: "zimbabwe", code: "zw", nameEn: "Zimbabwe", nameFr: "Zimbabwe", status: "onboarding", focusEn: "Ecosystem onboarding", focusFr: "Écosystème en intégration" },
];

export const verifiedMemberCount = memberNations.filter((member) => member.status === "verified").length;

export const cameroonHighlights = {
  en: [
    "Robotics competitions (ELVIATECH)",
    "STEM training programs",
    "Hackathons and innovation initiatives",
    "Headquarters: Bonamoussadi, Douala",
  ],
  fr: [
    "Compétitions de robotique (ELVIATECH)",
    "Programmes de formation STEM",
    "Hackathons et initiatives d'innovation",
    "Siège : Bonamoussadi, Douala",
  ],
};

export const memberCountrySlugs = memberNations.map((member) => member.slug);

/** ISO codes of the UN "Middle Africa" (Afrique centrale) member states.
 * While onboarding, these ecosystems are shown with a "Processing" status. */
export const centralAfricaCodes = new Set(["cm", "td", "cf", "ga", "gq", "cd", "cg", "ao", "st"]);
