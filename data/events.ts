export interface PlatformEvent {
  id: string;
  titleEn: string;
  titleFr: string;
  startsAt: string;
  endsAt: string;
  isPast: boolean;
  dateEn: string;
  dateFr: string;
  locationEn: string;
  locationFr: string;
  descriptionEn: string;
  descriptionFr: string;
  link: string;
}

export const platformEvents: PlatformEvent[] = [
  {
    id: "crauw-2026",
    titleEn: "CRAUW 2026 — Robotics & Automation Week",
    titleFr: "CRAUW 2026 — Semaine de la robotique et de l'automatisation",
    startsAt: "2026-04-07",
    endsAt: "2026-04-11",
    isPast: true,
    dateEn: "7–11 April 2026",
    dateFr: "7–11 avril 2026",
    locationEn: "Douala, Cameroon",
    locationFr: "Douala, Cameroun",
    descriptionEn: "A week of conferences, technical workshops, exhibitions and robotics competitions dedicated to automation and emerging technologies.",
    descriptionFr: "Une semaine de conférences, d'ateliers techniques, d'expositions et de compétitions consacrée à la robotique, à l'automatisation et aux technologies émergentes.",
    link: "https://elviatech.org/",
  },
  {
    id: "elviatech-2026",
    titleEn: "ELVIATECH 2026 — National Robotics and AI Olympiad",
    titleFr: "ELVIATECH 2026 — Olympiade nationale de robotique et d'IA",
    startsAt: "2026-04-09",
    endsAt: "2026-04-09",
    isPast: true,
    dateEn: "9 April 2026",
    dateFr: "9 avril 2026",
    locationEn: "Douala, Cameroon",
    locationFr: "Douala, Cameroun",
    descriptionEn: "The senior robotics competition held during CRAUW 2026, bringing together students, engineers and technical innovators.",
    descriptionFr: "La compétition senior de robotique organisée pendant CRAUW 2026, réunissant étudiants, ingénieurs et innovateurs techniques.",
    link: "https://elviatech.org/inscription.html",
  },
];
