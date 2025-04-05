import { Home } from '@/db/models';
import { useRTL } from '@/hooks/useRTL';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ShareholderFormProps {
    home: Home;
    setHome: (home: Home) => void;
}

export default function ShareholderForm({ home, setHome }: ShareholderFormProps) {
    const { t } = useTranslation();
    const { containerRTL } = useRTL();

    const handleRemove = (indexToRemove: number) => {
        if (home.shareholders.length <= 1) {
            Alert.alert(t('Error'), t('At least one shareholder is required.'));
            return;
        }
        setHome({
            ...home,
            shareholders: home.shareholders.filter((_, index) => index !== indexToRemove),
        });
    };

    return (
        <>
            <View className={`flex-row items-center justify-between mt-8 mb-2 ${containerRTL}`}>
                <Text className="title">{t('Shareholders')}</Text>
                <TouchableOpacity
                    onPress={() =>
                        setHome({
                            ...home,
                            shareholders: [...home.shareholders, { name: '', shareValue: 0 }],
                        })
                    }
                >
                    <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {home.shareholders.map((shareholder, i) => (
                <View key={i} className={`flex-row items-center mb-2 ${containerRTL}`}>
                    <TextInput
                        className="input w-[60%]"
                        value={shareholder.name}
                        onChangeText={text =>
                            setHome({
                                ...home,
                                shareholders: home.shareholders.map((s, index) =>
                                    index === i ? { ...s, name: text } : s
                                ),
                            })
                        }
                        placeholder={t('Shareholder Name')}
                    />

                    <TextInput
                        className="input w-[30%] ml-1"
                        value={shareholder.shareValue ? shareholder.shareValue.toString() : ''}
                        onChangeText={text =>
                            setHome({
                                ...home,
                                shareholders: home.shareholders.map((s, index) =>
                                    index === i ? { ...s, shareValue: parseFloat(text || '0') } : s
                                ),
                            })
                        }
                        placeholder={`${t('Share')}`}
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
        </>
    );
}
