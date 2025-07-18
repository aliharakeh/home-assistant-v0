'use client';

import { OfflineBanner } from '@/components/shared/offline-banner';
import { PageHeader } from '@/components/shared/page-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { useHomes } from '@/contexts/home-context';
import { useLanguage } from '@/contexts/language-context';
import { CurrencyType, RentDuration, Shareholder, toggleCurrency } from '@/lib/data';
import { AlertCircle, Calendar, DollarSign, Percent, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { Suspense, useEffect, useRef, useState } from 'react';

function AddHomeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, dir } = useLanguage();
    const { getHomeById, addHome, updateHome, loading, error } = useHomes();

    const isEdit = searchParams.get('edit') === 'true';
    const homeId = searchParams.get('id');

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        electricityCode: '',
        tenant: '',
        rent: '',
        rentCurrency: CurrencyType.USD,
    });

    const [rentDuration, setRentDuration] = useState<RentDuration>('monthly');
    const [shareholders, setShareholders] = useState<Shareholder[]>([]);
    const [newShareholder, setNewShareholder] = useState('');
    const [newShareholderAmount, setNewShareholderAmount] = useState('');
    const [currency, setCurrency] = useState<CurrencyType>(CurrencyType.PERCENTAGE);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const initializedRef = useRef(false);

    // Load data from database if in edit mode
    useEffect(() => {
        // Only run once on initial load when in edit mode and not loading
        if (isEdit && homeId && !initializedRef.current && !loading) {
            initializedRef.current = true;

            const home = getHomeById(homeId);

            if (home) {
                setFormData({
                    name: home.name,
                    address: home.address,
                    electricityCode: home.electricityCode,
                    tenant: home.tenant,
                    rent: home.rent.toString(),
                    rentCurrency: home.rentCurrency,
                });
                setRentDuration(home.rentDuration);
                setShareholders([...home.shareholders]);
            }
        }
    }, [isEdit, homeId, loading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const addShareholder = () => {
        if (newShareholder.trim() && newShareholderAmount.trim()) {
            const amount = Number.parseFloat(newShareholderAmount);
            if (!isNaN(amount) && amount > 0) {
                setShareholders([
                    ...shareholders,
                    {
                        name: newShareholder.trim(),
                        amount,
                        currency,
                    },
                ]);
                setNewShareholder('');
                setNewShareholderAmount('');
            }
        }
    };

    const removeShareholder = (index: number) => {
        setShareholders(shareholders.filter((_, i) => i !== index));
    };

    const toggleShareholderType = (index: number) => {
        setShareholders(
            shareholders.map((shareholder, i) => {
                if (i === index) {
                    return {
                        ...shareholder,
                        currency: toggleCurrency(shareholder.currency),
                    } as Shareholder;
                }
                return shareholder;
            })
        );
    };

    const updateShareholderAmount = (index: number, amount: string) => {
        const parsedAmount = Number.parseFloat(amount);
        if (!isNaN(parsedAmount)) {
            setShareholders(
                shareholders.map((shareholder, i) => {
                    if (i === index) {
                        return {
                            ...shareholder,
                            amount: parsedAmount,
                        };
                    }
                    return shareholder;
                })
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveError(null);
        setIsSaving(true);

        try {
            const rentValue = Number.parseFloat(formData.rent);
            if (isNaN(rentValue)) {
                setSaveError(t('invalidRentAmount'));
                setIsSaving(false);
                return;
            }

            const homeData = {
                id: isEdit ? homeId! : crypto.randomUUID(),
                name: formData.name,
                address: formData.address,
                electricityCode: formData.electricityCode,
                tenant: formData.tenant,
                rent: rentValue,
                rentDuration,
                shareholders,
                electricityBills:
                    isEdit && homeId ? getHomeById(homeId)?.electricityBills || [] : [],
                rentCurrency: formData.rentCurrency as CurrencyType,
            };

            if (isEdit && homeId) {
                await updateHome(homeData);
            } else {
                await addHome(homeData);
            }

            router.push('/');
        } catch (err) {
            console.error('Failed to save home:', err);
            setSaveError(t('failedToSaveHome'));
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
                <PageHeader showBackButton={true} backHref="/" />
                <Skeleton className="h-[600px] w-full rounded-lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
                <PageHeader />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button className="mt-4" asChild>
                    <Link href="/">{t('goBack')}</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
            <PageHeader
                title={isEdit ? t('editProperty') : t('addNewProperty')}
                showBackButton={true}
                backHref="/"
            />

            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? t('editProperty') : t('addNewProperty')}</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {saveError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{saveError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">{t('propertyName')}</Label>
                            <Input
                                id="name"
                                placeholder={t('enterPropertyName')}
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">{t('address')}</Label>
                            <Input
                                id="address"
                                placeholder={t('enterAddress')}
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="electricityCode">{t('electricityCode')}</Label>
                            <Input
                                id="electricityCode"
                                placeholder={t('enterElectricityCode')}
                                value={formData.electricityCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tenant">{t('tenantName')}</Label>
                            <Input
                                id="tenant"
                                placeholder={t('enterTenantName')}
                                value={formData.tenant}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rent">{t('rentAmount')}</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="rent"
                                    type="number"
                                    placeholder="0"
                                    value={formData.rent}
                                    onChange={handleInputChange}
                                    required
                                    className="flex-1"
                                />
                                <Toggle
                                    pressed={rentDuration === 'yearly'}
                                    onPressedChange={() =>
                                        setRentDuration(prev =>
                                            prev === 'monthly' ? 'yearly' : 'monthly'
                                        )
                                    }
                                    size="sm"
                                    aria-label="Toggle rent duration"
                                    className="flex items-center gap-1"
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-xs">{t(rentDuration)}</span>
                                </Toggle>
                                <Toggle
                                    pressed={formData.rentCurrency === CurrencyType.PERCENTAGE}
                                    onPressedChange={() =>
                                        setFormData(prev => ({
                                            ...prev,
                                            rentCurrency: toggleCurrency(prev.rentCurrency),
                                        }))
                                    }
                                    size="sm"
                                    aria-label="Toggle rent currency"
                                >
                                    {formData.rentCurrency === CurrencyType.PERCENTAGE ? (
                                        <Percent className="h-4 w-4" />
                                    ) : formData.rentCurrency === CurrencyType.USD ? (
                                        <DollarSign className="h-4 w-4" />
                                    ) : (
                                        <span className="text-xs">{CurrencyType.LBP}</span>
                                    )}
                                </Toggle>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('shareholders')}</Label>
                            <div className="grid gap-2">
                                <div className="flex gap-2">
                                    <Input
                                        value={newShareholder}
                                        onChange={e => setNewShareholder(e.target.value)}
                                        placeholder={t('shareholderName')}
                                        className="w-[50%]"
                                    />
                                    <div className="flex items-center gap-1 w-[40%]">
                                        <Input
                                            value={newShareholderAmount}
                                            onChange={e => setNewShareholderAmount(e.target.value)}
                                            placeholder={t('amount')}
                                            type="number"
                                            min="0"
                                            step="any"
                                            className="flex-1"
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addShareholder();
                                                }
                                            }}
                                        />
                                        <Toggle
                                            pressed={currency === CurrencyType.PERCENTAGE}
                                            onPressedChange={() =>
                                                setCurrency(toggleCurrency(currency))
                                            }
                                            size="sm"
                                            aria-label="Toggle currency"
                                        >
                                            {currency === CurrencyType.PERCENTAGE ? (
                                                <Percent className="h-4 w-4" />
                                            ) : currency === CurrencyType.USD ? (
                                                <DollarSign className="h-4 w-4" />
                                            ) : (
                                                <span className="text-xs">{CurrencyType.LBP}</span>
                                            )}
                                        </Toggle>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        onClick={addShareholder}
                                        className="w-[10%]"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {shareholders.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {shareholders.map((shareholder, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-muted p-2 rounded-md"
                                            >
                                                <span className="text-sm flex-1">
                                                    {shareholder.name}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        value={shareholder.amount}
                                                        onChange={e =>
                                                            updateShareholderAmount(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        type="number"
                                                        min="0"
                                                        step="any"
                                                        className="w-20 h-8 text-xs"
                                                    />
                                                    <Toggle
                                                        pressed={
                                                            shareholder.currency ===
                                                            CurrencyType.PERCENTAGE
                                                        }
                                                        onPressedChange={() =>
                                                            toggleShareholderType(index)
                                                        }
                                                        size="sm"
                                                        aria-label="Toggle currency"
                                                        className="h-8"
                                                    >
                                                        {shareholder.currency ===
                                                        CurrencyType.PERCENTAGE ? (
                                                            <Percent className="h-3 w-3" />
                                                        ) : shareholder.currency ===
                                                          CurrencyType.USD ? (
                                                            <DollarSign className="h-3 w-3" />
                                                        ) : (
                                                            <span className="text-xs">
                                                                {CurrencyType.LBP}
                                                            </span>
                                                        )}
                                                    </Toggle>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => removeShareholder(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSaving}>
                            {isSaving ? t('saving') : isEdit ? t('update') : t('save')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <OfflineBanner />
        </div>
    );
}

export default function AddHomePage() {
    const { dir } = useLanguage();

    return (
        <Suspense
            fallback={
                <div className="container max-w-md mx-auto px-4 py-6" dir={dir}>
                    <PageHeader showBackButton={true} backHref="/" />
                    <Skeleton className="h-[600px] w-full rounded-lg" />
                </div>
            }
        >
            <AddHomeContent />
        </Suspense>
    );
}
