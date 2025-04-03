import { useRTL } from '@/hooks/useRTL';
import { Text, View } from 'react-native';

export interface CardLabelProps {
    label: string;
    value: string | string[];
}

export function CardLabel(p: CardLabelProps) {
    const value = Array.isArray(p.value) ? p.value : [p.value];
    const { containerRTL, textRTL } = useRTL();

    return (
        <View className={`flex-row gap-2 w-full ${containerRTL}`}>
            <Text className={`font-semibold w-1/2 ${textRTL}`}>{p.label}</Text>

            <View className="">
                {value.map((v, i) => (
                    <Text key={i} className={`text-gray-500 ${textRTL}`}>
                        {v}
                    </Text>
                ))}
            </View>
        </View>
    );
}
