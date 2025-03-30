import { homes } from '@/data/sampleData';
import { Home } from '@/models/models';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const homeId = parseInt(id as string, 10);

    // State for the home data (to allow local updates)
    const [currentHome, setCurrentHome] = useState<Home | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newBillMonthYear, setNewBillMonthYear] = useState('');
    const [newBillPayment, setNewBillPayment] = useState('');

    useEffect(() => {
        // Initialize state with home data based on ID
        const homeData = homes[homeId];
        setCurrentHome(homeData);
    }, [homeId]);

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

        if (!currentHome) return;

        const newBill = {
            monthYear: newBillMonthYear.trim(),
            payment: paymentAmount,
        };

        // --- Update Logic --- (Simulating update)
        // In a real app, you'd call your data service here:
        // addElectricityBillToHome(homeId, newBill);

        // For this example, update the local state to reflect the change
        const updatedBills = [...currentHome.electricity.bills, newBill];
        const updatedHome = {
            ...currentHome,
            electricity: {
                ...currentHome.electricity,
                bills: updatedBills,
            },
        };
        setCurrentHome(updatedHome);
        // --- End Update Logic ---

        // Reset form and close modal
        setNewBillMonthYear('');
        setNewBillPayment('');
        setModalVisible(false);
    };

    // Use currentHome from state now
    if (!currentHome) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.error}>Home not found</Text>
            </SafeAreaView>
        );
    }

    const shareholderNames = currentHome.shareholders
        .map(shareholder => `${shareholder.name} (${shareholder.shareValue}%)`)
        .join('\n');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>{currentHome.name}</Text>
                <Text style={styles.address}>{currentHome.address}</Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Shareholders</Text>
                    <Text style={styles.multilineValue}>{shareholderNames}</Text>
                </View>

                {currentHome.rent && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Rental Information</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Tenant:</Text>
                            <Text style={styles.value}>{currentHome.rent.tenant.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Rent Amount:</Text>
                            <Text style={styles.value}>${currentHome.rent.price}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Payment Schedule:</Text>
                            <Text style={styles.value}>{currentHome.rent.rentPaymentDuration}</Text>
                        </View>
                    </View>
                )}

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
                        <Text style={styles.value}>{currentHome.electricity.addressCode}</Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Recent Bills</Text>
                    {currentHome.electricity.bills.map((bill, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.label}>{bill.monthYear}:</Text>
                            <Text style={styles.value}>${bill.payment}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    address: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
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
    multilineValue: {
        fontSize: 15,
        lineHeight: 22,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
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
