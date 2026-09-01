export type ArticleCategory = "Innovation" | "Climate & Tech" | "Inclusion" | "Tech & Society";

export interface Article {
  id: number;
  titleEn: string;
  titleFr: string;
  excerptEn: string;
  excerptFr: string;
  contentEn: string;
  contentFr: string;
  category: ArticleCategory;
  author: string;
  publishedAt: string;
  image: string;
  sourceUrl: string;
}

export const articlesData: Article[] = [
  {
    id: 1,
    titleEn: "Cameroon — Robotics as a factor of industrialization",
    titleFr: "Cameroun — La robotique comme facteur d'industrialisation",
    excerptEn: "Robotics as a practical lever for industrialization in Cameroon.",
    excerptFr: "La robotique comme levier concret d'industrialisation au Cameroun.",
    category: "Innovation",
    author: "La Concorde",
    publishedAt: "2022-09-21",
    image: "Cameroun - Robotics as a factor of industrialization.jpeg",
    sourceUrl: "https://laconcorde-actu.net/cameroun-la-robotique-comme-facteur-dindustrialisation/",
    contentEn: "This publication examines how robotics can support faster and more efficient industrialization in Cameroon.",
    contentFr: "Cette publication examine comment la robotique peut soutenir une industrialisation plus rapide et plus efficace au Cameroun.",
  },
  {
    id: 2,
    titleEn: "Jacques Eone develops robots and security solutions in Cameroon",
    titleFr: "Jacques Eone développe des robots et des solutions de sécurité au Cameroun",
    excerptEn: "Portrait of a Cameroonian engineer developing robotics and security systems.",
    excerptFr: "Portrait d'un ingénieur camerounais développant des systèmes robotiques et de sécurité.",
    category: "Innovation",
    author: "WeAreTech Africa",
    publishedAt: "2024-03-27",
    image: "Cameroon Jacques Eone Develops Robots.webp",
    sourceUrl: "https://www.wearetech.africa/en/fils-uk/tech-stars/cameroon-jacques-eone-develops-robots-and-security-solutions-for-businesses-and-individuals",
    contentEn: "Meet Jacques Eone, a Cameroonian engineer and innovator creating robotic solutions focused on security.",
    contentFr: "Découvrez Jacques Eone, ingénieur et innovateur camerounais qui conçoit des solutions robotiques axées sur la sécurité.",
  },
  {
    id: 3,
    titleEn: "Building inclusive climate responses with technology in Cameroon",
    titleFr: "Bâtir des réponses climatiques inclusives grâce à la technologie au Cameroun",
    excerptEn: "Community-led technology initiatives addressing climate challenges.",
    excerptFr: "Des initiatives technologiques communautaires face aux défis climatiques.",
    category: "Climate & Tech",
    author: "WeRobotics",
    publishedAt: "2021-05-24",
    image: "In Cameroon, Building Inclusive Climate Change Responses With Technology.webp",
    sourceUrl: "https://werobotics.org/blog/in-cameroon-building-inclusive-climate-change-responses-with-technology",
    contentEn: "This initiative shows how community technology projects can contribute to inclusive climate action in Cameroon.",
    contentFr: "Cette initiative montre comment des projets technologiques communautaires peuvent contribuer à une action climatique inclusive au Cameroun.",
  },
  {
    id: 4,
    titleEn: "How robots are helping Cameroonian women get into work",
    titleFr: "Comment les robots aident les Camerounaises à accéder à l'emploi",
    excerptEn: "How robotics and STEM education can support women's professional integration.",
    excerptFr: "Comment la robotique et l'éducation STEM peuvent soutenir l'insertion professionnelle des femmes.",
    category: "Tech & Society",
    author: "World Economic Forum",
    publishedAt: "2018-07-31",
    image: "How robots are helping Cameroon's women get into work.webp",
    sourceUrl: "https://www.weforum.org/stories/education-and-skills/from-robots-to-girl-power-getting-cameroons-women-into-work/",
    contentEn: "The article explores how STEM education and robotics can contribute to women's economic empowerment in Cameroon.",
    contentFr: "L'article explore comment l'éducation STEM et la robotique peuvent contribuer à l'autonomisation économique des femmes au Cameroun.",
  },
];

export const articleCategoryLabels: Record<ArticleCategory, { en: string; fr: string }> = {
  Innovation: { en: "Innovation", fr: "Innovation" },
  "Climate & Tech": { en: "Climate & Tech", fr: "Climat & Tech" },
  Inclusion: { en: "Inclusion", fr: "Inclusion" },
  "Tech & Society": { en: "Tech & Society", fr: "Tech & Société" },
};

export function formatArticleDate(date: string, language: "EN" | "FR") {
  return new Intl.DateTimeFormat(language === "FR" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
