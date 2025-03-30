import { router } from 'expo-router';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Home } from '../models/models';

interface HomeCardProps {
    home: Home;
    index: number;
}

export const HomeCard: React.FC<HomeCardProps> = ({ home, index }) => {
    const shareholderNames = home.shareholders.map(shareholder => shareholder.name).join(', ');

    const handlePress = () => {
        router.push(`/${index}`);
    };

    const handleEditPress = (event: GestureResponderEvent) => {
        router.push(`/home/${index}`);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
            <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditPress}
                activeOpacity={0.7}
            >
                <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{home.name}</Text>
            <Text style={styles.address}>{home.address}</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Shareholders:</Text>
                <Text style={styles.value}>{shareholderNames}</Text>
            </View>

            {home.rent && (
                <>
                    <View style={styles.section}>
                        <Text style={styles.label}>Tenant:</Text>
                        <Text style={styles.value}>{home.rent.tenant.name}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Rent Price:</Text>
                        <Text style={styles.value}>
                            {home.rent.price.currency} {home.rent.price.amount}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Payment Duration:</Text>
                        <Text style={styles.value}>{home.rent.rentPaymentDuration}</Text>
                    </View>
                </>
            )}

            {!home.rent && (
                <View style={styles.section}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.value}>Not currently rented</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#eee',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        zIndex: 1,
    },
    editButtonText: {
        fontSize: 12,
        color: '#333',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    section: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    label: {
        fontWeight: '600',
        marginRight: 8,
        width: 120,
    },
    value: {
        flex: 1,
        color: '#333',
    },
});
