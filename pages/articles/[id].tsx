import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import { Article, articleCategoryLabels, formatArticleDate } from "@/data/articles";
import { contentImageSrc, getArticles, getSiteSettings } from "@/lib/cms";
import type { SiteSettings } from "@/data/site";

type ArticlePageProps = {
  article: Article;
  settings: SiteSettings;
};

export default function ArticlePage({ article, settings }: ArticlePageProps) {
  const { t, lang } = useLanguage();

  if (!article) {
    return (
      <Layout title="Loading... | ARCP Articles">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-textSecondary text-xl animate-pulse">Loading Article...</div>
        </div>
      </Layout>
    );
  }

  const currentTitle = t(article.titleEn || "", article.titleFr || "");
  const currentContent = t(article.contentEn || "", article.contentFr || "");
  const currentExcerpt = t(article.excerptEn || "", article.excerptFr || "");

  const shareArticle = (network: "linkedin" | "twitter" | "facebook") => {
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(currentTitle);
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    };
    window.open(shareUrls[network], "_blank", "noopener,noreferrer,width=720,height=520");
  };

  return (
    <Layout
      title={`${currentTitle} | ARCP Articles`}
      description={currentExcerpt}
      path={`/articles/${article.id}`}
      image={contentImageSrc(article.image, "articles")}
      type="article"
      settings={settings}
    >
      <article className="pt-16 md:pt-24 pb-20 md:pb-32">
        
        {/* Header */}
        <header className="container mx-auto px-4 md:px-6 max-w-4xl text-center mb-10 md:mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-highlight/10 text-highlight border border-highlight/30">
              {t(articleCategoryLabels[article.category].en, articleCategoryLabels[article.category].fr)}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight mb-6 md:mb-8">
              {currentTitle}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-textSecondary text-sm font-medium">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface shrink-0" /> {/* Author avatar placeholder */}
                {article.author}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt, lang)}</time>
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        <div className="container mx-auto px-4 md:px-6 mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2 }}
            className="relative w-full aspect-[16/10] md:aspect-[21/9] max-w-5xl mx-auto rounded-3xl overflow-hidden glass glow-border"
          >
             {/* Replace with actual article image */}
            <Image 
              src={contentImageSrc(article.image, "articles")}
              alt={currentTitle} 
              fill 
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover" 
            />
          </motion.div>
        </div>

        {/* Content Body */}
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="prose prose-base md:prose-lg lg:prose-xl max-w-none text-textSecondary font-body leading-relaxed prose-headings:font-heading prose-headings:text-textPrimary prose-a:text-highlight prose-strong:text-textPrimary"
          >
             <p className="mb-6">{currentContent}</p>

            <div className="mt-8">
              <a 
                href={article.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-cta hover:bg-ctaHover text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                {t("Read full article", "Lire l'article complet")}
              </a>
            </div>

            <hr className="border-border my-12" />

            <div className="glass p-6 md:p-8 rounded-2xl glow-border mt-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between">
              <div>
                <h4 className="text-xl font-heading font-bold text-textPrimary mb-2">{t("Share this insight", "Partager cet aperçu")}</h4>
                <p className="text-sm text-textSecondary">{t("Help spread word about African robotics innovation.", "Aidez à faire connaître l'innovation robotique en Afrique.")}</p>
              </div>
              <div className="flex gap-4">
                {/* Social Share Icons */}
                {[
                  { id: "linkedin", icon: "/assets/social/linkedin.svg", label: "LinkedIn" },
                  { id: "twitter", icon: "/assets/social/twitter.svg", label: "Twitter" },
                  { id: "facebook", icon: "/assets/social/facebook.svg", label: "Facebook" }
                ].map((social) => (
                   <button 
                     key={social.id} 
                     type="button"
                     onClick={() => shareArticle(social.id as "linkedin" | "twitter" | "facebook")}
                     aria-label={t(`Share on ${social.label}`, `Partager sur ${social.label}`)}
                     className="w-12 h-12 rounded-full bg-surfaceAlt flex items-center justify-center hover:border-highlight hover:bg-highlight/10 hover:scale-110 transition-all border border-border group"
                   >
                      <Image src={social.icon} alt={social.id} width={20} height={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                   </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Back Link */}
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mt-12 md:mt-16 text-center border-t border-border pt-12 md:pt-16">
          <Link href="/#articles" className="inline-flex items-center gap-2 text-cta hover:text-ctaHover font-bold group transition-colors">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("Back to all articles", "Retour à tous les articles")}
          </Link>
        </div>

      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles();
  const paths = articles.map((article) => ({
    params: { id: String(article.id) },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params }) => {
  const id = Number(params?.id);
  const [articles, settings] = await Promise.all([getArticles(), getSiteSettings()]);
  const article = articles.find((entry) => entry.id === id);

  if (!Number.isInteger(id) || !article) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      article,
      settings,
    },
    revalidate: 60,
  };
};
