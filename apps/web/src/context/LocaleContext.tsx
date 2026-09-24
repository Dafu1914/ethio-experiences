'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'en' | 'am' | 'om';
export type Currency = 'ETB' | 'USD' | 'EUR';

type LocaleValue = {
  language: Language;
  currency: Currency;
  setLanguage: (l: Language) => void;
  setCurrency: (c: Currency) => void;
};

const LocaleContext = createContext<LocaleValue>({} as LocaleValue);

const LANG_KEY = 'ethio.lang';
const CUR_KEY = 'ethio.currency';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('en');
  const [currency, setCur] = useState<Currency>('ETB');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const l = localStorage.getItem(LANG_KEY) as Language | null;
      const c = localStorage.getItem(CUR_KEY) as Currency | null;
      if (l) setLang(l);
      if (c) setCur(c);
    } catch {}
  }, []);

  const setLanguage = (l: Language) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  };

  const setCurrency = (c: Currency) => {
    setCur(c);
    try {
      localStorage.setItem(CUR_KEY, c);
    } catch {}
  };

  return (
    <LocaleContext.Provider value={{ language, currency, setLanguage, setCurrency }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);