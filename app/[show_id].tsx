import AddElectricityBillModal from '@/components/ui/AddElectricityBillModal';
import ElectricityInfo from '@/components/ui/ElectricityInfo';
import { getHome, insertElectricityBill } from '@/db/db';
import { ElectricityBill, Home, validateElectricityBill } from '@/db/models';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';

export default function HomeDetailsScreen() {
    const { t } = useTranslation();
    const { show_id } = useLocalSearchParams<{ show_id: string }>();
    const homeId = parseInt(show_id as string, 10);

    const [currentHome, setCurrentHome] = useState<Home | null>(null);
    const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const setup = async () => {
            const home = await getHome(homeId, true);
            if (!home) {
                return;
            }
            setCurrentHome(home);
            setElectricityBills(home.electricityBills ?? []);
        };
        setup();
    }, [homeId]);

    const handleAddBill = async (newBill: ElectricityBill) => {
        if (!validateElectricityBill(newBill)) {
            return;
        }
        setModalVisible(false);
        await insertElectricityBill(homeId, newBill);
        setElectricityBills([...electricityBills, newBill]);
    };

    if (!currentHome) {
        return (
            <SafeAreaView>
                <Text>{t('Home not found')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="p-4">
                <ElectricityInfo home={currentHome} bills={electricityBills} />
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-4 right-4"
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add-circle" size={60} color="#007AFF" />
            </TouchableOpacity>

            <AddElectricityBillModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleAddBill}
                home={currentHome}
            />
        </SafeAreaView>
    );
}
