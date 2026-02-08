"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LanguageCode = "en" | "hi" | "es" | "fr";

const LanguageContext = createContext<{
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  languages: { code: LanguageCode; label: string }[];
} | null>(null);

const availableLanguages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("site-lang")
        : null;
    if (saved && availableLanguages.some(item => item.code === saved)) {
      setLangState(saved as LanguageCode);
    }
  }, []);

  const setLang = (next: LanguageCode) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("site-lang", next);
    }
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      languages: availableLanguages,
    }),
    [lang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
