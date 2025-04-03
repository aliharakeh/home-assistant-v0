import { CheckboxGroup } from '@/components/primitive/CheckboxGroup';
import { ElectricityBill, Home } from '@/db/models';
import { useRTL } from '@/hooks/useRTL';
import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const { containerRTL } = useRTL();

    const [billDate, setBillDate] = React.useState(new Date());
    const [billAmount, setBillAmount] = React.useState('');
    const [billSubsriptionType, setBillSubsriptionType] = React.useState(
        home.electricity.subsriptions?.[0]?.name ?? ''
    );

    const handleSave = () => {
        onSave({
            date: billDate.getTime(),
            amount: parseFloat(billAmount),
            subsription_type: billSubsriptionType,
        });
        setBillDate(new Date());
        setBillAmount('');
        setBillSubsriptionType('');
    };

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center bg-gray-500/50">
                <View className="bg-white rounded-lg p-6 w-5/6 shadow-lg">
                    <Text className="title mb-4 text-center">{t('Add New Electricity Bill')}</Text>

                    <View className={`flex-row items-center gap-2 mb-2 ${containerRTL}`}>
                        <Text className="label">{t('Date')}</Text>

                        <Text className="label">{billDate.toLocaleDateString()}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                DateTimePickerAndroid.open({
                                    value: billDate,
                                    mode: 'date',
                                    onChange: (event: DateTimePickerEvent, date?: Date) => {
                                        if (date) {
                                            setBillDate(date);
                                        }
                                    },
                                });
                            }}
                        >
                            <Ionicons name="calendar" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        className="input"
                        placeholder={t('Amount')}
                        value={billAmount}
                        onChangeText={setBillAmount}
                        keyboardType="numeric"
                    />

                    <View className="my-3">
                        <CheckboxGroup
                            options={home.electricity.subsriptions}
                            getValue={s => s?.name}
                            getLabel={s => `${s?.name} ${s.currency ? `(${s.currency})` : ''}`}
                            onChange={setBillSubsriptionType}
                        />
                    </View>

                    <View className="flex-row justify-end mt-2">
                        <TouchableOpacity className="btn-secondary" onPress={onClose}>
                            <Text className="btn-secondary-text">{t('Cancel')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="btn-primary" onPress={handleSave}>
                            <Text className="btn-primary-text">{t('Save Bill')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
