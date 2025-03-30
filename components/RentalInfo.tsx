import { Rent } from '@/models/models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RentalInfoProps {
    rent: Rent;
}

export default function RentalInfo({ rent }: RentalInfoProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rental Information</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Tenant:</Text>
                <Text style={styles.value}>{rent.tenant.name}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Rent Amount:</Text>
                <Text style={styles.value}>
                    {rent.price.currency} {rent.price.amount}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Payment Schedule:</Text>
                <Text style={styles.value}>{rent.rentPaymentDuration}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
