'use client';

import type { Language } from '@/lib/i18n/translations';
import { getTranslation } from '@/lib/i18n/translations';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, any>) => string;
    dir: 'ltr' | 'rtl';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Load language from localStorage or default to 'en'
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('preferredLanguage') as Language | null;
            return savedLang || 'en';
        }
        return 'en';
    });

    // Save language to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferredLanguage', language);
        }
    }, [language]);

    // Set document direction based on language
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = (key: string, params?: Record<string, any>) => {
        return getTranslation(language, key, params);
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
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
