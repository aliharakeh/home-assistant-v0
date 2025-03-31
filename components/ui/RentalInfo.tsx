import { Rent } from '@/models/models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CardLabel } from '../primitive/CardLabel';

interface RentalInfoProps {
    rent: Rent;
    card?: boolean;
}

export default function RentalInfo({ rent, card }: RentalInfoProps) {
    return (
        <View style={card ? styles.card : null}>
            {card && <Text style={styles.sectionTitle}>Rental Information</Text>}

            <CardLabel label="Tenant:" value={rent.tenant.name} />

            <CardLabel label="Rent Amount:" value={`${rent.price.currency} ${rent.price.amount}`} />

            <CardLabel label="Payment Schedule:" value={rent.rentPaymentDuration} />

            <CardLabel label="Last Payment Date:" value={rent.lastPaymentDate || '-'} />
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
