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
    <section className="relative isolate overflow-hidden bg-background">
      {/* Backdrop: the African continent, visible but calmed with a light wash
          and a spotlight that keeps the headline crisp. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Image src="/assets/Afrique.jpg" alt="" fill priority sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/42 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(62%_52%_at_50%_24%,#F6F9FC_0%,rgba(246,249,252,0.35)_55%,transparent_78%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-12 text-center md:px-6 md:pt-24 md:pb-16">
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

      </div>

      {/* Robotics across the continent — continuous scrolling strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        aria-hidden="true"
        className="relative z-10 overflow-hidden pb-16 md:pb-24 [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]"
      >
        <div className="hero-marquee-track flex w-max">
          {[...heroImages, ...heroImages].map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/2] w-56 shrink-0 overflow-hidden rounded-xl ring-1 ring-border shadow-[0_12px_28px_-16px_rgba(12,74,110,0.3)] mr-3 sm:w-64 md:mr-4 md:w-72"
            >
              <Image src={`/assets/${src}`} alt="" fill sizes="288px" className="object-cover" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
