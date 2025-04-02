import { CheckboxGroup } from '@/components/primitive/CheckboxGroup';
import { ElectricityBill, Home } from '@/db/models';
import React from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddElectricityBillModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (bill: ElectricityBill) => void;
    home: Home;
}

export default function AddElectricityBillModal({
    visible,
    onClose,
    onSave,
    home,
}: AddElectricityBillModalProps) {
    const [billDate, setBillDate] = React.useState(new Date());
    const [billAmount, setBillAmount] = React.useState('');
    const [billSubsriptionType, setBillSubsriptionType] = React.useState('');

    const handleSave = () => {
        onSave({
            date: billDate.toISOString(),
            amount: parseFloat(billAmount),
            subsription_type: billSubsriptionType,
        });
        setBillAmount('');
        setBillSubsriptionType('');
    };

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
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
                            options={home.electricity.subsriptions}
                            getValue={s => s.name}
                            getLabel={s => `${s.name} (${s.currency})`}
                            onChange={setBillSubsriptionType}
                        />
                    </View>

                    <View className="flex-row justify-end mt-2">
                        <TouchableOpacity
                            className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                            onPress={onClose}
                        >
                            <Text className="text-gray-700 font-medium">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-md"
                            onPress={handleSave}
                        >
                            <Text className="text-white font-medium">Save Bill</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
