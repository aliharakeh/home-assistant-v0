'use client'

import { HomeCard } from '@/components/home-card'
import { LanguageSwitcher } from '@/components/language-switcher'
import { OfflineBanner } from '@/components/offline-banner'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHomes } from '@/contexts/home-context'
import { useLanguage } from '@/contexts/language-context'
import { AlertCircle, PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
    const { t } = useLanguage()
    const { homes, loading, error } = useHomes()

    return (
        <div className="container max-w-md mx-auto px-4 py-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{t('myProperties')}</h1>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <Link href="/add-home">
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-4 w-4" />
                            {t('addHome')}
                        </Button>
                    </Link>
                </div>
            </header>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-[125px] w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : homes.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">{t('noProperties')}</p>
                    <Link href="/add-home">
                        <Button className="gap-1">
                            <PlusCircle className="h-4 w-4" />
                            {t('addFirstProperty')}
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {homes.map(home => (
                        <HomeCard key={home.name} {...home} />
                    ))}
                </div>
            )}

            <PWAInstallPrompt />
            <OfflineBanner />
        </div>
    )
}
