import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Standalone design preview — light theme + sky-blue accent.
 * Not wired into the site navigation. Delete once the direction is approved
 * and the tokens/components have been migrated.
 */

const C = {
  bg: "#F6F9FC",
  surface: "#FFFFFF",
  surface2: "#EEF4FA",
  border: "#E2E8F0",
  text: "#0F172A",
  soft: "#475569",
  faint: "#94A3B8",
  sky: "#0EA5E9",
  sky600: "#0284C7",
  sky50: "#E0F2FE",
  ink: "#0C4A6E",
};

const nav = ["Home", "About", "Ecosystems", "Articles", "Events", "Partners", "Contact"];

const pillars = [
  {
    title: ["Connect", "Connecter"],
    body: [
      "Link national robotics associations, labs and companies into one continental network.",
      "Relier associations, laboratoires et entreprises de robotique en un réseau continental.",
    ],
    icon: (
      <path d="M7 12a3 3 0 0 1 3-3h1m6 6a3 3 0 0 1-3 3h-1m-2-9 4 0m-8 6 4 0M9 7.5 15 16.5" />
    ),
  },
  {
    title: ["Share knowledge", "Partager la connaissance"],
    body: [
      "Circulate research, training resources and best practices between ecosystems.",
      "Faire circuler recherche, ressources de formation et bonnes pratiques entre écosystèmes.",
    ],
    icon: <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v14H6.5A1.5 1.5 0 0 0 5 19.5zM18 18v2M9 8h6M9 11h4" />,
  },
  {
    title: ["Represent", "Représenter"],
    body: [
      "Give African robotics a common voice in policy, standards and global forums.",
      "Porter une voix commune de la robotique africaine dans les politiques, normes et forums mondiaux.",
    ],
    icon: <path d="M5 20V4l9 3-2 3 2 3-9 2M5 20h4" />,
  },
  {
    title: ["Support", "Soutenir"],
    body: [
      "Help emerging national ecosystems get organised, verified and funded.",
      "Aider les écosystèmes nationaux émergents à s'organiser, se faire vérifier et se financer.",
    ],
    icon: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
  },
];

