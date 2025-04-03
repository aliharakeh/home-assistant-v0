import { Home } from '@/db/models';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { InputWithLabel } from '../primitive/InputWithLabel';

interface ElectricityFormProps {
    home: Home;
    setHome: (home: Home) => void;
}

export default function ElectricityForm({ home, setHome }: ElectricityFormProps) {
    const { t } = useTranslation();
    
    const handleRemove = (indexToRemove: number) => {
        setHome({
            ...home,
            electricity: {
                ...home.electricity,
                subsriptions: home.electricity.subsriptions.filter(
                    (_, index) => index !== indexToRemove
                ),
            },
        });
    };

    const handleAdd = () => {
        setHome({
            ...home,
            electricity: {
                ...home.electricity,
                subsriptions: [...home.electricity.subsriptions, { name: '', currency: '' }],
            },
        });
    };

    const handleChange = (index: number, key: string, value: string) => {
        setHome({
            ...home,
            electricity: {
                ...home.electricity,
                subsriptions: home.electricity.subsriptions.map((s, i) =>
                    i === index ? { ...s, [key]: value } : s
                ),
            },
        });
    };

    const handleClockCodeChange = (text: string) => {
        setHome({ ...home, electricity: { ...home.electricity, clock_code: text } });
    };

    return (
        <View>
            <Text className="title mt-3 mb-2">{t('Electricity')}</Text>

            <InputWithLabel
                label={t('Clock Code')}
                value={home.electricity.clock_code}
                onChangeText={handleClockCodeChange}
                placeholder={t('Electricity Address Code')}
            />

            <View className="flex-row items-center justify-between mt-2.5">
                <Text className="label">{t('Electricity Subsriptions')}</Text>
                <TouchableOpacity onPress={handleAdd}>
                    <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {home.electricity.subsriptions.map((subsription, i) => (
                <View key={i} className="flex-row items-center mb-2.5">
                    <TextInput
                        className="input w-[60%]"
                        value={subsription.name}
                        onChangeText={text => handleChange(i, 'name', text)}
                        placeholder={`${t('Subsription')} ${i + 1}`}
                    />

                    <TextInput
                        className="input w-[30%] ml-1"
                        value={subsription.currency}
                        onChangeText={text => handleChange(i, 'currency', text)}
                        placeholder={t('Currency')}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity
                        onPress={() => handleRemove(i)}
                        className="w-[10%] p-1.5 ml-1"
                    >
                        <Ionicons name="close-circle" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}
