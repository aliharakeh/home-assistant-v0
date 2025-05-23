'use client'

import { AddBillDialog } from '@/components/add-bill-dialog'
import { MonthlyLineChart } from '@/components/charts/monthly-line-chart'
import { YearlyPieChart } from '@/components/charts/yearly-pie-chart'
import { DeleteBillsDialog } from '@/components/delete-bills-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { CalendarDays, ChevronDown, ChevronUp, Lightbulb, Plus, Trash2, Zap } from 'lucide-react'
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
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const [startDate, setStartDate] = useState<string>(() => {
        const now = new Date()
        return `${now.getFullYear()}-01-01` // First day of current year
    })
    const [endDate, setEndDate] = useState<string>(today)
    const [isDateFilterActive, setIsDateFilterActive] = useState(true)
    const [billToDelete, setBillToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteRangeDialog, setShowDeleteRangeDialog] = useState(false)

    // Filter bills by date range if active
    const filteredBills = useMemo(() => {
        if (!isDateFilterActive || !startDate) {
            return bills
        }

        const start = new Date(startDate)
        const end = endDate ? new Date(endDate) : new Date()

        // Set end date to end of day
        if (endDate) end.setHours(23, 59, 59, 999)

        return bills.filter(bill => {
            const billDate = new Date(bill.date)
            if (billDate < start) return false
            if (endDate && billDate > end) return false
            return true
        })
    }, [bills, startDate, endDate, isDateFilterActive])

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

    const handleDateChange = () => {
        // Always keep the filter active since we have a default start date
        setIsDateFilterActive(true)
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
                        {t('addBill')}
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

                <div className="flex justify-center mt-3">
                    <div
                        className={`flex items-end gap-4 ${
                            dir === 'rtl' ? 'flex-row-reverse' : ''
                        }`}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <Label htmlFor="start-date" className="text-xs text-center w-full">
                                {t('startDate')}
                            </Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                onBlur={handleDateChange}
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
                                onChange={e => setEndDate(e.target.value)}
                                onBlur={handleDateChange}
                                className="h-9 w-40 text-sm"
                                min={startDate}
                                max={today}
                            />
                        </div>
                    </div>
                </div>

                <TabsContent value="all" className="space-y-4 mt-3">
                    {isDateFilterActive && startDate && (
                        <div dir={dir} className="bg-muted p-2 rounded-md text-sm text-center">
                            {t('showingDataFor')} {format(new Date(startDate), 'MMM d, yyyy')}
                            {endDate
                                ? ` - ${format(new Date(endDate), 'MMM d, yyyy')}`
                                : ` - ${t('now')}`}
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
                                    <div dir={dir} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                            <CardTitle className="text-base">
                                                ${bill.amount.toFixed(2)}
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
                                        <span className="text-muted-foreground">
                                            {t('subscriptionType')}:
                                        </span>{' '}
                                        {getSubscriptionTypeLabel(bill.subscriptionType, t)}
                                    </div>
                                </CardContent>
                                <CardFooter
                                    className={`p-2 flex justify-between border-t bg-muted/50 ${
                                        dir === 'rtl' ? 'flex-row-reverse' : ''
                                    }`}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleBillDetails(bill.id)}
                                        className={`flex-1 justify-between ${
                                            dir === 'rtl' ? 'flex-row-reverse' : ''
                                        }`}
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
                        ))
                    )}
                </TabsContent>

                <TabsContent value="summary">
                    {isDateFilterActive && startDate && (
                        <div className="bg-muted p-2 rounded-md text-sm text-center mb-4">
                            {t('showingDataFor')} {format(new Date(startDate), 'MMM d, yyyy')}
                            {endDate
                                ? ` - ${format(new Date(endDate), 'MMM d, yyyy')}`
                                : ` - ${t('now')}`}
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
                        {isDateFilterActive && startDate && (
                            <div className="bg-muted p-2 rounded-md text-sm text-center">
                                {t('showingDataFor')} {format(new Date(startDate), 'MMM d, yyyy')}
                                {endDate
                                    ? ` - ${format(new Date(endDate), 'MMM d, yyyy')}`
                                    : ` - ${t('now')}`}
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
                    {isDateFilterActive && startDate && (
                        <div className="bg-muted p-2 rounded-md text-sm text-center mb-4">
                            {t('showingDataFor')} {format(new Date(startDate), 'MMM d, yyyy')}
                            {endDate
                                ? ` - ${format(new Date(endDate), 'MMM d, yyyy')}`
                                : ` - ${t('now')}`}
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
