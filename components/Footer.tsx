import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { defaultSiteSettings, SiteSettings } from "@/data/site";

export function Footer({ settings = defaultSiteSettings }: { settings?: SiteSettings }) {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">

          {/* Column 1 */}
          <div>
            <div className="relative w-[150px] sm:w-[180px] md:w-[200px] h-[48px] md:h-[60px] mb-6">
              {/* ICON: logo.svg */}
              <Image src="/assets/logo.svg" alt="African Robot Cooperation Platform" fill sizes="200px" className="object-contain object-left" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
                {t("Building Africa's robotics future together through innovation, education and research.", "Construire ensemble l'avenir de la robotique africaine par l'innovation, l'éducation et la recherche.")}
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-gray-900 font-heading font-bold mb-6 text-lg">{t("Quick Links", "Liens Rapides")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("Home", "Accueil"), href: "/" },
                { label: t("About", "À propos"), href: "/#about" },
                { label: t("Ecosystems", "Écosystèmes"), href: "/#members" },
                { label: t("Articles", "Articles"), href: "/#articles" },
                { label: t("Events", "Événements"), href: "/#events" },
                { label: t("Partners", "Partenaires"), href: "/#partners" },
                { label: t("Contact", "Contact"), href: "/contact" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-gray-900 font-heading font-bold mb-6 text-lg">{t("Contact Info", "Coordonnées")}</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <span className="block text-gray-900 mb-1">{t("General:", "Général :")}</span>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary transition-colors">{settings.contactEmail}</a>
              </li>
              <li>
                <span className="block text-gray-900 mb-1">{t("Secretariat:", "Secrétariat :")}</span>
                <a href={`mailto:${settings.secretariatEmail}`} className="hover:text-primary transition-colors">{settings.secretariatEmail}</a>
              </li>
              <li>
                <span className="block text-gray-900 mb-1">{t("Phone:", "Téléphone :")}</span>
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary transition-colors">{settings.phone}</a>
              </li>
              <li>
                <span className="block text-gray-900 mb-1">{t("Address:", "Adresse :")}</span>
                {settings.address}
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-sm text-gray-500 text-center md:text-left">
          <p>© {new Date().getFullYear()} AFRICAN ROBOT COOPERATION PLATFORM. {t("All rights reserved.", "Tous droits réservés.")}</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">{t("Privacy Policy", "Politique de confidentialité")}</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">{t("Terms of Use", "Conditions d'utilisation")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
