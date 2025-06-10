'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import type { Home } from '@/lib/data';
import { formatRent, formatShareholderAmount } from '@/lib/data';
import { ChevronLeft, ChevronRight, HomeIcon, User, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface HomeCardProps extends Home {}

export function HomeCard({
    name,
    address,
    tenant,
    rent,
    rentDuration,
    electricityCode,
    shareholders,
}: HomeCardProps) {
    const [expanded, setExpanded] = useState(false);
    const { t, dir } = useLanguage();

    return (
        <Card className="overflow-hidden" dir={dir}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <HomeIcon className="h-5 w-5 text-muted-foreground" />
                        <h2 className="font-semibold">{name}</h2>
                    </div>
                    <Badge variant="outline">{formatRent(rent, t(rentDuration))}</Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-2">{address}</p>

                {expanded && (
                    <div className="mt-4 grid gap-3 text-sm">
                        <div className="grid gap-1">
                            <span className="text-muted-foreground font-medium">
                                {t('tenant')}:
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {tenant}
                            </span>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-muted-foreground font-medium">
                                {t('electricityCode')}:
                            </span>
                            <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {electricityCode}
                            </span>
                        </div>
                        {shareholders.length > 0 && (
                            <div className="mt-1">
                                <div className="flex items-center gap-1 mb-1">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground font-medium">
                                        {t('shareholders')}:
                                    </span>
                                </div>
                                <ul className="pl-5 list-disc space-y-1">
                                    {shareholders.map((shareholder, index) => (
                                        <li key={index}>
                                            {shareholder.name}{' '}
                                            <span className="text-muted-foreground">
                                                ({formatShareholderAmount(shareholder)})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between p-2 pt-0">
                <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                    {expanded ? t('showLess') : t('showMore')}
                </Button>
                <Link href={`/home/${encodeURIComponent(name)}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                        {t('details')}
                        {dir === 'rtl' ? (
                            <ChevronLeft className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
