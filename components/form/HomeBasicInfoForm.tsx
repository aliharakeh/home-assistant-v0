import { Home } from '@/db/models';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputWithLabel } from '../primitive/InputWithLabel';

interface HomeBasicInfoFormProps {
    home: Home;
    setHome: (home: Home) => void;
}

export default function HomeBasicInfoForm({ home, setHome }: HomeBasicInfoFormProps) {
    const { t } = useTranslation();

    return (
        <>
            <InputWithLabel
                label={t('Name')}
                value={home.name}
                onChangeText={text => setHome({ ...home, name: text })}
                placeholder={t('Home Name')}
            />

            <InputWithLabel
                label={t('Address')}
                value={home.address}
                onChangeText={text => setHome({ ...home, address: text })}
                placeholder={t('Address')}
            />
        </>
    );
}
