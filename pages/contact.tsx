import Link from "next/link";
import { FormEvent, useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { deliverForm, DeliveryMode } from "@/lib/forms";
import type { GetStaticProps } from "next";
import type { SiteSettings } from "@/data/site";
import { getSiteSettings } from "@/lib/cms";

export default function ContactPage({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | DeliveryMode | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const mode = await deliverForm({
        endpoint: process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT || "/api/forms/contact",
        recipient: settings.contactEmail,
        subject: String(data.get("subject") || t("Website contact request", "Demande de contact du site")),
        fields: {
          action: "arcp_contact_request",
          full_name: String(data.get("full_name") || ""),
          email: String(data.get("email") || ""),
          phone: String(data.get("phone") || ""),
          message: String(data.get("message") || ""),
          consent: "1",
          website: String(data.get("website") || ""),
        },
      });
      setStatus(mode);
      if (mode === "endpoint") form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout
      title={t("Contact", "Contact")}
      description={t("Contact the African Robot Cooperation Platform.", "Contactez la Plateforme Africaine de Coopération Robotique.")}
      path="/contact"
      settings={settings}
    >
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-highlight font-bold uppercase tracking-widest text-sm mb-3">ARCP</p>
            <h1 className="text-4xl md:text-6xl font-black mb-5">{t("Contact us", "Contactez-nous")}</h1>
            <p className="text-textSecondary text-lg mb-8">
              {t("For membership, partnerships, events, media or institutional collaboration, send us a message.", "Pour l'adhésion, les partenariats, les événements, les médias ou une collaboration institutionnelle, envoyez-nous un message.")}
            </p>
            <a className="text-highlight font-semibold hover:underline" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            <p className="text-textSecondary mt-3">{settings.phone}</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-9 grid gap-5" aria-describedby="contact-status">
            <div className="absolute -left-[10000px] w-px h-px overflow-hidden" aria-hidden="true">
              <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <label className="grid gap-2 font-semibold">
              {t("Full name", "Nom complet")}
              <input name="full_name" type="text" autoComplete="name" required className="bg-surfaceAlt border border-border rounded-xl px-4 py-3" />
            </label>
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="grid gap-2 font-semibold">
                {t("Email address", "Adresse email")}
                <input name="email" type="email" autoComplete="email" required className="bg-surfaceAlt border border-border rounded-xl px-4 py-3" />
              </label>
              <label className="grid gap-2 font-semibold">
                {t("Phone (optional)", "Téléphone (facultatif)")}
                <input name="phone" type="tel" autoComplete="tel" className="bg-surfaceAlt border border-border rounded-xl px-4 py-3" />
              </label>
            </div>
            <label className="grid gap-2 font-semibold">
              {t("Subject", "Objet")}
              <input name="subject" type="text" required className="bg-surfaceAlt border border-border rounded-xl px-4 py-3" />
            </label>
            <label className="grid gap-2 font-semibold">
              {t("Message", "Message")}
              <textarea name="message" rows={6} required className="bg-surfaceAlt border border-border rounded-xl px-4 py-3 resize-y" />
            </label>
            <label className="flex items-start gap-3 text-sm text-textSecondary">
              <input name="consent" type="checkbox" value="1" required className="mt-1" />
              <span>{t("I agree that my information may be processed to answer this request.", "J'accepte que mes informations soient traitées afin de répondre à cette demande.")} <Link href="/privacy" className="text-highlight hover:underline">{t("Privacy policy", "Politique de confidentialité")}</Link>.</span>
            </label>
            <button type="submit" disabled={status === "sending"} className="bg-cta hover:bg-ctaHover text-white font-bold px-7 py-4 rounded-full transition-colors">
              {status === "sending" ? t("Sending…", "Envoi…") : t("Send message", "Envoyer le message")}
            </button>
            <p id="contact-status" role="status" className="text-sm text-textSecondary min-h-5">
              {status === "endpoint" && t("Your message was sent successfully.", "Votre message a bien été envoyé.")}
              {status === "email-client" && t("Your email application is open; send the prepared message to finish.", "Votre application de messagerie est ouverte ; envoyez le message préparé pour terminer.")}
              {status === "error" && t(`Unable to send. Email ${settings.contactEmail}.`, `Envoi impossible. Écrivez à ${settings.contactEmail}.`)}
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<{ settings: SiteSettings }> = async () => ({
  props: { settings: await getSiteSettings() },
  revalidate: 60,
});
