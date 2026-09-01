import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import type { GetStaticProps } from "next";
import type { SiteSettings } from "@/data/site";
import { getSiteSettings } from "@/lib/cms";

export default function PrivacyPage({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  return (
    <Layout title={t("Privacy Policy", "Politique de confidentialité")} description={t("How the platform handles contact and membership information.", "Comment la plateforme traite les informations de contact et d'adhésion.")} path="/privacy" settings={settings}>
      <article className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t("Privacy Policy", "Politique de confidentialité")}</h1>
        <p className="text-textSecondary mb-10">{t("Last updated: 26 August 2026", "Dernière mise à jour : 26 août 2026")}</p>
        <div className="prose prose-invert prose-lg max-w-none">
          <h2>{t("Information we collect", "Informations collectées")}</h2>
          <p>{t("Membership and contact forms may collect your name, email address, organization, country and message. The newsletter form collects your email address.", "Les formulaires d'adhésion et de contact peuvent collecter votre nom, votre adresse email, votre organisation, votre pays et votre message. Le formulaire de newsletter collecte votre adresse email.")}</p>
          <h2>{t("How information is used", "Utilisation des informations")}</h2>
          <p>{t("We use submitted information only to respond to requests, manage membership discussions and send updates you requested. We do not sell personal information.", "Nous utilisons les informations soumises uniquement pour répondre aux demandes, gérer les échanges liés à l'adhésion et envoyer les actualités demandées. Nous ne vendons pas les données personnelles.")}</p>
          <h2>{t("Technical services", "Services techniques")}</h2>
          <p>{t("The language preference is stored locally in your browser. Country flags are loaded from FlagCDN, which may receive standard connection information such as your IP address. A configured form delivery provider may process form submissions on our behalf.", "La préférence de langue est enregistrée localement dans votre navigateur. Les drapeaux sont chargés depuis FlagCDN, qui peut recevoir des informations de connexion standards telles que votre adresse IP. Un prestataire d'envoi configuré peut traiter les formulaires pour notre compte.")}</p>
          <h2>{t("Retention and your rights", "Conservation et vos droits")}</h2>
          <p>{t(`Information is retained only as long as necessary for the relevant request. To request access, correction or deletion, contact ${settings.contactEmail}.`, `Les informations sont conservées uniquement pendant la durée nécessaire au traitement de la demande. Pour demander un accès, une correction ou une suppression, contactez ${settings.contactEmail}.`)}</p>
        </div>
      </article>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<{ settings: SiteSettings }> = async () => ({
  props: { settings: await getSiteSettings() },
  revalidate: 60,
});
