import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ShareholderFormProps {
    shareholderNames: string[];
    shareholderShares: string[];
    onNameChange: (text: string, index: number) => void;
    onShareChange: (text: string, index: number) => void;
    onAddShareholder: () => void;
    onRemoveShareholder: (index: number) => void;
}

export default function ShareholderForm({
    shareholderNames,
    shareholderShares,
    onNameChange,
    onShareChange,
    onAddShareholder,
    onRemoveShareholder,
}: ShareholderFormProps) {
    const handleRemove = (indexToRemove: number) => {
        if (shareholderNames.length <= 1) {
            Alert.alert('Error', 'At least one shareholder is required.');
            return;
        }
        onRemoveShareholder(indexToRemove);
    };

    return (
        <>
            <View style={styles.labelRow}>
                <Text style={styles.label}>Shareholders</Text>
                <TouchableOpacity onPress={onAddShareholder} style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {shareholderNames.map((shName, i) => (
                <View key={i} style={styles.shareholderRow}>
                    <TextInput
                        style={[styles.shareholderInput]}
                        value={shName}
                        onChangeText={text => onNameChange(text, i)}
                        placeholder={`Shareholder ${i + 1} Name`}
                    />
                    <TextInput
                        style={[styles.shareholderInput, styles.shareholderValueInput]}
                        value={shareholderShares[i]}
                        onChangeText={text => onShareChange(text, i)}
                        placeholder="Share %"
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={() => handleRemove(i)} style={styles.removeButton}>
                        <Ionicons name="close-circle" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addButton: {
        padding: 5,
    },
    shareholderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    shareholderInput: {
        width: '70%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: 'white',
    },
    shareholderValueInput: {
        width: '20%',
        marginLeft: 5,
    },
    removeButton: {
        width: '10%',
        padding: 5,
        marginLeft: 4,
    },
});
