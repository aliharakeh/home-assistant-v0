import ElectricityInfo from '@/components/ElectricityInfo';
import RentalInfo from '@/components/RentalInfo';
import { homes } from '@/data/sampleData';
import { ElectricityBill, Home } from '@/models/models';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const homeId = parseInt(id as string, 10);

    const [currentHome, setCurrentHome] = useState<Home | null>(null);

    useEffect(() => {
        const homeData = homes[homeId];
        setCurrentHome(homeData);
    }, [homeId]);

    const handleAddBill = (newBill: ElectricityBill) => {
        if (!currentHome) return;
        const updatedBills = [...currentHome.electricity.bills, newBill];
        const updatedHome = {
            ...currentHome,
            electricity: {
                ...currentHome.electricity,
                bills: updatedBills,
            },
        };
        setCurrentHome(updatedHome);
        homes[homeId] = updatedHome;
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

                {currentHome.rent && <RentalInfo rent={currentHome.rent} />}

                <ElectricityInfo electricity={currentHome.electricity} onAddBill={handleAddBill} />
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
