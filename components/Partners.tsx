import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_EMAIL } from "@/lib/forms";
import { PlatformPartner, platformPartners } from "@/data/partners";

function PartnerLogo({ partner }: { partner: PlatformPartner }) {
  const logo = (
    <Image
      src={partner.image}
      alt={partner.name}
      fill
      sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 208px"
      className="object-contain"
    />
  );
  const className = `w-32 h-20 sm:w-40 sm:h-24 md:w-52 md:h-28 relative transition-transform duration-300 ${partner.websiteUrl ? "hover:scale-105" : "cursor-default"}`;

  if (!partner.websiteUrl) {
    return <div className={className}>{logo}</div>;
  }

  return (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${partner.name} website`}
      className={className}
    >
      {logo}
    </a>
  );
}

export function Partners({ partners = platformPartners, contactEmail = CONTACT_EMAIL }: { partners?: PlatformPartner[]; contactEmail?: string }) {
  const { t } = useLanguage();
  const subject = encodeURIComponent(t("Partnership request — ARCP", "Demande de partenariat — PACR"));

  return (
    <section id="partners" className="scroll-mt-28 py-16 md:py-24 bg-surfaceAlt relative overflow-hidden mt-16 md:mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_60%)]" aria-hidden="true" />
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
          {t("Our", "Nos")} <span className="text-highlight">{t("Partners", "partenaires")}</span>
        </h2>
        <p className="text-textSecondary text-lg md:text-xl max-w-3xl mx-auto mb-16 px-4 text-balance leading-relaxed">
          {t(
            "We collaborate with public institutions and private-sector innovators to support robotics education and development.",
            "Nous collaborons avec des institutions publiques et des innovateurs du secteur privé pour soutenir l'éducation et le développement de la robotique.",
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-20 max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          {partners.map((partner) => <PartnerLogo key={partner.id} partner={partner} />)}
        </div>

        <a
          href={`mailto:${contactEmail}?subject=${subject}`}
          className="inline-flex bg-transparent border-2 border-cta text-cta hover:bg-cta hover:text-white px-8 py-3 rounded-full font-bold transition-all hover:shadow-md"
        >
          {t("Become a partner", "Devenir partenaire")}
        </a>
      </div>
    </section>
  );
}
