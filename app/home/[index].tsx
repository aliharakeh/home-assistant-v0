import ActionButtons from '@/components/form/ActionButtons';
import HomeBasicInfoForm from '@/components/form/HomeBasicInfoForm';
import RentForm from '@/components/form/RentForm';
import ShareholderForm from '@/components/form/ShareholderForm';
import { getUpdatedHome, Home, Rent, Shareholder, validateHome } from '@/models/models';
import { getHome, insertHome, updateHome } from '@/models/schema';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EditHomePage() {
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams<{ id: string }>();
    const isNewHome = id === 'new';
    const homeId = isNewHome ? -1 : parseInt(id || '0', 10);

    const [homeData, setHomeData] = useState<Home>({
        name: '',
        address: '',
        electricity_code: '',
        shareholders: [{ name: '', shareValue: 0 }],
    });
    const [shareholders, setShareholders] = useState<Shareholder[]>([{ name: '', shareValue: 0 }]);
    const [rent, setRent] = useState<Rent>({
        tenant: { name: '' },
        price: { amount: 0, currency: 'USD' },
        rentPaymentDuration: 'Monthly',
        lastPaymentDate: '',
    });

    useEffect(() => {
        const loadHome = async () => {
            const currentHome = await getHome(db, homeId);
            if (currentHome) {
                setHomeData(currentHome);
                setShareholders(currentHome.shareholders);
                if (currentHome.rent) {
                    setRent(currentHome.rent);
                }
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
        const updatedHome = getUpdatedHome(homeData, shareholders, rent);

        if (!validateHome(updatedHome)) {
            return;
        }

        if (isNewHome) {
            await insertHome(db, updatedHome);
            Alert.alert('Success', 'New home created successfully.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } else {
            await updateHome(db, updatedHome);
            Alert.alert('Success', 'Home details updated.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        }
        router.navigate('/index');
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

            <ShareholderForm shareholders={shareholders} setShareholders={setShareholders} />

            <RentForm rent={rent} setRent={setRent} />

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
