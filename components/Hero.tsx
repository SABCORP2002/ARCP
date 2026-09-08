import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { memberNations } from "@/data/members";
import { defaultSiteSettings, SiteSettings } from "@/data/site";

export function Hero({ settings = defaultSiteSettings, memberCount = memberNations.length }: { settings?: SiteSettings; memberCount?: number }) {
  const { t } = useLanguage();

  const title = t(settings.heroTitleEn, settings.heroTitleFr);

  const stats: [string, string][] = [
    [String(memberCount), t("Ecosystems represented", "Écosystèmes représentés")],
    ["54", t("Nations targeted", "Nations visées")],
    ["2024", t("Initiative launched", "Initiative lancée")],
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_92%_8%,rgba(14,165,233,0.14),transparent_70%)]" />

      <div className="container mx-auto grid items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-highlight">
            {t(settings.heroEyebrowEn, settings.heroEyebrowFr)}
          </p>
          <h1 className="text-balance font-heading text-4xl font-black leading-[1.08] text-textPrimary sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-textSecondary md:text-xl">
            {t(settings.heroDescriptionEn, settings.heroDescriptionFr)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#members"
              className="rounded-full bg-cta px-7 py-3.5 text-center font-bold text-white transition-colors hover:bg-ctaHover"
            >
              {t("Explore ecosystems", "Explorer les écosystèmes")}
            </Link>
            <Link
              href="/#articles"
              className="rounded-full border border-border px-7 py-3.5 text-center font-bold text-textPrimary transition-colors hover:border-highlight hover:text-highlight"
            >
              {t("Read the latest", "Lire les actualités")}
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-heading text-3xl font-black text-ink md:text-4xl">{value}</dd>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-textSecondary/70">{label}</p>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_60px_-25px_rgba(12,74,110,0.35)]">
            <Image
              src="/assets/member-nations.jpg"
              alt={t("African robotics ecosystems", "Écosystèmes robotiques africains")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 rounded-2xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink shadow-[0_16px_30px_-16px_rgba(12,74,110,0.3)]">
            {t("Pan-African · since 2024", "Panafricain · depuis 2024")}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
