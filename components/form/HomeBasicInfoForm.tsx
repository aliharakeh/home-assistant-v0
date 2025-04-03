import { Home } from '@/db/models';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput } from 'react-native';

interface HomeBasicInfoFormProps {
    home: Home;
    setHome: (home: Home) => void;
}

export default function HomeBasicInfoForm({ home, setHome }: HomeBasicInfoFormProps) {
    const { t } = useTranslation();
    
    return (
        <>
            <Text style={styles.label}>{t('Name')}</Text>
            <TextInput
                style={styles.input}
                value={home.name}
                onChangeText={text => setHome({ ...home, name: text })}
                placeholder={t('Home Name')}
            />

            <Text style={styles.label}>{t('Address')}</Text>
            <TextInput
                style={styles.input}
                value={home.address}
                onChangeText={text => setHome({ ...home, address: text })}
                placeholder={t('Address')}
            />
        </>
    );
}

const styles = StyleSheet.create({
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
});
