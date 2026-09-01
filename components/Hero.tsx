import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { memberNations } from "@/data/members";
import { defaultSiteSettings, SiteSettings } from "@/data/site";

const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.02, 
        delayChildren: 0.02 * i + delay 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.span
      style={{ display: "inline", whiteSpace: "pre-wrap" }}
      variants={container}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block" }}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export function Hero({ settings = defaultSiteSettings, memberCount = memberNations.length }: { settings?: SiteSettings; memberCount?: number }) {
  const { t, lang } = useLanguage();

  const title = t(settings.heroTitleEn, settings.heroTitleFr);

  return (
    <section className="relative min-h-[88vh] md:min-h-[95vh] flex items-center pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
      
      {/* Background Illustration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
         {/* ICON: hero-illlustration.jpg */}
        <Image src="/assets/hero-illlustration.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Main Content */}
          <div className="max-w-5xl mx-auto">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-highlight">
              {t(settings.heroEyebrowEn, settings.heroEyebrowFr)}
            </motion.p>
            <motion.h1 
              key={lang}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] mb-8 md:mb-10"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-textPrimary via-textPrimary to-highlight">
                <TypingText text={title} />
              </span>
            </motion.h1>
            
            <motion.p 
              key={`p-${lang}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-textSecondary mb-10 md:mb-14 leading-relaxed font-body max-w-3xl mx-auto"
            >
              {t(settings.heroDescriptionEn, settings.heroDescriptionFr)}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 md:mb-16 w-full sm:w-auto"
            >
              <Link href="/#members" className="w-full sm:w-auto bg-cta hover:bg-ctaHover text-background px-6 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg text-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                {t("Discover Our Members", "Découvrir NOS MEMBRES")}
              </Link>
              <Link href="/#articles" className="w-full sm:w-auto border border-border hover:border-cta hover:text-cta px-6 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg text-center transition-all hover:scale-105 active:scale-95 bg-surface/50 backdrop-blur-sm">
                {t("Read Latest Articles", "Lire les Derniers ARTICLES")}
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16 text-sm text-textSecondary font-medium border-t border-border/50 pt-10"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-3xl md:text-4xl font-black text-textPrimary mb-1">{memberCount}</span>
                <span className="uppercase tracking-widest text-xs font-bold opacity-60">{t("Ecosystems represented", "ÉCOSYSTÈMES REPRÉSENTÉS")}</span>
              </div>
              <div className="hidden md:block w-px h-12 bg-border" />
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-3xl md:text-4xl font-black text-textPrimary mb-1">2024</span>
                <span className="uppercase tracking-widest text-xs font-bold opacity-60">{t("Initiative launched", "INITIATIVE LANCÉE")}</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
