import { Shareholder } from '@/models/models';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ShareholderFormProps {
    shareholders: Shareholder[];
    setShareholders: (shareholders: Shareholder[]) => void;
}

export default function ShareholderForm({ shareholders, setShareholders }: ShareholderFormProps) {
    const handleRemove = (indexToRemove: number) => {
        if (shareholders.length <= 1) {
            Alert.alert('Error', 'At least one shareholder is required.');
            return;
        }
        setShareholders(shareholders.filter((_, index) => index !== indexToRemove));
    };

    return (
        <>
            <View style={styles.labelRow}>
                <Text style={styles.label}>Shareholders</Text>
                <TouchableOpacity
                    onPress={() => setShareholders([...shareholders, { name: '', shareValue: 0 }])}
                    style={styles.addButton}
                >
                    <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {shareholders.map((shareholder, i) => (
                <View key={i} style={styles.shareholderRow}>
                    <TextInput
                        style={[styles.shareholderInput]}
                        value={shareholder.name}
                        onChangeText={text =>
                            setShareholders(
                                shareholders.map((s, index) =>
                                    index === i ? { ...s, name: text } : s
                                )
                            )
                        }
                        placeholder={`Shareholder ${i + 1} Name`}
                    />
                    <TextInput
                        style={[styles.shareholderInput, styles.shareholderValueInput]}
                        value={shareholder.shareValue.toString()}
                        onChangeText={text =>
                            setShareholders(
                                shareholders.map((s, index) =>
                                    index === i ? { ...s, shareValue: parseFloat(text) } : s
                                )
                            )
                        }
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
