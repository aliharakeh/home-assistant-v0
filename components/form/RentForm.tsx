import { Home } from '@/db/models';
import { useRTL } from '@/hooks/useRTL';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { InputWithLabel } from '../primitive/InputWithLabel';

interface RentFormProps {
    home: Home;
    setHome: (home: Home) => void;
}

export default function RentForm({ home, setHome }: RentFormProps) {
    const { t } = useTranslation();
    const { columnContainerRTL, containerRTL, textRTL } = useRTL();

    return (
        <View className={`mt-4 ${columnContainerRTL}`}>
            <Text className={`title mt-4 ${textRTL}`}>{t('Rent Details')}</Text>

            <InputWithLabel
                label={t('Tenant Name')}
                value={home.rent.tenant.name}
                onChangeText={text =>
                    setHome({ ...home, rent: { ...home.rent, tenant: { name: text } } })
                }
                placeholder={t('Tenant Name')}
            />

            <View className={`flex-row ${containerRTL}`}>
                <View className="flex-1 mr-2">
                    <InputWithLabel
                        label={t('Amount')}
                        value={home.rent.price.amount.toString()}
                        onChangeText={text =>
                            setHome({
                                ...home,
                                rent: {
                                    ...home.rent,
                                    price: { ...home.rent.price, amount: parseFloat(text || '0') },
                                },
                            })
                        }
                        placeholder={t('Amount_PH')}
                        keyboardType="numeric"
                    />
                </View>

                <View className="flex-1">
                    <InputWithLabel
                        label={t('Currency')}
                        value={home.rent.price.currency}
                        onChangeText={text =>
                            setHome({
                                ...home,
                                rent: {
                                    ...home.rent,
                                    price: { ...home.rent.price, currency: text },
                                },
                            })
                        }
                        placeholder={t('Currency_PH')}
                    />
                </View>
            </View>

            <View className={`flex-row ${containerRTL}`}>
                <View className="flex-1 mr-2">
                    <InputWithLabel
                        label={t('Rent Payment Duration')}
                        value={home.rent.rentPaymentDuration}
                        onChangeText={text =>
                            setHome({ ...home, rent: { ...home.rent, rentPaymentDuration: text } })
                        }
                        placeholder={t('e.g., Monthly, Yearly')}
                    />
                </View>

                <View className="flex-1">
                    <InputWithLabel
                        label={t('Last Payment Date')}
                        value={home.rent.lastPaymentDate}
                        onChangeText={text =>
                            setHome({ ...home, rent: { ...home.rent, lastPaymentDate: text } })
                        }
                        placeholder={t('e.g., 2024-01-01')}
                    />
                </View>
            </View>
        </View>
    );
}
