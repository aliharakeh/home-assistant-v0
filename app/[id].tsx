import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { homes } from './data/sampleData';

export default function HomeDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const homeId = parseInt(id as string, 10);
    const home = homes[homeId];

    if (!home) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.error}>Home not found</Text>
            </SafeAreaView>
        );
    }

    const shareholderNames = home.shareholders
        .map(shareholder => `${shareholder.name} (${shareholder.shareValue}%)`)
        .join('\n');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>{home.name}</Text>
                <Text style={styles.address}>{home.address}</Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Shareholders</Text>
                    <Text style={styles.multilineValue}>{shareholderNames}</Text>
                </View>

                {home.rent && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Rental Information</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Tenant:</Text>
                            <Text style={styles.value}>{home.rent.tenant.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Rent Amount:</Text>
                            <Text style={styles.value}>${home.rent.price}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Payment Schedule:</Text>
                            <Text style={styles.value}>{home.rent.rentPaymentDuration}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Electricity</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Address Code:</Text>
                        <Text style={styles.value}>{home.electricity.addressCode}</Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Recent Bills</Text>
                    {home.electricity.bills.map((bill, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.label}>{bill.monthYear}:</Text>
                            <Text style={styles.value}>${bill.payment}</Text>
                        </View>
                    ))}
                </View>
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
    subsectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
        color: '#444',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        width: 130,
        color: '#555',
    },
    value: {
        fontSize: 15,
        flex: 1,
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
