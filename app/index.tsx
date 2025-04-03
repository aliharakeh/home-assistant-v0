import HomeCard from '@/components/ui/HomeCard';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { getAllHomes } from '@/db/db';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

export default function IndexScreen() {
    const [homeData, setHomeData] = useState<any[]>([]);

    // TODO: use drizzle live query instead of useFocusEffect
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const homes = await getAllHomes();
                setHomeData(homes);
            };
            loadData();
        }, [])
    );

    const handleAddNewHome = () => {
        router.push('/home/new');
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-row justify-end px-4 py-2">
                <LanguageSwitcher />
            </View>
            <ScrollView>
                <View className="p-4">
                    {homeData.map(home => (
                        <HomeCard key={home.id!} home={home} />
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity className="absolute bottom-4 right-4" onPress={handleAddNewHome}>
                <Ionicons name="add-circle" size={60} color="#007AFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
