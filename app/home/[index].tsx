import { addHome, getHomeByIndex, updateHome } from '@/data/sampleData';
import { Electricity, Home, Rent, Shareholder } from '@/models/models';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditHomePage() {
    const { index } = useLocalSearchParams<{ index: string }>();
    const isNewHome = index === 'new';
    const homeIndex = isNewHome ? -1 : parseInt(index || '0', 10);

    const [homeData, setHomeData] = useState<Home | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [shareholderNames, setShareholderNames] = useState<string[]>(['']);
    const [shareholderShares, setShareholderShares] = useState<string[]>(['100']);
    const [tenantName, setTenantName] = useState('');
    const [rentPrice, setRentPrice] = useState('');
    const [rentCurrency, setRentCurrency] = useState('USD');
    const [rentDuration, setRentDuration] = useState('Monthly');
    const [hasRent, setHasRent] = useState(false);
    const [electricityAddressCode, setElectricityAddressCode] = useState('');

    useEffect(() => {
        if (isNewHome) {
            // Initialize with empty data for a new home
            setHomeData({
                name: '',
                address: '',
                shareholders: [{ name: '', shareValue: 100 }],
                electricity: {
                    addressCode: '',
                    bills: [],
                },
            });
        } else {
            // Load existing home data
            const currentHome = getHomeByIndex(homeIndex);
            if (currentHome) {
                setHomeData(currentHome);
                setName(currentHome.name);
                setAddress(currentHome.address);
                setShareholderNames(currentHome.shareholders.map(s => s.name));
                setShareholderShares(currentHome.shareholders.map(s => s.shareValue.toString()));
                setElectricityAddressCode(currentHome.electricity.addressCode);

                if (currentHome.rent) {
                    setHasRent(true);
                    setTenantName(currentHome.rent.tenant.name);
                    setRentPrice(currentHome.rent.price.amount.toString());
                    setRentCurrency(currentHome.rent.price.currency);
                    setRentDuration(currentHome.rent.rentPaymentDuration);
                }
            } else {
                Alert.alert('Error', 'Home data not found.', [
                    { text: 'OK', onPress: () => router.back() },
                ]);
            }
        }
    }, [homeIndex, isNewHome]);

    const handleSave = () => {
        // Validate required fields
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a home name.');
            return;
        }

        if (!address.trim()) {
            Alert.alert('Error', 'Please enter an address.');
            return;
        }

        // Build updated shareholders list
        const updatedShareholders: Shareholder[] = shareholderNames
            .map((name, i) => ({
                name: name.trim(),
                shareValue: parseFloat(shareholderShares[i]) || 0,
            }))
            .filter(s => s.name); // Only include shareholders with names

        // If no valid shareholders, show error
        if (updatedShareholders.length === 0) {
            Alert.alert('Error', 'Please add at least one shareholder with a name.');
            return;
        }

        // Optional rent data
        let updatedRent: Rent | undefined = undefined;
        if (hasRent) {
            if (!tenantName.trim()) {
                Alert.alert('Error', 'Please enter a tenant name.');
                return;
            }

            const priceAmount = parseFloat(rentPrice);
            if (isNaN(priceAmount) || priceAmount <= 0) {
                Alert.alert('Error', 'Please enter a valid rent amount.');
                return;
            }

            updatedRent = {
                tenant: { name: tenantName.trim() },
                price: {
                    amount: priceAmount,
                    currency: rentCurrency.trim() || 'USD',
                },
                rentPaymentDuration: rentDuration.trim() || 'Monthly',
            };
        }

        // Update electricity
        const updatedElectricity: Electricity = {
            addressCode: electricityAddressCode.trim() || 'N/A',
            bills: homeData?.electricity?.bills || [],
        };

        // Create the updated or new home data object
        const updatedHomeData: Home = {
            name: name.trim(),
            address: address.trim(),
            shareholders: updatedShareholders,
            rent: updatedRent,
            electricity: updatedElectricity,
        };

        if (isNewHome) {
            // Add a new home
            addHome(updatedHomeData);
            Alert.alert('Success', 'New home created successfully.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } else {
            // Update existing home
            updateHome(homeIndex, updatedHomeData);
            Alert.alert('Success', 'Home details updated.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const handleShareholderNameChange = (text: string, index: number) => {
        const updatedNames = [...shareholderNames];
        updatedNames[index] = text;
        setShareholderNames(updatedNames);
    };

    const handleShareholderShareChange = (text: string, index: number) => {
        const updatedShares = [...shareholderShares];
        updatedShares[index] = text;
        setShareholderShares(updatedShares);
    };

    const handleAddShareholder = () => {
        setShareholderNames([...shareholderNames, '']);
        setShareholderShares([...shareholderShares, '0']);
    };

    const handleRemoveShareholder = (indexToRemove: number) => {
        if (shareholderNames.length <= 1) {
            Alert.alert('Error', 'At least one shareholder is required.');
            return;
        }
        setShareholderNames(shareholderNames.filter((_, index) => index !== indexToRemove));
        setShareholderShares(shareholderShares.filter((_, index) => index !== indexToRemove));
    };

    const toggleRentSection = () => {
        setHasRent(!hasRent);
    };

    if (!homeData && !isNewHome) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isNewHome ? 'Add New Home' : 'Edit Home'}</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Home Name"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
            />

            <View style={styles.labelRow}>
                <Text style={styles.label}>Shareholders</Text>
                <TouchableOpacity onPress={handleAddShareholder} style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {shareholderNames.map((shName, i) => (
                <View key={i} style={styles.shareholderRow}>
                    <TextInput
                        style={[styles.shareholderInput]}
                        value={shName}
                        onChangeText={text => handleShareholderNameChange(text, i)}
                        placeholder={`Shareholder ${i + 1} Name`}
                    />
                    <TextInput
                        style={[styles.shareholderInput, styles.sharholderValueInput]}
                        value={shareholderShares[i]}
                        onChangeText={text => handleShareholderShareChange(text, i)}
                        placeholder="Share %"
                        keyboardType="numeric"
                    />
                    <TouchableOpacity
                        onPress={() => handleRemoveShareholder(i)}
                        style={styles.removeButton}
                    >
                        <Ionicons name="close-circle" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            ))}

            <Text style={styles.sectionTitle}>Electricity Information</Text>
            <Text style={styles.label}>Address Code</Text>
            <TextInput
                style={styles.input}
                value={electricityAddressCode}
                onChangeText={setElectricityAddressCode}
                placeholder="Electricity Address Code"
            />

            <View style={styles.rentToggleRow}>
                <Text style={styles.sectionTitle}>Rent Details</Text>
                <TouchableOpacity onPress={toggleRentSection} style={styles.toggleButton}>
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
                        onChangeText={setTenantName}
                        placeholder="Tenant Name"
                    />

                    <Text style={styles.label}>Rent Price Amount</Text>
                    <TextInput
                        style={styles.input}
                        value={rentPrice}
                        onChangeText={setRentPrice}
                        placeholder="Rent Amount"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Rent Currency</Text>
                    <TextInput
                        style={styles.input}
                        value={rentCurrency}
                        onChangeText={setRentCurrency}
                        placeholder="e.g., USD, EUR"
                        autoCapitalize="characters"
                    />

                    <Text style={styles.label}>Payment Duration</Text>
                    <TextInput
                        style={styles.input}
                        value={rentDuration}
                        onChangeText={setRentDuration}
                        placeholder="e.g., Monthly, Yearly"
                    />
                </>
            ) : (
                <Text style={styles.infoText}>This property is not currently rented.</Text>
            )}

            <View style={styles.buttonContainer}>
                <Button title={isNewHome ? 'Create Home' : 'Save Changes'} onPress={handleSave} />
                <View style={{ width: 10 }} /> {/* Spacer */}
                <Button title="Cancel" onPress={handleCancel} color="grey" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 50, // Ensure space at bottom
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
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
    sharholderValueInput: {
        width: '20%',
        marginLeft: 5,
    },
    removeButton: {
        width: '10%',
        padding: 5,
        marginLeft: 4,
    },
});
