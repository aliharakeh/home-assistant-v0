import { CheckboxGroup } from '@/components/primitive/CheckboxGroup';
import ElectricityInfo from '@/components/ui/ElectricityInfo';
import { ElectricityBill, Home, validateElectricityBill } from '@/models/models';
import { getElectricityBills, getHome, insertElectricityBill } from '@/models/schema';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeDetailsScreen() {
    const db = useSQLiteContext();
    const { show_id } = useLocalSearchParams<{ show_id: string }>();
    const homeId = parseInt(show_id as string, 10);

    const [currentHome, setCurrentHome] = useState<Home | null>(null);
    const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [billDate, setBillDate] = useState(new Date());
    const [billAmount, setBillAmount] = useState('');
    const [billSubsriptionType, setBillSubsriptionType] = useState('');

    useEffect(() => {
        const setup = async () => {
            const home = await getHome(db, homeId);
            const bills = await getElectricityBills(db, homeId);
            setCurrentHome(home);
            setElectricityBills(bills);
        };
        setup();
    }, [homeId]);

    const handleAddBill = async (newBill: ElectricityBill) => {
        if (!validateElectricityBill(newBill)) {
            return;
        }
        setModalVisible(false);
        setBillDate(new Date());
        setBillAmount('');
        await insertElectricityBill(db, homeId, newBill);
        setElectricityBills([...electricityBills, newBill]);
    };

    if (!currentHome) {
        return (
            <SafeAreaView>
                <Text>Home not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="p-4">
                <ElectricityInfo
                    home={currentHome}
                    bills={electricityBills}
                    onAddBill={handleAddBill}
                />
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-4 right-4"
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add-circle" size={60} color="#007AFF" />
            </TouchableOpacity>

            {/* Modal for Adding Bill */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View className="flex-1 justify-center items-center bg-gray-500/50">
                    <View className="bg-white rounded-lg p-6 w-5/6 shadow-lg">
                        <Text className="text-xl font-bold mb-4 text-center">
                            Add New Electricity Bill
                        </Text>

                        <TextInput
                            className="border border-gray-300 rounded-md p-3 mb-4"
                            placeholder="Amount"
                            value={billAmount}
                            onChangeText={setBillAmount}
                            keyboardType="numeric"
                        />

                        <View className="mb-4">
                            <CheckboxGroup
                                options={currentHome.electricity.subsriptions}
                                getValue={s => s.name}
                                getLabel={s => `${s.name} (${s.currency})`}
                                onChange={setBillSubsriptionType}
                            />
                        </View>

                        <View className="flex-row justify-end mt-2">
                            <TouchableOpacity
                                className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-gray-700 font-medium">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-blue-500 px-4 py-2 rounded-md"
                                onPress={() =>
                                    handleAddBill({
                                        date: billDate.getTime(),
                                        amount: parseFloat(billAmount),
                                        subsription_type: billSubsriptionType,
                                    })
                                }
                            >
                                <Text className="text-white font-medium">Save Bill</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
