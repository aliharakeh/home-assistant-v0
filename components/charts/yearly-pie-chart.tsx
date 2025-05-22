'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import type { ElectricityBill } from '@/lib/data'
import { TrendingDown, TrendingUp } from 'lucide-react'
import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

interface YearlyPieChartProps {
    bills: ElectricityBill[]
    year?: number
    title: string
    description?: string
    className?: string
}

export function YearlyPieChart({
    bills,
    year,
    title,
    description,
    className,
}: YearlyPieChartProps) {
    const { t } = useLanguage()
    const currentYear = year || new Date().getFullYear()
    const previousYear = currentYear - 1

    // Chart configuration
    const chartConfig: ChartConfig = {
        main: {
            label: t('main'),
            color: 'hsl(var(--chart-1))',
        },
        motor: {
            label: t('motor'),
            color: 'hsl(var(--chart-2))',
        },
    }

    const chartData = React.useMemo(() => {
        // Filter bills by year
        const filteredBills = bills.filter(bill => {
            const billYear = new Date(bill.date).getFullYear()
            return billYear === currentYear
        })

        // Group bills by subscription type
        const billsByType = filteredBills.reduce<Record<string, number>>((acc, bill) => {
            if (!acc[bill.subscriptionType]) {
                acc[bill.subscriptionType] = 0
            }
            acc[bill.subscriptionType] += bill.amount
            return acc
        }, {})

        // Convert to array format for pie chart
        return Object.entries(billsByType || {}).map(([name, value]) => ({
            name,
            value,
            fill: chartConfig[name]?.color || 'hsl(var(--chart-5))',
        }))
    }, [bills, currentYear])

    // Calculate total amount for current year
    const totalAmount = React.useMemo(() => {
        return chartData.length > 0 ? chartData.reduce((sum, entry) => sum + entry.value, 0) : 0
    }, [chartData])

    // Calculate previous year's total for comparison
    const previousYearTotal = React.useMemo(() => {
        const previousYearBills = bills.filter(bill => {
            const billYear = new Date(bill.date).getFullYear()
            return billYear === previousYear
        })

        return previousYearBills.reduce((sum, bill) => sum + bill.amount, 0)
    }, [bills, previousYear])

    // Calculate trend percentage
    const trendPercentage = React.useMemo(() => {
        if (previousYearTotal === 0) return 0
        return ((totalAmount - previousYearTotal) / previousYearTotal) * 100
    }, [totalAmount, previousYearTotal])

    // Determine if trend is up or down
    const isTrendingUp = trendPercentage > 0
    const trendText = isTrendingUp
        ? t('trendingUpBy', { percentage: Math.abs(trendPercentage).toFixed(1) })
        : t('trendingDownBy', { percentage: Math.abs(trendPercentage).toFixed(1) })

    return (
        <Card className={className}>
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{t('yearlyData', { year: currentYear })}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {chartData.length === 0 ? (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                        {t('noDataForYear', { year: currentYear })}
                    </div>
                ) : (
                    <ChartContainer
                        className="mx-auto aspect-square max-h-[250px]"
                        config={chartConfig}
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={80}
                                strokeWidth={5}
                                paddingAngle={2}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        ${totalAmount.toFixed(0)}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground text-sm"
                                                    >
                                                        {t('total')}
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
            {chartData.length > 0 && previousYearTotal > 0 && (
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        {trendText}
                        {isTrendingUp ? (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-primary" />
                        )}
                    </div>
                    <div className="leading-none text-muted-foreground">
                        {t('comparedToPreviousYear')}
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}
