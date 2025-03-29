import React, { useState } from 'react';
import {
    Button,
    FlatList,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Item {
    id: string;
    label: string;
}

export default function ScreenOne() {
    const [items, setItems] = useState<Item[]>([
        { id: '1', label: 'Sample Item 1' },
        { id: '2', label: 'Sample Item 2' },
    ]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [inputText, setInputText] = useState('');

    const openModalToAdd = () => {
        setCurrentItem(null);
        setInputText('');
        setModalVisible(true);
    };

    const openModalToEdit = (item: Item) => {
        setCurrentItem(item);
        setInputText(item.label);
        setModalVisible(true);
    };

    const handleSave = () => {
        if (!inputText.trim()) return;

        if (currentItem) {
            setItems(
                items.map(item =>
                    item.id === currentItem.id ? { ...item, label: inputText.trim() } : item
                )
            );
        } else {
            const newItem: Item = {
                id: Date.now().toString(),
                label: inputText.trim(),
            };
            setItems([...items, newItem]);
        }

        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => openModalToEdit(item)}>
            <Text style={styles.itemLabel}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.addButtonContainer}>
                <Button title="Add New Item" onPress={openModalToAdd} />
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.list}
            />

            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {currentItem ? 'Edit Item' : 'Add New Item'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Item label"
                            value={inputText}
                            onChangeText={setInputText}
                            autoFocus={true}
                        />
                        <View style={styles.modalButtonRow}>
                            <Button title="Cancel" onPress={handleCancel} color="#6c757d" />
                            <Button title="Save" onPress={handleSave} />
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
        backgroundColor: '#f8f9fa',
        paddingTop: Platform.OS === 'android' ? 25 : 0, // Handle Android status bar
    },
    addButtonContainer: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        backgroundColor: '#ffffff',
    },
    list: {
        flex: 1,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    itemLabel: {
        fontSize: 16,
        color: '#212529',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 25,
        width: '85%',
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#343a40',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 5,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
});
