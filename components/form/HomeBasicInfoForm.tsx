import { Home } from '@/models/models';
import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

interface HomeBasicInfoFormProps {
    home: Home;
    setHome: (home: Home) => void;
}

export default function HomeBasicInfoForm({ home, setHome }: HomeBasicInfoFormProps) {
    return (
        <>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={home.name}
                onChangeText={text => setHome({ ...home, name: text })}
                placeholder="Home Name"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={home.address}
                onChangeText={text => setHome({ ...home, address: text })}
                placeholder="Address"
            />

            <Text style={styles.label}>Electricity Address Code</Text>
            <TextInput
                style={styles.input}
                value={home.electricity.clock_code}
                onChangeText={text =>
                    setHome({ ...home, electricity: { ...home.electricity, clock_code: text } })
                }
                placeholder="Electricity Address Code"
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
