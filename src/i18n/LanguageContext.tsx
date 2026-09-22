import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageOption } from './types';
import { translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'bridgeone_app_language_v1';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_LANG_KEY);
        if (saved && ['vi', 'en'].includes(saved)) {
          return saved as SupportedLanguage;
        }
      } catch {
        // Fallback
      }
    }
    return 'vi'; // Default to Vietnamese
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_LANG_KEY, lang);
      }
    } catch {
      // Ignored
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = translations[language] || translations.vi;
    if (langDict[key]) {
      return langDict[key];
    }
    // Fallback to English, then defaultText, then key itself
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return defaultText || key;
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
