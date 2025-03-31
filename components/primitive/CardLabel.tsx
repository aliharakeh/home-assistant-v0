import { StyleSheet, Text, View } from 'react-native';

export interface CardLabelProps {
    label: string;
    value: string | string[];
}

export function CardLabel(p: CardLabelProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{p.label}</Text>
            <Text style={styles.value}>
                {Array.isArray(p.value) ? p.value.join(', ') : p.value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        columnGap: 4,
    },
    label: {
        flex: 1,
        fontWeight: '600',
        width: 120,
    },
    value: {
        flex: 1,
        color: '#333',
    },
});
