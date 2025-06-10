'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { CurrencyType, type ElectricityBill, formatPayment } from '@/lib/data';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthlyLineChartProps {
    bills: ElectricityBill[];
    subscriptionType: 'main' | 'motor';
    title: string;
    className?: string;
    currency: CurrencyType;
}

export function MonthlyLineChart({
    bills,
    subscriptionType,
    title,
    className,
    currency,
}: MonthlyLineChartProps) {
    const { t } = useLanguage();

    const data = bills
        .filter(bill => bill.subscriptionType === subscriptionType)
        .reduce((acc, bill) => {
            const date = new Date(bill.date);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `${month} ${year}`;

            if (!acc[key]) {
                acc[key] = {
                    month: key,
                    amount: 0,
                };
            }

            acc[key].amount += bill.amount;
            return acc;
        }, {} as Record<string, { month: string; amount: number }>);

    const chartData = Object.values(data).sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        if (aYear !== bYear) return Number(aYear) - Number(bYear);
        return new Date(`${aMonth} 1, 2000`).getMonth() - new Date(`${bMonth} 1, 2000`).getMonth();
    });

    if (chartData.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    {t('notEnoughDataForChart')}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="month"
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
                                tickFormatter={value => formatPayment(value, currency)}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            {t('amount')}
                                                        </span>
                                                        <span className="font-bold text-muted-foreground">
                                                            {formatPayment(
                                                                payload[0].value as number,
                                                                currency
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
