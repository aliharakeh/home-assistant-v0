import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
    isNewHome: boolean;
    onSave: () => void;
    onCancel: () => void;
}

export default function ActionButtons({ isNewHome, onSave, onCancel }: ActionButtonsProps) {
    const { t } = useTranslation();

    return (
        <View className="flex-row justify-center mt-6 mb-16">
            <TouchableOpacity className="btn-secondary" onPress={onCancel} activeOpacity={0.7}>
                <Text className="btn-secondary-text">{t('Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="btn-primary" onPress={onSave} activeOpacity={0.7}>
                <Text className="btn-primary-text">
                    {isNewHome ? t('Create Home') : t('Save Changes')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
