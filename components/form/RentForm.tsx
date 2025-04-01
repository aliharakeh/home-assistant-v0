import { Home } from '@/models/models';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { InputWithLabel } from '../primitive/InputWithLabel';

interface RentFormProps {
    home: Home;
    setHome: (home: Home) => void;
}

export default function RentForm({ home, setHome }: RentFormProps) {
    return (
        <>
            <Text style={styles.sectionTitle}>Rent Details</Text>

            <InputWithLabel
                label="Tenant Name"
                value={home.rent.tenant.name}
                onChangeText={text =>
                    setHome({ ...home, rent: { ...home.rent, tenant: { name: text } } })
                }
                placeholder="Tenant Name"
            />

            <InputWithLabel
                label="Rent Price Amount"
                value={home.rent.price.amount.toString()}
                onChangeText={text =>
                    setHome({
                        ...home,
                        rent: {
                            ...home.rent,
                            price: { ...home.rent.price, amount: parseFloat(text) },
                        },
                    })
                }
                placeholder="Rent Amount"
            />

            <InputWithLabel
                label="Rent Price Currency"
                value={home.rent.price.currency}
                onChangeText={text =>
                    setHome({
                        ...home,
                        rent: {
                            ...home.rent,
                            price: { ...home.rent.price, currency: text },
                        },
                    })
                }
                placeholder="Rent Currency"
            />

            <InputWithLabel
                label="Rent Payment Duration"
                value={home.rent.rentPaymentDuration}
                onChangeText={text =>
                    setHome({ ...home, rent: { ...home.rent, rentPaymentDuration: text } })
                }
                placeholder="e.g., Monthly, Yearly"
            />

            <InputWithLabel
                label="Last Payment Date"
                value={home.rent.lastPaymentDate}
                onChangeText={text =>
                    setHome({ ...home, rent: { ...home.rent, lastPaymentDate: text } })
                }
                placeholder="e.g., 2024-01-01"
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
