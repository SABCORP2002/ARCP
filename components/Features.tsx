import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function Features() {
  const { t } = useLanguage();

  const featuresData = [
    {
      title: t("History", "Histoire"),
      description: t(
        "Founded in 2024, ARCP emerged from a collective desire to unite fragmented continental robotics initiatives into a shared platform.",
        "Fondée en 2024, l'ARCP est née d'un désir collectif d'unir les initiatives robotiques continentales au sein d'une plateforme commune.",
      ),
    },
    {
      title: t("Mission", "Mission"),
      description: t(
        "To accelerate the adoption, development, and contextualization of robotic technologies across all 54 African nations.",
        "Accélérer l'adoption, le développement et la contextualisation des technologies robotiques dans les 54 nations africaines.",
      ),
    },
    {
      title: t("Vision", "Vision"),
      description: t(
        "An Africa that is not merely a consumer of global automation, but a leading pioneer in responsible robotics innovation.",
        "Une Afrique qui n'est pas seulement consommatrice d'automatisation mondiale, mais pionnière de l'innovation robotique responsable.",
      ),
    },
    {
      title: t("Governance", "Gouvernance"),
      description: t(
        "Structured collaboratively with representation from key academic, industrial, and governmental bodies across our member states.",
        "Structurée de manière collaborative avec des représentants d'organismes académiques, industriels et gouvernementaux de nos États membres.",
      ),
    },
  ];

  return (
    <section id="about" className="scroll-mt-28 bg-surface py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-highlight"
          >
            {t("About us", "À propos")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-heading text-3xl font-bold md:text-5xl"
          >
            {t("About", "À propos de l'")}<span className="text-highlight"> ARCP</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg leading-relaxed text-textSecondary md:text-xl"
          >
            {t(
              "We are dedicated to building a robust ecosystem for robotics research and industrial application.",
              "Nous nous consacrons à la construction d'un écosystème robuste pour la recherche et l'application industrielle de la robotique.",
            )}
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {featuresData.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-border bg-surface p-7 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all hover:border-highlight/40 hover:shadow-[0_14px_34px_-14px_rgba(12,74,110,0.2)] md:p-9"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-highlight/10 text-highlight">
                <span className="h-2.5 w-2.5 rounded-full bg-highlight" />
              </div>
              <h3 className="font-heading text-xl font-bold text-textPrimary md:text-2xl">{feature.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-textSecondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
