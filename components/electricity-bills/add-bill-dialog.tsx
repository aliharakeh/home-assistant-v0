'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { useLanguage } from '@/contexts/language-context';
import type { ElectricityBill, SubscriptionType } from '@/lib/data';
import { CurrencyType, toggleCurrency } from '@/lib/data';
import { DollarSign, Percent } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface AddBillDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddBill: (bill: Omit<ElectricityBill, 'id'>) => void;
}

export function AddBillDialog({ open, onOpenChange, onAddBill }: AddBillDialogProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        subscriptionType: 'main' as SubscriptionType,
        currency: CurrencyType.USD as CurrencyType,
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const amount = Number.parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) return;

        onAddBill({
            amount,
            date: formData.date,
            subscriptionType: formData.subscriptionType,
            currency: formData.currency,
            notes: formData.notes || undefined,
        });

        // Reset form
        setFormData({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            subscriptionType: 'main',
            currency: CurrencyType.USD,
            notes: '',
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('addElectricityBill')}</DialogTitle>
                    <DialogDescription>{t('addElectricityBillDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">{t('amount')}</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    className="flex-1"
                                />
                                <Toggle
                                    pressed={formData.currency === CurrencyType.PERCENTAGE}
                                    onPressedChange={() =>
                                        setFormData(prev => ({
                                            ...prev,
                                            currency: toggleCurrency(prev.currency),
                                        }))
                                    }
                                    size="sm"
                                    aria-label="Toggle currency"
                                >
                                    {formData.currency === CurrencyType.PERCENTAGE ? (
                                        <Percent className="h-4 w-4" />
                                    ) : formData.currency === CurrencyType.USD ? (
                                        <DollarSign className="h-4 w-4" />
                                    ) : (
                                        <span className="text-xs">{CurrencyType.LBP}</span>
                                    )}
                                </Toggle>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">{t('date')}</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="subscriptionType">{t('subscriptionType')}</Label>
                            <Select
                                value={formData.subscriptionType}
                                onValueChange={value =>
                                    handleSelectChange('subscriptionType', value)
                                }
                            >
                                <SelectTrigger id="subscriptionType">
                                    <SelectValue placeholder={t('selectSubscriptionType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="main">{t('main')}</SelectItem>
                                    <SelectItem value="motor">{t('motor')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">{t('notes')}</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder={t('optionalNotes')}
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit">{t('addBill')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
