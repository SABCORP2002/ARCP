import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import type { GetStaticProps } from "next";
import type { SiteSettings } from "@/data/site";
import { getSiteSettings } from "@/lib/cms";

export default function TermsPage({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  return (
    <Layout title={t("Terms of Use", "Conditions d'utilisation")} description={t("Terms governing use of the platform website.", "Conditions régissant l'utilisation du site de la plateforme.")} path="/terms" settings={settings}>
      <article className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t("Terms of Use", "Conditions d'utilisation")}</h1>
        <p className="text-textSecondary mb-10">{t("Last updated: 26 August 2026", "Dernière mise à jour : 26 août 2026")}</p>
        <div className="prose prose-invert prose-lg max-w-none">
          <h2>{t("Purpose", "Objet")}</h2>
          <p>{t("This website presents the African Robot Cooperation Platform, its verified activities and opportunities to collaborate.", "Ce site présente la Plateforme Africaine de Coopération Robotique, ses activités vérifiées et les possibilités de collaboration.")}</p>
          <h2>{t("Accuracy and membership status", "Exactitude et statut des membres")}</h2>
          <p>{t("Profiles marked as onboarding are not represented as verified members. Event and article information may change; official linked sources take precedence.", "Les profils indiqués comme étant en cours d'intégration ne sont pas présentés comme membres vérifiés. Les informations relatives aux événements et aux articles peuvent évoluer ; les sources officielles liées font foi.")}</p>
          <h2>{t("External links", "Liens externes")}</h2>
          <p>{t("External websites are operated by third parties. The platform is not responsible for their availability, security or content.", "Les sites externes sont exploités par des tiers. La plateforme n'est pas responsable de leur disponibilité, de leur sécurité ou de leur contenu.")}</p>
          <h2>{t("Contact", "Contact")}</h2>
          <p>{t(`Questions about these terms can be sent to ${settings.contactEmail}.`, `Les questions relatives à ces conditions peuvent être envoyées à ${settings.contactEmail}.`)}</p>
        </div>
      </article>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<{ settings: SiteSettings }> = async () => ({
  props: { settings: await getSiteSettings() },
  revalidate: 60,
});
