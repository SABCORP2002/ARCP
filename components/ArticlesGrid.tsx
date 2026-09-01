import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  Article,
  ArticleCategory,
  articleCategoryLabels,
  articlesData,
  formatArticleDate,
} from "@/data/articles";
import { contentImageSrc } from "@/lib/cms";

export function ArticlesGrid({ articles = articlesData }: { articles?: Article[] }) {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<"All" | ArticleCategory>("All");
  const [visibleCount, setVisibleCount] = useState(3);

  const categories = [
    { key: "All", label: t("All", "Tout") },
    ...(Object.keys(articleCategoryLabels) as ArticleCategory[]).map((key) => ({
      key,
      label: t(articleCategoryLabels[key].en, articleCategoryLabels[key].fr),
    })),
  ];

  const filteredArticles = activeCategory === "All" 
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <section id="articles" className="scroll-mt-28 py-16 md:py-24 bg-surface/30 border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold">{t("Latest Insights", "Dernières Informations")}</h2>
          
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                aria-pressed={activeCategory === cat.key}
                onClick={() => {
                  setActiveCategory(cat.key as "All" | ArticleCategory);
                  setVisibleCount(3);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                  ${activeCategory === cat.key 
                    ? "bg-cta text-background scale-105" 
                    : "bg-surface text-textSecondary hover:bg-highlight/20 hover:text-white"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <AnimatePresence>
            {filteredArticles.slice(0, visibleCount).map((article) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <article className="glass glow-border rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform h-full flex flex-col group">
                  
                  <div className="relative h-48 w-full bg-background overflow-hidden">
                    {/* Replace with actual article image */}
                    <Image 
                      src={contentImageSrc(article.image, "articles")}
                      alt={t(article.titleEn, article.titleFr)} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur text-highlight text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-highlight/20">
                      {t(articleCategoryLabels[article.category].en, articleCategoryLabels[article.category].fr)}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-highlight transition-colors leading-tight">
                      <Link href={`/articles/${article.id}`}>
                        {t(article.titleEn, article.titleFr)}
                      </Link>
                    </h3>
                    <p className="text-textSecondary text-sm line-clamp-2 mb-6 flex-grow">
                      {t(article.excerptEn, article.excerptFr)}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto border-t border-border pt-4 text-xs font-medium text-textSecondary">
                      <span>{article.author}</span>
                      <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt, lang)}</time>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visibleCount < filteredArticles.length && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 3)}
              className="border border-border hover:border-highlight text-textPrimary hover:text-highlight px-8 py-3 rounded-full font-bold transition-colors"
            >
              {t("Load More Articles", "Afficher plus d'articles")}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
