import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "EN" | "FR";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, fr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("EN");

  // Load language preference from localStorage on mount
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const savedLang = localStorage.getItem("preferred_lang") as Language;
      if (savedLang === "EN" || savedLang === "FR") {
        timer = setTimeout(() => setLangState(savedLang), 0);
      }
    } catch {
      // Storage can be disabled by the browser; English remains the safe default.
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "FR" ? "fr" : "en";
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("preferred_lang", newLang);
    } catch {
      // Keep the in-memory preference when persistent storage is unavailable.
    }
  };

  const t = (en: string, fr: string) => (lang === "EN" ? en : fr);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
