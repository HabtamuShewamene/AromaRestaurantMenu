"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../../../messages/en.json";
import am from "../../../messages/am.json";

type Locale = "en" | "am";
type Translations = typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
  en,
  am,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem("aroma-locale") as Locale;
    if (savedLocale === "en" || savedLocale === "am") {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("aroma-locale", newLocale);
  };

  const t = (key: string): string => {
    const dict = dictionaries[locale] as any;
    const keys = key.split(".");
    let value = dict;
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    return value || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}
