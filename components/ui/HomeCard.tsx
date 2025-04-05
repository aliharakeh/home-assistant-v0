import { useRTL } from '@/hooks/useRTL';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { deleteHome } from '../../db/db';
import { Home } from '../../db/models';
import { Card } from '../primitive/Card';
import { CardLabel } from '../primitive/CardLabel';
interface HomeCardProps {
    home: Home;
}

export default function HomeCard({ home }: HomeCardProps) {
    const { t } = useTranslation();
    const { containerRTL, textRTL } = useRTL();

    const emptyShareholders = home.shareholders.length === 0;
    const emptyFirstShareholder =
        home.shareholders.length === 1 && home.shareholders[0].name === '';
    const shareholderNames =
        emptyShareholders || emptyFirstShareholder
            ? '-'
            : home.shareholders.map(shareholder => shareholder.name);

    const handlePress = () => router.push(`/${home.id}`);

    const handleEditPress = () => router.push(`/home/${home.id}`);

    const handleDeletePress = () => home.id && deleteHome(home.id);

    let rentContent = <Text className="text-gray-500">Not currently rented</Text>;

    if (home.rent) {
        rentContent = (
            <>
                <CardLabel label={t('Tenant')} value={home.rent.tenant.name || '-'} />

                <CardLabel
                    label={t('Rent Amount')}
                    value={
                        home.rent.price.amount
                            ? `${home.rent.price.amount} ${home.rent.price.currency} `
                            : '-'
                    }
                />

                <CardLabel
                    label={t('Payment Schedule')}
                    value={home.rent.rentPaymentDuration || '-'}
                />

                <CardLabel
                    label={t('Last Payment Date')}
                    value={home.rent.lastPaymentDate || '-'}
                />
            </>
        );
    }

    return (
        <Card clickable onPress={handlePress} touchOpacity={0.7}>
            <View className={`flex-row justify-between items-center ${containerRTL}`}>
                <Text className={`text-2xl font-semibold ${textRTL}`}>{home.name || '-'}</Text>

                <View className={`flex-row gap-2 ${containerRTL}`}>
                    <TouchableOpacity
                        className="bg-blue-100 rounded-md p-2"
                        onPress={handleEditPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="pencil" size={20} color="#007AFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-red-100 rounded-md p-2"
                        onPress={handleDeletePress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text className={`text-gray-500 mb-3 w-full ${textRTL}`}>{home.address || '-'}</Text>

            <CardLabel
                label={t('Electricity Clock Code')}
                value={home.electricity.clock_code || '-'}
            />

            <CardLabel label={t('Shareholders')} value={shareholderNames} />

            {rentContent}
        </Card>
    );
}
