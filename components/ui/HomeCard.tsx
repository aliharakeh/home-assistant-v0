import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Text, TouchableOpacity, View } from 'react-native';
import { Home } from '../../db/models';
import { Card } from '../primitive/Card';
import { CardLabel } from '../primitive/CardLabel';
interface HomeCardProps {
    home: Home;
}

export default function HomeCard({ home }: HomeCardProps) {
    const { t } = useTranslation();
    
    const shareholderNames = home.shareholders.map(shareholder => shareholder.name);

    const handlePress = () => {
        router.push(`/${home.id}`);
    };

    const handleEditPress = (event: GestureResponderEvent) => {
        router.push(`/home/${home.id}`);
    };

    let rentContent = <Text className="text-gray-500">Not currently rented</Text>;
    if (home.rent) {
        rentContent = (
            <>
                <CardLabel label={t('Tenant')} value={home.rent.tenant.name} />

                <CardLabel
                    label={t('Rent Amount')}
                    value={`${home.rent.price.currency} ${home.rent.price.amount}`}
                />

                <CardLabel label={t('Payment Schedule')} value={home.rent.rentPaymentDuration} />

                <CardLabel
                    label={t('Last Payment Date')}
                    value={home.rent.lastPaymentDate || '-'}
                />
            </>
        );
    }

    return (
        <Card clickable onPress={handlePress} touchOpacity={0.7}>
            <View className="flex-row justify-between items-center">
                <Text className="text-2xl font-semibold">{home.name}</Text>

                <TouchableOpacity
                    className="bg-blue-100 rounded-md p-2"
                    onPress={handleEditPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="pencil" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <Text className="text-gray-500 mb-3">{home.address}</Text>

            <CardLabel label={t('Electricity Clock Code')} value={home.electricity.clock_code} />

            <CardLabel label={t('Shareholders')} value={shareholderNames} />

            {rentContent}
        </Card>
    );
}
