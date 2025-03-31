import { ElectricityBill, Home } from '@/models/models';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CardLabel } from '../primitive/CardLabel';

interface ElectricityInfoProps {
    home: Home;
    bills: ElectricityBill[];
    onAddBill: (newBill: ElectricityBill) => void;
}

export default function ElectricityInfo({ home, bills, onAddBill }: ElectricityInfoProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [billDate, setBillDate] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [billCurrency, setBillCurrency] = useState('USD');

    const handleAddBill = () => {
        if (!billDate.trim() || !billAmount.trim()) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        const amount = parseFloat(billAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Error', 'Please enter a valid payment amount.');
            return;
        }

        onAddBill({
            date: billDate.trim(),
            amount,
            currency: billCurrency,
        });

        setModalVisible(false);
        setBillDate('');
        setBillAmount('');
    };

    return (
        <>
            <View style={styles.card}>
                <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Electricity</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.addButton}
                    >
                        <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <CardLabel label="Electricity Code:" value={home.electricity_code} />

                <Text style={styles.subsectionTitle}>Bills</Text>
                {bills.map((bill, index) => (
                    <CardLabel
                        key={index}
                        label={`${bill.date}:`}
                        value={`${bill.amount} ${bill.currency}`}
                    />
                ))}
            </View>

            {/* Modal for Adding Bill */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Electricity Bill</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Date (e.g., 01/2024)"
                            value={billDate}
                            onChangeText={setBillDate}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            value={billAmount}
                            onChangeText={setBillAmount}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Currency"
                            value={billCurrency}
                            onChangeText={setBillCurrency}
                        />

                        <View style={styles.modalButtonRow}>
                            <Button
                                title="Cancel"
                                onPress={() => setModalVisible(false)}
                                color="grey"
                            />
                            <View style={{ width: 10 }} />
                            <Button title="Save Bill" onPress={handleAddBill} />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    subsectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 12,
        marginBottom: 8,
        color: '#444',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        width: 130,
        color: '#555',
    },
    value: {
        fontSize: 15,
        flex: 1,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addButton: {
        padding: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        width: '100%',
    },
});
