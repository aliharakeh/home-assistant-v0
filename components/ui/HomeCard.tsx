import { router } from 'expo-router';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Home } from '../../models/models';
import { CardLabel } from '../primitive/CardLabel';
import RentalInfo from './RentalInfo';

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

            <CardLabel label="Electricity Code:" value={home.electricity_code} />

            <CardLabel label="Shareholders:" value={shareholderNames} />

            {home.rent && <RentalInfo rent={home.rent} />}

            {!home.rent && <Text style={styles.status}>Not currently rented</Text>}
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
    status: {
        fontSize: 14,
        color: '#666',
        marginTop: 12,
    },
});
