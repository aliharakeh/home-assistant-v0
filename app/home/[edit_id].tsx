import ActionButtons from '@/components/form/ActionButtons';
import HomeBasicInfoForm from '@/components/form/HomeBasicInfoForm';
import RentForm from '@/components/form/RentForm';
import ShareholderForm from '@/components/form/ShareholderForm';
import { getHome, insertHome, updateHome } from '@/db/db';
import { getUpdatedHome, Home, validateHome } from '@/db/models';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EditHomePage() {
    const { edit_id } = useLocalSearchParams<{ edit_id: string }>();
    const isNewHome = edit_id === 'new';
    const homeId = isNewHome ? -1 : parseInt(edit_id || '0', 10);

    const [homeData, setHomeData] = useState<Home>({
        name: '',
        address: '',
        electricity: { clock_code: '', subsriptions: [] },
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
                Alert.alert('Error', 'Home data not found.', [
                    { text: 'OK', onPress: () => router.back() },
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

    const handleCancel = () => {
        router.back();
    };

    if (!homeData) {
        return (
            <View style={styles.container}>
                <Text>Home data not found.</Text>
            </View>
        );
    }

    if (!homeData && !isNewHome) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isNewHome ? 'Add New Home' : 'Edit Home'}</Text>

            <HomeBasicInfoForm home={homeData} setHome={setHomeData} />

            <ShareholderForm home={homeData} setHome={setHomeData} />

            <RentForm home={homeData} setHome={setHomeData} />

            <ActionButtons isNewHome={isNewHome} onSave={handleSave} onCancel={handleCancel} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
});
