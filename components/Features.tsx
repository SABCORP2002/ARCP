import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function Features() {
  const { t } = useLanguage();

  const featuresData: Feature[] = [
    {
      title: t("History", "Histoire"),
      description: t(
        "Founded in 2024, ARCP emerged from a collective desire to unite fragmented continental robotics initiatives into a shared platform.",
        "Fondée en 2024, l'ARCP est née d'un désir collectif d'unir les initiatives robotiques continentales au sein d'une plateforme commune.",
      ),
      icon: (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </>
      ),
    },
    {
      title: t("Mission", "Mission"),
      description: t(
        "To accelerate the adoption, development, and contextualization of robotic technologies across all 54 African nations.",
        "Accélérer l'adoption, le développement et la contextualisation des technologies robotiques dans les 54 nations africaines.",
      ),
      icon: (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </>
      ),
    },
    {
      title: t("Vision", "Vision"),
      description: t(
        "An Africa that is not merely a consumer of global automation, but a leading pioneer in responsible robotics innovation.",
        "Une Afrique qui n'est pas seulement consommatrice d'automatisation mondiale, mais pionnière de l'innovation robotique responsable.",
      ),
      icon: (
        <>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ),
    },
    {
      title: t("Governance", "Gouvernance"),
      description: t(
        "Structured collaboratively with representation from key academic, industrial, and governmental bodies across our member states.",
        "Structurée de manière collaborative avec des représentants d'organismes académiques, industriels et gouvernementaux de nos États membres.",
      ),
      icon: (
        <>
          <path d="m4 9 8-5 8 5" />
          <path d="M5 9v9M10 9v9M14 9v9M19 9v9" />
          <path d="M3 21h18M4 9h16" />
        </>
      ),
    },
  ];

  return (
    <section id="about" className="scroll-mt-28 relative overflow-hidden bg-[#0A1A2E] py-20 md:py-28">
      {/* Technical texture: dot grid + a top sky glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:26px_26px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(14,165,233,0.18),transparent_70%)]"
      />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-sky"
          >
            {t("About us", "À propos")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-heading text-3xl font-bold text-white md:text-5xl"
          >
            {t("About", "À propos de l'")}<span className="text-sky"> ARCP</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg leading-relaxed text-white/70 md:text-xl"
          >
            {t(
              "We are dedicated to building a robust ecosystem for robotics research and industrial application.",
              "Nous nous consacrons à la construction d'un écosystème robuste pour la recherche et l'application industrielle de la robotique.",
            )}
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {featuresData.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky/50 hover:bg-white/[0.06] md:p-9"
            >
              {/* top edge accent */}
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
              {/* hover corner glow */}
              <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              <span className="absolute right-6 top-6 font-mono text-sm tracking-widest text-sky/50">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-sky/10 text-sky">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {feature.icon}
                </svg>
              </div>

              <h3 className="font-heading text-xl font-bold text-white md:text-2xl">{feature.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-white/65">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
