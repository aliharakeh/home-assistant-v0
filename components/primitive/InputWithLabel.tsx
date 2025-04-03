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
            <Text className="label">{p.label}</Text>
            <TextInput
                className="input"
                value={p.value}
                onChangeText={p.onChangeText}
                placeholder={p.placeholder}
            />
        </View>
    );
}
