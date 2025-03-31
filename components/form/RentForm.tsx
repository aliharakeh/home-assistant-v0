import { Rent } from '@/models/models';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { InputWithLabel } from '../primitive/InputWithLabel';

interface RentFormProps {
    rent: Rent;
    setRent: (rent: Rent) => void;
}

export default function RentForm({ rent, setRent }: RentFormProps) {
    return (
        <>
            <Text style={styles.sectionTitle}>Rent Details</Text>

            {rent ? (
                <>
                    <InputWithLabel
                        label="Tenant Name"
                        value={rent.tenant.name}
                        onChangeText={text => setRent({ ...rent, tenant: { name: text } })}
                        placeholder="Tenant Name"
                    />

                    <InputWithLabel
                        label="Rent Price Amount"
                        value={rent.price.amount.toString()}
                        onChangeText={text =>
                            setRent({ ...rent, price: { ...rent.price, amount: parseFloat(text) } })
                        }
                        placeholder="Rent Amount"
                    />

                    <InputWithLabel
                        label="Rent Price Currency"
                        value={rent.price.currency}
                        onChangeText={text =>
                            setRent({ ...rent, price: { ...rent.price, currency: text } })
                        }
                        placeholder="Rent Currency"
                    />

                    <InputWithLabel
                        label="Rent Payment Duration"
                        value={rent.rentPaymentDuration}
                        onChangeText={text => setRent({ ...rent, rentPaymentDuration: text })}
                        placeholder="e.g., Monthly, Yearly"
                    />

                    <InputWithLabel
                        label="Last Payment Date"
                        value={rent.lastPaymentDate}
                        onChangeText={text => setRent({ ...rent, lastPaymentDate: text })}
                        placeholder="e.g., 2024-01-01"
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
