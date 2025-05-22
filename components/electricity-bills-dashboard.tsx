'use client'

import { AddBillDialog } from '@/components/add-bill-dialog'
import { MonthlyLineChart } from '@/components/charts/monthly-line-chart'
import { YearlyPieChart } from '@/components/charts/yearly-pie-chart'
import { DeleteBillsDialog } from '@/components/delete-bills-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/contexts/language-context'
import {
    calculateTotalBills,
    type ElectricityBill,
    formatDate,
    getSubscriptionTypeLabel,
} from '@/lib/data'
import { format } from 'date-fns'
import {
    CalendarDays,
    CalendarIcon,
    ChevronDown,
    ChevronUp,
    Filter,
    Lightbulb,
    Plus,
    Trash2,
    Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface ElectricityBillsDashboardProps {
    homeId: string
    bills: ElectricityBill[]
    onAddBill: (bill: Omit<ElectricityBill, 'id'>) => void
    onDeleteBill: (billId: string) => Promise<void>
}

export function ElectricityBillsDashboard({
    homeId,
    bills,
    onAddBill,
    onDeleteBill,
}: ElectricityBillsDashboardProps) {
    const { t, dir } = useLanguage()
    const { toast } = useToast()
    const [showAddBill, setShowAddBill] = useState(false)
    const [expandedBillId, setExpandedBillId] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: undefined,
        to: undefined,
    })
    const [isDateFilterActive, setIsDateFilterActive] = useState(false)
    const [billToDelete, setBillToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteRangeDialog, setShowDeleteRangeDialog] = useState(false)

    // Filter bills by date range if active
    const filteredBills = useMemo(() => {
        if (!isDateFilterActive || !dateRange.from) {
            return bills
        }

        return bills.filter(bill => {
            const billDate = new Date(bill.date)
            if (dateRange.from && billDate < dateRange.from) {
                return false
            }
            if (dateRange.to && billDate > dateRange.to) {
                return false
            }
            return true
        })
    }, [bills, dateRange, isDateFilterActive])

    const totals = calculateTotalBills(filteredBills)

    // Sort bills by date (newest first)
    const sortedBills = useMemo(() => {
        return [...filteredBills].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    }, [filteredBills])

    const toggleBillDetails = (billId: string) => {
        setExpandedBillId(expandedBillId === billId ? null : billId)
    }

    const handleDateRangeSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
        setDateRange(range)
        if (range.from) {
            setIsDateFilterActive(true)
        }
    }

    const clearDateFilter = () => {
        setDateRange({ from: undefined, to: undefined })
        setIsDateFilterActive(false)
    }

    const handleDeleteBill = async () => {
        if (!billToDelete) return

        try {
            setIsDeleting(true)
            await onDeleteBill(billToDelete)
            setBillToDelete(null)
        } catch (err) {
            console.error('Failed to delete bill:', err)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeleteBillsSuccess = (deletedCount: number) => {
        toast({
            title: t('billsDeleted'),
            description: t('billsDeletedDescription', { count: deletedCount }),
            duration: 5000,
        })
    }

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
                        className="gap-1 text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('deleteBillsInRange')}</span>
                    </Button>
                    <Button size="sm" onClick={() => setShowAddBill(true)} className="gap-1">
                        <Plus className="h-4 w-4" />
                        {t('addBill')}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <TabsList className="grid grid-cols-4">
                        <TabsTrigger value="all">{t('allBills')}</TabsTrigger>
                        <TabsTrigger value="summary">{t('summary')}</TabsTrigger>
                        <TabsTrigger value="charts">{t('charts')}</TabsTrigger>
                        <TabsTrigger value="yearly">{t('yearly')}</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    {isDateFilterActive && dateRange.from ? (
                                        <span>
                                            {format(dateRange.from, 'MMM d, yyyy')}
                                            {dateRange.to
                                                ? ` - ${format(dateRange.to, 'MMM d, yyyy')}`
                                                : ''}
                                        </span>
                                    ) : (
                                        <span>{t('dateRange')}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={handleDateRangeSelect}
                                    numberOfMonths={2}
                                />
                                <div className="p-3 border-t border-border">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearDateFilter}
                                        className="w-full"
                                    >
                                        {t('clearFilter')}
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {isDateFilterActive && (
                            <Badge variant="outline" className="gap-1">
                                <Filter className="h-3 w-3" />
                                {t('filtered')}
                            </Badge>
                        )}
                    </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                    {isDateFilterActive && dateRange.from && (
                        <div className="bg-muted p-2 rounded-md text-sm text-center">
                            {t('showingDataFor')} {format(dateRange.from, 'MMM d, yyyy')}
                            {dateRange.to ? ` - ${format(dateRange.to, 'MMM d, yyyy')}` : ''}
                        </div>
                    )}
                    {sortedBills.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                {isDateFilterActive ? t('noBillsInRange') : t('noBillsYet')}
                            </CardContent>
                        </Card>
                    ) : (
                        sortedBills.map(bill => (
                            <Card key={bill.id} className="overflow-hidden">
                                <CardHeader className="p-4 pb-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                            <CardTitle className="text-base">
                                                ${bill.amount.toFixed(2)}
                                            </CardTitle>
                                        </div>
                                        <Badge variant="outline">
                                            {getSubscriptionTypeLabel(bill.subscriptionType)}
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <CalendarDays className="h-3 w-3" />
                                        {formatDate(bill.date)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">
                                            {t('subscriptionType')}:
                                        </span>{' '}
                                        {getSubscriptionTypeLabel(bill.subscriptionType)}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-2 flex justify-between border-t bg-muted/50">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleBillDetails(bill.id)}
                                        className="flex-1 justify-between"
                                    >
                                        {expandedBillId === bill.id
                                            ? t('hideDetails')
                                            : t('viewDetails')}
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
                                        onClick={() => setBillToDelete(bill.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">{t('deleteBillsInRange')}</span>
                                    </Button>
                                </CardFooter>

                                {expandedBillId === bill.id && (
                                    <div className="p-4 pt-0 bg-muted/30">
                                        <div className="rounded-md bg-background p-3 text-sm">
                                            <div className="mb-2">
                                                <span className="font-medium">{t('billId')}:</span>{' '}
                                                {bill.id}
                                            </div>
                                            {bill.notes && (
                                                <div>
                                                    <span className="font-medium">
                                                        {t('notes')}:
                                                    </span>{' '}
                                                    {bill.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="summary">
                    {isDateFilterActive && dateRange.from && (
                        <div className="bg-muted p-2 rounded-md text-sm text-center mb-4">
                            {t('showingDataFor')} {format(dateRange.from, 'MMM d, yyyy')}
                            {dateRange.to ? ` - ${format(dateRange.to, 'MMM d, yyyy')}` : ''}
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{t('totalBills')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totals.total.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    {filteredBills.length} {t('bills')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{t('mainBills')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totals.main.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    {
                                        filteredBills.filter(b => b.subscriptionType === 'main')
                                            .length
                                    }{' '}
                                    {t('bills')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{t('motorBills')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totals.motor.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    {
                                        filteredBills.filter(b => b.subscriptionType === 'motor')
                                            .length
                                    }{' '}
                                    {t('bills')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="charts">
                    <div className="space-y-6">
                        {isDateFilterActive && dateRange.from && (
                            <div className="bg-muted p-2 rounded-md text-sm text-center">
                                {t('showingDataFor')} {format(dateRange.from, 'MMM d, yyyy')}
                                {dateRange.to ? ` - ${format(dateRange.to, 'MMM d, yyyy')}` : ''}
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4">
                            <MonthlyLineChart
                                bills={filteredBills}
                                subscriptionType="main"
                                title={t('mainBillsTrend')}
                                className="md:col-span-1"
                            />
                            <MonthlyLineChart
                                bills={filteredBills}
                                subscriptionType="motor"
                                title={t('motorBillsTrend')}
                                className="md:col-span-1"
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="yearly">
                    {isDateFilterActive && dateRange.from && (
                        <div className="bg-muted p-2 rounded-md text-sm text-center mb-4">
                            {t('showingDataFor')} {format(dateRange.from, 'MMM d, yyyy')}
                            {dateRange.to ? ` - ${format(dateRange.to, 'MMM d, yyyy')}` : ''}
                        </div>
                    )}
                    <YearlyPieChart
                        bills={filteredBills}
                        title={t('yearlyDistribution')}
                        description={t('yearlyDistributionDescription')}
                    />
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
    )
}
