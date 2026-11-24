// Initial content, extracted from the former cms/seed.json and
// data/statistics.ts before the separate CMS was removed. Consumed only by
// scripts/db-seed.mjs, which inserts each table's rows exactly once (only
// when that table is still empty).

export const siteSettings = {
  hero_eyebrow_en: "African Robot Cooperation Platform",
  hero_eyebrow_fr: "Plateforme Africaine de Coopération Robotique",
  hero_title_en: "Building Africa's Robotics Future Together",
  hero_title_fr: "Construire ensemble l'avenir robotique de l'Afrique",
  hero_description_en:
    "A continental initiative connecting African ecosystems around robotics research, innovation and education.",
  hero_description_fr:
    "Une initiative continentale reliant les écosystèmes africains autour de la recherche, de l'innovation et de l'éducation en robotique.",
  contact_email: "info@africanrobotplatform.org",
  secretariat_email: "secretariat@africanrobotplatform.org",
  phone: "+237 695 418 674",
  address: "Glacier moderne Bonamoussadi, Douala, Cameroon",
};

export const articles = [
  {
    status: "published",
    sort: 1,
    title_en: "Cameroon — Robotics as a factor of industrialization",
    title_fr: "Cameroun — La robotique comme facteur d'industrialisation",
    excerpt_en: "Robotics as a practical lever for industrialization in Cameroon.",
    excerpt_fr: "La robotique comme levier concret d'industrialisation au Cameroun.",
    content_en:
      "This publication examines how robotics can support faster and more efficient industrialization in Cameroon.",
    content_fr:
      "Cette publication examine comment la robotique peut soutenir une industrialisation plus rapide et plus efficace au Cameroun.",
    category: "Innovation",
    author: "La Concorde",
    published_at: "2022-09-21",
    local_image: "Cameroun - Robotics as a factor of industrialization.jpeg",
    source_url: "https://laconcorde-actu.net/cameroun-la-robotique-comme-facteur-dindustrialisation/",
  },
  {
    status: "published",
    sort: 2,
    title_en: "Jacques Eone develops robots and security solutions in Cameroon",
    title_fr: "Jacques Eone développe des robots et des solutions de sécurité au Cameroun",
    excerpt_en: "Portrait of a Cameroonian engineer developing robotics and security systems.",
    excerpt_fr: "Portrait d'un ingénieur camerounais développant des systèmes robotiques et de sécurité.",
    content_en: "Meet Jacques Eone, a Cameroonian engineer and innovator creating robotic solutions focused on security.",
    content_fr:
      "Découvrez Jacques Eone, ingénieur et innovateur camerounais qui conçoit des solutions robotiques axées sur la sécurité.",
    category: "Innovation",
    author: "WeAreTech Africa",
    published_at: "2024-03-27",
    local_image: "Cameroon Jacques Eone Develops Robots.webp",
    source_url:
      "https://www.wearetech.africa/en/fils-uk/tech-stars/cameroon-jacques-eone-develops-robots-and-security-solutions-for-businesses-and-individuals",
  },
  {
    status: "published",
    sort: 3,
    title_en: "Building inclusive climate responses with technology in Cameroon",
    title_fr: "Bâtir des réponses climatiques inclusives grâce à la technologie au Cameroun",
    excerpt_en: "Community-led technology initiatives addressing climate challenges.",
    excerpt_fr: "Des initiatives technologiques communautaires face aux défis climatiques.",
    content_en:
      "This initiative shows how community technology projects can contribute to inclusive climate action in Cameroon.",
    content_fr:
      "Cette initiative montre comment des projets technologiques communautaires peuvent contribuer à une action climatique inclusive au Cameroun.",
    category: "Climate & Tech",
    author: "WeRobotics",
    published_at: "2021-05-24",
    local_image: "In Cameroon, Building Inclusive Climate Change Responses With Technology.webp",
    source_url: "https://werobotics.org/blog/in-cameroon-building-inclusive-climate-change-responses-with-technology",
  },
  {
    status: "published",
    sort: 4,
    title_en: "How robots are helping Cameroonian women get into work",
    title_fr: "Comment les robots aident les Camerounaises à accéder à l'emploi",
    excerpt_en: "How robotics and STEM education can support women's professional integration.",
    excerpt_fr: "Comment la robotique et l'éducation STEM peuvent soutenir l'insertion professionnelle des femmes.",
    content_en:
      "The article explores how STEM education and robotics can contribute to women's economic empowerment in Cameroon.",
    content_fr:
      "L'article explore comment l'éducation STEM et la robotique peuvent contribuer à l'autonomisation économique des femmes au Cameroun.",
    category: "Tech & Society",
    author: "World Economic Forum",
    published_at: "2018-07-31",
    local_image: "How robots are helping Cameroon's women get into work.webp",
    source_url:
      "https://www.weforum.org/stories/education-and-skills/from-robots-to-girl-power-getting-cameroons-women-into-work/",
  },
];

