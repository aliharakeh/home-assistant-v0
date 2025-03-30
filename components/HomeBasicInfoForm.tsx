import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

interface HomeBasicInfoFormProps {
    name: string;
    address: string;
    onNameChange: (value: string) => void;
    onAddressChange: (value: string) => void;
}

export default function HomeBasicInfoForm({
    name,
    address,
    onNameChange,
    onAddressChange,
}: HomeBasicInfoFormProps) {
    return (
        <>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={onNameChange}
                placeholder="Home Name"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={onAddressChange}
                placeholder="Address"
            />
        </>
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
