import { useRTL } from '@/hooks/useRTL';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';

export interface InputWithLabelProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
}

export function InputWithLabel(p: InputWithLabelProps) {
    const { columnContainerRTL, textRTL } = useRTL();

    return (
        <View className={`w-full gap-1 my-1 ${columnContainerRTL}`}>
            <Text className={`label ${textRTL}`}>{p.label}</Text>
            <TextInput
                className={`input ${textRTL}`}
                value={p.value}
                onChangeText={p.onChangeText}
                placeholder={p.placeholder}
                keyboardType={p.keyboardType ?? 'default'}
            />
        </View>
    );
}
