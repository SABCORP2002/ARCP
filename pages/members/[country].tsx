import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { cameroonHighlights, MemberNation } from "@/data/members";
import { getMembers, getSiteSettings } from "@/lib/cms";
import type { SiteSettings } from "@/data/site";

type MemberProfileProps = {
  member: MemberNation;
  settings: SiteSettings;
};

export default function MemberProfile({ member, settings }: MemberProfileProps) {
  const { t, lang } = useLanguage();

  const name = t(member.nameEn, member.nameFr);
  const isCameroon = member.slug === "cameroon";
  const isVerified = member.status === "verified";
  const fallbackDescription = isCameroon
    ? t(
        "Cameroon is developing a robotics ecosystem driven by technical talent, education, competitions and locally relevant innovation.",
        "Le Cameroun développe un écosystème robotique porté par les talents techniques, l'éducation, les compétitions et l'innovation adaptée aux réalités locales.",
      )
    : t(
        "This national ecosystem is currently completing the platform's verification and onboarding process. Official information will be published after validation.",
        "Cet écosystème national finalise actuellement le processus de vérification et d'intégration de la plateforme. Les informations officielles seront publiées après validation.",
      );
  const description = member.descriptionEn && member.descriptionFr
    ? t(member.descriptionEn, member.descriptionFr)
    : fallbackDescription;
  const highlights = isCameroon
    ? cameroonHighlights[lang === "FR" ? "fr" : "en"]
    : [
        t("Official profile awaiting validation", "Profil officiel en attente de validation"),
        t("National representatives onboarding", "Représentants nationaux en cours d'intégration"),
      ];
  const associations = isVerified && (isCameroon || member.websiteUrl)
    ? [{
        name: t(member.associationNameEn || "Cameroon Robotics Association", member.associationNameFr || "Association Camerounaise de Robotique"),
        logo: "/assets/logo.svg",
        link: member.websiteUrl || "https://cameroonrobotics.org",
      }]
    : [];

  return (
    <Layout title={`${name} | ARCP`} description={description} path={`/members/${member.slug}`} image="/assets/member-nations.jpg" settings={settings}>
      <section className="relative pt-24 pb-20 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-surfaceAlt -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 -z-10 pointer-events-none" aria-hidden="true">
          <Image src="/assets/member-page-illustration.svg" alt="" fill className="object-cover" />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative w-40 h-24 md:w-64 md:h-40 rounded-xl overflow-hidden shadow-lg ring-1 ring-border border-4 border-surface">
              <Image
                src={`https://flagcdn.com/w320/${member.code}.png`}
                alt={t(`Flag of ${member.nameEn}`, `Drapeau du pays : ${member.nameFr}`)}
                fill
                sizes="(max-width: 768px) 160px, 256px"
                className="object-cover"
              />
            </div>

            <div>
              <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${isVerified ? "bg-highlight/10 text-highlight border-highlight/30" : "bg-surface text-textSecondary border-border"}`}>
                {isVerified ? t("Verified member", "Membre vérifié") : t("Onboarding", "En cours d'intégration")}
              </span>
              <h1 className="text-4xl md:text-7xl font-heading font-black capitalize mb-4 text-textPrimary">{name}</h1>
              <p className="text-lg md:text-xl text-textSecondary max-w-2xl leading-relaxed">{description}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-heading font-bold mb-6">
                {isVerified ? t(member.associationNameEn || "Robotics association", member.associationNameFr || "Association de robotique") : t("Robotics ecosystem", "Écosystème robotique")}
              </h2>

              {isCameroon ? (
                <div className="prose prose-lg max-w-none text-textSecondary mb-12 prose-headings:font-heading prose-headings:text-textPrimary prose-a:text-highlight">
                  <p>
                    {t(
                      member.aboutEn || "Founded in 2018, the Cameroon Robotics Association promotes robotics and innovation by connecting academia, industry and young technical talent.",
                      member.aboutFr || "Fondée en 2018, l'Association Camerounaise de Robotique promeut la robotique et l'innovation en rapprochant le monde académique, l'industrie et les jeunes talents techniques.",
                    )}
                  </p>
                  <p>
                    {t(
                      "Its initiatives include ELVIATECH, robotics training, hackathons and CRAUW — Robotics & Automation Week.",
                      "Ses initiatives comprennent ELVIATECH, des formations en robotique, des hackathons et CRAUW — Robotics & Automation Week.",
                    )}
                  </p>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-border rounded-3xl text-center text-textSecondary">
                  <p>{t("This page intentionally avoids publishing unverified membership claims.", "Cette page évite volontairement de publier des informations d'adhésion non vérifiées.")}</p>
                  <Link href="/join" className="inline-block mt-5 text-highlight font-bold hover:underline">
                    {t("Submit official ecosystem information", "Soumettre les informations officielles de l'écosystème")}
                  </Link>
                </div>
              )}

              {isCameroon && (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6">{t("Innovation gallery", "Galerie d'innovation")}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((number) => (
                      <div key={number} className="relative h-48 rounded-2xl overflow-hidden glass glow-border group">
                        <Image
                          src={`/assets/gallery/cameroon-${number}.jpg`}
                          alt={t(`Cameroon robotics activity ${number}`, `Activité robotique au Cameroun ${number}`)}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="space-y-8" aria-label={t("Country profile details", "Détails du profil pays")}>
              <div className="glass p-8 rounded-3xl glow-border">
                <h2 className="text-xl font-heading font-bold mb-6 text-highlight">{t("Key highlights", "Points forts")}</h2>
                <ul className="space-y-4">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="text-cta" aria-hidden="true">✓</span>
                      <span className="text-textSecondary text-lg font-medium">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isCameroon ? (
                <a href={member.websiteUrl || "https://cameroonrobotics.org"} target="_blank" rel="noopener noreferrer" className="w-full bg-cta hover:bg-ctaHover text-white py-5 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center">
                  {t("Visit the Cameroon platform", "Visiter la plateforme du Cameroun")}
                </a>
              ) : (
                <div className="w-full bg-surfaceAlt text-textSecondary py-5 rounded-2xl font-bold border border-border text-center">
                  {t("Official link pending validation", "Lien officiel en attente de validation")}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surfaceAlt border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center text-textPrimary">{t("Verified associations", "Associations vérifiées")}</h2>

          {associations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {associations.map((association) => (
                <a key={association.link} href={association.link} target="_blank" rel="noopener noreferrer" className="glass p-8 rounded-[2rem] flex items-center gap-6 hover:-translate-y-2 transition-transform glow-border group">
                  <div className="relative w-16 h-16 shrink-0 bg-surfaceAlt rounded-xl border border-border">
                    <Image src={association.logo} alt="" fill sizes="64px" className="object-contain p-2" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-textPrimary group-hover:text-highlight transition-colors leading-tight">{association.name}</h3>
                    <span className="text-highlight text-xs uppercase tracking-widest font-bold mt-1 block">{t("Verified member", "Membre vérifié")}</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-10 border-2 border-dashed border-border rounded-[2rem] text-center text-textSecondary">
              <p>{t("No association has completed verification for this country yet.", "Aucune association n'a encore finalisé sa vérification pour ce pays.")}</p>
              <Link href="/join" className="inline-block mt-6 text-highlight font-bold hover:underline">{t("Register an association", "Enregistrer une association")}</Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const members = await getMembers();
  return {
    paths: members.map((member) => ({ params: { country: member.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<MemberProfileProps> = async ({ params }) => {
  const country = String(params?.country || "");
  const [members, settings] = await Promise.all([getMembers(), getSiteSettings()]);
  const member = members.find((entry) => entry.slug === country);
  if (!member) return { notFound: true, revalidate: 60 };
  return { props: { member, settings }, revalidate: 60 };
};
