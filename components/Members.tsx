import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { MemberNation, memberNations } from "@/data/members";

export function Members({ members = memberNations }: { members?: MemberNation[] }) {
  const { t } = useLanguage();
  const verifiedCount = members.filter((member) => member.status === "verified").length;

  return (
    <section id="members" className="scroll-mt-28 py-16 md:py-24 relative overflow-hidden">
       {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/assets/member-nations.jpg" alt="Member Nations Background" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
       {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-highlight/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
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
            className="text-textSecondary text-lg"
          >
            {t(
              `${verifiedCount} verified national association and ${members.length - verifiedCount} ecosystems currently onboarding.`,
              `${verifiedCount} association nationale vérifiée et ${members.length - verifiedCount} écosystèmes actuellement en intégration.`
            )}
          </motion.p>
        </div>

        {/* Member Countries */}
        <div>
          <h3 className="text-2xl font-heading font-bold mb-8 text-center text-textSecondary uppercase tracking-widest">
            {t("Represented Countries", "PAYS REPRÉSENTÉS")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
            {members.map((member, i) => (
              <MemberCard key={member.slug} member={member} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function MemberCard({ member, index }: { member: MemberNation; index: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/members/${member.slug}`} className="block relative group overflow-hidden rounded-2xl h-64 md:h-72 glass glow-border shadow-lg transition-all hover:-translate-y-2 focus-visible:-translate-y-2">
        <div className="absolute inset-x-0 top-0 h-36 md:h-44 overflow-hidden">
          <Image 
            src={`https://flagcdn.com/w160/${member.code}.png`} 
            alt={t(`Flag of ${member.nameEn}`, `Drapeau du pays : ${member.nameFr}`)}
            fill 
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        <div className="absolute inset-x-0 bottom-0 min-h-24 flex flex-col items-center justify-center gap-1 p-4 bg-surface/90 backdrop-blur-sm border-t border-border/50">
          <h4 className="font-heading font-bold capitalize text-lg text-textPrimary text-center line-clamp-1">
            {t(member.nameEn, member.nameFr)}
          </h4>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${member.status === "verified" ? "text-cta" : "text-textSecondary"}`}>
            {t(member.focusEn, member.focusFr)}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-cta/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
          <span className="text-background font-bold px-6 py-2 border-2 border-background rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {t("View Profile", "Voir le Profil")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
