"use client"

import type React from "react"

import { LanguageProvider } from "@/contexts/language-context"
import { HomeProvider } from "@/contexts/home-context"
import { PWARegister } from "@/components/pwa-register"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <HomeProvider>
        <PWARegister />
        {children}
        <Toaster />
      </HomeProvider>
    </LanguageProvider>
  )
}
