'use client';

import { AddBillDialog } from '@/components/electricity-bills/add-bill-dialog';
import { DeleteBillsDialog } from '@/components/electricity-bills/delete-bills-dialog';
import { MonthlyLineChart } from '@/components/electricity-bills/monthly-line-chart';
import { YearlyPieChart } from '@/components/electricity-bills/yearly-pie-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/language-context';
import {
    calculateTotalBills,
    CurrencyType,
    type ElectricityBill,
    formatDate,
    formatPayment,
    getSubscriptionTypeLabel,
} from '@/lib/data';
import {
    CalendarDays,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Lightbulb,
    Percent,
    Plus,
    Trash2,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface ElectricityBillsDashboardProps {
    homeId: string;
    bills: ElectricityBill[];
    onAddBill: (bill: Omit<ElectricityBill, 'id'>) => void;
    onDeleteBill: (billId: string) => Promise<void>;
}

export function ElectricityBillsDashboard({
    homeId,
    bills,
    onAddBill,
    onDeleteBill,
}: ElectricityBillsDashboardProps) {
    const { t, dir } = useLanguage();
    const { toast } = useToast();
    const [showAddBill, setShowAddBill] = useState(false);
    const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-01-01`;
    });
    const [endDate, setEndDate] = useState<string>(today);
    const [isDateFilterActive, setIsDateFilterActive] = useState(true);
    const [billToDelete, setBillToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteRangeDialog, setShowDeleteRangeDialog] = useState(false);

    const filteredBills = useMemo(() => {
        if (!isDateFilterActive || !startDate) {
            return bills;
        }

        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();

        if (endDate) end.setHours(23, 59, 59, 999);

        return bills.filter(bill => {
            const billDate = new Date(bill.date);
            if (billDate < start) return false;
            if (endDate && billDate > end) return false;
            return true;
        });
    }, [bills, startDate, endDate, isDateFilterActive]);

    const totals = calculateTotalBills(filteredBills);

    const sortedBills = useMemo(() => {
        return [...filteredBills].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [filteredBills]);

    const toggleBillDetails = (billId: string) => {
        setExpandedBillId(expandedBillId === billId ? null : billId);
    };

    const handleDateChange = () => {
        setIsDateFilterActive(true);
    };

    const handleDeleteBill = async () => {
        if (!billToDelete) return;

        try {
            setIsDeleting(true);
            await onDeleteBill(billToDelete);
            setBillToDelete(null);
        } catch (err) {
            console.error('Failed to delete bill:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteBillsSuccess = (deletedCount: number) => {
        toast({
            title: t('billsDeleted'),
            description: t('billsDeletedDescription', { count: deletedCount }),
            duration: 5000,
        });
    };

    return (
        <div dir={dir}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {t('electricityBills')}
                </h2>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowDeleteRangeDialog(true)}
                        className={`gap-1 text-destructive ${
                            dir === 'rtl' ? 'flex-row-reverse' : ''
                        }`}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('deleteBillsInRange')}</span>
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setShowAddBill(true)}
                        className={`gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList dir={dir} className={`grid grid-cols-4`}>
                    <TabsTrigger value="all" className={dir === 'rtl' ? 'text-right' : ''}>
                        {t('allBills')}
                    </TabsTrigger>
                    <TabsTrigger value="summary" className={dir === 'rtl' ? 'text-right' : ''}>
                        {t('summary')}
                    </TabsTrigger>
                    <TabsTrigger value="charts" className={dir === 'rtl' ? 'text-right' : ''}>
                        {t('charts')}
                    </TabsTrigger>
                    <TabsTrigger value="yearly" className={dir === 'rtl' ? 'text-right' : ''}>
                        {t('yearly')}
                    </TabsTrigger>
                </TabsList>

                <DateFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onDateChange={handleDateChange}
                    dir={dir}
                    t={t}
                />

                <TabsContent value="all">
                    <AllBillsTab
                        bills={sortedBills}
                        expandedBillId={expandedBillId}
                        onToggleBillDetails={toggleBillDetails}
                        onDeleteBill={setBillToDelete}
                        dir={dir}
                        t={t}
                    />
                </TabsContent>

                <TabsContent value="summary">
                    <SummaryTab bills={filteredBills} totals={totals} t={t} />
                </TabsContent>

                <TabsContent value="charts">
                    <ChartsTab bills={filteredBills} t={t} />
                </TabsContent>

                <TabsContent value="yearly">
                    <YearlyTab bills={filteredBills} t={t} />
                </TabsContent>
            </Tabs>

            <Dialog open={!!billToDelete} onOpenChange={open => !open && setBillToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('confirmDeleteBill')}</DialogTitle>
                        <DialogDescription>{t('deleteBillConfirmation')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBillToDelete(null)}>
                            {t('cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteBill}
                            disabled={isDeleting}
                        >
                            {isDeleting ? t('deleting') : t('delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AddBillDialog open={showAddBill} onOpenChange={setShowAddBill} onAddBill={onAddBill} />

            <DeleteBillsDialog
                open={showDeleteRangeDialog}
                onOpenChange={setShowDeleteRangeDialog}
                homeId={homeId}
                onSuccess={handleDeleteBillsSuccess}
            />
        </div>
    );
}

interface AllBillsTabProps {
    bills: ElectricityBill[];
    expandedBillId: string | null;
    onToggleBillDetails: (billId: string) => void;
    onDeleteBill: (billId: string) => void;
    dir: 'ltr' | 'rtl';
    t: (key: string, params?: Record<string, any>) => string;
}

function AllBillsTab({
    bills,
    expandedBillId,
    onToggleBillDetails,
    onDeleteBill,
    dir,
    t,
}: AllBillsTabProps) {
    if (bills.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    {t('noBillsYet')}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4 mt-3">
            {bills.map(bill => (
                <Card key={bill.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                        <div dir={dir} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">
                                    {formatPayment(bill.amount, bill.currency)}
                                </CardTitle>
                            </div>
                            <Badge variant="outline">
                                {getSubscriptionTypeLabel(bill.subscriptionType, t)}
                            </Badge>
                        </div>
                        <div dir={dir} className={`flex items-center gap-1 mt-1`}>
                            <CalendarDays className="h-3 w-3" />
                            {formatDate(bill.date)}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div dir={dir} className="text-sm">
                            <span className="text-muted-foreground">{t('subscriptionType')}:</span>{' '}
                            {getSubscriptionTypeLabel(bill.subscriptionType, t)}
                        </div>
                        {bill.notes && (
                            <div dir={dir} className="text-sm mt-1">
                                <span className="text-muted-foreground">{t('notes')}:</span>{' '}
                                {bill.notes}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter
                        className={`p-2 flex justify-between border-t bg-muted/50 ${
                            dir === 'rtl' ? 'flex-row-reverse' : ''
                        }`}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleBillDetails(bill.id)}
                            className={`flex-1 justify-between ${
                                dir === 'rtl' ? 'flex-row-reverse' : ''
                            }`}
                        >
                            {expandedBillId === bill.id ? t('hideDetails') : t('viewDetails')}
                            {expandedBillId === bill.id ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDeleteBill(bill.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('deleteBillsInRange')}</span>
                        </Button>
                    </CardFooter>

                    {expandedBillId === bill.id && (
                        <div dir={dir} className="p-4 pt-0 bg-muted/30">
                            <div className="rounded-md bg-background p-3 text-sm">
                                <div>
                                    <span className="font-medium">{t('notes')}:</span>{' '}
                                    {bill.notes ?? '-'}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}

interface SummaryTabProps {
    bills: ElectricityBill[];
    totals: {
        total: number;
        main: number;
        motor: number;
    };
    t: (key: string, params?: Record<string, any>) => string;
}

function SummaryTab({ bills, totals, t }: SummaryTabProps) {
    // Calculate totals by subscription type and currency
    const totalsBySubscription = bills.reduce((acc, bill) => {
        if (!acc[bill.subscriptionType]) {
            acc[bill.subscriptionType] = {
                [CurrencyType.USD]: 0,
                [CurrencyType.LBP]: 0,
                [CurrencyType.PERCENTAGE]: 0,
            };
        }
        acc[bill.subscriptionType][bill.currency] += bill.amount;
        return acc;
    }, {} as Record<string, Record<CurrencyType, number>>);

    // Calculate combined totals for all currencies
    const combinedTotals = Object.values(totalsBySubscription).reduce((acc, subscriptionTotals) => {
        Object.entries(subscriptionTotals).forEach(([currency, amount]) => {
            const currencyType = currency as CurrencyType;
            if (!acc[currencyType]) {
                acc[currencyType] = 0;
            }
            acc[currencyType] += amount;
        });
        return acc;
    }, {} as Record<CurrencyType, number>);

    return (
        <div className="space-y-4 mt-3">
            {Object.entries(totalsBySubscription).map(([subscriptionType, currencyTotals]) => (
                <Card key={subscriptionType}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            {t(subscriptionType)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(currencyTotals).map(
                                ([currency, amount]) =>
                                    amount > 0 && (
                                        <div
                                            key={currency}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                {currency === CurrencyType.USD ? (
                                                    <DollarSign className="h-4 w-4" />
                                                ) : currency === CurrencyType.PERCENTAGE ? (
                                                    <Percent className="h-4 w-4" />
                                                ) : (
                                                    <span className="text-sm">
                                                        {CurrencyType.LBP}
                                                    </span>
                                                )}
                                                <span className="text-sm text-muted-foreground">
                                                    {t('currency')}
                                                </span>
                                            </div>
                                            <div className="text-lg font-semibold">
                                                {formatPayment(amount, currency as CurrencyType)}
                                            </div>
                                        </div>
                                    )
                            )}
                            <div className="pt-2 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('totalBills')}
                                    </span>
                                    <span className="text-sm">
                                        {
                                            bills.filter(
                                                b => b.subscriptionType === subscriptionType
                                            ).length
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        {t('total')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(combinedTotals).map(
                            ([currency, amount]) =>
                                amount > 0 && (
                                    <div
                                        key={currency}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            {currency === CurrencyType.USD ? (
                                                <DollarSign className="h-4 w-4" />
                                            ) : currency === CurrencyType.PERCENTAGE ? (
                                                <Percent className="h-4 w-4" />
                                            ) : (
                                                <span className="text-sm">{CurrencyType.LBP}</span>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {t('currency')}
                                            </span>
                                        </div>
                                        <div className="text-lg font-semibold">
                                            {formatPayment(amount, currency as CurrencyType)}
                                        </div>
                                    </div>
                                )
                        )}
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    {t('totalBills')}
                                </span>
                                <span className="text-sm">{bills.length}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface ChartsTabProps {
    bills: ElectricityBill[];
    t: (key: string, params?: Record<string, any>) => string;
}

function ChartsTab({ bills, t }: ChartsTabProps) {
    // Get the most common currency from bills
    const mostCommonCurrency = bills.reduce((acc, bill) => {
        acc[bill.currency] = (acc[bill.currency] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const dominantCurrency = Object.entries(mostCommonCurrency).reduce((a, b) =>
        a[1] > b[1] ? a : b
    )[0] as CurrencyType;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <MonthlyLineChart
                    bills={bills}
                    subscriptionType="main"
                    title={t('mainBillsTrend')}
                    className="md:col-span-1"
                    currency={dominantCurrency}
                />
                <MonthlyLineChart
                    bills={bills}
                    subscriptionType="motor"
                    title={t('motorBillsTrend')}
                    className="md:col-span-1"
                    currency={dominantCurrency}
                />
            </div>
        </div>
    );
}

interface YearlyTabProps {
    bills: ElectricityBill[];
    t: (key: string, params?: Record<string, any>) => string;
}

function YearlyTab({ bills, t }: YearlyTabProps) {
    // Get the most common currency from bills
    const mostCommonCurrency = bills.reduce((acc, bill) => {
        acc[bill.currency] = (acc[bill.currency] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const dominantCurrency = Object.entries(mostCommonCurrency).reduce((a, b) =>
        a[1] > b[1] ? a : b
    )[0] as CurrencyType;

    return (
        <YearlyPieChart
            bills={bills}
            title={t('yearlyDistribution')}
            description={t('yearlyDistributionDescription')}
            currency={dominantCurrency}
        />
    );
}

interface DateFilterProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onDateChange: () => void;
    dir: 'ltr' | 'rtl';
    t: (key: string, params?: Record<string, any>) => string;
}

function DateFilter({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onDateChange,
    dir,
    t,
}: DateFilterProps) {
    return (
        <div className="flex justify-center mt-3">
            <div className={`flex items-end gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="flex flex-col items-center gap-1">
                    <Label htmlFor="start-date" className="text-xs text-center w-full">
                        {t('startDate')}
                    </Label>
                    <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={e => onStartDateChange(e.target.value)}
                        onBlur={onDateChange}
                        className="h-9 w-40 text-sm"
                    />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Label htmlFor="end-date" className="text-xs text-center w-full">
                        {t('endDate')}
                    </Label>
                    <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={e => onEndDateChange(e.target.value)}
                        onBlur={onDateChange}
                        className="h-9 w-40 text-sm"
                        min={startDate}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>
        </div>
    );
}
