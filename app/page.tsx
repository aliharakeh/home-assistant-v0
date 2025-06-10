'use client';

import { HomeCard } from '@/components/home/home-card';
import { OfflineBanner } from '@/components/shared/offline-banner';
import { PageHeader } from '@/components/shared/page-header';
import { PWAInstallPrompt } from '@/components/shared/pwa-install-prompt';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomes } from '@/contexts/home-context';
import { useLanguage } from '@/contexts/language-context';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const { t } = useLanguage();
    const { homes, loading, error } = useHomes();

    return (
        <div className="container max-w-md mx-auto px-4 py-6">
            <PageHeader
                title={t('myProperties')}
                showAddButton={true}
                addButtonLabel={t('addHome')}
                addHref="/add-home"
            />
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
                    <Button asChild>
                        <Link href="/add-home">{t('addFirstProperty')}</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {homes.map(home => (
                        <HomeCard key={home.id} {...home} />
                    ))}
                </div>
            )}

            <PWAInstallPrompt />
            <OfflineBanner />
        </div>
    );
}
