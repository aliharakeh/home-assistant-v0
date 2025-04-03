import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <TouchableOpacity
            onPress={toggleLanguage}
            className="flex-row items-center bg-gray-100 rounded-full px-3 py-1"
        >
            <Text className="text-sm font-medium mr-2">{i18n.language.toUpperCase()}</Text>
            <Ionicons
                name={i18n.language === 'en' ? 'language' : 'language-outline'}
                size={16}
                color="#666"
            />
        </TouchableOpacity>
    );
}
