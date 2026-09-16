import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations, languageNames, isRTL, Language, Translations } from '@/data/translations';
import { getLanguage, setLanguage as setStoredLanguage } from '@/utils/storage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
    languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getLanguage);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        setStoredLanguage(lang);
    }, []);

    const t = useCallback((key: string): string => {
        return translations[language][key] || translations['en'][key] || key;
    }, [language]);

    const rtl = isRTL(language);

    useEffect(() => {
        document.documentElement.dir = rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language, rtl]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL: rtl, languageName: languageNames[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}

export { type Language };
