import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

interface ElectricityFormProps {
    electricityAddressCode: string;
    onElectricityAddressCodeChange: (value: string) => void;
}

export default function ElectricityForm({
    electricityAddressCode,
    onElectricityAddressCodeChange,
}: ElectricityFormProps) {
    return (
        <>
            <Text style={styles.sectionTitle}>Electricity Information</Text>
            <Text style={styles.label}>Address Code</Text>
            <TextInput
                style={styles.input}
                value={electricityAddressCode}
                onChangeText={onElectricityAddressCodeChange}
                placeholder="Electricity Address Code"
            />
        </>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
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
