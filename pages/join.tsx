import { useState } from "react";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { deliverForm, DeliveryMode } from "@/lib/forms";
import type { GetStaticProps } from "next";
import type { SiteSettings } from "@/data/site";
import { getSiteSettings } from "@/lib/cms";

export default function JoinPage({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    country: "",
    membershipType: "Member",
    interest: "",
    message: "",
  });

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const subject = `${t("New Join Request", "Nouvelle Demande d'Adhésion")}: ${formData.membershipType} - ${formData.fullName}`;
    try {
      const mode = await deliverForm({
        endpoint: process.env.NEXT_PUBLIC_MEMBERSHIP_FORM_ENDPOINT || "/api/forms/join",
        recipient: settings.secretariatEmail,
        subject,
        fields: {
          action: "arcp_join_request",
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          country: formData.country,
          membership_type: formData.membershipType,
          interest: formData.interest,
          message: formData.message,
          consent: "1",
          website: "",
        },
      });
      setDeliveryMode(mode);
    } catch {
      setError(t("The request could not be sent. Please contact the secretariat directly.", "La demande n'a pas pu être envoyée. Veuillez contacter directement le secrétariat."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout
      title={t("Join Us", "Rejoignez-nous")}
      description={t("Apply to join the African robotics cooperation network.", "Déposez une demande pour rejoindre le réseau africain de coopération robotique.")}
      path="/join"
      settings={settings}
    >
      <section className="py-14 sm:py-16 md:py-20 bg-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-highlight/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cta/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-10 md:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black mb-4 md:mb-6">
              {t("Join the", "Rejoignez le")} <span className="text-highlight">{t("Movement.", "Mouvement.")}</span>
            </h1>
            <p className="text-base md:text-lg text-textSecondary">
              {t(
                "Take part in a growing pan-African robotics ecosystem. Whether you are an individual researcher, a startup, or an international organization, there is a place for you in ARCP.",
                "Participez à un écosystème robotique panafricain en développement. Que vous soyez chercheur, startup ou organisation internationale, vous avez une place au sein de l'ARCP."
              )}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {deliveryMode ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 sm:p-8 md:p-12 rounded-[2rem] text-center border-highlight/20 shadow-xl"
              >
                <div className="w-20 h-20 bg-cta/10 rounded-full flex items-center justify-center mx-auto mb-6 text-cta text-4xl">
                  ✓
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
                  {deliveryMode === "endpoint" ? t("Application sent", "Demande envoyée") : t("Email ready to send", "Email prêt à être envoyé")}
                </h2>
                <p className="text-textSecondary text-base md:text-lg mb-8">
                  {deliveryMode === "endpoint"
                    ? t("Your request was delivered to the secretariat.", "Votre demande a été transmise au secrétariat.")
                    : t("Your email application has opened. Send the prepared message to complete your request.", "Votre application de messagerie s'est ouverte. Envoyez le message préparé pour finaliser votre demande.")}
                </p>
                <button 
                  type="button"
                  onClick={() => setDeliveryMode(null)}
                  className="bg-highlight hover:bg-highlight/80 text-white px-8 py-3 rounded-full font-bold transition-all"
                >
                  {t("Send Another Request", "Envoyer une autre demande")}
                </button>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="glass p-5 sm:p-6 md:p-12 rounded-[1.75rem] md:rounded-[2.5rem] border-highlight/10 shadow-2xl space-y-6 md:space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("Full Name", "Nom Complet")}</label>
                    <input 
                      id="fullName"
                      type="text" 
                      name="fullName"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t("Enter your full name", "Entrez votre nom complet")}
                      className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("Email Address", "Adresse Email")}</label>
                    <input 
                      id="email"
                      type="email" 
                      name="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@organization.com"
                      className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary"
                    />
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("Phone / WhatsApp", "Téléphone / WhatsApp")}</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+237…"
                      className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary"
                    />
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("Organization / University", "Organisation / Université")}</label>
                    <input 
                      id="organization"
                      type="text" 
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder={t("Company, Lab, or University", "Entreprise, Laboratoire ou Université")}
                      className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("Country", "Pays")}</label>
                    <input 
                      id="country"
                      type="text" 
                      name="country"
                      autoComplete="country-name"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      placeholder={t("Your Country", "Votre Pays")}
                      className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="interest" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("Area of interest", "Domaine d'intérêt")}</label>
                  <input
                    id="interest"
                    type="text"
                    name="interest"
                    required
                    value={formData.interest}
                    onChange={handleChange}
                    placeholder={t("Education, research, industry…", "Éducation, recherche, industrie…")}
                    className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary"
                  />
                </div>

                {/* Membership Type */}
                <div className="space-y-2">
                  <label htmlFor="membershipType" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("How would you like to join?", "Comment souhaitez-vous nous rejoindre ?")}</label>
                  <select 
                    id="membershipType"
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleChange}
                    className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary appearance-none cursor-pointer"
                  >
                    <option value="Member">{t("Individual Member (Student/Professional)", "Membre Individuel (Étudiant/Professionnel)")}</option>
                    <option value="Partner">{t("Organization / Partner", "Organisation / Partenaire")}</option>
                    <option value="Sponsor">{t("Sponsor", "Sponsor")}</option>
                    <option value="Volunteer">{t("Volunteer", "Bénévole")}</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-textPrimary ml-4 uppercase tracking-wider">{t("Briefly describe your interest or objectives", "Décrivez brièvement votre intérêt ou vos objectifs")}</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("Tell us what you'd like to achieve with ARCP...", "Dites-nous ce que vous aimeriez accomplir avec l'ARCP...")}
                    className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-highlight transition-colors text-textPrimary resize-none"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-textSecondary">
                  <input type="checkbox" required className="mt-1 h-4 w-4 accent-green-500" />
                  <span>
                    {t("I agree to the processing of this information for my membership request.", "J'accepte le traitement de ces informations pour ma demande d'adhésion.")} {" "}
                    <Link href="/privacy" className="text-highlight hover:underline">{t("Privacy policy", "Politique de confidentialité")}</Link>
                  </span>
                </label>

                {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">{error}</p>}

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cta hover:bg-ctaHover text-background font-black text-lg md:text-xl py-4 md:py-6 rounded-2xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? t("Sending…", "Envoi…") : t("Submit Membership Request", "Soumettre la Demande d'Adhésion")}
                  </button>
                  <p className="text-center text-textSecondary text-xs mt-6 uppercase tracking-widest font-bold opacity-60">
                    {t(`Direct contact: ${settings.secretariatEmail}`, `Contact direct : ${settings.secretariatEmail}`)}
                  </p>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<{ settings: SiteSettings }> = async () => ({
  props: { settings: await getSiteSettings() },
  revalidate: 60,
});
