import ElectricityInfo from '@/components/form/ElectricityInfo';
import RentalInfo from '@/components/ui/RentalInfo';
import { ElectricityBill, Home, validateElectricityBill } from '@/models/models';
import { getElectricityBills, getHome, insertElectricityBill } from '@/models/schema';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeDetailsScreen() {
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams<{ id: string }>();
    const homeId = parseInt(id as string, 10);

    const [currentHome, setCurrentHome] = useState<Home | null>(null);
    const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);

    useEffect(() => {
        const setup = async () => {
            const home = await getHome(db, homeId);
            const bills = await getElectricityBills(db, homeId);
            setCurrentHome(home);
            setElectricityBills(bills);
        };
        setup();
    }, [homeId]);

    const handleAddBill = async (newBill: ElectricityBill) => {
        if (!validateElectricityBill(newBill)) {
            return;
        }
        await insertElectricityBill(db, homeId, newBill);
        setElectricityBills([...electricityBills, newBill]);
    };

    if (!currentHome) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.error}>Home not found</Text>
            </SafeAreaView>
        );
    }

    const shareholderNames = currentHome.shareholders
        .map(shareholder => `${shareholder.name} (${shareholder.shareValue}%)`)
        .join('\n');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>{currentHome.name}</Text>
                <Text style={styles.address}>{currentHome.address}</Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Shareholders</Text>
                    <Text style={styles.multilineValue}>{shareholderNames}</Text>
                </View>

                {currentHome.rent && <RentalInfo rent={currentHome.rent} card={true} />}

                {electricityBills.length > 0 && (
                    <ElectricityInfo
                        home={currentHome}
                        bills={electricityBills}
                        onAddBill={handleAddBill}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    address: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    multilineValue: {
        fontSize: 15,
        lineHeight: 22,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
});
