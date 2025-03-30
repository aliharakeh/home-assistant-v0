import { getHomeByIndex, updateHome } from '@/data/sampleData';
import { Home, Rent, Shareholder } from '@/models/models';
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
    const homeIndex = parseInt(index || '0', 10);

    const [homeData, setHomeData] = useState<Home | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [shareholderNames, setShareholderNames] = useState<string[]>([]);
    const [tenantName, setTenantName] = useState('');
    const [rentPrice, setRentPrice] = useState('$');
    const [rentCurrency, setRentCurrency] = useState('');
    const [rentDuration, setRentDuration] = useState('');

    useEffect(() => {
        const currentHome = getHomeByIndex(homeIndex);
        if (currentHome) {
            setHomeData(currentHome);
            setName(currentHome.name);
            setAddress(currentHome.address);
            setShareholderNames(currentHome.shareholders.map(s => s.name));
            if (currentHome.rent) {
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
    }, [homeIndex]);

    const handleSave = () => {
        if (!homeData) return;

        const updatedShareholders: Shareholder[] = shareholderNames
            .map((name, i) => ({
                name: name.trim(),
                shareValue: homeData.shareholders[i]?.shareValue || 0,
            }))
            .filter(s => s.name);

        let updatedRent: Rent | undefined = undefined;
        if (homeData.rent) {
            updatedRent = {
                ...homeData.rent,
                tenant: { ...homeData.rent.tenant, name: tenantName.trim() },
                price: {
                    amount: parseFloat(rentPrice) || 0,
                    currency: rentCurrency.trim(),
                },
                rentPaymentDuration: rentDuration.trim(),
            };
        }

        const updatedHomeData: Home = {
            ...homeData,
            name: name.trim(),
            address: address.trim(),
            shareholders: updatedShareholders,
            rent: updatedRent,
        };

        updateHome(homeIndex, updatedHomeData);
        Alert.alert('Success', 'Home details updated.', [
            { text: 'OK', onPress: () => router.back() },
        ]);
    };

    const handleCancel = () => {
        router.back();
    };

    const handleShareholderNameChange = (text: string, index: number) => {
        const updatedNames = [...shareholderNames];
        updatedNames[index] = text;
        setShareholderNames(updatedNames);
    };

    const handleAddShareholder = () => {
        setShareholderNames([...shareholderNames, '']);
    };

    const handleRemoveShareholder = (indexToRemove: number) => {
        setShareholderNames(shareholderNames.filter((_, index) => index !== indexToRemove));
    };

    if (!homeData) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{homeData.name}</Text>

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
                        style={styles.shareholderInput}
                        value={shName}
                        onChangeText={text => handleShareholderNameChange(text, i)}
                        placeholder={`Shareholder ${i + 1} Name`}
                    />
                    <TouchableOpacity
                        onPress={() => handleRemoveShareholder(i)}
                        style={styles.removeButton}
                    >
                        <Ionicons name="close-circle" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            ))}

            {homeData.rent && (
                <>
                    <Text style={styles.sectionTitle}>Rent Details</Text>

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
            )}

            {!homeData.rent && (
                <Text style={styles.infoText}>This property is not currently rented.</Text>
            )}

            <View style={styles.buttonContainer}>
                <Button title="Save Changes" onPress={handleSave} />
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
        marginBottom: 5,
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
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: 'white',
    },
    removeButton: {
        padding: 5,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
