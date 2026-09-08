import Link from "next/link";
import { motion } from "framer-motion";
import type { GetStaticProps } from "next";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { getSiteSettings, getStatistics } from "@/lib/cms";
import type { SiteSettings } from "@/data/site";
import type { AnnualStatistics } from "@/data/statistics";

type Props = { statistics: AnnualStatistics; settings: SiteSettings };

const HIGHLIGHT_KEYS = ["associations", "education", "ventures", "funding"];

export default function StatisticsPage({ statistics, settings }: Props) {
  const { t, lang } = useLanguage();

  const updated = statistics.updatedAt
    ? new Date(`${statistics.updatedAt}T00:00:00Z`).toLocaleDateString(lang === "FR" ? "fr-FR" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  const highlights = HIGHLIGHT_KEYS.map((key) => statistics.categories.find((category) => category.key === key)).filter(
    (category): category is NonNullable<typeof category> => Boolean(category),
  );

  const steps = [
    {
      title: t("Ecosystems submit data", "Les écosystèmes transmettent les données"),
      text: t(
        "Each member ecosystem files an annual return across the eight categories.",
        "Chaque écosystème membre remet un rapport annuel sur les huit catégories.",
      ),
    },
    {
      title: t("ARCP consolidates", "L'ARCP consolide"),
      text: t(
        "Returns are reviewed, de-duplicated and cross-checked with public sources.",
        "Les données sont contrôlées, dédoublonnées et recoupées avec des sources publiques.",
      ),
    },
    {
      title: t("Annual report published", "Publication du rapport annuel"),
      text: t(
        "A consolidated report is released every first quarter, with the figures below.",
        "Un rapport consolidé paraît chaque premier trimestre, avec les chiffres ci-dessous.",
      ),
    },
  ];

  return (
    <Layout
      title={t(`Africa Robotics Statistics ${statistics.year}`, `Statistiques de la robotique en Afrique ${statistics.year}`)}
      description={t(statistics.summaryEn, statistics.summaryFr)}
      path="/statistics"
      settings={settings}
    >
      {/* Header */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-highlight"
          >
            {t("Annual report", "Rapport annuel")} · {statistics.year}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-balance font-heading text-4xl font-black leading-[1.12] md:text-6xl"
          >
            {t("Africa Robotics ", "La robotique en Afrique ")}
            <span className="text-highlight">{t("Statistics", "en chiffres")}</span>
          </motion.h1>
          <p className="mx-auto mt-6 text-lg leading-relaxed text-textSecondary md:text-xl">
            {t(statistics.summaryEn, statistics.summaryFr)}
          </p>
          {updated ? (
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-textSecondary/60">
              {t("Figures consolidated on", "Chiffres consolidés le")} {updated}
            </p>
          ) : null}
        </div>
      </section>

      {/* Highlight band */}
      <section className="relative overflow-hidden bg-[#0A1A2E] py-14 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:26px_26px]"
        />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {highlights.map((category) => (
              <div key={category.key} className="text-center">
                <div className="font-heading text-4xl font-black text-white md:text-5xl">{category.value}</div>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-sky/80">
                  {t(category.labelEn, category.labelFr)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All categories */}
      <section className="bg-gradient-to-b from-[#EAF4FD] to-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-highlight">
              {t("By category", "Par catégorie")}
            </p>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              {t("Eight indicators of progress", "Huit indicateurs d'avancement")}
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {statistics.categories.map((category) => (
              <div
                key={category.key}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:border-highlight/40 hover:shadow-[0_16px_34px_-16px_rgba(12,74,110,0.2)]"
              >
                <p className="text-[11px] font-bold uppercase leading-snug tracking-wider text-textSecondary">
                  {t(category.labelEn, category.labelFr)}
                </p>
                <p className="mt-3 font-heading text-4xl font-black text-ink">{category.value}</p>
                {category.deltaEn || category.deltaFr ? (
                  <span className="mt-2 inline-flex w-fit rounded-full bg-highlight/10 px-2.5 py-1 text-[11px] font-semibold text-highlight">
                    {t(category.deltaEn || "", category.deltaFr || "")}
                  </span>
                ) : null}
                <p className="mt-4 text-sm leading-relaxed text-textSecondary">
                  {t(category.descriptionEn, category.descriptionFr)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-highlight">
              {t("Methodology", "Méthodologie")}
            </p>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              {t("How the figures are produced", "Comment les chiffres sont produits")}
            </h2>
          </div>

          <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-border bg-surface p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-highlight/10 font-mono text-sm font-bold text-highlight">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-heading text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-textSecondary">{step.text}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-center text-textSecondary leading-relaxed">
            {t(statistics.methodologyEn, statistics.methodologyFr)}
          </p>
        </div>
      </section>

      {/* Download */}
      <section className="relative overflow-hidden bg-[#0A1A2E] py-16 text-center md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(14,165,233,0.18),transparent_70%)]"
        />
        <div className="container relative mx-auto max-w-2xl px-4 md:px-6">
          <h2 className="font-heading text-2xl font-bold text-white md:text-4xl">
            {t(`Download the ${statistics.year} statistics report`, `Télécharger le rapport statistique ${statistics.year}`)}
          </h2>
          <p className="mx-auto mt-4 text-white/70">
            {t(
              "The full PDF covers the methodology, per-country breakdowns and category detail.",
              "Le PDF complet couvre la méthodologie, les répartitions par pays et le détail par catégorie.",
            )}
          </p>

          <div className="mt-8">
            {statistics.reportUrl ? (
              <a
                href={statistics.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cta px-8 py-4 font-bold text-white transition-colors hover:bg-ctaHover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
                </svg>
                {t("Download the full report (PDF)", "Télécharger le rapport complet (PDF)")}
              </a>
            ) : (
              <div className="mx-auto max-w-md">
                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/15 px-8 py-4 font-bold text-white/50">
                  {t("Report in preparation", "Rapport en préparation")}
                </span>
                <p className="mt-4 text-sm text-white/60">
                  {t(
                    `The ${statistics.year} report is being consolidated and will be published in the first quarter. `,
                    `Le rapport ${statistics.year} est en cours de consolidation et sera publié au premier trimestre. `,
                  )}
                  <Link href="/contact" className="font-semibold text-sky hover:underline">
                    {t("Ask to be notified", "Demander à être informé")}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: {
    statistics: await getStatistics(),
    settings: await getSiteSettings(),
  },
  revalidate: 60,
});