export const members = [
  { slug: "cameroon", status: "published", sort: 1, code: "cm", name_en: "Cameroon", name_fr: "Cameroun", member_status: "verified", focus_en: "Verified national association", focus_fr: "Association nationale vérifiée" },
  { slug: "ivory-coast", status: "published", sort: 2, code: "ci", name_en: "Côte d'Ivoire", name_fr: "Côte d'Ivoire", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "nigeria", status: "published", sort: 3, code: "ng", name_en: "Nigeria", name_fr: "Nigéria", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "morocco", status: "published", sort: 4, code: "ma", name_en: "Morocco", name_fr: "Maroc", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "south-africa", status: "published", sort: 5, code: "za", name_en: "South Africa", name_fr: "Afrique du Sud", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "gabon", status: "published", sort: 6, code: "ga", name_en: "Gabon", name_fr: "Gabon", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "equatorial-guinea", status: "published", sort: 7, code: "gq", name_en: "Equatorial Guinea", name_fr: "Guinée équatoriale", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "chad", status: "published", sort: 8, code: "td", name_en: "Chad", name_fr: "Tchad", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "central-african-republic", status: "published", sort: 9, code: "cf", name_en: "Central African Republic", name_fr: "République centrafricaine", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "kenya", status: "published", sort: 10, code: "ke", name_en: "Kenya", name_fr: "Kenya", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "ghana", status: "published", sort: 11, code: "gh", name_en: "Ghana", name_fr: "Ghana", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "egypt", status: "published", sort: 12, code: "eg", name_en: "Egypt", name_fr: "Égypte", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "ethiopia", status: "published", sort: 13, code: "et", name_en: "Ethiopia", name_fr: "Éthiopie", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "senegal", status: "published", sort: 14, code: "sn", name_en: "Senegal", name_fr: "Sénégal", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "rwanda", status: "published", sort: 15, code: "rw", name_en: "Rwanda", name_fr: "Rwanda", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "tunisia", status: "published", sort: 16, code: "tn", name_en: "Tunisia", name_fr: "Tunisie", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "algeria", status: "published", sort: 17, code: "dz", name_en: "Algeria", name_fr: "Algérie", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "uganda", status: "published", sort: 18, code: "ug", name_en: "Uganda", name_fr: "Ouganda", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "tanzania", status: "published", sort: 19, code: "tz", name_en: "Tanzania", name_fr: "Tanzanie", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
  { slug: "zimbabwe", status: "published", sort: 20, code: "zw", name_en: "Zimbabwe", name_fr: "Zimbabwe", member_status: "onboarding", focus_en: "Ecosystem onboarding", focus_fr: "Écosystème en intégration" },
];

export const events = [
  {
    key: "crauw-2026",
    status: "published",
    sort: 1,
    title_en: "CRAUW 2026 — Robotics & Automation Week",
    title_fr: "CRAUW 2026 — Semaine de la robotique et de l'automatisation",
    starts_at: "2026-04-07",
    ends_at: "2026-04-11",
    location_en: "Douala, Cameroon",
    location_fr: "Douala, Cameroun",
    description_en:
      "A week of conferences, technical workshops, exhibitions and robotics competitions dedicated to automation and emerging technologies.",
    description_fr:
      "Une semaine de conférences, d'ateliers techniques, d'expositions et de compétitions consacrée à la robotique, à l'automatisation et aux technologies émergentes.",
    link: "https://elviatech.org/",
  },
  {
    key: "elviatech-2026",
    status: "published",
    sort: 2,
    title_en: "ELVIATECH 2026 — National Robotics and AI Olympiad",
    title_fr: "ELVIATECH 2026 — Olympiade nationale de robotique et d'IA",
    starts_at: "2026-04-09",
    ends_at: "2026-04-09",
    location_en: "Douala, Cameroon",
    location_fr: "Douala, Cameroun",
    description_en:
      "The senior robotics competition held during CRAUW 2026, bringing together students, engineers and technical innovators.",
    description_fr:
      "La compétition senior de robotique organisée pendant CRAUW 2026, réunissant étudiants, ingénieurs et innovateurs techniques.",
    link: "https://elviatech.org/inscription.html",
  },
];

export const partners = [
  { status: "published", sort: 1, name: "MINEPDED", local_image: "MINEPDED.png" },
  { status: "published", sort: 2, name: "MINRESI", local_image: "MINRESI.png" },
  { status: "published", sort: 3, name: "Port Autonome de Douala", local_image: "PAD.png" },
  { status: "published", sort: 4, name: "Port Autonome de Kribi", local_image: "PAK.png" },
  { status: "published", sort: 5, name: "PAK Azure", local_image: "PAKAZURE.jpg" },
  { status: "published", sort: 6, name: "Sparte Robotics", local_image: "Sparte Robotics.jpg" },
];

export const statistics = {
  year: 2024,
  updated_at: "2024-12-01",
  summary_en:
    "The 2024 edition establishes the continental baseline for African robotics. Figures are consolidated from national ecosystems onboarding the platform and will be updated as verification progresses.",
  summary_fr:
    "L'édition 2024 établit la référence continentale pour la robotique africaine. Les chiffres sont consolidés à partir des écosystèmes nationaux en cours d'intégration et seront actualisés au fil de la vérification.",
  methodology_en:
    "Each member ecosystem submits an annual return covering associations, education, research, ventures, events, industrial deployments, funding and policy. ARCP reviews and de-duplicates the returns, cross-checks public sources, and publishes a consolidated report every first quarter.",
  methodology_fr:
    "Chaque écosystème membre transmet un rapport annuel couvrant les associations, l'éducation, la recherche, les entreprises, les événements, les déploiements industriels, le financement et les politiques publiques. L'ARCP contrôle et dédoublonne les données, les recoupe avec des sources publiques, et publie un rapport consolidé chaque premier trimestre.",
  report_url: null,
  categories: [
    { key: "associations", label_en: "National robotics associations", label_fr: "Associations nationales de robotique", value: "20", delta_en: "1 verified · 19 onboarding", delta_fr: "1 vérifiée · 19 en intégration", description_en: "Country-level associations or communities engaged with the platform.", description_fr: "Associations ou communautés nationales engagées avec la plateforme." },
    { key: "education", label_en: "Robotics education programmes", label_fr: "Programmes d'éducation en robotique", value: "140+", delta_en: "Baseline year", delta_fr: "Année de référence", description_en: "STEM curricula, bootcamps and university tracks reported by member ecosystems.", description_fr: "Cursus STEM, bootcamps et filières universitaires signalés par les écosystèmes membres." },
    { key: "research", label_en: "Research outputs", label_fr: "Productions de recherche", value: "310", delta_en: "Papers & patents, 2024", delta_fr: "Articles et brevets, 2024", description_en: "Peer-reviewed papers and filed patents in robotics and automation.", description_fr: "Articles évalués par les pairs et brevets déposés en robotique et automatisation." },
    { key: "ventures", label_en: "Robotics startups & companies", label_fr: "Startups et entreprises de robotique", value: "95", delta_en: "Active ventures", delta_fr: "Entreprises actives", description_en: "Companies building or deploying robotic systems across the member states.", description_fr: "Entreprises qui conçoivent ou déploient des systèmes robotiques dans les États membres." },
    { key: "events", label_en: "Competitions & events", label_fr: "Compétitions et événements", value: "60+", delta_en: "Hosted in 2024", delta_fr: "Organisés en 2024", description_en: "Championships, hackathons and industry forums run by member ecosystems.", description_fr: "Championnats, hackathons et forums professionnels menés par les écosystèmes membres." },
    { key: "industry", label_en: "Documented industrial deployments", label_fr: "Déploiements industriels documentés", value: "48", delta_en: "Agri · health · logistics · mining", delta_fr: "Agri · santé · logistique · mines", description_en: "Operational robotic deployments reported with a verifiable site and use case.", description_fr: "Déploiements robotiques opérationnels signalés avec un site et un cas d'usage vérifiables." },
    { key: "funding", label_en: "Public & grant funding mobilised", label_fr: "Financements publics et subventions mobilisés", value: "US$18M", delta_en: "Across member states", delta_fr: "Dans les États membres", description_en: "Grants and public programmes dedicated to robotics reported for the year.", description_fr: "Subventions et programmes publics dédiés à la robotique signalés pour l'année." },
    { key: "policy", label_en: "National robotics or AI strategies", label_fr: "Stratégies nationales robotique ou IA", value: "11", delta_en: "Adopted or in draft", delta_fr: "Adoptées ou en projet", description_en: "Member states with a published or draft strategy covering robotics.", description_fr: "États membres dotés d'une stratégie publiée ou en projet couvrant la robotique." },
  ],
};
