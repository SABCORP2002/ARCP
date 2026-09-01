import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_EMAIL, deliverForm } from "@/lib/forms";

export function Newsletter({ recipient = CONTACT_EMAIL }: { recipient?: string }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "email-client" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const mode = await deliverForm({
        endpoint: process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ENDPOINT || "/api/forms/newsletter",
        recipient,
        subject: t("Newsletter subscription", "Inscription à la newsletter"),
        fields: { action: "arcp_newsletter", email, website: "" },
      });
      setStatus(mode === "endpoint" ? "sent" : "email-client");
      if (mode === "endpoint") setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-highlight/5 border-b border-border">
      
       {/* Decorative Gradient */}
       <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="glass p-6 sm:p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border-highlight/30 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black mb-4 leading-tight text-textPrimary">
              {t("Stay updated on African", "Restez informé sur la")} <br className="hidden md:block"/>
              <span className="text-cta">{t("robotics.", "robotique africaine.")}</span>
            </h2>
            <p className="text-textSecondary text-lg mb-8">
              {t(
                "Join our newsletter for monthly insights, grant announcements, and highlights from across the continent.",
                "Inscrivez-vous à notre newsletter pour des aperçus mensuels, des annonces de bourses et des moments forts du continent."
              )}
            </p>
            
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={handleSubmit}
            >
              <label htmlFor="newsletter-email" className="sr-only">{t("Email address", "Adresse email")}</label>
              <input 
                id="newsletter-email"
                type="email" 
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("Enter your email address", "Entrez votre adresse email")} 
                className="bg-background/80 border border-border text-textPrimary px-6 py-4 rounded-full flex-grow focus:outline-none focus:border-highlight transition-colors"
                required
              />
              <button 
                type="submit"
                disabled={status === "sending"}
                className="bg-cta hover:bg-ctaHover text-background font-bold px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                {status === "sending" ? t("Sending…", "Envoi…") : t("Subscribe", "S'abonner")}
              </button>
            </form>
            <p className="mt-4 text-sm text-textSecondary">
              {status === "sent" && t("Subscription request sent successfully.", "Demande d'inscription envoyée.")}
              {status === "email-client" && t("Send the prepared email to complete your subscription.", "Envoyez l'email préparé pour finaliser votre inscription.")}
              {status === "error" && t(`Unable to send. Contact ${recipient}.`, `Envoi impossible. Contactez ${recipient}.`)}
              {status === "idle" && <>{t("By subscribing, you accept our", "En vous inscrivant, vous acceptez notre")} <Link href="/privacy" className="text-highlight hover:underline">{t("privacy policy", "politique de confidentialité")}</Link>.</>}
            </p>
          </div>

          <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-96 lg:h-96 opacity-60">
             {/* ICON: newsletter-illustration.svg */}
            <Image src="/assets/newsletter-illustration.svg" alt="" fill sizes="(max-width: 1024px) 256px, 384px" className="object-contain" />
          </div>

        </div>
      </div>
    </section>
  );
}
