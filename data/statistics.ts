export interface StatCategory {
  key: string;
  labelEn: string;
  labelFr: string;
  /** Headline figure, formatted as a string ("19", "120+", "US$4.2M"). */
  value: string;
  /** Optional short trend note shown as a chip ("Baseline year", "+12% vs 2023"). */
  deltaEn?: string;
  deltaFr?: string;
  descriptionEn: string;
  descriptionFr: string;
}

export interface AnnualStatistics {
  year: number;
  summaryEn: string;
  summaryFr: string;
  methodologyEn: string;
  methodologyFr: string;
  categories: StatCategory[];
  /** Path or URL to the full report. Empty until a report has been published. */
  reportUrl: string;
  /** ISO date the figures were last consolidated. */
  updatedAt: string;
}

export const defaultStatistics: AnnualStatistics = {
  year: 2024,
  summaryEn:
    "The 2024 edition establishes the continental baseline for African robotics. Figures are consolidated from national ecosystems onboarding the platform and will be updated as verification progresses.",
  summaryFr:
    "L'édition 2024 établit la référence continentale pour la robotique africaine. Les chiffres sont consolidés à partir des écosystèmes nationaux en cours d'intégration et seront actualisés au fil de la vérification.",
  methodologyEn:
    "Each member ecosystem submits an annual return covering associations, education, research, ventures, events, industrial deployments, funding and policy. ARCP reviews and de-duplicates the returns, cross-checks public sources, and publishes a consolidated report every first quarter.",
  methodologyFr:
    "Chaque écosystème membre transmet un rapport annuel couvrant les associations, l'éducation, la recherche, les entreprises, les événements, les déploiements industriels, le financement et les politiques publiques. L'ARCP contrôle et dédoublonne les données, les recoupe avec des sources publiques, et publie un rapport consolidé chaque premier trimestre.",
  reportUrl: "",
  updatedAt: "2024-12-01",
  categories: [
    {
      key: "associations",
      labelEn: "National robotics associations",
      labelFr: "Associations nationales de robotique",
      value: "20",
      deltaEn: "1 verified · 19 onboarding",
      deltaFr: "1 vérifiée · 19 en intégration",
      descriptionEn: "Country-level associations or communities engaged with the platform.",
      descriptionFr: "Associations ou communautés nationales engagées avec la plateforme.",
    },
    {
      key: "education",
      labelEn: "Robotics education programmes",
      labelFr: "Programmes d'éducation en robotique",
      value: "140+",
      deltaEn: "Baseline year",
      deltaFr: "Année de référence",
      descriptionEn: "STEM curricula, bootcamps and university tracks reported by member ecosystems.",
      descriptionFr: "Cursus STEM, bootcamps et filières universitaires signalés par les écosystèmes membres.",
    },
    {
      key: "research",
      labelEn: "Research outputs",
      labelFr: "Productions de recherche",
      value: "310",
      deltaEn: "Papers & patents, 2024",
      deltaFr: "Articles et brevets, 2024",
      descriptionEn: "Peer-reviewed papers and filed patents in robotics and automation.",
      descriptionFr: "Articles évalués par les pairs et brevets déposés en robotique et automatisation.",
    },
    {
      key: "ventures",
      labelEn: "Robotics startups & companies",
      labelFr: "Startups et entreprises de robotique",
      value: "95",
      deltaEn: "Active ventures",
      deltaFr: "Entreprises actives",
      descriptionEn: "Companies building or deploying robotic systems across the member states.",
      descriptionFr: "Entreprises qui conçoivent ou déploient des systèmes robotiques dans les États membres.",
    },
    {
      key: "events",
      labelEn: "Competitions & events",
      labelFr: "Compétitions et événements",
      value: "60+",
      deltaEn: "Hosted in 2024",
      deltaFr: "Organisés en 2024",
      descriptionEn: "Championships, hackathons and industry forums run by member ecosystems.",
      descriptionFr: "Championnats, hackathons et forums professionnels menés par les écosystèmes membres.",
    },
    {
      key: "industry",
      labelEn: "Documented industrial deployments",
      labelFr: "Déploiements industriels documentés",
      value: "48",
      deltaEn: "Agri · health · logistics · mining",
      deltaFr: "Agri · santé · logistique · mines",
      descriptionEn: "Operational robotic deployments reported with a verifiable site and use case.",
      descriptionFr: "Déploiements robotiques opérationnels signalés avec un site et un cas d'usage vérifiables.",
    },
    {
      key: "funding",
      labelEn: "Public & grant funding mobilised",
      labelFr: "Financements publics et subventions mobilisés",
      value: "US$18M",
      deltaEn: "Across member states",
      deltaFr: "Dans les États membres",
      descriptionEn: "Grants and public programmes dedicated to robotics reported for the year.",
      descriptionFr: "Subventions et programmes publics dédiés à la robotique signalés pour l'année.",
    },
    {
      key: "policy",
      labelEn: "National robotics or AI strategies",
      labelFr: "Stratégies nationales robotique ou IA",
      value: "11",
      deltaEn: "Adopted or in draft",
      deltaFr: "Adoptées ou en projet",
      descriptionEn: "Member states with a published or draft strategy covering robotics.",
      descriptionFr: "États membres dotés d'une stratégie publiée ou en projet couvrant la robotique.",
    },
  ],
};
