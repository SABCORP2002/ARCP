import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function Features() {
  const { t } = useLanguage();

  const featuresData = [
    {
      icon: "history-icon.jpg",
      title: t("History", "Histoire"),
      description: t(
        "Founded in 2024, ARCP emerged from a collective desire to unite fragmented continental robotics initiatives into a shared platform.",
        "Fondée en 2024, l'ARCP est née d'un désir collectif d'unir les initiatives robotiques continentales au sein d'une plateforme commune."
      ),
    },
    {
      icon: "mission-icon.jpg",
      title: t("Mission", "Mission"),
      description: t(
        "To accelerate the adoption, development, and contextualization of robotic technologies across all 54 African nations.",
        "Accélérer l'adoption, le développement et la contextualisation des technologies robotiques dans les 54 nations africaines."
      ),
    },
    {
      icon: "vision-icon.jpg",
      title: t("Vision", "Vision"),
      description: t(
        "An Africa that is not merely a consumer of global automation, but a leading pioneer in responsible robotics innovation.",
        "Une Afrique qui n'est pas seulement consommatrice d'automatisation mondiale, mais pionnière de l'innovation robotique responsable."
      ),
    },
    {
      icon: "governance-icon.jpg",
      title: t("Governance", "Gouvernance"),
      description: t(
        "Structured collaboratively with representation from key academic, industrial, and governmental bodies across our member states.",
        "Structurée de manière collaborative avec des représentants d'organismes académiques, industriels et gouvernementaux de nos États membres."
      ),
    },
  ];

  return (
    <section id="about" className="scroll-mt-28 py-16 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            {t("About", "À propos de l'")}<span className="text-highlight"> ARCP</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-textSecondary text-lg"
          >
            {t(
              "We are dedicated to building a robust ecosystem for robotics research and industrial application.",
              "Nous nous consacrons à la construction d'un écosystème robuste pour la recherche et l'application industrielle de la robotique."
            )}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {featuresData.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="glass p-6 md:p-10 rounded-[2rem] glow-border group flex flex-col items-start shadow-xl relative overflow-hidden"
            >
              {/* Background Image with low opacity */}
              <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-40 transition-opacity duration-500">
                <Image 
                  src={`/assets/${feature.icon}`} 
                  alt="" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                />
              </div>

              {/* Gradient Overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-transparent to-transparent z-[1]" />

              <div className="relative z-10 w-full">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:bg-highlight/10 transition-colors">
                  {/* Optional: A small accent or just the space */}
                  <div className="w-2 h-2 rounded-full bg-highlight" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-black mb-4 group-hover:text-highlight transition-colors">{feature.title}</h3>
                <p className="text-textSecondary leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
