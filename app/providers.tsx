'use client'

import { Toaster } from '@/components/ui/toaster'
import { HomeProvider } from '@/contexts/home-context'
import { LanguageProvider } from '@/contexts/language-context'
import type React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <HomeProvider>
                {children}
                <Toaster />
            </HomeProvider>
        </LanguageProvider>
    )
}
