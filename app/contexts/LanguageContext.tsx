'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: typeof translations[Language];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [translationsState, setTranslationsState] = useState<typeof translations[Language]>(translations.en);

  useEffect(() => {
    // Load language preference from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am')) {
      setLanguage(savedLanguage);
      setTranslationsState(translations[savedLanguage]);
    }
  }, []);

  useEffect(() => {
    // Save language preference to localStorage when it changes
    localStorage.setItem('language', language);
    setTranslationsState(translations[language]);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: translationsState }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 