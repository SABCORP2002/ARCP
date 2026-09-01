export interface SiteSettings {
  heroEyebrowEn: string;
  heroEyebrowFr: string;
  heroTitleEn: string;
  heroTitleFr: string;
  heroDescriptionEn: string;
  heroDescriptionFr: string;
  contactEmail: string;
  secretariatEmail: string;
  phone: string;
  address: string;
}

export const defaultSiteSettings: SiteSettings = {
  heroEyebrowEn: "African Robot Cooperation Platform",
  heroEyebrowFr: "Plateforme Africaine de Coopération Robotique",
  heroTitleEn: "Building Africa's Robotics Future Together",
  heroTitleFr: "Construire ensemble l'avenir robotique de l'Afrique",
  heroDescriptionEn: "A continental initiative connecting African ecosystems around robotics research, innovation and education.",
  heroDescriptionFr: "Une initiative continentale reliant les écosystèmes africains autour de la recherche, de l'innovation et de l'éducation en robotique.",
  contactEmail: "info@africanrobotplatform.org",
  secretariatEmail: "secretariat@africanrobotplatform.org",
  phone: "+237 695 418 674",
  address: "Glacier moderne Bonamoussadi, Douala, Cameroon",
};
