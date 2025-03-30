import { HomeCard } from '@/components/HomeCard';
import { homes } from '@/data/sampleData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IndexScreen() {
    const handleAddNewHome = () => {
        router.push('/home/new');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>My Properties</Text>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddNewHome}>
                            <Ionicons name="add-circle" size={28} color="#007AFF" />
                            <Text style={styles.addButtonText}>Add Home</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerSubtitle}>Manage your homes and rentals</Text>
                </View>

                {homes.map((home, index) => (
                    <HomeCard key={index} home={home} index={index} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        padding: 16,
        paddingBottom: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#007AFF',
        fontWeight: '600',
        marginLeft: 4,
    },
});
