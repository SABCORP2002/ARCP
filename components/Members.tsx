import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { MemberNation, memberNations } from "@/data/members";

export function Members({ members = memberNations }: { members?: MemberNation[] }) {
  const { t, lang } = useLanguage();
  const verifiedCount = members.filter((member) => member.status === "verified").length;
  const onboardingCount = members.length - verifiedCount;

  const ordered = [...members].sort((a, b) => {
    if (a.status !== b.status) return a.status === "verified" ? -1 : 1;
    return t(a.nameEn, a.nameFr).localeCompare(t(b.nameEn, b.nameFr), lang === "FR" ? "fr" : "en");
  });

  return (
    <section id="members" className="scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            {t("African Robotics", "Écosystèmes Robotiques")} <span className="text-highlight">{t("Ecosystems", "Africains")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-textSecondary text-lg md:text-xl"
          >
            {t(
              `${verifiedCount} verified national association and ${onboardingCount} ecosystems onboarding across the continent.`,
              `${verifiedCount} association nationale vérifiée et ${onboardingCount} écosystèmes en intégration à travers le continent.`,
            )}
          </motion.p>
        </div>

        {/* Directory toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border pb-4 mb-6 md:mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-textSecondary">
            {t("Represented countries", "Pays représentés")}
            <span className="text-textSecondary/50"> · {members.length}</span>
          </span>
          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-textSecondary">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cta" />
              {t("Verified", "Vérifié")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-textSecondary/60" />
              {t("Onboarding", "En intégration")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {ordered.map((member, index) => (
            <MemberCard key={member.slug} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member, index }: { member: MemberNation; index: number }) {
  const { t } = useLanguage();
  const verified = member.status === "verified";

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.35 }}
    >
      <Link
        href={`/members/${member.slug}`}
        className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-surface p-3 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:border-highlight/40 hover:shadow-[0_12px_26px_-12px_rgba(12,74,110,0.18)] focus-visible:-translate-y-1 focus-visible:border-highlight/60 focus-visible:outline-none"
      >
        <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-surfaceAlt ring-1 ring-border">
          <Image
            src={`https://flagcdn.com/w320/${member.code}.png`}
            alt={t(`Flag of ${member.nameEn}`, `Drapeau : ${member.nameFr}`)}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 16vw"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.06]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <h4 className="font-heading text-sm font-bold leading-tight text-textPrimary transition-colors group-hover:text-highlight line-clamp-1">
            {t(member.nameEn, member.nameFr)}
          </h4>
          <span
            className={`mt-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
              verified ? "text-cta" : "text-textSecondary/70"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${verified ? "bg-cta" : "border border-textSecondary/50"}`} />
            {verified ? t("Verified", "Vérifié") : t("Onboarding", "En intégration")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
