import { Text, TextInput, View } from 'react-native';

export interface InputWithLabelProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}

export function InputWithLabel(p: InputWithLabelProps) {
    return (
        <View className="w-full gap-1 my-1">
            <Text className="font-semibold text-lg">{p.label}</Text>
            <TextInput
                className="border border-gray-300 bg-white py-3 rounded-md p-2"
                value={p.value}
                onChangeText={p.onChangeText}
                placeholder={p.placeholder}
            />
        </View>
    );
}
