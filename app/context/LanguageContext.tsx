"use client";

import { createContext, useContext, useState } from "react";

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: any }) {
  const [lang, setLang] = useState<"en" | "hi">("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
