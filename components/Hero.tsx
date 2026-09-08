import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { memberNations } from "@/data/members";
import { defaultSiteSettings, SiteSettings } from "@/data/site";

const heroImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];

/** Types the heading one character at a time; the trailing `accent` renders in the accent colour. */
function TypedTitle({ text, accent }: { text: string; accent: string }) {
  const accentAt = text.endsWith(accent) ? text.length - accent.length : text.length;
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index >= text.length) window.clearInterval(id);
    }, 42);
    return () => window.clearInterval(id);
  }, [text]);

  const shownInk = text.slice(0, Math.min(count, accentAt));
  const shownAccent = count > accentAt ? text.slice(accentAt, count) : "";
  const remaining = text.slice(count);
  const typing = count < text.length;

  return (
    <span aria-label={text}>
      <span aria-hidden="true">
        <span className="text-textPrimary">{shownInk}</span>
        <span className="text-highlight">{shownAccent}</span>
        {typing && <span className="type-caret text-highlight">|</span>}
        <span className="text-transparent">{remaining}</span>
      </span>
    </span>
  );
}

export function Hero({ settings = defaultSiteSettings, memberCount = memberNations.length }: { settings?: SiteSettings; memberCount?: number }) {
  const { t } = useLanguage();

  const title = t(settings.heroTitleEn, settings.heroTitleFr);
  const accent = t("Future Together", "de l'Afrique");

  const stats: [string, string][] = [
    [String(memberCount), t("Ecosystems represented", "Écosystèmes représentés")],
    ["54", t("Nations targeted", "Nations visées")],
    ["2024", t("Initiative launched", "Initiative lancée")],
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(14,165,233,0.12),transparent_70%)]" />

      <div className="container mx-auto px-4 py-16 text-center md:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-highlight">
            {t(settings.heroEyebrowEn, settings.heroEyebrowFr)}
          </p>
          <h1 className="text-balance font-heading text-4xl font-black leading-[1.12] text-textPrimary sm:text-5xl md:text-6xl">
            <TypedTitle text={title} accent={accent} />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-textSecondary md:text-xl">
            {t(settings.heroDescriptionEn, settings.heroDescriptionFr)}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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

          <dl className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-12 gap-y-4 border-t border-border pt-8">
            {stats.map(([value, label]) => (
              <div key={label} className="text-center">
                <dt className="sr-only">{label}</dt>
                <dd className="font-heading text-3xl font-black text-ink md:text-4xl">{value}</dd>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-textSecondary/70">{label}</p>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Robotics across the continent */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:mt-16 md:grid-cols-5 md:gap-4"
        >
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`group relative aspect-[3/2] overflow-hidden rounded-xl ring-1 ring-border shadow-[0_12px_28px_-16px_rgba(12,74,110,0.3)] ${
                index === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <Image
                src={`/assets/${src}`}
                alt={t("African robotics in action", "La robotique africaine en action")}
                fill
                sizes="(max-width: 768px) 50vw, 18vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
