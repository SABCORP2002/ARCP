import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { SiteSettings } from "@/data/site";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  settings?: SiteSettings;
}

export function Layout({ children, title, description, path = "/", image = "/assets/hero-illlustration.jpg", type = "website", settings }: LayoutProps) {
  const { t, lang } = useLanguage();
  const defaultTitle = "ARCP";
  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalDescription = description || t("Building Africa's robotics future through cooperation, education and responsible innovation.", "Construire l'avenir de la robotique africaine par la coopération, l'éducation et l'innovation responsable.");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://africanrobotplatform.org";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const canonicalUrl = new URL(path, siteUrl).toString();
  const imageUrl = new URL(`${basePath}${image}`, siteUrl).toString();

  return (
    <>
      <Head>
        <title>{finalTitle}</title>
        <meta name="description" content={finalDescription} />
        <meta name="theme-color" content="#020D07" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href={`${basePath}/assets/logo.svg`} type="image/svg+xml" />
        <link rel="manifest" href={`${basePath}/site.webmanifest`} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content="ARCP" />
        <meta property="og:locale" content={lang === "FR" ? "fr_FR" : "en_GB"} />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={finalDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalTitle} />
        <meta name="twitter:description" content={finalDescription} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <div className="min-h-screen flex flex-col bg-background font-body text-textPrimary selection:bg-highlight/30">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-black">
          {t("Skip to main content", "Aller au contenu principal")}
        </a>
        <Navbar />
        <main id="main-content" className="flex-grow pt-24">{children}</main>
        <Footer settings={settings} />
      </div>
    </>
  );
}
