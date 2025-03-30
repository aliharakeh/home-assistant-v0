import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

interface ActionButtonsProps {
    isNewHome: boolean;
    onSave: () => void;
    onCancel: () => void;
}

export default function ActionButtons({ isNewHome, onSave, onCancel }: ActionButtonsProps) {
    return (
        <View style={styles.buttonContainer}>
            <Button title={isNewHome ? 'Create Home' : 'Save Changes'} onPress={onSave} />
            <View style={{ width: 10 }} /> {/* Spacer */}
            <Button title="Cancel" onPress={onCancel} color="grey" />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 50, // Ensure space at bottom
    },
});
