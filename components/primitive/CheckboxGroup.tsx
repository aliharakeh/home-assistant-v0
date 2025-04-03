import { useRTL } from '@/hooks/useRTL';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface CheckboxGroupProps {
    options: any[];
    getValue: (option: any) => any;
    getLabel: (option: any) => string;
    onChange: (value: any) => void;
}

export function CheckboxGroup({ options, getValue, getLabel, onChange }: CheckboxGroupProps) {
    const { containerRTL } = useRTL();
    const [selectedValue, setSelectedValue] = useState(getValue(options[0]));

    return (
        <View
            className={`flex-row flex-wrap items-center justify-start gap-4 w-full ${containerRTL}`}
        >
            {options.map(o => {
                const value = getValue(o);
                const label = getLabel(o);
                const isSelected = selectedValue === value;
                return (
                    <Pressable
                        key={value}
                        className="flex-row items-center gap-2"
                        onPress={() => {
                            setSelectedValue(value);
                            onChange(value);
                        }}
                    >
                        <Checkbox value={isSelected} />
                        <Text>{label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
