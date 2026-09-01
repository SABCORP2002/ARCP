import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: t("Home", "Accueil"), href: "/" },
    { label: t("About", "À propos"), href: "/#about" },
    { label: t("Ecosystems", "Écosystèmes"), href: "/#members" },
    { label: t("Articles", "Articles"), href: "/#articles" },
    { label: t("Events", "Événements"), href: "/#events" },
    { label: t("Partners", "Partenaires"), href: "/#partners" },
    { label: t("Contact", "Contact"), href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md border-b border-border py-3 md:py-4 shadow-sm" : "bg-white py-4 md:py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center">
          {/* Logo - Left */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center relative w-[136px] sm:w-[160px] md:w-[220px] h-[44px] md:h-[56px] flex-shrink-0">
               {/* ICON: logo.svg */}
              <Image
                src="/assets/logo.svg"
                alt="African Robot Cooperation Platform"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav - Center */}
          <nav aria-label={t("Main navigation", "Navigation principale")} className="hidden lg:flex items-center gap-6 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-800 hover:text-highlight transition-colors text-sm font-medium whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions - Right */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
            <button
              onClick={() => setLang(lang === "EN" ? "FR" : "EN")}
              aria-label={t("Switch to French", "Passer en anglais")}
              className="text-gray-800 hover:text-black text-sm font-medium transition-colors"
            >
              {lang} / {lang === "EN" ? "FR" : "EN"}
            </button>
            <Link 
              href="/join"
              className="bg-cta hover:bg-ctaHover text-background px-6 py-2 rounded-full font-semibold transition-colors"
            >
              {t("Join Us", "Nous Rejoindre")}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex-1 flex justify-end">
            <button
              className="p-2 text-black"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={t("Open menu", "Ouvrir le menu")}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
               {/* ICON: menu-icon.svg */}
              <Image src="/assets/menu-icon.svg" alt="" width={24} height={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={t("Mobile navigation", "Navigation mobile")}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-lg flex flex-col justify-center items-center p-6"
          >
            <button
              ref={closeButtonRef}
              className="absolute top-6 right-6 p-2 text-black text-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label={t("Close menu", "Fermer le menu")}
            >
              &times;
            </button>
            
            <nav aria-label={t("Mobile navigation", "Navigation mobile")} className="flex flex-col items-center gap-6 mb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-2xl font-heading font-bold text-gray-900 hover:text-highlight transition-colors pb-4 w-full text-center border-b border-gray-100 last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              <button
                onClick={() => setLang(lang === "EN" ? "FR" : "EN")}
                aria-label={t("Switch to French", "Passer en anglais")}
                className="text-gray-700 text-lg font-medium"
              >
                {t("Language", "Langue")} : {lang}
              </button>
              <Link 
                href="/join"
                className="w-full text-center bg-cta hover:bg-ctaHover text-background px-6 py-3 rounded-full font-semibold transition-colors mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("Join Us", "Nous Rejoindre")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
