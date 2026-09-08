import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { centralAfricaCodes, MemberNation, memberNations } from "@/data/members";

type Status = "verified" | "processing" | "onboarding";

function statusOf(member: MemberNation): Status {
  if (member.status === "verified") return "verified";
  return centralAfricaCodes.has(member.code) ? "processing" : "onboarding";
}

export function Members({ members = memberNations }: { members?: MemberNation[] }) {
  const { t, lang } = useLanguage();

  const verifiedCount = members.filter((member) => statusOf(member) === "verified").length;
  const processingCount = members.filter((member) => statusOf(member) === "processing").length;
  const onboardingCount = members.length - verifiedCount - processingCount;

  const rank: Record<Status, number> = { verified: 0, processing: 1, onboarding: 2 };
  const ordered = [...members].sort((a, b) => {
    const byStatus = rank[statusOf(a)] - rank[statusOf(b)];
    if (byStatus !== 0) return byStatus;
    return t(a.nameEn, a.nameFr).localeCompare(t(b.nameEn, b.nameFr), lang === "FR" ? "fr" : "en");
  });

  return (
    <section
      id="members"
      className="scroll-mt-28 relative overflow-hidden bg-gradient-to-b from-[#DBEDFB] via-[#EAF4FD] to-background py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(14,165,233,0.16),transparent_70%)]"
      />

      <div className="container relative mx-auto px-4 md:px-6">
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
              `${verifiedCount} verified national association, ${processingCount} ecosystems in processing and ${onboardingCount} onboarding across the continent.`,
              `${verifiedCount} association nationale vérifiée, ${processingCount} écosystèmes en traitement et ${onboardingCount} en intégration à travers le continent.`,
            )}
          </motion.p>
        </div>

        {/* Directory toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border pb-4 mb-6 md:mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-textSecondary">
            {t("Represented countries", "Pays représentés")}
            <span className="text-textSecondary/50"> · {members.length}</span>
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-textSecondary">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cta" />
              {t("Verified", "Vérifié")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" />
              {t("Processing", "En traitement")}
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
  const status = statusOf(member);

  const label =
    status === "verified"
      ? t("Verified", "Vérifié")
      : status === "processing"
        ? t("Processing", "En traitement")
        : t("Onboarding", "En intégration");
  const tone =
    status === "verified" ? "text-cta" : status === "processing" ? "text-warning" : "text-textSecondary/70";
  const dot =
    status === "verified"
      ? "bg-cta"
      : status === "processing"
        ? "bg-warning"
        : "border border-textSecondary/50";

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
          <span className={`mt-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${tone}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
