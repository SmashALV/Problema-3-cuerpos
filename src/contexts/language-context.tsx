'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en'); // Default language

  useEffect(() => {
    // This effect runs only on the client after hydration
    const storedLang = localStorage.getItem('language') as Language | null;
    if (storedLang) {
      setLanguage(storedLang);
    }
    // If no stored language, it defaults to 'en' as set in useState
  }, []);

  useEffect(() => {
    // This effect runs whenever the language state changes
    if (typeof window !== 'undefined') { // ensure localStorage is available
        localStorage.setItem('language', language);
    }
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
