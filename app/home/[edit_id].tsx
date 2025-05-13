import ElectricityForm from '@/components/form/ElectricityForm';
import HomeBasicInfoForm from '@/components/form/HomeBasicInfoForm';
import RentForm from '@/components/form/RentForm';
import ShareholderForm from '@/components/form/ShareholderForm';
import { getHome, insertHome, updateHome } from '@/db/db';
import { getUpdatedHome, Home, validateHome } from '@/db/models';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function EditHomePage() {
    const { t } = useTranslation();
    const { edit_id } = useLocalSearchParams<{ edit_id: string }>();
    const isNewHome = edit_id === 'new';
    const homeId = isNewHome ? -1 : parseInt(edit_id || '0', 10);

    const [homeData, setHomeData] = useState<Home>({
        name: '',
        address: '',
        electricity: { clock_code: '', subscriptions: [{ name: t('main'), currency: '' }] },
        shareholders: [{ name: '', shareValue: 0 }],
        rent: {
            tenant: { name: '' },
            price: { amount: 0, currency: '' },
            rentPaymentDuration: '',
            lastPaymentDate: '',
        },
    });

    useEffect(() => {
        const loadHome = async () => {
            const currentHome = await getHome(homeId);
            if (currentHome) {
                setHomeData(currentHome);
            } else {
                Alert.alert(t('Error'), t('Home data not found.'), [
                    { text: t('OK'), onPress: () => router.back() },
                ]);
            }
        };
        if (!isNewHome) {
            loadHome();
        }
    }, [homeId, isNewHome]);

    const handleSave = async () => {
        const updatedHome = getUpdatedHome(homeData);
        if (!validateHome(updatedHome)) {
            return;
        }

        if (isNewHome) {
            await insertHome(updatedHome);
        } else {
            await updateHome(updatedHome);
        }

        router.back();
    };

    // const handleCancel = () => {
    //     router.back();
    // };

    if (!homeData) {
        return (
            <View className="p-4">
                <Text>{t('Home data not found.')}</Text>
            </View>
        );
    }

    if (!homeData && !isNewHome) {
        return (
            <View className="p-44">
                <Text>{t('Loading...')}</Text>
            </View>
        );
    }

    return (
        <View className="p-4">
            <ScrollView>
                <Text className="title">{isNewHome ? t('Add New Home') : t('Edit Home')}</Text>

                <HomeBasicInfoForm home={homeData} setHome={setHomeData} />

                <ElectricityForm home={homeData} setHome={setHomeData} />

                <ShareholderForm home={homeData} setHome={setHomeData} />

                <RentForm home={homeData} setHome={setHomeData} />

                {/* <ActionButtons isNewHome={isNewHome} onSave={handleSave} onCancel={handleCancel} /> */}
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-4 right-4 rounded-full bg-blue-200 p-4"
                activeOpacity={0.7}
                onPress={handleSave}
            >
                <Ionicons name="save" size={50} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );
}
