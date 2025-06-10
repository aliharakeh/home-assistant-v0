'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { CurrencyType, type ElectricityBill, formatPayment } from '@/lib/data';
import * as React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartConfig } from '../ui/chart';

interface YearlyPieChartProps {
    bills: ElectricityBill[];
    year?: number;
    title: string;
    description?: string;
    className?: string;
    currency: CurrencyType;
}

export function YearlyPieChart({
    bills,
    year,
    title,
    description,
    className,
    currency,
}: YearlyPieChartProps) {
    const { t } = useLanguage();
    const currentYear = year || new Date().getFullYear();
    const previousYear = currentYear - 1;

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
    };

    const chartData = React.useMemo(() => {
        // Filter bills by year
        const filteredBills = bills.filter(bill => {
            const billYear = new Date(bill.date).getFullYear();
            return billYear === currentYear;
        });

        // Group bills by subscription type
        const billsByType = filteredBills.reduce<Record<string, number>>((acc, bill) => {
            if (!acc[bill.subscriptionType]) {
                acc[bill.subscriptionType] = 0;
            }
            acc[bill.subscriptionType] += bill.amount;
            return acc;
        }, {});

        // Convert to array format for pie chart
        return Object.entries(billsByType || {}).map(([name, value]) => ({
            name,
            value,
            fill: chartConfig[name]?.color || 'hsl(var(--chart-5))',
        }));
    }, [bills, currentYear, t]);

    // Calculate total amount for current year
    const totalAmount = React.useMemo(() => {
        return chartData.length > 0 ? chartData.reduce((sum, entry) => sum + entry.value, 0) : 0;
    }, [chartData]);

    // Calculate previous year's total for comparison
    const previousYearTotal = React.useMemo(() => {
        const previousYearBills = bills.filter(bill => {
            const billYear = new Date(bill.date).getFullYear();
            return billYear === previousYear;
        });

        return previousYearBills.reduce((sum, bill) => sum + bill.amount, 0);
    }, [bills, previousYear]);

    // Calculate trend percentage
    const trendPercentage = React.useMemo(() => {
        if (previousYearTotal === 0) return 0;
        return ((totalAmount - previousYearTotal) / previousYearTotal) * 100;
    }, [totalAmount, previousYearTotal]);

    // Determine if trend is up or down
    const isTrendingUp = trendPercentage > 0;
    const trendText = isTrendingUp
        ? t('trendingUpBy', { percentage: Math.abs(trendPercentage).toFixed(1) })
        : t('trendingDownBy', { percentage: Math.abs(trendPercentage).toFixed(1) });

    if (chartData.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    {t('noDataForYear', { year: currentYear })}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            {chartConfig[data.name]?.label ||
                                                                data.name}
                                                        </span>
                                                        <span className="font-bold text-muted-foreground">
                                                            {formatPayment(data.value, currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                    <div className="text-2xl font-bold">{formatPayment(totalAmount, currency)}</div>
                    <p className="text-sm text-muted-foreground">{trendText}</p>
                </div>
            </CardContent>
        </Card>
    );
}
