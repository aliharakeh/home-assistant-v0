import { ElectricityBill, Home } from '@/db/models';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card } from '../primitive/Card';
import { CardLabel } from '../primitive/CardLabel';

interface ElectricityInfoProps {
    home: Home;
    bills: ElectricityBill[];
    onAddBill: (newBill: ElectricityBill) => void;
}

export default function ElectricityInfo({ home, bills, onAddBill }: ElectricityInfoProps) {
    const { t } = useTranslation();
    
    const subsriptionTypes = home.electricity.subsriptions.map(s => `${s.name} (${s.currency})`);

    return (
        <Card>
            <CardLabel label={t('Electricity Clock Code')} value={home.electricity.clock_code} />

            <CardLabel label={t('Subscription Types')} value={subsriptionTypes} />

            {bills.length > 0 && (
                <View style={{ marginTop: 20 }}>
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
                                month: 'short',
                                day: 'numeric',
                            }),
                            value: b.amount,
                        }))}
                    />
                </View>
            )}
        </Card>
    );
}
