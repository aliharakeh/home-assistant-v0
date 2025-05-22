'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { useLanguage } from '@/contexts/language-context'
import type { ElectricityBill } from '@/lib/data'
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

interface MonthlyLineChartProps {
    bills: ElectricityBill[]
    subscriptionType: 'main' | 'motor'
    title: string
    description?: string
    className?: string
}

export function MonthlyLineChart({
    bills,
    subscriptionType,
    title,
    description,
    className,
}: MonthlyLineChartProps) {
    const { t } = useLanguage()

    // Chart configuration
    const chartConfig: ChartConfig = {
        main: {
            label: title,
            color: 'hsl(var(--chart-1))',
        },
    }

    const chartData = useMemo(() => {
        // Filter bills by subscription type if needed
        const filteredBills = bills.filter(bill => bill.subscriptionType === subscriptionType)

        // Group bills by month and year
        const billsByMonth = filteredBills.reduce<Record<string, { date: string; amount: number }>>(
            (acc, bill) => {
                const date = new Date(bill.date)
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                    2,
                    '0'
                )}`

                if (!acc[monthYear]) {
                    acc[monthYear] = {
                        date: monthYear,
                        amount: 0,
                    }
                }

                acc[monthYear].amount += bill.amount
                return acc
            },
            {}
        )

        // Convert to array and sort by date
        return Object.values(billsByMonth).sort((a, b) => a.date.localeCompare(b.date))
    }, [bills, subscriptionType])

    // Format month-year for display
    const formatMonthYear = (monthYear: string) => {
        const [year, month] = monthYear.split('-')
        return `${month}/${year.slice(2)}`
    }

    // Get color based on subscription type
    const getLineColor = () => {
        switch (subscriptionType) {
            case 'main':
                return 'hsl(var(--chart-1))' // blue
            case 'motor':
                return 'hsl(var(--chart-2))' // purple
            default:
                return 'hsl(var(--chart-1))' // blue
        }
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                {chartData.length < 1 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        {t('notEnoughDataForChart')}
                    </div>
                ) : (
                    <ChartContainer className="h-[300px] w-full" config={chartConfig}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatMonthYear}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={value => `$${value}`}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                strokeWidth={2}
                                activeDot={{ r: 6, fill: getLineColor(), opacity: 0.8 }}
                                stroke={getLineColor()}
                            />
                        </LineChart>
                    </ChartContainer>

                    // <ChartContainer className="h-[300px]">
                    //     <ResponsiveContainer width="100%" height="100%">
                    //         <LineChart
                    //             data={chartData}
                    //             margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    //         >
                    //             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    //             <XAxis
                    //                 dataKey="date"
                    //                 tickFormatter={formatMonthYear}
                    //                 stroke="hsl(var(--muted-foreground))"
                    //                 fontSize={12}
                    //                 tickLine={false}
                    //                 axisLine={false}
                    //             />
                    //             <YAxis
                    //                 stroke="hsl(var(--muted-foreground))"
                    //                 fontSize={12}
                    //                 tickLine={false}
                    //                 axisLine={false}
                    //                 tickFormatter={value => `$${value}`}
                    //             />
                    //             <ChartTooltip
                    //                 content={({ active, payload }) => {
                    //                     if (active && payload && payload.length) {
                    //                         const data = payload[0].payload as any
                    //                         return (
                    //                             <ChartTooltipContent>
                    //                                 <ChartTooltipItem
                    //                                     label={t('date')}
                    //                                     value={formatMonthYear(data.date)}
                    //                                 />
                    //                                 <ChartTooltipItem
                    //                                     label={t('amount')}
                    //                                     value={`$${data.amount.toFixed(2)}`}
                    //                                     color={getLineColor()}
                    //                                 />
                    //                             </ChartTooltipContent>
                    //                         )
                    //                     }
                    //                     return null
                    //                 }}
                    //             />
                    //             <Line
                    //                 type="monotone"
                    //                 dataKey="amount"
                    //                 strokeWidth={2}
                    //                 activeDot={{ r: 6, fill: getLineColor(), opacity: 0.8 }}
                    //                 stroke={getLineColor()}
                    //             />
                    //         </LineChart>
                    //     </ResponsiveContainer>
                    // </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
