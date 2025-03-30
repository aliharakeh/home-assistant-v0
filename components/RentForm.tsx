import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RentFormProps {
    hasRent: boolean;
    tenantName: string;
    rentPrice: string;
    rentCurrency: string;
    rentDuration: string;
    onTenantNameChange: (value: string) => void;
    onRentPriceChange: (value: string) => void;
    onRentCurrencyChange: (value: string) => void;
    onRentDurationChange: (value: string) => void;
    onToggleRent: () => void;
}

export default function RentForm({
    hasRent,
    tenantName,
    rentPrice,
    rentCurrency,
    rentDuration,
    onTenantNameChange,
    onRentPriceChange,
    onRentCurrencyChange,
    onRentDurationChange,
    onToggleRent,
}: RentFormProps) {
    return (
        <>
            <View style={styles.rentToggleRow}>
                <Text style={styles.sectionTitle}>Rent Details</Text>
                <TouchableOpacity onPress={onToggleRent} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                        {hasRent ? 'Remove Rent' : 'Add Rent'}
                    </Text>
                </TouchableOpacity>
            </View>

            {hasRent ? (
                <>
                    <Text style={styles.label}>Tenant Name</Text>
                    <TextInput
                        style={styles.input}
                        value={tenantName}
                        onChangeText={onTenantNameChange}
                        placeholder="Tenant Name"
                    />

                    <Text style={styles.label}>Rent Price Amount</Text>
                    <TextInput
                        style={styles.input}
                        value={rentPrice}
                        onChangeText={onRentPriceChange}
                        placeholder="Rent Amount"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Rent Currency</Text>
                    <TextInput
                        style={styles.input}
                        value={rentCurrency}
                        onChangeText={onRentCurrencyChange}
                        placeholder="e.g., USD, EUR"
                        autoCapitalize="characters"
                    />

                    <Text style={styles.label}>Payment Duration</Text>
                    <TextInput
                        style={styles.input}
                        value={rentDuration}
                        onChangeText={onRentDurationChange}
                        placeholder="e.g., Monthly, Yearly"
                    />
                </>
            ) : (
                <Text style={styles.infoText}>This property is not currently rented.</Text>
            )}
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
    infoText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 20,
        color: '#666',
    },
    rentToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 5,
    },
    toggleButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});
