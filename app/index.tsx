import { HomeCard } from '@/components/ui/HomeCard';
import { Home } from '@/models/models';
import { getAllHomes } from '@/models/schema';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function IndexScreen() {
    const db = useSQLiteContext();
    const [homeData, setHomeData] = useState<Home[]>([]);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const homes = await getAllHomes(db);
                setHomeData(homes);
            };
            loadData();
        }, [db])
    );

    const handleAddNewHome = () => {
        router.push('/home/new');
    };

    return (
        <SafeAreaView className="flex-1">
            <ScrollView>
                <View className="p-4">
                    {homeData.map(home => (
                        <HomeCard key={home.id!} home={home} index={home.id!} />
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity className="absolute bottom-4 right-4" onPress={handleAddNewHome}>
                <Ionicons name="add-circle" size={60} color="#007AFF" />
            </TouchableOpacity>
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
