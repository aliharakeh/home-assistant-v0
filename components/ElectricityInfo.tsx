import { Electricity, ElectricityBill } from '@/models/models';
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

interface ElectricityInfoProps {
    electricity: Electricity;
    onAddBill: (newBill: ElectricityBill) => void;
}

export default function ElectricityInfo({ electricity, onAddBill }: ElectricityInfoProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [newBillMonthYear, setNewBillMonthYear] = useState('');
    const [newBillPayment, setNewBillPayment] = useState('');

    const handleAddBill = () => {
        // Basic Validation
        if (!newBillMonthYear.trim() || !newBillPayment.trim()) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }
        const paymentAmount = parseFloat(newBillPayment);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid payment amount.');
            return;
        }

        const newBill = {
            monthYear: newBillMonthYear.trim(),
            payment: paymentAmount,
        };

        // Call the parent component's handler
        onAddBill(newBill);

        // Reset form and close modal
        setModalVisible(false);
        setNewBillMonthYear('');
        setNewBillPayment('');
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

                <View style={styles.row}>
                    <Text style={styles.label}>Address Code:</Text>
                    <Text style={styles.value}>{electricity.addressCode}</Text>
                </View>

                <Text style={styles.subsectionTitle}>Recent Bills</Text>
                {electricity.bills.map((bill, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.label}>{bill.monthYear}:</Text>
                        <Text style={styles.value}>${bill.payment}</Text>
                    </View>
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
                            placeholder="Month/Year (e.g., 01/2024)"
                            value={newBillMonthYear}
                            onChangeText={setNewBillMonthYear}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Payment Amount"
                            value={newBillPayment}
                            onChangeText={setNewBillPayment}
                            keyboardType="numeric"
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
        fontSize: 16,
        fontWeight: '600',
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
