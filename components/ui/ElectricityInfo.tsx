import { ElectricityBill, Home } from '@/db/models';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card } from '../primitive/Card';
import { CardLabel } from '../primitive/CardLabel';

interface ElectricityInfoProps {
    home: Home;
    bills: ElectricityBill[];
}

export default function ElectricityInfo({ home, bills }: ElectricityInfoProps) {
    const { t } = useTranslation();

    const subsriptionTypes = home.electricity.subsriptions
        ? home.electricity.subsriptions.map(
              s => `${s?.name} ${s.currency ? `(${s.currency})` : ''}`
          )
        : '-';

    const groupedBills = bills.reduce((acc, bill) => {
        acc[bill.subsription_type] = acc[bill.subsription_type] || [];
        acc[bill.subsription_type].push(bill);
        return acc;
    }, {} as Record<string, ElectricityBill[]>);

    return (
        <Card>
            <CardLabel
                label={t('Electricity Clock Code')}
                value={home.electricity.clock_code || ''}
            />

            <CardLabel label={t('Subscription Types')} value={subsriptionTypes} />

            {Object.entries(groupedBills).map(([subsriptionType, bills]) => (
                <View key={subsriptionType} style={{ marginTop: 20 }}>
                    <Text className="title mb-4">{subsriptionType}</Text>

                    <LineChart
                        initialSpacing={10}
                        adjustToWidth
                        rotateLabel
                        height={200}
                        labelsExtraHeight={45}
                        xAxisLabelsVerticalShift={15}
                        yAxisOffset={bills.reduce(
                            (acc, bill) => Math.min(acc, bill.amount),
                            bills[0].amount
                        )}
                        data={bills.map(b => ({
                            label: new Date(b.date).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                            }),
                            value: b.amount,
                        }))}
                    />
                </View>
            ))}
        </Card>
    );
}
