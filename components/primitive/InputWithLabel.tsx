import { StyleSheet, Text, TextInput, View } from 'react-native';

export interface InputWithLabelProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}

export function InputWithLabel(p: InputWithLabelProps) {
    return (
        <View>
            <Text style={styles.label}>{p.label}</Text>
            <TextInput
                style={styles.input}
                value={p.value}
                onChangeText={p.onChangeText}
                placeholder={p.placeholder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 10,
    },
});
