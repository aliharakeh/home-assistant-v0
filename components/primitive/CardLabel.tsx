import { Text, View } from 'react-native';

export interface CardLabelProps {
    label: string;
    value: string | string[];
    rtl?: boolean;
}

export function CardLabel(p: CardLabelProps) {
    const value = Array.isArray(p.value) ? p.value : [p.value];
    return (
        <View className={`flex-row gap-2 w-full ${p.rtl ? 'flex-row-reverse' : ''}`}>
            <Text className={`font-semibold w-[50%] ${p.rtl ? 'text-right' : ''}`}>{p.label}</Text>

            <View className={p.rtl ? 'flex-1 items-end' : 'flex-1'}>
                {value.map((v, i) => (
                    <Text key={i} className={`text-gray-500 ${p.rtl ? 'text-right' : ''}`}>
                        {v}
                    </Text>
                ))}
            </View>
        </View>
    );
}
