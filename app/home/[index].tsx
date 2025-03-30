import ActionButtons from '@/components/ActionButtons';
import ElectricityForm from '@/components/ElectricityForm';
import HomeBasicInfoForm from '@/components/HomeBasicInfoForm';
import RentForm from '@/components/RentForm';
import ShareholderForm from '@/components/ShareholderForm';
import { addHome, getHomeByIndex, updateHome } from '@/data/sampleData';
import { Electricity, Home, Rent, Shareholder } from '@/models/models';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

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

            <HomeBasicInfoForm
                name={name}
                address={address}
                onNameChange={setName}
                onAddressChange={setAddress}
            />

            <ShareholderForm
                shareholderNames={shareholderNames}
                shareholderShares={shareholderShares}
                onNameChange={handleShareholderNameChange}
                onShareChange={handleShareholderShareChange}
                onAddShareholder={handleAddShareholder}
                onRemoveShareholder={handleRemoveShareholder}
            />

            <ElectricityForm
                electricityAddressCode={electricityAddressCode}
                onElectricityAddressCodeChange={setElectricityAddressCode}
            />

            <RentForm
                hasRent={hasRent}
                tenantName={tenantName}
                rentPrice={rentPrice}
                rentCurrency={rentCurrency}
                rentDuration={rentDuration}
                onTenantNameChange={setTenantName}
                onRentPriceChange={setRentPrice}
                onRentCurrencyChange={setRentCurrency}
                onRentDurationChange={setRentDuration}
                onToggleRent={toggleRentSection}
            />

            <ActionButtons isNewHome={isNewHome} onSave={handleSave} onCancel={handleCancel} />
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
});
