'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';

type PageHeaderProps = {
    title?: string;
    showBackButton?: boolean;
    backHref?: string;
    showAddButton?: boolean;
    addHref?: string;
    addButtonLabel?: string;
};

export function PageHeader({
    title,
    showBackButton = false,
    backHref = '/',
    showAddButton = false,
    addHref = '/add-home',
    addButtonLabel,
}: PageHeaderProps) {
    const { t, dir } = useLanguage();

    return (
        <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                {showBackButton && (
                    <Link href={backHref} className="flex items-center gap-1 text-sm">
                        {dir === 'rtl' ? (
                            <ArrowRight className="h-4 w-4" />
                        ) : (
                            <ArrowLeft className="h-4 w-4" />
                        )}
                        {t('back')}
                    </Link>
                )}
                {!showBackButton && title && <h1 className="text-2xl font-bold">{title}</h1>}
            </div>
            <div className="flex items-center gap-2">
                <LanguageSwitcher />
                {showAddButton && (
                    <Link href={addHref}>
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-4 w-4" />
                            {addButtonLabel || t('add')}
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}
