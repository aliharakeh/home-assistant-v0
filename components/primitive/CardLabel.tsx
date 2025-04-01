import { Text, View } from 'react-native';

export interface CardLabelProps {
    label: string;
    value: string | string[];
}

export function CardLabel(p: CardLabelProps) {
    const value = Array.isArray(p.value) ? p.value : [p.value];
    return (
        <View className="flex-row gap-2 w-full">
            <Text className="font-semibold w-[120px]">{p.label}</Text>
            <View>
                {value.map((v, i) => (
                    <Text key={i} className="text-gray-500">
                        {v}
                    </Text>
                ))}
            </View>
        </View>
    );
}