export default function Preview() {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>Design preview — ARCP</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen font-body" style={{ background: C.bg, color: C.text }}>
        <span
          className="fixed right-0 top-0 z-50 rounded-bl-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
          style={{ background: C.ink }}
        >
          Design preview
        </span>

        {/* Navbar */}
        <header
          className="sticky top-0 z-40"
          style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(15,23,42,.05)" }}
        >
          <div className="container mx-auto flex items-center gap-6 px-4 py-4 md:px-6">
            <div className="relative h-[46px] w-[150px] shrink-0 md:h-[54px] md:w-[176px]">
              <Image src="/assets/logo.svg" alt="ARCP" fill className="object-contain object-left" />
            </div>
            <nav className="mx-auto hidden items-center gap-7 lg:flex">
              {nav.map((label) => (
                <span key={label} className="cursor-pointer text-[15px] font-medium transition-colors" style={{ color: C.soft }}>
                  {label}
                </span>
              ))}
            </nav>
            <div className="ml-auto hidden items-center gap-4 lg:flex">
              <span className="text-[15px] font-medium" style={{ color: C.soft }}>
                EN / FR
              </span>
              <span
                className="rounded-full px-5 py-2.5 text-[15px] font-semibold text-white"
                style={{ background: C.sky }}
              >
                {t("Join the platform", "Rejoindre la plateforme")}
              </span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{ background: `radial-gradient(55% 45% at 92% 8%, ${C.sky50}, transparent 70%), ${C.bg}` }}
        >
          <div className="container mx-auto grid items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: C.sky600 }}>
                {t("African Robot Cooperation Platform", "Plateforme Africaine de Coopération Robotique")}
              </p>
              <h1
                className="text-balance font-heading text-4xl font-black leading-[1.08] sm:text-5xl md:text-6xl"
                style={{ color: C.text }}
              >
                {t("Building Africa's Robotics ", "Construire l'avenir robotique ")}
                <span style={{ color: C.sky }}>{t("Future Together", "de l'Afrique ensemble")}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: C.soft }}>
                {t(
                  "A continental initiative connecting African ecosystems around robotics research, innovation and education.",
                  "Une initiative continentale reliant les écosystèmes africains autour de la recherche, de l'innovation et de l'éducation en robotique.",
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <span className="rounded-full px-7 py-3.5 text-center font-bold text-white" style={{ background: C.sky }}>
                  {t("Explore ecosystems", "Explorer les écosystèmes")}
                </span>
                <span
                  className="rounded-full px-7 py-3.5 text-center font-bold"
                  style={{ border: `1px solid ${C.border}`, color: C.text }}
                >
                  {t("Read the latest", "Lire les actualités")}
                </span>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-8" style={{ borderColor: C.border }}>
                {[
                  ["20", t("ecosystems represented", "écosystèmes représentés")],
                  ["54", t("nations targeted", "nations visées")],
                  ["2024", t("initiative launched", "initiative lancée")],
                ].map(([n, label]) => (
                  <div key={label}>
                    <div className="font-heading text-3xl font-black" style={{ color: C.ink }}>
                      {n}
                    </div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.faint }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative">
              <div
                className="relative aspect-[5/6] overflow-hidden rounded-[2rem]"
                style={{ border: `1px solid ${C.border}`, boxShadow: "0 30px 60px -25px rgba(12,74,110,.35)" }}
              >
                <Image src="/assets/member-nations.jpg" alt="" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
              </div>
              <div
                className="absolute -bottom-5 -left-5 rounded-2xl px-5 py-3 text-sm font-semibold"
                style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 16px 30px -16px rgba(12,74,110,.3)", color: C.ink }}
              >
                {t("Pan-African · since 2024", "Panafricain · depuis 2024")}
              </div>
            </div>
          </div>
        </section>

        {/* What ARCP does */}
        <section style={{ background: C.surface }} className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: C.sky600 }}>
                {t("Our role", "Notre rôle")}
              </p>
              <h2 className="font-heading text-3xl font-bold md:text-5xl" style={{ color: C.text }}>
                {t("What ARCP does", "Ce que fait l'ARCP")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed" style={{ color: C.soft }}>
                {t(
                  "One platform to organise, connect and represent the continent's robotics ecosystems.",
                  "Une plateforme pour organiser, relier et représenter les écosystèmes robotiques du continent.",
                )}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {pillars.map((p) => (
                <div
                  key={p.title[0]}
                  className="group rounded-2xl p-7 transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: C.sky50, color: C.sky600 }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {p.icon}
                    </svg>
                  </div>
                  <h3 className="font-heading text-lg font-bold" style={{ color: C.text }}>
                    {t(p.title[0], p.title[1])}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: C.soft }}>
                    {t(p.body[0], p.body[1])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section style={{ background: C.ink }} className="py-16 text-center text-white md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold md:text-4xl">
              {t("Bring your national ecosystem into ARCP", "Faites entrer votre écosystème national dans l'ARCP")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              {t(
                "National associations, partner organisations and individual supporters — there is a place for you.",
                "Associations nationales, organisations partenaires, particuliers — il y a une place pour vous.",
              )}
            </p>
            <span
              className="mt-8 inline-block rounded-full px-8 py-3.5 font-bold"
              style={{ background: C.surface, color: C.ink }}
            >
              {t("Start an application", "Déposer une candidature")}
            </span>
          </div>
        </section>

        {/* Footer strip */}
        <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}` }} className="py-10">
          <div className="container mx-auto flex flex-col items-center gap-3 px-4 text-center md:px-6">
            <div className="relative h-10 w-40">
              <Image src="/assets/logo.svg" alt="ARCP" fill className="object-contain" />
            </div>
            <div className="flex gap-5 text-sm" style={{ color: C.soft }}>
              <span>{t("Privacy Policy", "Politique de confidentialité")}</span>
              <span>{t("Terms of Use", "Conditions d'utilisation")}</span>
            </div>
            <p className="text-xs" style={{ color: C.faint }}>
              © {new Date().getFullYear()} African Robot Cooperation Platform
            </p>
          </div>
        </footer>

        <div className="py-10 text-center">
          <Link href="/" className="text-sm font-semibold" style={{ color: C.sky600 }}>
            ← {t("Back to the current site", "Retour au site actuel")}
          </Link>
        </div>
      </div>
    </>
  );
}
